class HajarAuth {
  constructor(options) {
    this.jwt = options.jwt;
    this.bcrypt = options.bcrypt;
    this.User = options.User;
    this.secret = options.secret;
    this.cookieOptions = options.cookieOptions;
  }

  async signup(email, password) {
    const userExists = await this.User.findOne({ email });
    if (userExists) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await this.bcrypt.hash(password, 10);

    const user = new this.User({
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = this.jwt.sign({ userId: user._id }, this.secret);

    return { token };
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

    return { token };
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
}

module.exports = HajarAuth;
