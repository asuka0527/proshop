import express from "express";
import asyncHandler from "express-async-handler";

import { authUser, getUserProfile } from "../controllers/userControllers.js";

import { protect } from "../middleware/authMiddleware.js";

// [Fetching users from DATABASE] -3).  setup user router
const router = express.Router();

router.post("/login", authUser);

// we use route because we are gonna make a GET & PUT request to update user profile
router.route("/profile").get(protect, getUserProfile);

export default router;
