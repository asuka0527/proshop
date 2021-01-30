import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @description Fetch all products
// @route GET/api/products
// @access Public (some routes will need a token for example when users needs to be login so it will need a login token)
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  // the page in the query
  const page = Number(req.query.pageNumber) || 1;

  // this is who to get a query string
  // $regex - is to start search with only the key inputed does not need to perfectly match the name
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  // count is a method we can use to count something the db models
  const count = await Product.countDocuments({ ...keyword });

  // ...keyword its gonne be keyword or empty {}
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // send to the frontend
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

// @description Delete product
// @route DELETE/api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // this will allow all ADMIN to remove product
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @description Create product
// @route POST/api/products
// @access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  // create new product with sample data
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });
  // save the created product with sample data to db
  const createdProduct = await product.save();
  // after saving it to db send back the createdProduct values to frontend
  res.status(201).json(createdProduct);
});

// @description Update product
// @route PUT/api/products/:id
// @access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  //get values of product from the body
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;

  // find product by Id from URL
  const product = await Product.findById(req.params.id);

  // if product found, set the properties to the values you got from the body
  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // save the updated product to db
    const updatedProduct = await product.save();
    // after saving it to db send back the updatedProduct values to frontend
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product update failed");
  }
});

// @description Create new review
// @route POST/api/products/:id/reviews
// @access Private
const createProductReview = asyncHandler(async (req, res) => {
  //get values of the product REVIEW entered by user from the body
  const { rating, comment } = req.body;

  // find product by Id from URL
  const product = await Product.findById(req.params.id);

  if (product) {
    // if product found, if the user who is logged in same with the user who already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(404);
      throw new Error("Product already reviewed");
    }

    // if not yet reviewed create a review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // insert the new review in the Product model's reviews array
    product.reviews.push(review);

    // update the #  numReviews
    product.numReviews = product.reviews.length;

    // update the #  rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // save the update fields in the db
    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product update failed");
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
