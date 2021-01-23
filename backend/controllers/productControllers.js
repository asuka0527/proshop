import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @description Fetch all products
// @route GET/api/products
// @access Public (some routes will need a token for example when users needs to be login so it will need a login token)
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  // throw new Error("some error");
  // convert it JSON
  res.json(products);
});

// @description Fetch single products
// @route GET/api/product/:id
// @access Public (token)
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById };
