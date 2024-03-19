import initHajar from "./core/init.js";
import auth from "./core/auth/index.js";
import { version as _version } from "../../../../package.json";
const hajar = {
  initHajar,
  auth,
  version: _version,
};

export default hajar;
