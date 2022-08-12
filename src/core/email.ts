/* tslint:disable:no-string-literal */
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface HAJAR_MAIL_PARAMETERS {
  name: string
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
}

export interface HAJAR_LIST_TRANSPORT_ARRAY {
  [key: string]: nodemailer.Transporter<SMTPTransport.SentMessageInfo>
}

export function setupEmail (params: HAJAR_MAIL_PARAMETERS[]): HAJAR_LIST_TRANSPORT_ARRAY {
  const listTransport: HAJAR_LIST_TRANSPORT_ARRAY = {};
  if (params.length > 0) {
    for (let i = 0; i < params.length; i++) {
      const config = params[i];
      const nameTransporter: string = config.name ?? "";
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: {
          user: config.user,
          pass: config.pass
        }
      });
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

export async function sendEmail (transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>, params: nodemailer.SendMailOptions): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    transport.sendMail(params, function (error: any, info: any) {
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