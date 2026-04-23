import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { CvTemplateData } from '../../../feature/cv-generation/templates/cv-template-data.interface';
import { CV_THEME_TEMPLATE_REGISTRY, CvThemeId } from '../../../feature/cv-generation/templates/cv-theme.config';

export type CvPayload = CvTemplateData;

@Injectable({
	providedIn: 'root',
})
export class CvPdfService {
	private readonly _templates = CV_THEME_TEMPLATE_REGISTRY;

	constructor() {
		const fonts = pdfFonts as unknown as { pdfMake?: { vfs?: unknown }; vfs?: unknown };
		const vfs = fonts?.pdfMake?.vfs || fonts?.vfs;
		if (vfs) {
			(pdfMake as unknown as { vfs: unknown }).vfs = vfs;
		}
	}

	async generatePdfDataUrl(payload: CvPayload, themeId: CvThemeId = 'light'): Promise<string> {
		const definition = await this._getDocDefinition(payload, themeId);
		const pdfDoc = pdfMake.createPdf(definition as any) as any;

		if (typeof pdfDoc.getDataUrl === 'function' && pdfDoc.getDataUrl.length === 0) {
			const maybePromise = pdfDoc.getDataUrl();
			if (maybePromise && typeof maybePromise.then === 'function') {
				return (await maybePromise) as string;
			}
		}

		return await new Promise<string>((resolve) => {
			pdfDoc.getDataUrl((url: string) => resolve(url));
		});
	}

	async generatePdfBlob(payload: CvPayload, themeId: CvThemeId = 'light'): Promise<Blob> {
		const definition = await this._getDocDefinition(payload, themeId);
		const pdfDoc = pdfMake.createPdf(definition as any) as any;

		if (typeof pdfDoc.getBlob === 'function' && pdfDoc.getBlob.length === 0) {
			const maybePromise = pdfDoc.getBlob();
			if (maybePromise && typeof maybePromise.then === 'function') {
				return (await maybePromise) as Blob;
			}
		}

		return await new Promise<Blob>((resolve) => {
			pdfDoc.getBlob((result: Blob) => resolve(result));
		});
	}

	async download(payload: CvPayload, fileName: string, themeId: CvThemeId = 'light'): Promise<void> {
		const definition = await this._getDocDefinition(payload, themeId);
		(pdfMake.createPdf(definition as any) as any).download(fileName);
	}

	async toFile(payload: CvPayload, fileName: string, themeId: CvThemeId = 'light'): Promise<File> {
		const blob = await this.generatePdfBlob(payload, themeId);
		return new File([blob], fileName, { type: 'application/pdf' });
	}

	private async _getDocDefinition(payload: CvPayload, themeId: CvThemeId): Promise<Record<string, unknown>> {
		const template = this._templates.get(themeId) || this._templates.get('light');
		if (!template) {
			throw new Error('No CV templates are registered');
		}

		return await template.getDocDefinition(payload);
	}
}
