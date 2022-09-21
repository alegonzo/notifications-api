import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationDto } from '../dto/notification.dto';
import { EmailMetadata } from '../entities/email-metadata.entity';
import { Notification } from '../entities/notification.entity';
import { SystemMetadata } from '../entities/system-metadata.entity';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationVia } from '../enums/notification-via.enum';
import { CustomLogger } from './custom-logger.service';
import { forIn, groupBy } from 'lodash';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { QueryNotificationDto } from '../dto/query-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private customLogger: CustomLogger,
    @InjectQueue('emails')
    private emailQueue: Queue,
    private configService: ConfigService,
  ) {
    this.customLogger.setContext('NotificationService');
  }

  async create(data: CreateNotificationDto) {
    const notification = new Notification();
    notification.event = data.event;
    notification.type = data.type;
    notification.via = data.via;

    if (notification.via === NotificationVia.SYSTEM)
      notification.type = NotificationType.INSTANT;

    if (notification.via === NotificationVia.EMAIL) {
      const metadata = new EmailMetadata();
      metadata.content = data.content;
      metadata.email = data.email;
      metadata.provider = data.emailProvider;
      notification.metadata = metadata;
    } else if (notification.via === NotificationVia.SYSTEM) {
      const metadata = new SystemMetadata();
      metadata.content = data.content;
      metadata.uuid = data.uuid;
      notification.metadata = metadata;
    }

    const result = await this.notificationRepository.save(notification);

    if (notification.type === NotificationType.BATCH) {
      await this.processBatchNotificationByUser(data.email);
    }

    if (
      notification.via === NotificationVia.EMAIL &&
      notification.type === NotificationType.INSTANT
    ) {
      this.emailQueue.add('send-email', {
        to: data.email,
        content: `<p>${data.content}</p>`,
        provider: data.emailProvider,
        notificationId: result.id,
      });
    }
    return result;
  }

  async findAll(query: QueryNotificationDto): Promise<NotificationDto[]> {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.metadata', 'metadata')
      .where('notification.type = :type', { type: NotificationType.INSTANT })
      .andWhere('metadata.uuid = :uuid', { uuid: query.userUuid })
      .orderBy('notification.id', 'DESC')
      .skip(query.skip ?? 0)
      .take(query.take ?? 10)
      .getMany();

    return notifications.map((item) => new NotificationDto(item));
  }

  findOne(id: number) {
    return this.notificationRepository.findOne({ where: { id } });
  }

  async updateReadStatus(id: number) {
    const notification = await this.findOne(id);
    notification.read = !notification.read;
    return this.notificationRepository.save(notification);
  }

  remove(id: number) {
    return this.notificationRepository.delete({ id });
  }

  multiUpdateSetReadStatus(ids: number[]) {
    return this.notificationRepository.update(
      {
        id: In(ids),
      },
      {
        read: true,
      },
    );
  }

  findBatchUnreadNotifications() {
    return this.notificationRepository.find({
      where: {
        read: false,
        type: NotificationType.BATCH,
      },
      relations: ['metadata'],
    });
  }

  async processBatchNotificationsByGroup() {
    const notifications = await this.findBatchUnreadNotifications();
    const groupedByUsers = groupBy(notifications, (item) => {
      const metadata = item?.metadata as EmailMetadata;
      return metadata.email;
    });
    forIn(groupedByUsers, (notifications, email) => {
      const groupedByEvents = groupBy(notifications, 'event');
      forIn(groupedByEvents, (_notifications) => {
        this.prepareBatchEmail(_notifications, email);
      });
    });
  }

  async processBatchNotificationByUser(email: string): Promise<void> {
    const maxAmountOfNotifications = +this.configService.get(
      'BATCH_MAX_NOTIFICATION_AMOUNT',
    );
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.metadata', 'metadata')
      .where('notification.read = :read', { read: false })
      .andWhere('notification.type = :type', { type: NotificationType.BATCH })
      .andWhere('metadata.email = :email', { email })
      .getMany();
    const groupedByEvent = groupBy(notifications, 'event');
    forIn(groupedByEvent, (notifications) => {
      if (notifications.length >= maxAmountOfNotifications) {
        this.prepareBatchEmail(notifications, email);
      }
    });
  }

  private async prepareBatchEmail(
    notifications: Notification[],
    to: string,
  ): Promise<void> {
    this.emailQueue.add('send-email', {
      to: to,
      content: notifications.reduce(
        (prev, curr) => `${prev} <p>${curr.metadata.content}</p>`,
        '',
      ),
      provider: this.configService.get('DEFAULT_EMAIL_PROVIDER'),
    });
    await this.multiUpdateSetReadStatus(notifications.map((item) => item.id));
  }
}
