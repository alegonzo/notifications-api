import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { NotificationService } from './notification.service';

@Injectable()
export class TaskService implements OnModuleInit {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private configService: ConfigService,
    private notificationService: NotificationService,
  ) {}

  onModuleInit() {
    const job = new CronJob(
      `0 */${this.configService.get('BATCH_MAX_WAIT_HOURS')} * * *`,
      async () => {
        this.logger.log('Batch email cron job executed');
        await this.notificationService.processBatchNotificationsByGroup();
      },
    );
    this.schedulerRegistry.addCronJob('check-batch-notifications', job);
    job.start();
  }
}
