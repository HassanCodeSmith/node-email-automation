import { Router } from "express";
import {
  changeOutgoingAccountActiveState,
  changeOutgoingAccountCampaignVisibility,
  deleteOutgoingAccount,
  getAllEnabledOutgoingAccounts,
  getAllOutgoingAccounts,
  getOutgoingAccountById,
  storeOutgoingAccounts,
  updateOutgoingAccount,
} from "../controllers/outgoingAccount.controllers.js";

const outgoingAccountRouter = Router();

outgoingAccountRouter.route("/store-accounts").post(storeOutgoingAccounts);

outgoingAccountRouter.route("/get-all").get(getAllOutgoingAccounts);

outgoingAccountRouter
  .route("/active-accounts")
  .get(getAllEnabledOutgoingAccounts);

outgoingAccountRouter.route("/get/:id").get(getOutgoingAccountById);

outgoingAccountRouter.route("/update/:id").put(updateOutgoingAccount);

outgoingAccountRouter.route("/delete/:id").delete(deleteOutgoingAccount);

outgoingAccountRouter
  .route("/change-active-state/:id")
  .patch(changeOutgoingAccountActiveState);

outgoingAccountRouter
  .route("/change-campaign-visibility/:id")
  .patch(changeOutgoingAccountCampaignVisibility);

export { outgoingAccountRouter };
