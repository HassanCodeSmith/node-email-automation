import { Router } from "express";
const router = Router();

import { spintaxRouter } from "./spintax.routes.js";
import { outgoingAccountRouter } from "./outgoingAccounts.routes.js";
import { targetEmailsListNameRouter } from "./targetEmailsListName.routes.js";
import { targetEmailRouter } from "./targetEmail.routes.js";
import { campaignRouter } from "./campaign.routes.js";
import { userRouter } from "./user.routes.js";
import { settingsRouter } from "./setting.routes.js";
import { loginAuth } from "../middlewares/index.middlewares.js";

/** ___ User ___ */
router.use("/user", userRouter);

/** ___ Spintax ___ */
router.use("/spintax", loginAuth, spintaxRouter);

/** ___ Accounts ___ */
router.use("/outgoing", loginAuth, outgoingAccountRouter);

/** __ Email List ___ */
router.use("/target-email-list-name", loginAuth, targetEmailsListNameRouter);

/** __ Emails ___ */
router.use("/target-email", loginAuth, targetEmailRouter);

/** __ Settings ___ */
router.use("/settings", loginAuth, settingsRouter);

/** __ Campaign ___ */
router.use("/campaign", loginAuth, campaignRouter);

export { router };
