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
      type: Boolean,
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

// [ User Registration ] - before we save we want to encrypt password

userSchema.pre("save", async function (next) {
  // mongoose method that will check if password is modified
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrpyt.genSalt(10);
  this.password = await bcrpyt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
