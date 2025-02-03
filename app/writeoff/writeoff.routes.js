import express from "express";
import { adminProtect } from "../middleware/auth.middleware.js";
import { createWriteOff, getWriteOffs } from "./writeoff.controller.js";

const router = express.Router();

router
  .route("/")
  .post(adminProtect, createWriteOff)
  .get(adminProtect, getWriteOffs);
// router.route('/').post(createWriteOff).get(getWriteOffs)

export default router;
