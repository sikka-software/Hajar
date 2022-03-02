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
    let mails = __config.HAJAR_MAIL_PARAMETERS.split(";");
    let counter = 0;
    for (var i = 0; i < mails.length; i++) {
      let config = mails[i].split(":");
      listTransport[counter] = nodemailer.createTransport({
        host: config[0], //replace with your email provider
        port: config[1],
        secure: config[2],
        auth: {
          user: config[3],
          pass: config[4],
        },
      });
      listTransport[counter].verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log(`Server ${counter} is ready to send mail`);
        }
      });
    }
  }
  return listTransport;
}

function sendEmail() {
  transporter.sendMail(message, (error, info) => {
    console.log(error);
    console.log(info);
  });
}

module.exports = {
  setupEmail,
  sendEmail
};
