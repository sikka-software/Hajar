const mongoose = require("mongoose");

export default function addModel(name, data) {
  const NewSchema = new mongoose.Schema(data, { timestamps: true });
  return mongoose.model(name, NewSchema);
}
