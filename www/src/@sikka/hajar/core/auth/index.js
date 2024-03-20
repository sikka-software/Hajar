import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

async function login(config, email, password) {
  const { models } = config.mongoose;
  const user = await models.User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const accessToken = sign({ _id: user._id }, config.secret, {
    expiresIn: "7d",
  });
  const refreshToken = sign({ userId: user._id }, config.refreshTokenSecret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

export { login };
