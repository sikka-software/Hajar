import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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

export function initHajar(
  userInstance: User,
  adminInstance: Admin,
  jwtSecret: string
) {
  if (initialized) {
    throw new Error("Hajar is already initialized");
  }

  User = userInstance;
  Admin = adminInstance;
  secret = jwtSecret;
  initialized = true;
}

export { User, Admin, secret };
