import mongoose from "mongoose";

export default function initializeDB(callback: mongoose.CallbackWithoutResult) {
    mongoose
      .connect(
        `mongodb+srv://${globalThis.__config.mongodb_name}:${globalThis.__config.mongodb_password}@cluster0.dubdn.mongodb.net/${globalThis.__config.mongodb_user}?retryWrites=true&w=majority`, globalThis.__config.mongodb_options, callback
      );
}
