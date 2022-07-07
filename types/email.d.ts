import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
export interface HAJAR_MAIL_PARAMETERS {
    name: string;
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
}
export interface HAJAR_LIST_TRANSPORT_ARRAY {
    [key: string]: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
}
export declare function setupEmail(params: HAJAR_MAIL_PARAMETERS[]): HAJAR_LIST_TRANSPORT_ARRAY;
export declare function sendEmail(transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>, params: nodemailer.SendMailOptions): Promise<boolean>;
//# sourceMappingURL=email.d.ts.map