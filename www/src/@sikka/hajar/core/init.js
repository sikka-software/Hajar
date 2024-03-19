let initialized = false;
let secret;
let mongooseInstance;
let User;
let Admin;
let Client;

function initHajar(
  jwtSecret,
  inputMongooseInstance,
  userModel,
  adminModel,
  clientModel
) {
  if (initialized) {
    throw new Error("Hajar is already initialized");
  }

  secret = jwtSecret;
  mongooseInstance = inputMongooseInstance;
  User = userModel;
  Admin = adminModel;
  Client = clientModel;
  initialized = true;
}

async function getUserType(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user.ref;
}

async function getAdminData(user) {
  if (user.ref === "admin") {
    const adminData = await Admin.findOne({ uid: user._id });
    if (!adminData) {
      throw new Error("Admin data not found");
    }
    return adminData;
  }
  return null;
}

async function getClientData(user) {
  if (user.ref === "client") {
    const clientData = await Client.findOne({ uid: user._id });
    if (!clientData) {
      throw new Error("Client data not found");
    }
    return clientData;
  }
  return null;
}

export default {
  initHajar,
  getUserType,
  getAdminData,
  getClientData,
  secret,
  mongooseInstance,
  User,
  Admin,
  Client,
};
