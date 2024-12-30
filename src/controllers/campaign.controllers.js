import { convert } from "html-to-text";
import { Campaigns } from "../models/campaign.model.js";
import { TargetEmail } from "../models/targetEmail.model.js";
import { CampaignTracking } from "../models/campaignTracking.model.js";
import { Settings } from "../models/setting.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import { emailAutomation } from "../utils/emailAutomation.util.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/index.errors.js";
import { Spintax } from "../models/spintax.model.js";

/** __________ SAVE CAMPAIGN __________ */
export const saveCampaign = async (req, res) => {
  const newCampaign = new Campaigns({ ...req.body, UserId: req?.userId });
  await newCampaign.save();
  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Campaign created successfully.",
      data: newCampaign,
    })
  );
};

/** __________ GET ALL CAMPAIGNS __________ */
export const getAllCampaigns = async (req, res) => {
  const allCampaigns = await Campaigns.find({ UserId: req?.userId });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allCampaigns.length > 0
          ? "Campaign collection fetched successfully."
          : "Campaign collection is empty.",
      data: allCampaigns,
    })
  );
};

/** __________ GET CAMPAIGN BY ID __________ */
export const getCampaignById = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide compaign id.");
  }

  const campaign = await Campaigns.findOne({ UserId: req?.userId, _id: id });

  return res.status(campaign ? 200 : 404).json(
    new ApiResponce({
      statusCode: campaign ? 200 : 404,
      message: campaign
        ? "Campaign fetched successfully."
        : "Campaign not found by provided id",
      data: campaign ? campaign : {},
    })
  );
};

/** __________ UPDATE CAMPAIGN BY ID __________ */
export const updateCampaignById = async (req, res) => {
  console.log("bodyyyyyyyyyyyyyyyyyyyyyyyyy: ", req.body);
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide compaign id.");
  }

  const updatedCampaign = await Campaigns.findOneAndUpdate(
    { UserId: req.userId, _id: id },
    req.body,
    { new: true }
  );

  if (!updatedCampaign) {
    throw new BadRequestError("Campaign not updated with provided id");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Campaign updated successfully.",
      data: updatedCampaign,
    })
  );
};

/** __________ DELETE CAMPAIGN BY ID __________ */
export const deleteCampaignById = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide compaign id.");
  }

  const deletedCampaign = await Campaigns.findOneAndDelete({
    UserId: req?.userId,
    _id: id,
  });

  return res.status(deletedCampaign ? 200 : 404).json(
    new ApiResponce({
      statusCode: deletedCampaign ? 200 : 404,
      message: deletedCampaign
        ? "Campaign deleted successfully."
        : "Compaign not found with provided id",
    })
  );
};

/** __________ CAMPAIGN PROCESS __________ */
export const campaignProcess = async (req, res) => {
  async function replacePlaceholder(inputString) {
    try {
      const placeholders = inputString.match(/#\w+#/g);
      if (!placeholders) return inputString;

      for (const placeholder of placeholders) {
        const name = placeholder.slice(1, -1);
        const spintax = await Spintax.findOne({ Name: name });

        if (spintax && spintax.Values.length > 0) {
          const randomValue =
            spintax.Values[Math.floor(Math.random() * spintax.Values.length)];
          inputString = inputString.replace(
            new RegExp(placeholder, "g"),
            randomValue
          );
        }
      }

      return inputString;
    } catch (error) {
      console.error("Error replacing placeholders:", error);
      throw error;
    }
  }

  function htmlToText(html) {
    try {
      const options = { wordwrap: 130 };
      return convert(html, options);
    } catch (error) {
      console.error("Error converting HTML to text:", error);
      return html;
    }
  }

  try {
    const { id } = req.params;
    const { state } = req.query;

    const campaign = await Campaigns.findOne({ _id: id, UserId: req.userId })
      .populate("CampaignTargetEmailIds")
      .populate("CampaignOutgoingAccountIds");

    if (!campaign) throw new NotFoundError("Campaign not found");
    if (!state) throw new BadRequestError("Status is required");

    const statusEnums = ["Start", "Pause", "Stop"];
    if (!statusEnums.includes(state))
      throw new BadRequestError("Invalid state value");
    if (campaign.State === state)
      throw new ConflictError(`Campaign already in state ${state}`);

    campaign.State = state;
    await campaign.save();

    if (state === "Pause") {
      return res.status(200).json({
        statusCode: 200,
        message: "Campaign paused successfully",
      });
    }

    if (state === "Stop") {
      await Campaigns.updateMany({}, { $set: { isEmailSended: false } });
      return res.status(200).json({
        statusCode: 200,
        message: "Campaign stopped successfully",
      });
    }

    const settings = await Settings.findOne({ UserId: req.userId });
    const numberOfBrowsers = settings?.MaxBroswersAllowed || 1;

    const emailsToProcess = await TargetEmail.find({
      TargetEmailsListNameId: { $in: campaign.CampaignTargetEmailIds },
      isEmailSended: false,
    });

    const accounts = campaign.CampaignOutgoingAccountIds.slice(
      0,
      numberOfBrowsers
    );
    const emailBatches = Array.from({ length: accounts.length }, () => []);
    emailsToProcess.forEach((email, index) => {
      emailBatches[index % accounts.length].push(email);
    });

    campaign.Body = await replacePlaceholder(campaign.Body);

    await Promise.all(
      accounts.map(async (account, accountIndex) => {
        const accountEmails = emailBatches[accountIndex];

        if (accountEmails.length === 0) return;

        let emailsSentToday = await CampaignTracking.countDocuments({
          AccountId: account._id,
          createdAt: { $gte: new Date().setHours(0, 0, 0, 0) },
        });

        if (emailsSentToday >= account.MaxEmailPerDay) {
          console.log(`Account ${account.Email} has reached its daily limit.`);
          return;
        }

        const startSession = emailAutomation.startSession({
          token: settings.GoLoginToken,
        });
        const automationSession = startSession({
          googleUsername: account.Email,
          googlePassword: account.Password,
        });
        // const automationSession = await emailAutomation.startSession({
        //   googleUsername: account.Email,
        //   googlePassword: account.Password,
        // });

        for (const email of accountEmails) {
          if (emailsSentToday >= account.MaxEmailPerDay) break;

          const personalizedBody = campaign.Body.replace(
            /{FirstName}/g,
            email.FirstName
          );
          const plainTextBody = htmlToText(personalizedBody);

          await emailAutomation.sendEmail({
            session: automationSession,
            recipientEmail: email.Email,
            emailSubject: campaign.Subject,
            emailBody: plainTextBody,
          });

          email.isEmailSended = true;
          await email.save();

          await CampaignTracking.create({
            CampaignId: campaign._id,
            AccountId: account._id,
            EmailId: email._id,
          });

          emailsSentToday++;
          await new Promise((resolve) =>
            setTimeout(resolve, account.DelayInMinutes * 60 * 1000)
          );
        }

        await emailAutomation.closeSession(automationSession);
      })
    );

    res.status(200).json({ message: "Campaign started successfully" });
  } catch (error) {
    console.error("Error in campaignProcess:", error);
    res
      .status(500)
      .json({ message: "An error occurred while starting the campaign" });
  }
};

export const connectAccount = async (req, res) => {
  const { googleUsername, googlePassword } = req.body;

  const settings = await Settings.findOne({ UserId: req.userId });
  console.log("setingssssssssssssssssssssssss: ", settings);
  const startSession = emailAutomation.startSession({
    token: settings.GoLoginToken,
  });
  const automationSession = startSession({
    googleUsername,
    googlePassword,
  });

  return res.send(automationSession);
};
