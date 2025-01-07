const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String,enum: ["male", "female"], required: true },
  age: { type: Number, required: true },
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
