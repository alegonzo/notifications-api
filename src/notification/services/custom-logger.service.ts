import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';
import { LogService } from './log.service';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends ConsoleLogger {
  constructor(private logService: LogService) {
    super();
  }

  async dbLog(
    message: string,
    identifier: string,
    error: boolean,
    notificationId: number,
  ) {
    if (error) this.error(message);
    else this.log(message);
    await this.logService.create(message, error, identifier, notificationId);
  }
}
