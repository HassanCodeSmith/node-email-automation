import { BadRequestError, NotFoundError } from "../errors/index.errors.js";
import { Settings } from "../models/setting.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

/** __________ SAVE SETTINGS __________ */
export const saveSettings = async (req, res) => {
  const newSetting = await Settings.create({ ...req.body, UserId: req.userId });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Setting saved successfully",
      data: newSetting,
    })
  );
};

/** __________ GET SETTINGS BY ID __________ */
export const getSettingsById = async (req, res) => {
  const setting = await Settings.findOne({ UserId: req.userId });

  if (!setting) {
    throw new BadRequestError("Setting not found with provided id.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Setting fetched successfully",
      data: setting,
    })
  );
};

/** __________ UPDATE SETTINGS __________ */
export const updateSettings = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide settings id.");
  }

  const setting = await Settings.findOne({ UserId: req.userId, _id: id });

  if (!setting) {
    throw new BadRequestError("Setting not found with provided id.");
  }

  const updatedSettings = await Settings.findOneAndUpdate(
    {
      UserId: req?.userId,
      _id: id,
    },
    req.body,
    { new: true }
  );

  if (!updatedSettings) {
    throw new BadRequestError("Settings not updated with provided id.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Settings updated successfully.",
      data: updateSettings,
    })
  );
};

/** __________ DELETE SETTING BY ID __________ */
export const deleteSettings = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide settings id.");
  }

  const setting = await Settings.findOne({ UserId: req.userId, _id: id });

  if (!setting) {
    throw new BadRequestError("Setting not found with provided id.");
  }

  const deletedSetting = await Settings.findOneAndDelete({
    UserId: req?.userId,
    _id: id,
  });

  if (!deletedSetting) {
    throw new BadRequestError("Settings not deleted with provided id");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Settings deleted successfully.",
    })
  );
};
