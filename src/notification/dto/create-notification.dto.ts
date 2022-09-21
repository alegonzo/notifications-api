import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateIf,
} from 'class-validator';
import { EmailProvider } from '../enums/email-provider.enum';
import { EventType } from '../enums/event-type.enum';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationVia } from '../enums/notification-via.enum';

export class CreateNotificationDto {
  @ApiProperty({ enum: EventType })
  @IsEnum(EventType)
  @IsNotEmpty()
  event: EventType;

  @ApiProperty({ enum: NotificationVia })
  @IsEnum(NotificationVia)
  @IsNotEmpty()
  via: NotificationVia;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  type: NotificationType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @ValidateIf((o: CreateNotificationDto) => o.via === NotificationVia.SYSTEM)
  @IsNotEmpty()
  @IsString()
  uuid?: string;

  @ApiPropertyOptional()
  @ValidateIf((o: CreateNotificationDto) => o.via === NotificationVia.EMAIL)
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: EmailProvider })
  @ValidateIf((o: CreateNotificationDto) => o.via === NotificationVia.EMAIL)
  @IsEnum(EmailProvider)
  @IsNotEmpty()
  @IsString()
  emailProvider?: EmailProvider;
}
