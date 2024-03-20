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

  const ref = user.ref;
  let adminData = null;
  let clientData = null;

  if (ref === "admin") {
    adminData = await models.Admin.findOne({ userId: user._id });
    if (!adminData) {
      throw new Error("Admin not found");
    }
  } else if (ref === "client") {
    clientData = await models.Client.findOne({ userId: user._id });
    if (!clientData) {
      throw new Error("Client not found");
    }
  }

  const token = sign({ _id: user._id }, config.secret, {
    expiresIn: "7d",
  });

  if (ref === "admin") {
    return {
      success: true,
      user: { ...user.toObject() },
      admin: { ...adminData.toObject() },
      token,
    };
  } else if (ref === "client") {
    return {
      success: true,
      user: { ...user.toObject() },
      client: { ...clientData.toObject() },
      token,
    };
  }
}

export { login };
