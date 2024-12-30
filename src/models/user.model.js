import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/index.errors.js";

const userSchema = new mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      enums: ["User", "Admin"],
      default: "User",
    },
  },
  { timestamps: true, collection: "Users" }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("Password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
    next();
  } catch (error) {
    console.error(error);
    throw new BadRequestError("There is an issue while hashing password.");
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.Password);
  } catch (error) {
    console.error(error);
    throw new BadRequestError("There is an error while comparing password.");
  }
};

userSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
