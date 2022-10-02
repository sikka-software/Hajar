import nodemailer from "nodemailer";
import getVerifyEmail from "../templates/VerifyEmail";
import getEmailInvoiceTemplate from "../templates/invoice";
import getResetEmail from "../templates/ResetPassword";

export function setupEmail(params) {
  const listTransport = {};
  if (params.length > 0) {
    for (let i = 0; i < params.length; i++) {
      const config = params[i];
      const nameTransporter = config.name;
      let mailConfig = {
        host: config.host,
        port: config.port,
        auth: {
          user: config.user,
          pass: config.pass
        }
      };
      if (config.port === 587) {
        mailConfig["tls"] = {
          // do not fail on invalid certs
          rejectUnauthorized: false
        };
        mailConfig["secure"] = false;
      }
      if (config.port === 465) {
        mailConfig["secure"] = true;
      }
      let transporter = nodemailer.createTransport(mailConfig);
      listTransport[nameTransporter] = transporter;
      (listTransport[nameTransporter]).verify(function (error, success) {
        if (error != null) {
          console.log(error);
        } else {
          console.log(`Server ${nameTransporter} is ready to send mail`);
        }
      })
    }
  }
  return listTransport
}

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
}

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
}