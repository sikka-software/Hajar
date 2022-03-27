import mongoose from "mongoose";

type HajarDBParameters = {
  HAJAR_MONGODB_NAME: string,
  HAJAR_MONGODB_USER: string,
  HAJAR_MONGODB_PASSWORD: string,
  options: any,
  callback: mongoose.CallbackWithoutResult
};

export default function initializeDB(params: HajarDBParameters) {
  console.log(mongoose);
  if (
    params &&
    params.HAJAR_MONGODB_NAME &&
    params.HAJAR_MONGODB_PASSWORD &&
    params.HAJAR_MONGODB_USER
  ) {
    mongoose
      .connect(
        `mongodb+srv://${params.HAJAR_MONGODB_NAME}:${params.HAJAR_MONGODB_PASSWORD}@cluster0.dubdn.mongodb.net/${params.HAJAR_MONGODB_USER}?retryWrites=true&w=majority`, params.options, params.callback
      );
  }
}
