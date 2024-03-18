const { initHajar } = require("./core/init.js");
const auth = require("./core/auth/index.js");
const hajar = {
  initHajar,
  auth,
  version: "1.0.41",
};

module.exports = hajar;
