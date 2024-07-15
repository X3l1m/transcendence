import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('data')
  getData(): string {
    return this.appService.getData();
  }
}

@Controller('domates')
export class Domates {

  @Get()
  getDomates(): string {
    return "domates aldim"
  }
}