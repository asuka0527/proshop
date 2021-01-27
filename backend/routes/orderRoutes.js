import express from "express";
const router = express.Router();

import asyncHandler from "express-async-handler";

import { addOrderItems } from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

router.route("/").post(protect, addOrderItems);

export default router;
