import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController, Domates } from './app.controller';
import { EventsController } from 'sse/events.controller';
import { EventsService } from 'sse/events.service';


@Module({
  imports: [],
  controllers: [AppController, EventsController, Domates],
  providers: [AppService, EventsService],
})
export class AppModule {}
