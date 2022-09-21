import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from '../services/notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventType } from '../enums/event-type.enum';
import { NotificationVia } from '../enums/notification-via.enum';
import { NotificationType } from '../enums/notification-type.enum';

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

const mockedNotificationService = {
  findAll: jest.fn((uuid: string) => notifications),
  create: jest.fn((dto: CreateNotificationDto) => notification),
};

describe('NotificationController', () => {
  let notificationController: NotificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockedNotificationService,
        },
      ],
    }).compile();
    // get the service from the testing module.
    notificationController = module.get(NotificationController);
  });

  it('should return Notifications List', async () => {
    const spyFindAll = jest.spyOn(notificationController, 'findAll');

    await expect(
      notificationController.findAll({ userUuid: '123', skip: 0, take: 1 }),
    ).toBe(notifications);
    expect(spyFindAll).toBeCalledWith({ userUuid: '123', skip: 0, take: 1 });
  });

  it('should return created Notification', () => {
    //expect(notificationController.create(notificationDto)).toBeCalled();
    expect(notificationController.create(notificationDto)).toBe(notification);
  });
});
