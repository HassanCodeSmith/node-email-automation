import { Router } from "express";
import {
  deleteMyAccount,
  getAllUsers,
  getUserById,
  login,
  registerUser,
} from "../controllers/user.controllers.js";
import {
  adminAuth,
  emailValidator,
  filterMissingFields,
  trimObjects,
  userAuth,
} from "../middlewares/index.middlewares.js";
import { loginAuth } from "../middlewares/loginAuth.middleware.js";

const userRouter = Router();

// Register
userRouter
  .route("/register")
  .post(
    trimObjects,
    filterMissingFields(["UserName", "Email", "Password"]),
    emailValidator,
    registerUser
  );

// Login
userRouter
  .route("/login")
  .post(
    trimObjects,
    filterMissingFields(["Email", "Password"]),
    emailValidator,
    login
  );

// Get All Users --- Admin
userRouter.route("/get-all").get(loginAuth, adminAuth, getAllUsers);

// Get
userRouter.route("/get").get(loginAuth, getUserById);

// Delete Account By User
userRouter
  .route("/delete-my-account")
  .delete(loginAuth, userAuth, deleteMyAccount);

export { userRouter };
