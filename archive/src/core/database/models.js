const mongoose = require("mongoose");

function addModel(name, data) {
  const NewSchema = new mongoose.Schema(data, { timestamps: true });
  return mongoose.model(name, NewSchema);
}
module.exports = { addModel };
