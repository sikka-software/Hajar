import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

async function login(models, config, email, password) {
  const user = await models.User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const validPassword = await compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid password");
  }

  const token = sign({ _id: user._id }, config.secret);
  return token;
}

export { login };
