import { Routes } from "@angular/router";
import { logoutActivateGuard } from "./shared/guards/logout-activate-guard.guard";
import { loginActivateGuard } from "./shared/guards/login-activate-guard.guard";


export const routes: Routes = [
    { path: "", redirectTo: "/auth/login", pathMatch: "full" },

    {
        path: "auth", canActivate: [logoutActivateGuard],
        loadChildren: () => import("./auth/auth.routes").then(r => r.authRoutes)
    },
    {
        path: "events", canActivate: [loginActivateGuard],
        loadChildren: () => import("./events/events.routes").then(r => r.eventsRoutes)
    },

    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/auth/login' },
];
