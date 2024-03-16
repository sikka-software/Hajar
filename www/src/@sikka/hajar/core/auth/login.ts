import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { secret } from "../init";
import { User, Admin } from "../init";
interface ILoginResponse {
  success: boolean;
  user: object;
  admin: object;
  token: string;
}

async function loginAdmin(
  email: string,
  password: string,
  isGoogle = false
): Promise<ILoginResponse> {
  const user = await User.findOne({ email, ref: "admin" });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!isGoogle) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }
  }

  const adminData = await Admin.findOne({ profile: user._id });
  const token = jwt.sign({ userId: user._id }, secret);

  return {
    success: true,
    user: { ...user.toObject() },
    admin: { ...adminData.toObject() },
    token,
  };
}

export default loginAdmin;
