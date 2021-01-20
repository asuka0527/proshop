// ES MODULES
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import products from "./data/products.js";
import colors from "colors";

// // common JS module way of importing files/libraries
// const express = require("express");
// // Environment variables
// const dotenv = require("dotenv");
// const products = require("./data/products");

// Environment variables
dotenv.config();

connectDB();

// Initialize express
const app = express();

// Home Route
app.get("/", (req, res) => {
  res.send("API IS RUNNING...");
});

// create route for ALL products
app.get("/api/products", (req, res) => {
  // convert it JSON
  res.json(products);
});

// create a route for single product
app.get("/api/products/:id", (req, res) => {
  const product = products.find((product) => product._id === req.params.id);
  res.json(product);
});

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);
