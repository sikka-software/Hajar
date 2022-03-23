

function setupDB(mongoose, callback) {
  console.log(mongoose);
  if (
    __config &&
    __config.HAJAR_MONGODB_NAME &&
    __config.HAJAR_MONGODB_USER &&
    __config.HAJAR_MONGODB_PASSWORD
  ) {
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose
      .connect(
        `mongodb+srv://${__config.HAJAR_MONGODB_NAME}:${__config.HAJAR_MONGODB_PASSWORD}@cluster0.dubdn.mongodb.net/${__config.HAJAR_MONGODB_USER}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
      )
      .then(() => {
        console.log("connected To DATABASE!");
        if (callback && typeof callback === "function") {
          callback();
        }
      })
      .catch((err) => {
        console.log("mongoDB:", err);
      });
  }
}

module.exports = { initializeDB: setupDB };
