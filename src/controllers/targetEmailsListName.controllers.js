import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/index.errors.js";
import { TargetEmail } from "../models/targetEmail.model.js";
import { TargetEmailsListName } from "../models/targetEmailsListName.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

/** __________ ADD TARGET EMAIL LIST NAME __________ */
export const addTargetEmailsListName = async (req, res) => {
  const existingListName = await TargetEmailsListName.findOne({
    UserId: req.userId,
    Name: req.body.Name,
  });
  if (existingListName) {
    throw new ConflictError("Name already taken.");
  }

  const newListName = await TargetEmailsListName.create({
    ...req.body,
    UserId: req.userId,
  });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "List name added successfully",
      data: newListName,
    })
  );
};

/** __________ GET ALL TARGET EMAIL LIST NAMES __________ */
export const getAllTargetEmailsListNames = async (req, res) => {
  const allTargetEmailsListNames = await TargetEmailsListName.find({
    UserId: req.userId,
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allTargetEmailsListNames.length > 0
          ? "Collection fetched successfully"
          : "Collection is empty",
      data: allTargetEmailsListNames,
    })
  );
};

/** __________ GET TERGET EMAILS LIST NAME BY ID __________ */
export const getTargetEmailsListName = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide id in params");
  }

  const targetEmailsListName = await TargetEmailsListName.findOne({
    UserId: req.userId,
    _id: id,
  });

  if (!targetEmailsListName) {
    throw new NotFoundError("Target emails list name not found");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Target emails list name fetched successfully.",
      data: targetEmailsListName,
    })
  );
};

/** __________ UPDATE LIST NAME __________ */
export const updateTargetEmailsListName = async (req, res) => {
  const { id } = req.params;

  const updatedList = await TargetEmailsListName.findOneAndUpdate(
    { UserId: req.userId, _id: id },
    req.body,
    {
      new: true,
    }
  );

  if (!updatedList) {
    throw new BadRequestError(
      "Target email list detials not updated by provided id"
    );
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Target emails list name updated successfully",
      data: updatedList,
    })
  );
};

/** __________ DELETE LIST NAME __________ */
export const deleteTargetEmailsListName = async (req, res) => {
  const { id } = req.params;

  const deletedTargetListName = await TargetEmailsListName.findOneAndDelete({
    UserId: req.userId,
    _id: id,
  });

  if (!deletedTargetListName) {
    throw new NotFoundError("Target emails list name not found.");
  }

  await TargetEmail.deleteMany({
    UserId: req.userId,
    TargetEmailsListNameId: id,
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Target emails list name deleted successfully",
    })
  );
};
