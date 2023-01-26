import mongoose from "mongoose";

export default function initializeMongoDB(callback) {
  mongoose.connect(
    `mongodb+srv://${String(global._config.mongodb_name)}:${String(
      global._config.mongodb_password
    )}@cluster0.dubdn.mongodb.net/${String(
      global._config.mongodb_user
    )}?retryWrites=true&w=majority`,
    global._config.mongodb_options,
    callback
  );
}
