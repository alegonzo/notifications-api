import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from '../entities/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private logRepository: Repository<Log>,
  ) {}

  async create(
    message: string,
    error: boolean,
    identifier: string,
    notificationId: number,
  ) {
    const log = new Log();
    log.identifier = identifier;
    log.message = message;
    log.error = error;
    log.notificationId = notificationId;
    return this.logRepository.save(log);
  }
}
