import { Router } from "express";
import {
  campaignProcess,
  connectAccount,
  deleteCampaignById,
  getAllCampaigns,
  getCampaignById,
  saveCampaign,
  updateCampaignById,
} from "../controllers/campaign.controllers.js";
import {
  filterMissingFields,
  trimObjects,
} from "../middlewares/index.middlewares.js";

const campaignRouter = Router();

// Save
campaignRouter
  .route("/save")
  .post(
    trimObjects,
    filterMissingFields(["Name", "Subject", "Body"]),
    saveCampaign
  );

// Get All
campaignRouter.route("/get-all").get(getAllCampaigns);

// Get
campaignRouter.route("/get/:id").get(getCampaignById);

// Update
campaignRouter
  .route("/update/:id")
  .put(
    trimObjects,
    filterMissingFields(["Name", "Subject", "Body"]),
    updateCampaignById
  );

// Delete
campaignRouter.route("/delete/:id").delete(deleteCampaignById);

// Process
campaignRouter.route("/process/:id").post(campaignProcess);

campaignRouter.route("/connect-account").get(connectAccount);

export { campaignRouter };
