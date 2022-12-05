import { Controller, Get } from '@nestjs/common';

@Controller()
export class HelloController {
  @Get()
  responseHello() {
    return 'Hello';
  }
}
