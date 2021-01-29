import express from "express";
import asyncHandler from "express-async-handler";

import {
  getProducts,
  getProductById,
  deleteProduct,
} from "../controllers/productControllers.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// [Fetching productcs from DATABASE] 1. setup Product router
const router = express.Router();

router.route("/").get(getProducts);

router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct);

export default router;
