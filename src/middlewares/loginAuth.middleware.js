import { User } from "../models/user.model.js";
// import { BadRequestError, NotFoundError } from "../errors/index.errors.js";
import jwt from "jsonwebtoken";

export const loginAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    console.error("Token must be provided.");
    // throw new NotFoundError("Token must be provided.");
    return res.status(200).json({
      tokenInvalid: true,
      message: "Token must be provided.",
    });
  }

  let payload;
  try {
    payload = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } catch (error) {
    console.error("Invalid token provided.", error);
    return res.status(200).json({
      tokenInvalid: true,
      message: "Invalid token provided.",
    });
  }

  const user = await User.findOne({ _id: payload.userId });

  if (!user) {
    console.error("User not found by provided token");
    // throw new BadRequestError("User not found by provided token");
    return res.status(200).json({
      tokenInvalid: true,
      message: "User not found by provided token",
    });
  }

  req.userId = user._id;
  req.userRole = { userRole: user.Role };

  next();
};
