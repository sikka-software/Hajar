import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import * as initHajarModule from "../init.js";

async function login(email, password) {
  const {
    User,
    getClientData,
    getAdminData,
    getUserType,
    jwtSecret,
    //  mongoose,
  } = initHajarModule;
  const { secret } = initHajarModule;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (!(await compare(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const token = sign({ userId: user._id }, jwtSecret || secret, {
    expiresIn: "1h",
  });

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
