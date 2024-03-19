function initHajar(
  jwtSecret,
  mongooseInstance,
  userModel,
  adminModel,
  clientModel
) {
  let initialized = false;

  let User = userModel;
  let Admin = adminModel;
  let Client = clientModel;
  let secret = jwtSecret;
  let mongoose = mongooseInstance;

  const initialize = () => {
    if (initialized) {
      throw new Error("Hajar is already initialized");
    }

    initialized = true;
    console.log("Hajar initialized successfully.");
  };

  const getUserType = async (email) => {
    if (!initialized) {
      throw new Error("Hajar is not initialized");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }
    return user.ref;
  };

  const getAdminData = async (user) => {
    if (!initialized) {
      throw new Error("Hajar is not initialized");
    }
    if (user.ref === "admin") {
      const adminData = await Admin.findOne({ uid: user._id });
      if (!adminData) {
        throw new Error("Admin data not found");
      }
      return adminData;
    }
    return null;
  };

  const getClientData = async (user) => {
    if (!initialized) {
      throw new Error("Hajar is not initialized");
    }
    if (user.ref === "client") {
      const clientData = await Client.findOne({ uid: user._id });
      if (!clientData) {
        throw new Error("Client data not found");
      }
      return clientData;
    }
    return null;
  };

  // Initialize hajar with external data
  initialize();

  // Expose functions and models
  return {
    getUserType,
    getAdminData,
    getClientData,
    User, // Expose User model
    Admin, // Expose Admin model
    Client, // Expose Client model
    secret, // Expose secret
    mongoose, // Expose mongoose
  };
}

export { initHajar };
