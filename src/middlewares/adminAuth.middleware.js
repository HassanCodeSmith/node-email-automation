import { BadRequestError } from "../errors/index.errors.js";

export const adminAuth = async (req, res, next) => {
  const { userRole } = req.userRole;
  if (userRole !== "Admin") {
    console.error("Invalid role.");
    throw new BadRequestError("Invalid role");
  }

  next();
};
