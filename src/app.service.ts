import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  /**
   * 
   * @returns 
   */
  getHello(): string {
    return 'Hello World!';
  }
}
