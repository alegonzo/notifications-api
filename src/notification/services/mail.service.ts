import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as mg from 'nodemailer-mailgun-transport';
import * as sendgridTransport from 'nodemailer-sendgrid-transport';
import { EmailProvider } from '../enums/email-provider.enum';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  buildEmailTransport(provider: EmailProvider) {
    switch (provider) {
      case EmailProvider.GMAIL:
        return nodemailer.createTransport('SMTP', {
          service: 'Gmail',
          auth: {
            user: this.configService.get<string>('GMAIL_USER'),
            pass: this.configService.get<string>('GMAIL_PASS'),
          },
        });

      case EmailProvider.MAILGUN:
        return nodemailer.createTransport(
          mg({
            auth: {
              api_key: this.configService.get<string>('MAILGUN_API_KEY'),
              domain: this.configService.get<string>('MAINGUN_DOMAIN'),
            },
          }),
        );
      case EmailProvider.SEND_GRID:
        return nodemailer.createTransport(
          sendgridTransport({
            auth: {
              api_key: this.configService.get<string>('SENDGRID_API_KEY'),
            },
          }),
        );
      default:
        throw new Error('Email provider not provided');
    }
  }

  async sendEmail(to: string, content: string, provider: EmailProvider) {
    return this.buildEmailTransport(provider).sendMail({
      to,
      subject: 'Notification',
      html: content,
    });
  }
}
