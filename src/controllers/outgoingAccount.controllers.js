import { OutgoingAccount } from "../models/outgoingAccount.model.js";
import { BadRequestError, NotFoundError } from "../errors/index.errors.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

/** __________ STORE OUTGOING ACCOUNTS __________ */
export const storeOutgoingAccounts = async (req, res) => {
  const { docs } = req.body;

  if (!Array.isArray(docs) || docs.length === 0) {
    throw new BadRequestError(
      "Invalid data format. Expected array of documents."
    );
  }
  await Promise.all(
    docs.map(async (doc) => {
      await OutgoingAccount.create({ ...doc, UserId: req.userId });
    })
  );

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Outgoing accounts imported successfully",
    })
  );
};

/** __________ GET ALL OUTGOING ACCOUNTS __________ */
export const getAllOutgoingAccounts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  const emails = await OutgoingAccount.find({ UserId: req.userId })
    .skip(skip)
    .limit(limit)
    .select("-Password");

  const totalEmails = await OutgoingAccount.countDocuments({
    UserId: req.userId,
  });

  const pagination = {
    page,
    limit,
    totalEmails,
    totalPages: Math.ceil(totalEmails / limit),
    hasNextPage: page * limit < totalEmails,
    hasPrevPage: page > 1,
  };

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Emails fetched successfully.",
      pagination,
      data: emails,
    })
  );
};

/** __________ GET ALL ENABLED OUTGOING ACCOUNTS __________ */
export const getAllEnabledOutgoingAccounts = async (req, res) => {
  const emails = await OutgoingAccount.find({
    UserId: req.userId,
    Enable: 1,
  })
    .sort({
      Email: 1,
    })
    .select("-Password");

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "All active outgoing accounts fetched successfully.",
      data: emails,
    })
  );
};

/** __________ GET OUTGOING ACCOUNT BY ID __________ */
export const getOutgoingAccountById = async (req, res) => {
  const accountDetails = await OutgoingAccount.findOne({
    UserId: req.userId,
    _id: req.params.id,
  }).select("-Password");

  if (!accountDetails) {
    throw new NotFoundError("Outgoing account not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Outgoing account fetched successfully.",
      data: accountDetails,
    })
  );
};

/** __________ UPDATE OUTGOING ACCOUNT __________ */
export const updateOutgoingAccount = async (req, res) => {
  const accountDetails = await OutgoingAccount.findOne({
    UserId: req.userId,
    _id: req.params.id,
  });

  if (!accountDetails) {
    throw new NotFoundError("Outgoing account not found.");
  }

  await OutgoingAccount.findOneAndUpdate(
    { UserId: req.userId, _id: req.params.id },
    req.body
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Outgoing account updated successfully.",
    })
  );
};

/** __________ DELETE OUTGOING ACCOUNT __________ */
export const deleteOutgoingAccount = async (req, res) => {
  const accountDetails = await OutgoingAccount.findOne({
    UserId: req.userId,
    _id: req.params.id,
  });

  if (!accountDetails) {
    throw new NotFoundError("Outgoing account not found.");
  }

  await OutgoingAccount.findOneAndDelete({
    UserId: req.userId,
    _id: req.params.id,
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Outgoing account deleted successfully.",
    })
  );
};

/** __________ CHANGE OUTGOING ACCOUNT'S ACTIVE STATE __________ */
export const changeOutgoingAccountActiveState = async (req, res) => {
  const accountDetails = await OutgoingAccount.findOne({
    UserId: req.userId,
    _id: req.params.id,
  });

  if (!accountDetails) {
    throw new NotFoundError("Details not found.");
  }

  if (accountDetails.Enable === 1) {
    accountDetails.Enable = 0;
  } else {
    accountDetails.Enable = 1;
  }
  await accountDetails.save();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Account active state changed successfully.",
    })
  );
};

/** __________ CHANGE OUTGOING ACCOUNT'S CAMPAIGN VISIBILITY STATE __________ */
export const changeOutgoingAccountCampaignVisibility = async (req, res) => {
  const accountDetails = await OutgoingAccount.findOne({
    UserId: req.userId,
    _id: req.params.id,
  });

  if (!accountDetails) {
    throw new NotFoundError("Details not found.");
  }

  if (accountDetails.Enable === 1) {
    accountDetails.Enable = 0;
  } else {
    accountDetails.Enable = 1;
  }
  await accountDetails.save();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Campaign visibility state changed successfully.",
    })
  );
};
