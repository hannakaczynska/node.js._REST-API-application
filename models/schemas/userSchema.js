const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const user = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

user.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

user.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", user);

module.exports = User;
