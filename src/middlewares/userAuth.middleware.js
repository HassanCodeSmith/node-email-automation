import { BadRequestError } from "../errors/index.errors.js";

export const userAuth = async (req, res, next) => {
  const { userRole } = req.userRole;
  if (userRole !== "User") {
    console.error("Invalid role.");
    throw new BadRequestError("Invalid role");
  }

  next();
};
