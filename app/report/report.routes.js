import express from "express";
import { adminProtect } from "../middleware/auth.middleware.js";
import { getSalesReport } from "./report.controller.js";

const router = express.Router();

router.route("/sales").get(adminProtect, getSalesReport);
// router.route("/sales").get(getSalesReport);

export default router;
