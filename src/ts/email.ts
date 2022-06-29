import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export interface HajarMailParameters {
  HAJAR_MAIL_PARAMETERS: { name: string, host: string, port: number, secure: boolean, user: string, pass: string }[]
}

export function setup(params: HajarMailParameters): nodemailer.Transporter<SMTPTransport.SentMessageInfo>[] {
  let listTransport: any = {};
  if (params.HAJAR_MAIL_PARAMETERS.length > 0) {
    for (let i = 0; i < params.HAJAR_MAIL_PARAMETERS.length; i++) {
      const config = params.HAJAR_MAIL_PARAMETERS[i];
      const nameTransporter: any = config.name ?? '';
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
      (listTransport[nameTransporter] as nodemailer.Transporter<SMTPTransport.SentMessageInfo>).verify(function (error, success) {
        if (error != null) {
          console.log(error)
        } else {
          console.log(`Server ${nameTransporter} is ready to send mail`)
        }
      })
    }
  }
  return listTransport
}

export function send(transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>, params: nodemailer.SendMailOptions): void {
  transport.sendMail(params, function (error: any, info: any) {
    console.log(error);
    console.log(info);
  })
}
