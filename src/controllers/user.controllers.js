import { User } from "../models/user.model.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../errors/index.errors.js";
import { ApiResponce } from "../utils/apiResponce.util.js";

/** __________ REGISTER USER __________ */
export const registerUser = async (req, res) => {
  const existingUser = await User.findOne({ Email: req.body.Email }).select(
    "-Password"
  );
  if (existingUser) {
    throw new ConflictError("Email already taken");
  }

  const newUser = await User.create(req.body);
  const userWithoutPassword = await User.findOne({ _id: newUser._id }).select(
    "-Password"
  );

  return res.status(201).json(
    new ApiResponce({
      statusCode: 2001,
      message: "User registered successfully.",
      data: userWithoutPassword,
    })
  );
};

/** __________ LOGIN __________ */
export const login = async (req, res) => {
  const { Email, Password } = req.body;

  const user = await User.findOne({ Email });

  if (!user) {
    throw new NotFoundError("User not found with provided email.");
  }

  if (!(await user.comparePassword(Password))) {
    throw new BadRequestError("Wrong password.");
  }

  const token = user.createJWT();

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Login successfully",
      token,
      data: user,
    })
  );
};

/** __________ GET ALL USERS __________ */
export const getAllUsers = async (req, res) => {
  const allUsers = await User.find({ Role: { $ne: "Admin" } }).select(
    "-Password"
  );

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message:
        allUsers.length === 0
          ? "There is no any user currently registered"
          : "Users collections feteched successfully",
      data: allUsers,
    })
  );
};

/** __________ GET USER BY ID __________ */
export const getUserById = async (req, res) => {
  const user = await User.findOne({ _id: req.userId }).select("-Password");

  if (!user) {
    throw new NotFoundError("User not found with provided token");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "User fetched successfully",
      data: user,
    })
  );
};

/** __________ DELETE ACCOUNT __________ */
export const deleteMyAccount = async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.userId });

  if (!user) {
    throw new NotFoundError("User not found with provided token");
  }

  return res.status(200).json(
    new ApiResponce({
      statusCode: 200,
      message: "Account deleted successfully",
    })
  );
};
