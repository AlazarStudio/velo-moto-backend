import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getTurnoverReport } from "./turnover.controller.js";

const router = express.Router();

router.route("/turnover").get(protect, getTurnoverReport);
// router.route("/turnover").get(getTurnoverReport);

export default router;
