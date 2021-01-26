import express from "express";
import asyncHandler from "express-async-handler";

import { authUser } from "../controllers/userControllers.js";

// [Fetching productcs from DATABASE] -3).  setup user router
const router = express.Router();

router.post("/login", authUser);

export default router;
