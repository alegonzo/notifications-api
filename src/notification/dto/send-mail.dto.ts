import { EmailProvider } from '../enums/email-provider.enum';

export class SendMailDto {
  to: string;
  content: string;
  provider: EmailProvider;
  notificationId: number;
}
