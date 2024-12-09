import { Routes } from '@angular/router';
import { leavePageGuard } from '../shared/guards/leave-page.guard';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';
import { eventResolverResolver } from './resolvers/event.resolver';

export const eventRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./events-page/events-page.component').then(
                (m) => m.EventsPageComponent
            ),
        title: 'Events | Angular Events',
    },
    {
        path: 'add',
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
            import('./event-form/event-form.component').then(
                (m) => m.EventFormComponent
            ),
        title: 'Add Event | Angular Events',
    },
    {
        path: ':id',
        canActivate: [numericIdGuard],
        resolve: {
            event: eventResolverResolver,
        },
        loadComponent: () =>
            import('./event-detail/event-detail.component').then(
                (m) => m.EventDetailComponent
            ),
    },
    {
        path: '**',
        redirectTo: '',
    },
];