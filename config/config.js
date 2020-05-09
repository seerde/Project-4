require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "Token not found please log in" });
  } else {
    try {
      req.user = jwt.decode(token, process.env.SECRET).user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Your token is invalid" });
    }
  }
};