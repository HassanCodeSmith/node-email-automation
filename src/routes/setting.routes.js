import { Router } from "express";
import {
  getSettingsById,
  saveSettings,
  updateSettings,
  deleteSettings,
} from "../controllers/setting.controllers.js";
import { trimObjects } from "../middlewares/trimObjects.middleware.js";
import { filterMissingFields } from "../middlewares/filterMissingFields.middleware.js";
var settingsRouter = Router();

// Save
settingsRouter
  .route("/save")
  .post(
    trimObjects,
    filterMissingFields(["MaxBroswersAllowed", "GoLoginToken"]),
    saveSettings
  );

// Get
settingsRouter.route("/get").get(getSettingsById);

// Update
settingsRouter
  .route("/update/:id")
  .put(
    trimObjects,
    filterMissingFields(["MaxBroswersAllowed", "GoLoginToken"]),
    updateSettings
  );

// Delete
settingsRouter.route("/delete/:id").delete(deleteSettings);

export { settingsRouter };
