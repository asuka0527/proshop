import express from "express";
import asyncHandler from "express-async-handler";

import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
} from "../controllers/productControllers.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// [Fetching productcs from DATABASE] 1. setup Product router
const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/:id/reviews").post(protect, createProductReview);

router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
