import mongoose from "mongoose";
import bcrpyt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: String,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// [userAuthentication] -4). method that will check wether the plain password entered in the browser matches the encypted one

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrpyt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
