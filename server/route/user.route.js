const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  const { email, password, name, age, gender } = req.body;
  try {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(500).send("Internal server error");
      }
      const user = new UserModel({
        name,
        email,
        password: hash,
        gender,
        age,
      });
      await user.save();
      res.status(201).send("User registered successfully");
    });
  } catch (error) {
    res.send("error occured while registering");
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(500).send("user not found");
    }

    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return res.status(500).send("Internal server error");
        }
        if (result) {
          const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
          res
            .status(200)
            .json({ message: "User logged in successfully", token });
        } else {
          res.status(500).send("invalid credentials");
        }
      });
    }
  } catch (error) {
    res.send("error occured while login");
  }
});

module.exports = userRouter;
