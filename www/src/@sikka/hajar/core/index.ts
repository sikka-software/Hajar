import { login } from "./auth";
import { Model, Document } from "mongoose";

export type Models = {
  User: Model<Document<any>>;
  Admin: Model<Document<any>>;
  Client: Model<Document<any>>;
};

export type Config = {
  secret: string;
  mongoose: any;
};

class Hajar {
  models!: Models;
  config!: Config;
  initialized: boolean;
  auth: {
    login: (email: string, password: string) => Promise<string>;
  };

  constructor() {
    this.initialized = false;
    this.auth = {
      login: (email: string, password: string) =>
        login(this.models, this.config, email, password),
    };
  }

  initHajar(
    jwtSecret: string,
    mongooseInstance: any,
    userModel: Model<Document<any>>,
    adminModel: Model<Document<any>>,
    clientModel: Model<Document<any>>
  ) {
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
