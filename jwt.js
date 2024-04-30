const jwt = require("jsonwebtoken");

//creates token
const createToken = (userid) => {
  return jwt.sign({ id: userid }, process.env.JWT_SECRET, { expiresIn: 900 });
};

//check if the token is valid
const isTokenValid = (token) => {
  const upDatedToken = token.replace("Bearer ", "");
  return jwt.verify(upDatedToken, process.env.JWT_SECRET);
};

module.exports = { createToken, isTokenValid };
