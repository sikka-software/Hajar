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

  async signup(name, email, password, confirmPassword, role) {
    // modified
    const userExists = await this.User.findOne({ email });
    if (userExists) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await this.bcrypt.hash(password, 10);
    const hashedconfirmPassword = await this.bcrypt.hash(confirmPassword, 10);
    const user = new this.User({
      name,
      email,
      password: hashedPassword,
      confirmPassword: hashedconfirmPassword,
      role, // new
    });

    await user.save();

    const token = this.jwt.sign({ userId: user._id }, this.secret);

    return { token, role }; // modified
  }
  async createRole(roleName, permissionIds) {
    const existingRole = await this.Role.findOne({ name: roleName });
    if (existingRole) {
      throw new Error(`Role ${roleName} already exists`);
    }

    const permissions = await this.Permission.find({
      _id: { $in: permissionIds },
    });
    if (permissionIds.length !== permissions.length) {
      throw new Error("Invalid permission IDs provided");
    }

    const role = new this.Role({
      name: roleName,
      permissions: permissions.map((permission) => permission._id),
    });

    await role.save();

    return role;
  }

  async signin(email, password, res) {
    const user = await this.User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordCorrect = await this.bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password");
    }

    const token = this.jwt.sign({ userId: user._id }, this.secret);

    const role = user.role || "user"; // default role is "user"

    return { token, role }; // modified
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
      const user = await this.User.findById(decodedToken.userId).populate({
        path: "roles",
        populate: {
          path: "permissions",
          model: "permissions",
        },
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      return null;
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
      throw new Error(`User with email ${email} not found`);
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
      throw new Error(`User with ID ${userId} not found`);
    }

    return user;
  }

  async getRoleById(roleId) {
    const role = await this.Role.findById(roleId).populate("permissions");
    if (!role) {
      throw new Error("Role not found");
    }
    return role;
  }

  async getRoles() {
    const roles = await this.Role.find().populate("permissions");
    return roles;
  }

  async updateRole(roleId, name, permissionIds) {
    const role = await this.Role.findById(roleId);
    if (!role) {
      throw new Error("Role not found");
    }
    role.name = name;
    role.permissions = await this.Permission.find({
      _id: { $in: permissionIds },
    });
    await role.save();
    return role;
  }

  async deleteRole(roleId) {
    const role = await this.Role.findById(roleId);
    if (!role) {
      throw new Error("Role not found");
    }
    await role.delete();
  }
}

module.exports = HajarAuth;
