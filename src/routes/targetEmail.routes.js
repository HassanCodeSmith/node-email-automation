import { Router } from "express";

import { trimObjects } from "../middlewares/trimObjects.middleware.js";
import {
  addTargetEmails,
  deleteAllTargetEmailsByTargetEmailsListNameId,
  deleteTargetEmailById,
  getAllNotSendedTargetEmails,
  getAllTargetEmailsByTargetEmailsListNameId,
  getTargetEmailsById,
  markTargetEmailAsSended,
} from "../controllers/targetEmail.controllers.js";
import { filterMissingFields } from "../middlewares/filterMissingFields.middleware.js";

const targetEmailRouter = Router();

// Add
targetEmailRouter.route("/add").post(trimObjects, addTargetEmails);

// Get All Emails By Target Emails List Name Id
targetEmailRouter
  .route("/get-all/:id")
  .get(getAllTargetEmailsByTargetEmailsListNameId);

// Get Target Email By Id
targetEmailRouter.route("/get/:id").get(getTargetEmailsById);

// Delete All Emails By Target Emails List Name Id
targetEmailRouter
  .route("/:id")
  .delete(deleteAllTargetEmailsByTargetEmailsListNameId);

// Delte Single Email
targetEmailRouter.route("/delete/:id").delete(deleteTargetEmailById);

// Get All Emails On Which Email Not Send
targetEmailRouter.route("/not-sended").post(getAllNotSendedTargetEmails);

// Mark Email Sended
targetEmailRouter.route("/:id").patch(markTargetEmailAsSended);

export { targetEmailRouter };
