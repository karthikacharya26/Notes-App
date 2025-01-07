const jwt = require("jsonwebtoken");
const UserModel = require("../model/user.model");

const auth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ msg: "token not found" });
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ msg: "token not found" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ msg: "invalid token" });
    }
    const user = await UserModel.findById(decoded.id)
    req.user = user
    next()
  } catch (error) {
    res.status(400).json({ msg: "invalid token" });
  }
};

module.exports = auth