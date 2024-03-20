import { login } from "./auth";

//@Todo : move this to a separate file
export type Models = {
  User: any;
  Admin: any;
  Client: any;
};

export type Config = {
  secret: string;
  mongoose: any;
};
const initmodesl = {
  User: null,
  Admin: null,
  Client: null,
};
class Hajar {
  models: Models;
  config!: Config;
  initialized: boolean;
  auth: {
    login: (email: string, password: string) => Promise<string>;
  };

  constructor() {
    this.initialized = false;
    this.models = initmodesl;
    this.config = {
      secret: "",
      mongoose: null,
    };
    this.auth = {
      login: (email: string, password: string) =>
        login(this.models, this.config, email, password),
    };
  }

  initHajar(
    jwtSecret: string,
    mongooseInstance: any,
    userModel: any,
    adminModel: any,
    clientModel: any
  ) {
    if (this.initialized) {
      throw new Error("Hajar is already initialized");
    }

    this.models.User = userModel;
    this.models.Admin = adminModel;
    this.models.Client = clientModel;
    this.config.secret = jwtSecret;
    this.config.mongoose = mongooseInstance;
    this.initialized = true;

    console.log("Hajar initialized successfully.");
  }
}

export default new Hajar();
