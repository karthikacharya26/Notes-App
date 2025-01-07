const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  const { email, password, name, age, gender } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(500).json({ msg: "internal server error" });
      }

      const user = new UserModel({
        name,
        email,
        password: hash,
        gender,
        age,
      });
      await user.save();
      res.status(201).json({ msg: "user registered successfully" });
    });
  } catch (error) {
    res.status(500).json({ msg: "error registering user" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "user not found" });
    }

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).json({ msg: "internal server error" });
        }

        if (result) {
          const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
          res.status(200).json({ msg: "user logged in successfully", token });
        } else {
          return res.status(500).json({ msg: "invalid credentials" });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ msg: "error logging user" });
  }
});

module.exports = userRouter;
