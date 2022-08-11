/* tslint:disable:no-string-literal */
import mongoose from "mongoose";

export default function initializeDB (callback: mongoose.CallbackWithoutResult): void {
  mongoose
    .connect(
        `mongodb+srv://${String(globalThis._config.mongodb_name)}:${String(global._config.mongodb_password)}@cluster0.dubdn.mongodb.net/${String(global._config.mongodb_user)}?retryWrites=true&w=majority`, global._config.mongodb_options, callback
    );
}