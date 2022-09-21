import { IsNotEmpty } from 'class-validator';

export class QueryNotificationDto {
  @IsNotEmpty()
  userUuid: string;

  skip?: number;

  take?: number;
}
