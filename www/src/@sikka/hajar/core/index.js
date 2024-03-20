import { login } from "./auth/index.js";

class Hajar {
  constructor() {
    this.config = null;
    this.initialized = false;
    this.auth = {
      login: function (email, password) {
        if (!this.initialized) {
          throw new Error("Hajar is not initialized");
        }
        return login(this.config, email, password);
      }.bind(this),
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
