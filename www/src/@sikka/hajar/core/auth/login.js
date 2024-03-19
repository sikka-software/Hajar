import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import init from "../init.js";
const { User, secret, getClientData, getAdminData, getUserType } = init;

async function login(email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!(await compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = sign({ userId: user._id }, secret, { expiresIn: "1h" });

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

export default login;
