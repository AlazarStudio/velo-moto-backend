import express from "express";

import { protect } from "../middleware/auth.middleware.js";

import {
  addItemToCart,
  getCartItemsCustomer,
  getCartItemsContractor,
  removeItemFromCart,
  updateCartItem,
  confirmSale
} from "./cart.controller.js";

const router = express.Router();

// router.route("/").post(protect, addItemToCart).get(protect, getCartItemsCustomer).get(protect, getCartItemsContractor);
router.route("/").post(addItemToCart).get(getCartItemsCustomer).get(getCartItemsContractor);

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
