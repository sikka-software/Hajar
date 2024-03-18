const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  User,
  secret,
  getClientData,
  getAdminData,
  getUserType,
} = require("../init.js");

async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });

  const userData = {
    success: true,
    user: user.toObject(),
    token,
  };

  switch (await getUserType(email)) {
    case "admin":
      userData.admin = await getAdminData(user);
      break;
    case "client":
      userData.client = await getClientData(user);
      break;
  }

  return userData;
}

module.exports = login;
