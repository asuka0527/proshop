// ES MODULES
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import products from "./data/products.js";
import colors from "colors";

// // common JS module way of importing files/libraries
// const express = require("express");
// // Environment variables
// const dotenv = require("dotenv");
// const products = require("./data/products");

import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
// Environment variables
dotenv.config();

// connect us to the Mongo database
connectDB();

// Initialize express
const app = express();

// [userAuthentication] will allow us to accept json data in the body
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("API IS RUNNING...");
});

// [Fetching productcs from DATABASE] 2. link app to productRouter
app.use("/api/products", productRoutes);
// [userAuthentication] -2). mount userRoutes here then setup userRoutes next
app.use("/api/users", userRoutes);
// [ addOrderRoute ]
app.use("/api/orders", orderRoutes);

//[PAYPAL] - config route - when we are ready to make our payment we will hit this route the fetch the client ID
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// FALLBACK for 404 error - when user tries to access a route that does not exist
app.use(notFound);
// ERROR MIDDLEWARE
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
