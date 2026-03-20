import { provideHttpClient, withFetch } from '@angular/common/http';
import {
	APP_INITIALIZER,
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideTranslate, provideWacom } from 'wacom';
import { BootstrapService } from './feature/bootstrap/bootstrap.service';
import { routes } from './app.routes';
import { wacomConfig } from './wacom.config';

const initializeBootstrapData = (bootstrapService: BootstrapService) => () =>
	bootstrapService.initialize();

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
		provideHttpClient(withFetch()),
		provideClientHydration(withEventReplay()),
		providePrimeNG({
			theme: {
				preset: Aura,
				options: {
					darkModeSelector: "[data-mode='dark']",
				},
			},
		}),
		provideWacom(wacomConfig),
		provideTranslate(),
		{
			provide: APP_INITIALIZER,
			useFactory: initializeBootstrapData,
			deps: [BootstrapService],
			multi: true,
		},
	],
};
