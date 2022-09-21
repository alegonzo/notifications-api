import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventType } from '../enums/event-type.enum';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationVia } from '../enums/notification-via.enum';
import { Metadata } from './metadata.entity';

@Entity()
export class Notification {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @Column()
  event: EventType;

  @ApiProperty()
  @Column()
  type: NotificationType;

  @ApiProperty()
  @Column()
  via: NotificationVia;

  @ApiProperty()
  @Column({ default: false })
  read: boolean;

  @ApiProperty()
  @OneToOne(() => Metadata, { cascade: true })
  @JoinColumn()
  metadata: Metadata;
}
