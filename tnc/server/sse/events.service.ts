import { Injectable } from '@nestjs/common';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable()
export class EventsService {
  sendEvents(): Observable<MessageEvent> {
    return interval(100).pipe( // Her 5 saniyede bir event gönder
      map(() => {
        const mesaj = new MessageEvent('message', { data: 'ada' });
        return mesaj;
      })
    );
  }
}