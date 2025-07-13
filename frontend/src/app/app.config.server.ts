import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// >>>>> MUDANÇA AQUI: Importe 'provideNgxMask' em vez de 'NgxMaskModule' <<<<<
import { provideNgxMask } from 'ngx-mask';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withComponentInputBinding(),
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch()
    ),
    importProvidersFrom(
      ReactiveFormsModule,
      FormsModule
    ),
    // >>>>> MUDANÇA AQUI: Chame 'provideNgxMask()' diretamente nos providers <<<<<
    provideNgxMask(), // Não é mais necessário dentro de importProvidersFrom para a configuração global
    // Opcional: Se estiver usando Service Worker (PWA)
    // provideServiceWorker('ngsw-worker.js', {
    //   enabled: !isDevMode(),
    //   registrationStrategy: 'registerWhenStable:30000'
    // })
  ]
};
