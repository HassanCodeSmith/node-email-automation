import { Spintax } from "../models/spintax.model.js";
import { ApiResponce } from "../utils/apiResponce.util.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/index.errors.js";

/** __________ ADD SPINTAX __________ */
export const saveSpintax = async (req, res) => {
  if (req.body.Values) {
    throw new BadRequestError(
      "Values can't be sent while saving Spintax name and descirption"
    );
  }

  const existingSpintax = await Spintax.findOne({
    UserId: req.userId,
    Name: req.body.Name,
  });

  if (existingSpintax) {
    throw new ConflictError("Name already taken for spintax");
  }

  const newSpintax = await Spintax.create({ ...req.body, UserId: req.userId });

  return res.status(201).json(
    new ApiResponce({
      statusCode: 201,
      message: "Spintax added successfully.",
      data: newSpintax,
    })
  );
};

/** __________ ADD SPINTAX VALUE __________ */
export const addSpintaxValue = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide id.");
  }

  const updatedSpinTax = await Spintax.findOneAndUpdate(
    { UserId: req.userId, _id: req.params.id },
    { $push: { Values: req.body.spintaxValue } },
    { new: true }
  );

  if (!updateSpintax) {
    throw new BadRequestError("Spintax value not updated with provided id.");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Spintax value added successfully.",
      data: updatedSpinTax,
    })
  );
};

/** __________ DELETE SPINTAX VALUE __________ */
export const deleteSpintaxValue = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide id.");
  }

  const updatedSpinTax = await Spintax.findOneAndUpdate(
    { UserId: req.userId, _id: id },
    { $pull: { Values: req.body.spintaxValue } },
    { new: true }
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Spintax value deleted successfully.",
      data: updatedSpinTax,
    })
  );
};

/** __________ GET ALL SPINTAX __________ */
export const getAllSpintax = async (req, res) => {
  const allSpintax = await Spintax.find({ UserId: req.userId });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allSpintax.length > 0
          ? "Spintax collection feteched successfully."
          : "Spintax collection is empty.",
      data: allSpintax,
    })
  );
};

/** __________ GET SPINTAX BY ID __________ */
export const getSpintaxById = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide id.");
  }

  const spintax = await Spintax.findOne({
    UserId: req.userId,
    _id: id,
  });

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Spintax feteched successfully.",
      data: spintax,
    })
  );
};

/** __________ UPDATE SPINTAX __________ */
export const updateSpintax = async (req, res) => {
  const { id } = req?.params;

  if (!id) {
    throw new NotFoundError("Please provide id.");
  }
  const updatedSpintax = await Spintax.findOneAndUpdate(
    {
      UserId: req.userId,
      _id: id,
    },
    req.body,
    { new: true }
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Spintax updated successfully.",
      data: updatedSpintax,
    })
  );
};

/** __________ DELETE SPINTAX __________ */
export const deleteSpintax = async (req, res) => {
  const deletedSpintax = await Spintax.findOneAndDelete({
    UserId: req.userId,
    _id: req.params.id,
  });

  return res.status(deletedSpintax ? 200 : 400).json(
    new ApiResponce({
      statusCode: deletedSpintax ? 200 : 400,
      message: deleteSpintax
        ? "Spintax deleted successfully."
        : "Spintax not found may be already deleted",
    })
  );
};
