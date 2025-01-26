import { Routes } from '@angular/router';
import { leavePageGuard } from '../shared/guards/leave-page.guard';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';
import { eventResolver } from './resolvers/event-resolver.resolver';

export const eventsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./events-page/events-page.component').then(
                (m) => m.EventsPageComponent
            ),
        title: 'Eventos | SVTickets',
    },
    {
        path: 'add', canDeactivate: [leavePageGuard],
        resolve: {
            event: eventResolver,
        },
        loadComponent: () =>
            import('./event-form/event-form.component').then(
                (m) => m.EventFormComponent
            ),
        title: 'add event | SVTickets',
    },
    {
        path: ':id', canDeactivate: [leavePageGuard], canActivate: [numericIdGuard],
        resolve: {
            event: eventResolver,
        },
        loadComponent: () =>
            import('./event-detail/event-detail.component').then(
                (m) => m.EventDetailComponent
            ),
    },
];
