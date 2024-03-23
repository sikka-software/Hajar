import {
  login,
  register,
  getUserFromToken,
  refreshAccessToken,
} from "./auth/index.js";

class Hajar {
  async init(url, secrets, mongooseInstance) {
    if (this.initialized) {
      throw new Error("🚫 Hajar is already initialized");
    }
    console.log("⌛ Starting the database connection process...");
    try {
      await mongooseInstance.connect(url);
      mongooseInstance.connection.once("open", () => {
        console.log("✅🔗 Connected to the database successfully!");
      });
      mongooseInstance.connection.on("error", (error) => {
        console.error("❌🔗 Error connecting to the database:", error);
        throw error;
      });

      this.config = {
        accessToken: secrets.accessToken,
        refreshToken: secrets.refreshToken,
        mongoose: mongooseInstance,
      };

      this.initialized = true;
      console.log("✅🚀 Hajar initialized successfully.");
    } catch (error) {
      console.error("❌🔗 Attempt to connect to the database failed: ", error);
      throw error;
    }
  }
  constructor() {
    this.config = null;
    this.initialized = false;
    this.auth = {
      login: (email, password, userType) => {
        if (!this.initialized) {
          throw new Error("Hajar is not initialized");
        }
        return login(email, password, userType, this.config);
      },
      register: (userDetails) => {
        if (!this.initialized) {
          throw new Error("Hajar is not initialized");
        }
        return register(userDetails, this.config);
      },
      getUserFromToken: (accessToken) => {
        if (!this.initialized) {
          throw new Error("Hajar is not initialized");
        }
        return getUserFromToken(accessToken, this.config);
      },
      refreshAccessToken: (refreshToken) => {
        if (!this.initialized) {
          throw new Error("Hajar is not initialized");
        }
        return refreshAccessToken(refreshToken, this.config);
      },
    };
  }
}

export default new Hajar();
