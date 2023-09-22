const User = require("./models/User");
module.exports = {
  Query: {
    async getUsers() {
      return await User.find();
    },
    async getUser(_, { id }) {
      return await User.findById({ _id: id });
    },
  },
  Mutation: {
    async createUser(_, { input }) {
      const newUser = new User(input);
      return await newUser.save();
    },
    async updateUser(_, { id, input }) {
      return await User.findByIdAndUpdate(id, input, { new: true });
    },
    async deleteUser(_, { id }) {
      return await User.findByIdAndDelete({ _id: id });
    },
  },
};
