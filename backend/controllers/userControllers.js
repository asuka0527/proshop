import asyncHandler from "express-async-handler";
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
      token: null,
    });
  } else {
    // authourized
    res.status(401);
    throw new Error("Invalid email and password");
  }
});

export { authUser };