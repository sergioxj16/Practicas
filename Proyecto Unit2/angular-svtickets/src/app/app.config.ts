import {
  ApplicationConfig,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './shared/interceptors/base-url.interceptor';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { provideGoogleId } from './auth/google-login/google-login.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideGoogleId('746820501392-oalflicqch2kuc12s8rclb5rf7b1fist.apps.googleusercontent.com'),
  ],
};
