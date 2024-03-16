/* import HajarError from "../utils/HajarError";
import { User } from "../init"; // Assuming these are the correct imports
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

// @TODO here we need to add the register function
interface UserDetails {
  username: string;
  email: string;
  password: string;
}

interface Name {
  en: string;
  ar: string;
}

interface Admin {
  profile: string;
  role: string;
  uid: string;
  username: string;
  firstName: Name;
  lastName: Name;
}

interface UserResponse {
  success: boolean;
  user: User;
  admin: Admin;
  token: string;
}

const secret = "your-secret-key";

async function register(userDetails: UserDetails): Promise<UserResponse> {
  try {
    userDetails.email = userDetails.email.toLowerCase();
    const userExists = await User.findOne({ email: userDetails.email });
    const usernameCheck = await User.findOne({
      username: userDetails.username,
    });

    if (usernameCheck) {
      throw new HajarError(
        "User with this username already exists",
        "username-already-exist",
        { username: userDetails.username }
      );
    }
    if (userExists) {
      throw new HajarError(
        "User with this email already exists",
        "user-already-exist",
        { email: userDetails.email }
      );
    }

    // Here we need to add the logic to create the a role for the admin
    let adminRole = await Role.findOne({ name: "Admin" });

    const hashedPassword = await bcrypt.hash(userDetails.password, 10);

    const user = new User({
      username: userDetails.username,
      email: userDetails.email,
      ref: "admin",
      password: hashedPassword,
      role: adminRole._id,
    });

    const newUser = await user.save();

    const admin = new Admin({
      profile: newUser._id,
      role: adminRole._id,
      uid: newUser._id,
      username: userDetails.username,
      firstName: { en: "", ar: "" },
      lastName: { en: "", ar: "" },
    });

    const newAdmin = await admin.save();

    const token = jwt.sign({ userId: newUser._id }, secret);

    return {
      success: true,
      user: { ...newUser.toObject() },
      admin: { ...newAdmin.toObject() },
      token,
    };
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export default register;
 */
