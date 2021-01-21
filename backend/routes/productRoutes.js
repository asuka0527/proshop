import express from "express";
import asyncHandler from "express-async-handler";

// [Fetching productcs from DATABASE] 1. setup Product router
const router = express.Router();

import Product from "../models/productModel.js";

// @description Fetch all products
// @route GET/api/products
// @access Public (some routes will need a token for example when users needs to be login so it will need a login token)
router.get(
  "/",
  // use MIDDLEWARE to handle error with custom error handler
  asyncHandler(async (req, res) => {
    // this mongoose method will return all products
    const products = await Product.find({});

    // convert it JSON
    res.json(products);
  })
);
2;
// @description Fetch single products
// @route GET/api/product/:id
// @access Public (token)
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

export default router;
