import mongoose from "mongoose";

import {
  HAJAR_MONGODB_NAME,
  HAJAR_MONGODB_USER,
  HAJAR_MONGODB_PASSWORD,
} from "../../../Hajar.config.json";

export default function initializeMongoDB(callback) {
  mongoose.connect(
    `mongodb+srv://${String(HAJAR_MONGODB_NAME)}:${String(
      HAJAR_MONGODB_PASSWORD
    )}@cluster0.dubdn.mongodb.net/${String(
      HAJAR_MONGODB_USER
    )}?retryWrites=true&w=majority`,

    callback
  );
}
