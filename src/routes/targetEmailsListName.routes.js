import { Router } from "express";
import {
  addTargetEmailsListName,
  deleteTargetEmailsListName,
  getAllTargetEmailsListNames,
  getTargetEmailsListName,
  updateTargetEmailsListName,
} from "../controllers/targetEmailsListName.controllers.js";
import { trimObjects } from "../middlewares/trimObjects.middleware.js";
import { filterMissingFields } from "../middlewares/filterMissingFields.middleware.js";

const targetEmailsListNameRouter = Router();

// Add
targetEmailsListNameRouter
  .route("/add")
  .post(trimObjects, filterMissingFields(["Name"]), addTargetEmailsListName);

// Get All
targetEmailsListNameRouter.route("/get-all").get(getAllTargetEmailsListNames);

// Get
targetEmailsListNameRouter.route("/get/:id").get(getTargetEmailsListName);

// Update
targetEmailsListNameRouter
  .route("/update/:id")
  .put(trimObjects, filterMissingFields(["Name"]), updateTargetEmailsListName);

// Delete
targetEmailsListNameRouter
  .route("/delete/:id")
  .delete(deleteTargetEmailsListName);
export { targetEmailsListNameRouter };
