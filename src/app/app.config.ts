import { provideHttpClient, withFetch } from '@angular/common/http';
import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { provideTranslate, provideWacom } from 'wacom';
import { routes } from './app.routes';
import { wacomConfig } from './wacom.config';

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
	],
};
