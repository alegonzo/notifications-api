import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { NotificationController } from './controllers/notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { SystemMetadata } from './entities/system-metadata.entity';
import { EmailMetadata } from './entities/email-metadata.entity';
import { Metadata } from './entities/metadata.entity';
import { MailService } from './services/mail.service';
import { CustomLogger } from './services/custom-logger.service';
import { LogService } from './services/log.service';
import { Log } from './entities/log.entity';
import { AuthModule } from 'src/auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { EmailProcessor } from './processors/email.processor';
import { TaskService } from './services/task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification,
      Metadata,
      SystemMetadata,
      EmailMetadata,
      Log,
    ]),
    BullModule.registerQueue({
      name: 'emails',
    }),
    AuthModule,
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    MailService,
    CustomLogger,
    LogService,
    EmailProcessor,
    TaskService,
  ],
})
export class NotificationModule {}
