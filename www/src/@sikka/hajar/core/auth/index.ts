// @ts-ignore
import { Models } from "../index"; // Adjust the path as needed
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Config } from "../index"; // Assuming Config type is also exported from index.ts

// @ts-ignore
export async function login(
  models: Models,
  config: Config,
  email: string,
  password: string
): Promise<string> {
  const user = await models.User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ _id: user._id }, config.secret);
  return token;
}
