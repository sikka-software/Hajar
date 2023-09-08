const CustomError = require("../../utils/customError");

class HajarAuth {
  constructor(options) {
    this.jwt = options.jwt;
    this.bcrypt = options.bcrypt;
    this.User = options.User;
    this.Role = options.Role; // new
    this.Permission = options.Permission; // new
    this.secret = options.secret;
    this.cookieOptions = options.cookieOptions;
  }

  async signup(username, email, password, confirmPassword) {
    // modified
    const userExists = await this.User.findOne({ email });
    if (userExists) {
      throw new CustomError(
        "User with this email already exists",
        "user-already-exist",
        { email: email }
      );
    }
    const role = await this.Role.find({ name: "Admin" });
    const RoleId = role._id;
    const hashedPassword = await this.bcrypt.hash(password, 10);
    const hashedconfirmPassword = await this.bcrypt.hash(confirmPassword, 10);
    const user = new this.User({
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedconfirmPassword,
      role: RoleId, // new
    });

    await user.save();

    const token = this.jwt.sign({ userId: user._id }, this.secret);

    return { user, token, role }; // modified
  }
  async createRole(roleName, permissionIds) {
    const existingRole = await this.Role.findOne({ name: roleName });
    if (existingRole) {
      // throw new Error(`Role ${roleName} already exists`);
      throw new CustomError("Role already exists", "role-already-exist", {
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
    });

    return newRole;
  }

  async signin(email, password, res) {
    const user = await this.User.findOne({ email });
    if (!user) {
      // throw new Error("Invalid email or password");
      throw new CustomError(
        "Invalid email or password",
        "invalid-email-password"
      );
    }

    const isPasswordCorrect = await this.bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      // throw new Error("Invalid email or password");
      throw new CustomError(
        "Invalid email or password",
        "invalid-email-password"
      );
    }

    const token = this.jwt.sign({ userId: user._id }, this.secret);

    const role = user.role || "user"; // default role is "user"

    return { user, token, role }; // modified
  }

  signout(res) {
    res.clearCookie("token");
    return true;
  }

  async getUserByToken(token) {
    if (!token) {
      return null;
    }

    try {
      const decodedToken = this.jwt.verify(token, this.secret);
      const user = await this.User.findById(decodedToken.userId);
      if (!user) {
        console.error(`User not found for ID ${decodedToken.userId}`);
        // return { error: "User not found" };
        return new CustomError("User not found", "user-not-found");
      }
      return user;
    } catch (err) {
      console.error("JWT verification error:", err);
      // return { error: "Invalid token" };
      return new CustomError("Invalid user token", "invalid-user-token");
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
      throw new CustomError("User not found", "user-not-found", {
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
      throw new CustomError("User not found", "user-not-found", {
        userID: userId,
      });
    }

    return user;
  }

  async getRoleById(middelware, roleId) {
    if (!middelware.Types.ObjectId.isValid(roleId)) {
      // throw new Error("Invalid roleId");
      throw new CustomError("Invalid Role ID", "invalid-role", {
        roleID: roleId,
      });
    }
    try {
      const role = await this.Role.findOne({ _id: roleId });
      if (!role) {
        // throw new Error("Role not found");
        throw new CustomError("Role not found", "role-not-found", {
          roleID: roleId,
        });
      }
      return role;
    } catch (error) {
      // throw new Error(`Unable to fetch role: ${error.message}`);
      throw new CustomError(error.message, "fetch-role-error", {
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
      throw new CustomError(error.message, "fetch-role-error");
    }
  }

  // Delete a role from the database
  async deleteRole(roleId) {
    try {
      const role = await this.Role.findByIdAndRemove(roleId);
      if (!role) {
        // throw new Error("Role not found");
        throw new CustomError("Role not found", "role-not-found", {
          roleID: roleId,
        });
      }
    } catch (error) {
      // throw new Error(`Unable to delete role: ${error.message}`);
      throw new CustomError(error.message, "delete-role-error");
    }
  }

  async updateRole(roleId, name, permissionIds) {
    const role = await this.Role.findById(roleId);
    if (!role) {
      // throw new Error("Role not found");
      throw new CustomError("Role not found", "role-not-found", {
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
      throw new CustomError(error.message, "fetch-permission-error");
    }
  }
}

module.exports = HajarAuth;
