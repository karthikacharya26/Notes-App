const dotenv = require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const userRouter = require("./route/user.route");
const cors = require("cors");
const auth = require("./middleware/auth.middeware");
const noteRouter = require("./route/note.route");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use("/user", userRouter);
app.use("/note", auth, noteRouter);
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("serving working fine");
});

app.listen(PORT, async () => {
  try {
    await connectDB;
    console.log("listening on Port 3000");
  } catch (error) {
    console.log(error);
  }
});
