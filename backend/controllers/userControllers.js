import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import User from "../models/userModel.js";

// [userAuthentication] -1). set up request here
// @description     Auth user & get token
// @route           POST/api/users/login
// @access          Public (some routes will need a token for example when users needs to be login so it will need a login token)
const authUser = asyncHandler(async (req, res) => {
  //this will give us the data that has been sent in the body
  const { email, password } = req.body;
  // res.send({ email, password });

  // we want to find the entered email in our User model (database) by email
  const user = await User.findOne({ email });

  // once the email is found we must check is the PLAIN password correct. but the password in our database in encrypted so we need to use bcrypt in the User Model

  if (user && (await user.matchPassword(password))) {
    // we want to return this
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    // authourized
    res.status(401);
    throw new Error("Invalid email and password");
  }
});

// [ User Registration ]
// @description     Register users
// @route           POST/api/users
// @access          Public
const registerUser = asyncHandler(async (req, res) => {
  // data we want from the body
  const { name, email, password } = req.body;

  // check if user exists by email
  const userExists = await User.findOne({ email });

  // check if
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // if it does not exist we will take the User model and use .create({that will take in an object})
  const user = await User.create({
    name,
    email,
    password,
  });

  // after creation is successful
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @description     Get user profile
// @route           GET/api/users/profile
// @access          Private
const getUserProfile = asyncHandler(async (req, res) => {
  // const user = await User.findById(req.user._id);

  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// [ Update User - by User ]
// @description     Update user profile
// @route           PUT/api/users/profile (PUT === update)
// @access          Private
const updateUserProfile = asyncHandler(async (req, res) => {
  // find the user by Id
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      // automatically incrypted bec of the middleware in the User Model
      user.password = req.body.password;
    }

    // save updated user info
    const updatedUser = await user.save();

    // respond with json the UPDATE user info
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

/////// ADMIN

// @description     Get all users
// @route           GET/api/users
// @access          Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  // get all users from db
  const users = await User.find({});
  // respond(send) users object to fronted
  res.json(users);
});

// @description     Delete user
// @route           DELETE/api/users/:id
// @access          Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // get the user's id from URL params
  const user = await User.findById(req.params.id);

  if (user) {
    // remove user from db
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @description     Get user by ID
// @route           GET/api/users/:id
// @access          Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  // get user from db , select it and dont get password
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    // respond(send) user object to fronted
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// [ Update User - by ADMIN ]
// @description     Update user
// @route           PUT/api/users/:id (PUT === update)
// @access          Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  // find the user by Id from the URL
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin === true ? true : false;

    // save updated user info
    const updatedUser = await user.save();

    // respond with json the UPDATE user info
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
