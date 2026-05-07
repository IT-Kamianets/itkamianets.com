import { DarkCvTemplate } from './dark-cv.template';
import { LightCvTemplate } from './light-cv.template';
import { CvTemplateInterface } from './cv-template.interface';

export type CvThemeId = 'light' | 'dark';

export interface CvThemeOption {
	value: CvThemeId;
	label: string;
}

export const CV_THEME_OPTIONS: ReadonlyArray<CvThemeOption> = [
	{ value: 'light', label: 'Світла (Light)' },
	{ value: 'dark', label: 'Темна (Dark)' },
];

export const CV_THEME_TEMPLATE_REGISTRY: ReadonlyMap<CvThemeId, CvTemplateInterface> = new Map<CvThemeId, CvTemplateInterface>([
	['light', new LightCvTemplate()],
	['dark', new DarkCvTemplate()],
]);
