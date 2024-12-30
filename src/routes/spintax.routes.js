import { Router } from "express";
import {
  addSpintaxValue,
  deleteSpintax,
  deleteSpintaxValue,
  getAllSpintax,
  getSpintaxById,
  saveSpintax,
  updateSpintax,
} from "../controllers/spintax.controllers.js";
import {
  trimObjects,
  filterMissingFields,
} from "../middlewares/index.middlewares.js";
const spintaxRouter = Router();

// Save Spintax
spintaxRouter
  .route("/save")
  .post(trimObjects, filterMissingFields(["Name"]), saveSpintax);

// Add Spintax Value
spintaxRouter
  .route("/add-value/:id")
  .patch(trimObjects, filterMissingFields(["spintaxValue"]), addSpintaxValue);

// Delete Spintax Value
spintaxRouter
  .route("/delete-value/:id")
  .patch(
    trimObjects,
    filterMissingFields(["spintaxValue"]),
    deleteSpintaxValue
  );

// Get All Spintaxes
spintaxRouter.route("/get-all").get(getAllSpintax);

// Get Spintax By Id
spintaxRouter.route("/get/:id").get(getSpintaxById);

// Update Spintax
spintaxRouter
  .route("/update/:id")
  .put(trimObjects, filterMissingFields(["Name"]), updateSpintax);

// Delete Spintax
spintaxRouter.route("/delete/:id").delete(deleteSpintax);

export { spintaxRouter };
