const { initHajar } = require("./core/init.js");
const auth = require("./core/auth/index.js");
const pkg = require("../../../../package.json");
const hajar = {
  initHajar,
  auth,
  version: pkg.version,
};

module.exports = hajar;
