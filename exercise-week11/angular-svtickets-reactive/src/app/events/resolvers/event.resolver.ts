import { inject } from '@angular/core';
import { MyEvent } from '../../shared/interfaces/my-event';
import { ResolveFn, Router } from '@angular/router';
import { EventsService } from '../services/events.service';
import { catchError, EMPTY } from 'rxjs';

export const eventResolverResolver: ResolveFn<MyEvent> = (route) => {
  const eventServie = inject(EventsService);
  const router = inject(Router);
  return eventServie.getEvent(+route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/events']);
      return EMPTY;
    })
  );
};