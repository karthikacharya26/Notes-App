const dotenv = require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRouter = require("./route/user.route");
const noteRouter = require("./route/note.route");
const auth = require("./middleware/auth.middleware");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/user", userRouter);
app.use('/note',auth, noteRouter)

app.get("/", (req, res) => {
  res.status(200).json({ msg: "server working fine" });
});

app.listen(PORT, async () => {
  try {
    await connectDB;
    console.log(`listening on port ${PORT}`);
  } catch (error) {
    console.log("error connecting DB and server");
  }
});
