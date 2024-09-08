import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  addItemToCart,
  getCartItems,
  removeItemFromCart,
  updateCartItem,
  confirmSale
} from "./cart.controller.js";

const router = express.Router();

// router.route("/").post(protect, addItemToCart).get(protect, getCartItems);
router.route("/").post(addItemToCart).get(getCartItems);

// router
//   .route("/:id")
//   .delete(protect, removeItemFromCart)
//   .put(protect, updateCartItem);

router
  .route("/:id")
  .delete(removeItemFromCart)
  .put(updateCartItem);

// router.post("/confirm-sale", protect, confirmSale);

router.post("/confirm-sale", confirmSale);

export default router;
