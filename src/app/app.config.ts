import { provideHttpClient, withFetch } from '@angular/common/http';
import {
	ApplicationConfig,
	provideBrowserGlobalErrorListeners,
	provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideTranslate } from 'wacom';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideBrowserGlobalErrorListeners(),
		provideZonelessChangeDetection(),
		provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
		provideHttpClient(withFetch()),
		provideClientHydration(withEventReplay()),
		provideTranslate(),
	],
};
