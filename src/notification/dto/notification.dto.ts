import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';
import { SystemMetadata } from '../entities/system-metadata.entity';
import { EventType } from '../enums/event-type.enum';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationVia } from '../enums/notification-via.enum';

export class NotificationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  event: EventType;

  @ApiProperty()
  type: NotificationType;

  @ApiProperty()
  via: NotificationVia;

  @ApiProperty()
  metadata: SystemMetadata;

  @ApiProperty()
  read: boolean;

  @ApiProperty()
  createdAt: Date;

  constructor(notification: Notification) {
    this.id = notification.id;
    this.event = notification.event;
    this.via = notification.via;
    this.type = notification.type;
    this.read = notification.read;
    this.createdAt = notification.createdAt;
    this.metadata = notification.metadata as SystemMetadata;
  }
}
