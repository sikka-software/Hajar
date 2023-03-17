class HajarAuth {
  constructor(options) {
    this.jwt = options.jwt;
    this.bcrypt = options.bcrypt;
    this.User = options.User;
    this.Role = options.Role; // new
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

    const role = user.role || "admin"; // default role is "user"

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
      const user = await this.User.findById(decodedToken.userId);
      return user;
    } catch (err) {
      return null;
    }
  }
  async createRole(roleName, permissions) {
    const existingRole = await this.Role.findOne({ name: roleName });
    if (existingRole) {
      throw new Error(`Role ${roleName} already exists`);
    }

    const role = new this.Role({
      name: roleName,
      permissions,
    });

    await role.save();

    return role;
  }
}

module.exports = HajarAuth;
