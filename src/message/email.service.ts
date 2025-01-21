import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private mailTransport: Transporter;

  constructor(private configService: ConfigService) {
    this.mailTransport = createTransport({
      service: 'gmail',
      host: this.configService.get('MAIL_HOST'),
      port: this.configService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('MAIL_USER'),
        pass: this.configService.get('MAIL_PASSWORD'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<{ success: boolean } | null> {
    const confirmLink = `${process.env.DOMAIN}/auth/verification?token=${token}`;
    const mailOptions: SendMailOptions = {
      from: {
        name: this.configService.get('MAIL_NAME_DEFAULT'),
        address: this.configService.get('MAIL_SENDER_DEFAULT'),
      },
      to: email,
      subject: 'Verification email',
      html: `<p>click <a href='${confirmLink}'>here</a> to confirm email</p>`,
    };

    try {
      await this.mailTransport.sendMail(mailOptions);
      return { success: true };
    } catch (err) {
      console.error('Error sending email:', err);
      return null;
    }
  }

  async sendnewpasswordmail(
    email: string,
    token: string,
  ): Promise<{ success: boolean } | null> {
    const resetLink = `${process.env.DOMAIN}/auth/new-password?token=${token}`;
    const mailOptions: SendMailOptions = {
      from: {
        name: this.configService.get('MAIL_NAME_DEFAULT'),
        address: this.configService.get('MAIL_SENDER_DEFAULT'),
      },
      to: email,
      subject: 'Reset Password email',
      html: `<p>click <a href='${resetLink}'>here</a> to reset your password</p>`,
    };

    try {
      await this.mailTransport.sendMail(mailOptions);
      return { success: true };
    } catch (err) {
      console.error('Error sending email:', err);
    }
  }
}
