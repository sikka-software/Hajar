class HajarMail {
  constructor(options) {
    this.nodemailer = options.nodemailer;
  }

  async setupEmail(emailConfig) {
    // Create a transporter object using the emailConfig provided
    let transporter = this.nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: emailConfig.auth.user,
        pass: emailConfig.auth.pass,
      },
    });

    // Verify the transporter object is valid and can send emails
    await transporter.verify();

    return transporter;
  }
  async sendEmail({ emailConfig, resetPasswordEmailTemplate, ...emailData }) {
    try {
      // Use the emailConfig to setup the transporter
      let transporter = this.nodemailer.createTransport(emailConfig);

      // Use the emailConfig and resetPasswordEmailTemplate to send the email
      await transporter.sendMail({
        from: emailConfig.auth.user,
        to: emailData.to,
        subject: emailData.subject,
        html: resetPasswordEmailTemplate,
      });

      console.log("Email sent successfully");
    } catch (err) {
      console.error(err);
      throw err; // Rethrow the error for handling in your route handler
    }
  }

  /* 
export async function sendEmail(transport, params) {
  return await new Promise((resolve, reject) => {
    transport.sendMail(params, function (error, info) {
      if (error === null) {
        console.log("error=", error);
        resolve(false);
      } else {
        console.log(info);
        resolve(true);
      }
    });
  });
} */
  /* 
export async function sendEmailVerify(transport) {
  return await new Promise((resolve, reject) => {
    transport.sendMail(getVerifyEmail, function (error, info) {
      if (error === null) {
        console.log("error=", error);
        resolve(false);
      } else {
        console.log(info);
        resolve(true);
      }
    });
  });
}

export async function sendEmailInvoice(transport) {
  return await new Promise((resolve, reject) => {
    transport.sendMail(getEmailInvoiceTemplate, function (error, info) {
      if (error === null) {
        console.log("error=", error);
        resolve(false);
      } else {
        console.log(info);
        resolve(true);
      }
    });
  });
}

export async function sendEmailReset(transport) {
  return await new Promise((resolve, reject) => {
    transport.sendMail(getResetEmail, function (error, info) {
      if (error === null) {
        console.log("error=", error);
        resolve(false);
      } else {
        console.log(info);
        resolve(true);
      }
    });
  });
} */
}
module.exports = HajarMail;
