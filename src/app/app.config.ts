import { ApplicationConfig, provideZoneChangeDetection, Sanitizer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { ConfigAura } from './shared/config/primeng-config';
import { API_BASE_URL } from './shared/services/http.services';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: ConfigAura
      }
    }),
    {
      provide: Sanitizer,
      useClass: NgDompurifySanitizer,
    },
    { provide: API_BASE_URL, useValue: "https://testcibrwebapi.azurewebsites.net", multi: true }, //test
    provideHttpClient(
      withInterceptorsFromDi()
    ),
  ]
};
