import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, secret } from "../init.js";
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
export default login;
