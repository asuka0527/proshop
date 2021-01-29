import express from "express";
// [Fetching users from DATABASE] -3).  setup user router
const router = express.Router();

import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userControllers.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/authMiddleware.js";

// [ User Registration ] -> .get -> // [ Get all users - ADMIN]
router.route("/").post(registerUser).get(protect, admin, getUsers);

router.post("/login", authUser);

// we use route because we are gonna make a GET & PUT request to update user profile
// add on - [ Update User ]
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
