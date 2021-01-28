import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @description Create new order
// @route POST/api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  // the data we want to get from the body
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    // save to database

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @description Get order by ID
// @route GET/api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  // find order using the params and populate is with user, and name, email from the body
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  //if the order exists return the json file of that order to the body
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @description Update order to paid
// @route GET/api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // find order using the params and populate is with user, and name, email from the body
  const order = await Order.findById(req.params.id);

  //if the order found update these properties
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    //from Paypal
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    // save the updated order to db return it to the body
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @description Get logged in user orders
// @route GET/api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  // find only the orders of the logged in user
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

export { addOrderItems, getOrderById, updateOrderToPaid, getMyOrders };
