const nodemailer = require("nodemailer");
/*
contain of file Hajar.config
{
    HAJAR_MAIL_PARAMETERS: "HOST:PORT:IS_SECURE:USERNAME:PASSWORD;HOST2:PORT2:IS_SECURE:USERNAME2:PASSWORD2"
}
*/
function setupEmail() {
  let listTransport = [];
  if (__config && __config.HAJAR_MAIL_PARAMETERS) {
    for (var i = 0; i < __config.HAJAR_MAIL_PARAMETERS.length; i++) {
      let config = __config.HAJAR_MAIL_PARAMETERS[i];
      listTransport[config.name] = nodemailer.createTransport({
        host: config.host, //replace with your email provider
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.username,
          pass: config.password,
        },
      });
      listTransport[config.name].verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Server ${config.name} is ready to send mail`);
        }
      });
    }
  }
  return listTransport;
}

function sendEmail(transport, message) {
  if(transport){
    transport.sendMail(message, (error, info) => {
      console.log(error);
      console.log(info);
    });
  }
}

module.exports = {
  setupEmail: setupEmail,
  sendEmail: sendEmail
};
