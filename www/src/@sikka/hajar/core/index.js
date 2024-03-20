import { login } from "./auth/index.js";

class Hajar {
  constructor() {
    this.models = null;
    this.config = null;
    this.initialized = false;
    this.auth = {
      login: function (email, password) {
        if (!this.initialized) {
          throw new Error("Hajar is not initialized");
        }
        return login(this.models, this.config, email, password);
      }.bind(this),
    };
  }
  initHajar(jwtSecret, mongooseInstance, userModel, adminModel, clientModel) {
    if (this.initialized) {
      throw new Error("Hajar is already initialized");
    }

    this.models = {
      User: userModel,
      Admin: adminModel,
      Client: clientModel,
    };
    this.config = {
      secret: jwtSecret,
      mongoose: mongooseInstance,
    };
    this.initialized = true;

    console.log("Hajar initialized successfully.");
  }
}

export default new Hajar();
