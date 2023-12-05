// This class handles all authentication

const HajarError = require("../../utils/hajarError");

class HajarAuth {
  constructor(options) {
    this.jwt = options.jwt;
    this.bcrypt = options.bcrypt;
    this.User = options.User;
    this.Admin = options.Admin; // new
    this.Role = options.Role; // new
    this.Permission = options.Permission; // new
    this.secret = options.secret;
    this.Customer = options.Customer;
  }
  async register(userDetails) {
    try {
      userDetails.email = userDetails.email.toLowerCase();
      const userExists = await this.User.findOne({ email: userDetails.email });

      if (userExists) {
        throw new HajarError(
          "User with this email already exists",
          "user-already-exist",
          { email: userDetails.email }
        );
      }

      const adminRole = await this.Role.findOne({ name: "Admin" });

      if (!adminRole) {
        throw new HajarError("Admin role not found", "admin-role-not-found");
      }

      let existingUserWithSameUsername = await this.User.findOne({
        username: userDetails.username,
      });

      if (existingUserWithSameUsername) {
        userDetails.username = generateUniqueUsername(userDetails.username);
      }

      const hashedPassword = await this.bcrypt.hash(userDetails.password, 10);

      const user = new this.User({
        username: userDetails.username,
        email: userDetails.email,
        ref: "admins",
        password: hashedPassword,
        role: adminRole._id,
      });

      const newUser = await user.save();

      const admin = new this.Admin({
        profile: newUser._id,
        role: adminRole._id,
        uid: newUser._id,
        username: userDetails.username,
        firstName: {
          en: "ENGLISH FIRST NAME",
          ar: "ARABIC FIRST NAME",
        },
        lastName: {
          en: "ENGLISH LAST NAME",
          ar: "ARABIC LAST NAME",
        },
      });

      const newAdmin = await admin.save();

      const token = this.jwt.sign({ userId: newUser._id }, this.secret);
      const finalUser = {
        ...newAdmin.toObject(),
        ...newUser.toObject(),
      };
      return {
        success: true,
        user: finalUser,
        token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async registerCustomer(userDetails) {
    try {
      userDetails.email = userDetails.email.toLowerCase();
      const userExists = await this.User.findOne({ email: userDetails.email });

      if (userExists) {
        throw new HajarError(
          "User with this email already exists",
          "user-already-exist",
          { email: userDetails.email }
        );
      }

      let existingUserWithSameUsername = await this.User.findOne({
        username: userDetails.username,
      });

      if (existingUserWithSameUsername) {
        throw new HajarError(
          "User with this username already exists",
          "user-already-exist",
          { username: userDetails.username }
        );
      }

      const hashedPassword = await this.bcrypt.hash(userDetails.password, 10);

      const user = new this.User({
        username: userDetails.username,
        email: userDetails.email,
        ref: "customers",
        password: hashedPassword,
      });

      const newUser = await user.save();

      const customer = new this.Customer({
        profile: newUser._id,
        uid: newUser._id,
        username: userDetails.username,
        firstName: {
          en: "ENGLISH FIRST NAME",
          ar: "ARABIC FIRST NAME",
        },
        lastName: {
          en: "ENGLISH LAST NAME",
          ar: "ARABIC LAST NAME",
        },
      });

      const newCustomer = await customer.save();

      const token = this.jwt.sign({ userId: newUser._id }, this.secret);
      const finalUser = {
        ...newCustomer.toObject(),
        ...newUser.toObject(),
      };
      return {
        success: true,
        user: finalUser,
        token,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async createRole({ roleName, permissionIds, ...newRoleOptions }) {
    const existingRole = await this.Role.findOne({ name: roleName });
    if (existingRole) {
      // throw new Error(`Role ${roleName} already exists`);
      throw new HajarError("Role already exists", "role-already-exist", {
        role: roleName,
      });
    }
    let idPermissions = [];
    for (let i = 0; i < permissionIds.length; i++) {
      const permission = permissionIds[i];
      const idPermission = await this.Permission.findOne(
        {
          grant: permission.grant,
          read: permission.read,
          write: permission.write,
          update: permission.update,
          delete: permission.delete,
        },
        "_id"
      );
      idPermissions.push(idPermission);
    }

    const newRole = await this.Role.create({
      name: roleName,
      permissions: [...idPermissions],
      ...newRoleOptions,
    });

    return newRole;
  }
  async loginAdmin(email, password, isGoogle = false) {
    try {
      const user = await this.User.findOne({ email: email, ref: "admins" });

      if (!user) {
        throw new HajarError(
          "Invalid email or password",
          "invalid-email-password"
        );
      }

      if (!isGoogle) {
        const isPasswordCorrect = await this.bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new HajarError(
            "Invalid email or password",
            "invalid-email-password"
          );
        }
      }

      // Password is correct, sign a token for the admin user
      const token = this.jwt.sign({ userId: user._id }, this.secret);

      return { user, token, role: "admin" };
    } catch (error) {
      console.error(error);
      return new HajarError(error.message, "admin-login-error");
    }
  }

  async loginCustomer(email, password, isGoogle = false) {
    try {
      const user = await this.User.findOne({ email: email, ref: "customers" });

      if (!user) {
        throw new HajarError(
          "Invalid email or password",
          "invalid-email-password"
        );
      }

      if (!isGoogle) {
        const isPasswordCorrect = await this.bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new HajarError(
            "Invalid email or password",
            "invalid-email-password"
          );
        }
      }
      const customerData = await this.Customer.findOne({ profile: user._id });

      user.customerData = customerData;

      const token = this.jwt.sign({ userId: user._id }, this.secret);

      return { user, token, role: "customer" };
    } catch (error) {
      console.error(error);
      return new HajarError(error.message, "customer-login-error");
    }
  }

  logout(res) {
    res.clearCookie("@admin-tayar-token");
    return true;
  }
  async getUserByToken(token) {
    if (!token) {
      return null;
    }
    try {
      const decodedToken = this.jwt.verify(token, this.secret);
      const user = await this.User.findById(decodedToken.userId);
      console.log("decodedToken.userId : ", decodedToken.userId);
      const admin = await this.Admin.findOne({ uid: user._id });

      if (!user) {
        console.error(`User not found for ID ${decodedToken.userId}`);
        return new HajarError("User not found", "user-not-found");
      }

      if (!admin) {
        console.error(`Admin not found for user ID ${user._id}`);
        return new HajarError("Admin not found", "admin-not-found");
      }
      const mergedObject = {
        ...admin.toObject(),
        ...user.toObject(),
      };

      return mergedObject;
    } catch (err) {
      console.error("JWT verification error:", err);
      // return { error: "Invalid token" };
      return new HajarError("Invalid user token", "invalid-user-token");
    }
  }
  async getUserByEmail(email) {
    const user = await this.User.findOne({ email }).populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "permissions",
      },
    });
    if (!user) {
      // throw new Error(`User with email ${email} not found`);
      throw new HajarError("User not found", "user-not-found", {
        email: email,
      });
    }

    return user;
  }
  async getUserById(userId) {
    const user = await this.User.findById(userId).populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "permissions",
      },
    });
    if (!user) {
      // throw new Error(`User with ID ${userId} not found`);
      throw new HajarError("User not found", "user-not-found", {
        userID: userId,
      });
    }

    return user;
  }
  async getRoleById(middelware, roleId) {
    if (!middelware.Types.ObjectId.isValid(roleId)) {
      // throw new Error("Invalid roleId");
      throw new HajarError("Invalid Role ID", "invalid-role", {
        roleID: roleId,
      });
    }
    try {
      const role = await this.Role.findOne({ _id: roleId });
      if (!role) {
        // throw new Error("Role not found");
        throw new HajarError("Role not found", "role-not-found", {
          roleID: roleId,
        });
      }
      return role;
    } catch (error) {
      // throw new Error(`Unable to fetch role: ${error.message}`);
      throw new HajarError(error.message, "fetch-role-error", {
        roleID: roleId,
      });
    }
  }
  // Fetch all roles from the database
  async getRoles() {
    try {
      const roles = await this.Role.find();
      return roles;
    } catch (error) {
      // throw new Error(`Unable to fetch roles: ${error.message}`);
      throw new HajarError(error.message, "fetch-role-error");
    }
  }
  // Delete a role from the database
  async deleteRole(roleId) {
    try {
      const role = await this.Role.findByIdAndDelete(roleId);
      if (!role) {
        // throw new Error("Role not found");
        throw new HajarError("Role not found", "role-not-found", {
          roleID: roleId,
        });
      }
    } catch (error) {
      // throw new Error(`Unable to delete role: ${error.message}`);
      throw new HajarError(error.message, "delete-role-error");
    }
  }
  async updateRole(roleId, name, permissionIds) {
    const role = await this.Role.findById(roleId);
    if (!role) {
      // throw new Error("Role not found");
      throw new HajarError("Role not found", "role-not-found", {
        roleID: roleId,
      });
    }
    role.name = name;
    let idPermissions = [];

    for (let i = 0; i < permissionIds.length; i++) {
      const permission = permissionIds[i];
      const idPermission = await this.Permission.findOne(
        {
          grant: permission.grant,
          read: permission.read,
          write: permission.write,
          update: permission.update,
          delete: permission.delete,
        },
        "_id"
      );
      idPermissions.push(idPermission);
    }
    role.permissions = [...idPermissions];
    const newRole = await role.save();
    return newRole;
  }
  async getAllGrantedPermissions() {
    try {
      const grants = await this.Permission.find().distinct("grant");
      return [...grants];
    } catch (error) {
      // throw new Error(`Unable to fetch permissions: ${error.message}`);
      throw new HajarError(error.message, "fetch-permission-error");
    }
  }
}

module.exports = HajarAuth;
