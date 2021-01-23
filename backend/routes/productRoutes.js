import express from "express";
import asyncHandler from "express-async-handler";

import {
  getProducts,
  getProductById,
} from "../controllers/productControllers.js";

// [Fetching productcs from DATABASE] 1. setup Product router
const router = express.Router();

router.route("/").get(getProducts);

router.route("/:id").get(getProductById);

export default router;
