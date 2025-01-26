import { Routes } from '@angular/router';
import { profileResolver } from './resolvers/profile.resolver';
import { numericIdGuard } from '../shared/guards/numeric-id.guard';

export const profileRoutes: Routes = [
    {
        path: '',
        resolve: {
            user: profileResolver,
        },
        loadComponent: () =>
            import('./profile-page/profile-page.component').then(
                (m) => m.ProfilePageComponent
            ),
        title: 'Profile | SVTickets',
    },
    {
        path: ':id',
        canActivate: [numericIdGuard],
        resolve: {
            user: profileResolver,
        },
        loadComponent: () =>
            import('./profile-page/profile-page.component').then(
                (m) => m.ProfilePageComponent
            ),
        title: 'Profile | SVTickets',
    },
];