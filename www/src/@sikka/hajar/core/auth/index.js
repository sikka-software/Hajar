import { compare, hash } from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import HajarError from "../utils/hajarError";

async function login(email, password, userType, config) {
  try {
    const { models } = config.mongoose;
    const user = await models.User.findOne({ email });
    if (!user) {
      throw new HajarError("User not found", "invalid-email-password");
    }

    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      throw new HajarError("Invalid password", "invalid-email-password");
    }

    // Capitalize the first letter of userType
    const modelType = userType.charAt(0).toUpperCase() + userType.slice(1);

    // Check if the model exists in models on our mongoose instance
    if (!models[modelType]) {
      throw new HajarError("Invalid user type", "invalid_user_type");
    }

    const additionalData = await models[modelType].findOne({ uid: user._id });
    if (!additionalData) {
      throw new HajarError(`${modelType} not found`, `${userType}_not_found`);
    }

    const token = sign({ _id: user._id }, config.accessToken, {
      expiresIn: "1h",
    });

    const refreshToken = sign({ _id: user._id }, config.refreshToken, {
      expiresIn: "7d",
    });

    return {
      success: true,
      user: { ...user.toObject() },
      [userType]: { ...additionalData.toObject() },
      token,
      refreshToken,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
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
      throw new HajarError(
        "User with this username already exists",
        "username_exists"
      );
    }
    if (userExists) {
      throw new HajarError(
        "User with this email already exists",
        "email_exists"
      );
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

    const token = sign({ _id: newUser._id }, config.accessToken);
    const refreshToken = sign({ _id: newUser._id }, config.refreshToken, {
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
    const decodedToken = verify(accessToken, config.accessToken);
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
    payload = verify(refreshToken, config.refreshToken);
  } catch (err) {
    throw new Error("Invalid token");
  }

  const user = await models.User.findById(payload._id);
  if (!user) {
    throw new Error("User not found");
  }

  const newAccessToken = sign({ _id: user._id }, config.accessToken, {
    expiresIn: "1h",
  });
  return newAccessToken;
}

export { login, register, getUserFromToken, refreshAccessToken };
