// app/payment/payment.routes.js
import express from "express";
import { createPayment } from "./payment.controller.js";

const router = express.Router();

// публичный маршрут, БЕЗ protect
router.post("/create-payment", createPayment);

export default router;
