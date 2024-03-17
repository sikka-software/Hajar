import mongoose, { Model } from "mongoose";

interface IUser {
  findOne: (query: any) => Promise<any>;
}

interface IAdmin {
  findOne: (query: any) => Promise<any>;
}

interface IClient {
  findOne: (query: any) => Promise<any>;
}

let initialized = false;
let secret: string;
let mongooseInstance: typeof mongoose;
let User: IUser;
let Admin: IAdmin;
let Client: IClient;

export function initHajar(
  jwtSecret: string,
  inputMongooseInstance: typeof mongoose,
  userModel: IUser,
  adminModel: IAdmin,
  clientModel: IClient
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

export async function getUserType(email: string): Promise<string> {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }
  return user.ref;
}

export async function getAdminData(user: any): Promise<any> {
  if (user.ref === "admin") {
    const adminData = await Admin.findOne({ uid: user._id });
    if (!adminData) {
      throw new Error("Admin data not found");
    }
    return adminData;
  }
  return null;
}

export async function getClientData(user: any): Promise<any> {
  if (user.ref === "client") {
    const clientData = await Client.findOne({ uid: user._id });
    if (!clientData) {
      throw new Error("Client data not found");
    }
    return clientData;
  }
  return null;
}

export { secret, mongooseInstance, User, Admin, Client };
