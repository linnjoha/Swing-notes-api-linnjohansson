const jwt = require("jsonwebtoken");

const createToken = (userid) => {
  return jwt.sign({ id: userid }, process.env.JWT_SECRET, { expiresIn: 900 });
};

const isTokenValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { createToken, isTokenValid };
