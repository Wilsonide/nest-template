/* eslint-disable prettier/prettier */
import { Address } from 'nodemailer/lib/mailer';

export class SendMailDto {
  sender?: Address;
  email: string;
  subject: string;
  html: string;
  text: string;
  token: string;
}