import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NotificationDto } from '../dto/notification.dto';
import { QueryNotificationDto } from '../dto/query-notification.dto';
import { NotificationService } from '../services/notification.service';

@ApiTags('notifications')
@UseGuards(AuthGuard('basic'))
@ApiBasicAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @ApiResponse({ type: [NotificationDto] })
  @Get()
  findAll(@Query() query: QueryNotificationDto): Promise<NotificationDto[]> {
    return this.notificationService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Put(':id/read')
  updateReadStatus(@Param('id') id: string) {
    return this.notificationService.updateReadStatus(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
