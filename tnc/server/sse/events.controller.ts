import { Controller, Get, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Sse('sse')
  sse(): Observable<MessageEvent> {
	return this.eventsService.sendEvents();
  }
}