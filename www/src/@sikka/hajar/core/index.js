import {
  login,
  register,
  getUserFromToken,
  refreshAccessToken,
} from "./auth/index.js";

class Hajar {
  constructor() {
    this.config = null;
    this.initialized = false;
    this.auth = {
      login: (email, password) => {
        if (!this.initialized) {
          throw new Error("Hajar is not initialized");
        }
        return login(email, password, this.config);
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
  initHajar(jwtSecret, refreshToken, mongooseInstance) {
    if (this.initialized) {
      throw new Error("Hajar is already initialized");
    }
    this.config = {
      secret: jwtSecret,
      refreshTokenSecret: refreshToken,
      mongoose: mongooseInstance,
    };
    this.initialized = true;
    console.log("Hajar initialized successfully.");
  }
}

export default new Hajar();
