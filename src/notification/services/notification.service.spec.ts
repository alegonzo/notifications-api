import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { EventType } from '../enums/event-type.enum';
import { NotificationType } from '../enums/notification-type.enum';
import { NotificationVia } from '../enums/notification-via.enum';
import { NotificationService } from './notification.service';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from './custom-logger.service';
import { ConsoleLogger } from '@nestjs/common';

const notifications = [
  {
    id: 54,
    event: 'EVENT_2',
    via: 'SYSTEM',
    type: 'INSTANT',
    read: false,
    createdAt: '2022-09-20T19:20:07.877Z',
    metadata: {
      id: 54,
      content: 'Contenido de la notif',
      uuid: 'id123123',
    },
  },
];

const notificationDto = {
  event: EventType.EVENT_2,
  via: NotificationVia.SYSTEM,
  type: NotificationType.INSTANT,
  content: 'Contenido de la notif',
  uuid: 'id123123',
};
const notification = {
  id: 54,
  event: 'EVENT_2',
  via: 'SYSTEM',
  type: 'INSTANT',
  read: false,
  createdAt: '2022-09-20T19:20:07.877Z',
  metadata: {
    id: 54,
    content: 'Contenido de la notif',
    uuid: 'id123123',
  },
};

class CustomLoggerMock extends ConsoleLogger {
  dbLog() {
    console.log('event logged');
  }
}

describe('NotificationService', () => {
  let service: NotificationService;
  const repositoryMock = {
    save: jest.fn((dto: Notification) => notification),
    findAll: jest.fn((uuid: string) => notifications),
  };
  const queueMock = {
    add: jest.fn(() => console.log('added to queue')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        ConfigService,
        {
          provide: CustomLogger,
          useClass: CustomLoggerMock,
        },
        {
          provide: 'BullQueue_emails',
          useValue: queueMock,
        },
        {
          provide: getRepositoryToken(Notification),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create Notification', async () => {
    await expect(service.create(notificationDto)).resolves.toHaveProperty('id');
  });
});
