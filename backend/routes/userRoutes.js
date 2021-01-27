import express from "express";
import asyncHandler from "express-async-handler";

import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
} from "../controllers/userControllers.js";

import { protect } from "../middleware/authMiddleware.js";

// [Fetching users from DATABASE] -3).  setup user router
const router = express.Router();

router.post("/login", authUser);

// we use route because we are gonna make a GET & PUT request to update user profile
// add on - [ Update User ]
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// [ User Registration ]
router.route("/").post(registerUser);

export default router;
