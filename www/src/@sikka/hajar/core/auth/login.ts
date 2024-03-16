import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { secret } from "../init";
import { User } from "../init";

interface ILoginResponse {
  success: boolean;
  user: object;
  token: string;
}

async function login(
  userType: string,
  email: string,
  password: string,
  mongoose: any
): Promise<ILoginResponse> {
  const user = await User.findOne({ email, ref: userType });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const userData = await mongoose
    .model(userType)
    .findOne({ profile: user._id });

  if (!userData) {
    throw new Error(`${userType} data not found`);
  }

  const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });

  return {
    success: true,
    user: userData,
    token,
  };
}

export default login;
