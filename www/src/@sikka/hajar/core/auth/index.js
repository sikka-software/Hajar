import { compare, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

async function login(email, password, config) {
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
  let additionalData = null;

  switch (ref) {
    case "admin":
      additionalData = await models.Admin.findOne({ uid: user._id });
      if (!additionalData) {
        throw new Error("Admin not found");
      }
      break;
    case "client":
      additionalData = await models.Client.findOne({ uid: user._id });
      if (!additionalData) {
        throw new Error("Client not found");
      }
      break;
    default:
      throw new Error("Invalid user reference");
  }

  const token = sign({ _id: user._id }, config.secret, {
    expiresIn: "7d",
  });

  const refreshToken = sign({ _id: user._id }, config.refreshTokenSecret, {
    expiresIn: "30d",
  });

  return {
    success: true,
    user: { ...user.toObject() },
    [ref]: { ...additionalData.toObject() },
    token,
    refreshToken,
  };
}

// @TODO: Add the ability to register a client in the same function
async function register(userDetails, config) {
  try {
    const { models } = config.mongoose;
    userDetails.email = userDetails.email.toLowerCase();
    const userExists = await models.User.findOne({
      email: userDetails.email,
    });
    const usernameCheck = await models.User.findOne({
      username: userDetails.username,
    });

    if (usernameCheck) {
      throw new Error("User with this username already exists");
    }
    if (userExists) {
      throw new Error("User with this email already exists");
    }

    const adminRole = await models.Role.findOne({
      name: "Admin",
    });

    if (!adminRole) {
      const allPermissions = await models.Permission.find({});
      const newAdminRole = new models.Role({
        name: "Admin",
        permissions: allPermissions,
      });
      await newAdminRole.save();
    }

    const hashedPassword = await hash(userDetails.password, 10);

    const user = new models.User({
      username: userDetails.username,
      email: userDetails.email,
      ref: "admin",
      password: hashedPassword,
      role: adminRole._id,
    });

    const newUser = await user.save();

    const admin = new models.Admin({
      profile: newUser._id,
      role: adminRole._id,
      uid: newUser._id,
      username: userDetails.username,
      firstName: { en: "", ar: "" },
      lastName: { en: "", ar: "" },
    });

    const newAdmin = await admin.save();

    const token = sign({ _id: newUser._id }, config.secret);
    // i need to add the refresh token here
    const refreshToken = sign({ _id: newUser._id }, config.refreshTokenSecret, {
      expiresIn: "30d",
    });

    return {
      success: true,
      user: { ...newUser.toObject() },
      admin: { ...newAdmin.toObject() },
      token,
      refreshToken,
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

async function getUserFromToken(accessToken, config) {
  try {
    const { models } = config.mongoose;
    const decodedToken = verify(accessToken, config.secret);
    const user = await models.User.findById(decodedToken._id);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function refreshAccessToken(refreshToken, config) {
  if (!refreshToken) {
    throw new Error("No token provided");
  }
  const { models } = config.mongoose;

  let payload = {};
  try {
    payload = verify(refreshToken, config.refreshTokenSecret);
  } catch (err) {
    throw new Error("Invalid token");
  }

  const user = await models.User.findById(payload._id);
  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = sign({ _id: user._id }, config.secret, {
    expiresIn: "1h",
  });
  return newAccessToken;
}

export { login, register, getUserFromToken, refreshAccessToken };
