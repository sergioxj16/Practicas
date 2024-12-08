import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.authRoutes),
        title: 'Bienvenido | SvTikets',
    },
    {
        path: 'events',
        loadChildren: () =>
            import('./events/event.routes').then((m) => m.eventRoutes),
    },
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: '/events',
    },
];