import nodemailer from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

interface HajarMailParameters {
  HAJAR_MAIL_PARAMETERS: SMTPTransport.Options[]
}

export function setup (params: HajarMailParameters): Array<nodemailer.Transporter<SMTPTransport.SentMessageInfo>> {
  const listTransport: any = {}

  if (params.HAJAR_MAIL_PARAMETERS.length > 0) {
    for (let i = 0; i < params.HAJAR_MAIL_PARAMETERS.length; i++) {
      const config = params.HAJAR_MAIL_PARAMETERS[i]
      const nameTransporter: string = config.name ?? ''
      const transporter = nodemailer.createTransport(config)
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

export function send (transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>, message: any): void {
  if (transport.transporter.name.length !== 0) {
    transport.sendMail(message, (error: any, info: any) => {
      console.log(error)
      console.log(info)
    })
  }
}
