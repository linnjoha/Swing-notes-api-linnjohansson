const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isMatchedPassword = await bcrypt.compare(password, hashedPassword);
  return isMatchedPassword;
};

module.exports = {
  hashPassword,
  comparePassword,
};
