import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import asyncHandler from "express-async-handler";

// this middleware will validate the user
// middleware function (req,res,next)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //   console.log(decoded);

      // dont include password
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// [ADMIN ] -

const admin = (req, res, next) => {
  //  validate whether there is a user and if  its Admin
  if (req.user && req.user.isAdmin) {
    // if yes then continue
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
};

export { protect, admin };
