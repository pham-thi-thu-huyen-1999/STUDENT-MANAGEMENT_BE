import { Controller, Get } from '@nestjs/common';

@Controller('api')
class AppController {
  @Get()
  root(): string {
    return '{"message":"hello"}';
  }
}

export { AppController };
