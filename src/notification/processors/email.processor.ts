import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { SendMailDto } from '../dto/send-mail.dto';
import { CustomLogger } from '../services/custom-logger.service';
import { MailService } from '../services/mail.service';

@Processor('emails')
export class EmailProcessor {
  constructor(
    private mailService: MailService,
    private customLogger: CustomLogger,
  ) {
    this.customLogger.setContext('EmailProcessor');
  }

  @Process('send-email')
  async sendEmail(job: Job<SendMailDto>) {
    const { to, content, provider, notificationId } = job.data;
    try {
      await this.mailService.sendEmail(to, content, provider);
      await this.customLogger.dbLog(
        `Email enviado correctamente`,
        to,
        false,
        notificationId,
      );
    } catch (e) {
      await this.customLogger.dbLog(e.message, to, true, notificationId);
    }
  }
}
