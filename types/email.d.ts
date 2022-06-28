import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
interface HajarMailParameters {
    HAJAR_MAIL_PARAMETERS: SMTPTransport.Options[];
}
export declare function setup(params: HajarMailParameters): Array<nodemailer.Transporter<SMTPTransport.SentMessageInfo>>;
export declare function send(transport: nodemailer.Transporter<SMTPTransport.SentMessageInfo>, message: any): void;
export {};
//# sourceMappingURL=email.d.ts.map