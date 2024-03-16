import mongoose from "mongoose";

interface User {
  findOne: (query: any) => Promise<any>;
}

interface Admin {
  findOne: (query: any) => Promise<any>;
}

let initialized = false;
let User: User;
let Admin: Admin;
let secret: string;
let mongooseInstance: typeof mongoose;

export function initHajar(
  userInstance: User,
  adminInstance: Admin,
  jwtSecret: string,
  mongooseInstance: typeof mongoose
) {
  if (initialized) {
    throw new Error("Hajar is already initialized");
  }

  User = userInstance;
  Admin = adminInstance;
  secret = jwtSecret;
  mongooseInstance = mongooseInstance;
  initialized = true;
}

export { User, Admin, secret, mongooseInstance };
