const { fi } = require("date-fns/locale");
const mongoose = require("mongoose");

function setupDB() {
  if (
    __config &&
    __config.HAJAR_MONGODB_NAME &&
    __config.HAJAR_MONGODB_USER &&
    __config.HAJAR_MONGODB_PASSWORD
  ) {
    mongoose.set("useFindAndModify", false);
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useCreateIndex", true);
    mongoose
      .connect(
        `mongodb+srv://dbQawaim:${__config.HAJAR_MONGODB_PASSWORD}@cluster0.dubdn.mongodb.net/${__config.HAJAR_MONGODB_NAME}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
      .then(() => {
        console.log("connected To DATABASE!");
      })
      .catch((err) => {
        console.log("mongoDB:", err);
      });
  }
}

module.exports = setupDB;
