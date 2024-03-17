const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, secret } = require("../init.js");

async function login(userType, email, password) {
  const user = await User.findOne({ email, ref: userType });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });

  return {
    success: true,
    user: user,
    token,
  };
}

module.exports = login;
