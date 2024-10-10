import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getSalesReport } from "./report.controller.js";

const router = express.Router();

router.route("/sales").get(protect, getSalesReport);
// router.route("/sales").get(getSalesReport);

export default router;
