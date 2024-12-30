import { BadRequestError, NotFoundError } from "../errors/index.errors.js";
import { TargetEmail } from "../models/targetEmail.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

/** __________ ADD EMAIL LIST __________ */
export const addTargetEmails = async (req, res) => {
  const { docs } = req.body;

  if (!Array.isArray(docs) || docs.length === 0) {
    throw new BadRequestError("Please provide a non-empty array of documents.");
  }

  const updatedDocs = docs.map((doc) => ({ ...doc, UserId: req.userId }));
  const responce = await TargetEmail.insertMany(updatedDocs);

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Target emails added successfully",
      data: responce,
    })
  );
};

/** __________ GET ALL TARGET EMAILS BY TARGET EMAILS LIST NAME ID __________ */
export const getAllTargetEmailsByTargetEmailsListNameId = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new NotFoundError("Please provide id");
  }
  const allEmail = await TargetEmail.find({
    UserId: req.userId,
    TargetEmailsListNameId: id,
  });

  if (allEmail.length === 0) {
    return res.status(200).json(
      new ApiResponce({
        statusCode: 200,
        message: "Target emails collection is empty.",
        data: [],
      })
    );
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Target emails collection fetched successfully.",
      data: allEmail,
    })
  );
};

/** __________ GET TARGET EMAIL BY ID __________ */
export const getTargetEmailsById = async (req, res) => {
  const { id } = req.params;
  const targetEmail = await TargetEmail.findOne({
    UserId: req.userId,
    _id: id,
  });

  return res.status(targetEmail ? 200 : 404).json(
    new ApiResponce({
      statusCode: targetEmail ? 200 : 404,
      message: targetEmail
        ? "Target email fetched successfully."
        : "Target email not found",
      data: targetEmail ? targetEmail : {},
    })
  );
};

/** __________ DELETE EMAIL LIST __________ */
export const deleteAllTargetEmailsByTargetEmailsListNameId = async (
  req,
  res
) => {
  const { id } = req.params;

  if (!id) {
    throw new BadRequestError("Please provide list name id.");
  }

  await TargetEmail.deleteMany({
    UserId: req.userId,
    TargetEmailsListNameId: id,
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Email list deleted successfully.",
    })
  );
};

/** __________ DELETE TARGET EMAIL BY ID __________ */
export const deleteTargetEmailById = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new BadRequestError("Please provide target email id");
  }

  const emailList = await TargetEmail.findOneAndDelete({
    UserId: req?.userId,
    _id: id,
  });

  if (!emailList) {
    throw new NotFoundError("Target email not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Target Email deleted successfully.",
    })
  );
};

/** __________ GET ALL UN-SENDED EMAILS  __________ */
export const getAllNotSendedTargetEmails = async (req, res) => {
  const { ids } = req.body;

  const allEmail = await TargetEmail.find({
    isEmailSended: false,
    TargetEmailsListNameId: { $in: ids },
  }).sort({ Email: 1 });

  if (allEmail.length === 0) {
    return res.status(200).json(
      new ApiResponce({
        statusCode: 200,
        message: "There is no any email for send.",
        data: [],
      })
    );
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "All un-sended emails fetched successfully.",
      data: allEmail,
    })
  );
};

/** __________ MARK TARGET EMAIL AS SENDED __________ */
export const markTargetEmailAsSended = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Please provide document id");
  }

  const email = await TargetEmail.findOneAndUpdate(
    { UserId: req.userId, _id: id },
    { isEmailSended: true },
    { new: true }
  );

  if (!email) {
    throw new NotFoundError("Target email not found.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Target email marked as sended successfully.",
      data: email,
    })
  );
};
