import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns a greeting message.
   * @returns A greeting message.
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
