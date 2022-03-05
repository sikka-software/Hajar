const { dirname } = require("path");
const fs = require("fs");

global.__basedir = __dirname;
global.__appdir = dirname(require.main.filename);

//Here you must add a file Hajar.config
//for configuration of Hajar
/*
contain of file Hajar.config
{
    HAJAR_MONGODB_NAME: "",
    HAJAR_MONGODB_USER: "",
    HAJAR_MONGODB_PASSWORD: ""
}
*/
var file_config = `${__appdir}/Hajar.config.json`;
if (fs.existsSync(file_config)) {
  global.__config = JSON.parse(fs.readFileSync(file_config, "utf8"));
}

/*
example use
Hajar.Database()
Hajar.Invoice()
Hajar.Mail.setupEmail()
Hajar.Mail.sendEmail()
*/
var Hajar = {
  Database: require("./invoice"),
  Invoice: require("./invoice"),
  Mail: require("./email"),
  Payment: require("./payments"),
  Auth: require("./auth")
};

module.exports = Hajar;
