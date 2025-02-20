import { Address } from 'nodemailer/lib/mailer';
export declare class SendMailDto {
    sender?: Address;
    email: string;
    subject: string;
    html: string;
    text: string;
    token: string;
}
