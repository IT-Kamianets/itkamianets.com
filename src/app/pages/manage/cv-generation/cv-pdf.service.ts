import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export interface CvPayload {
	fullName: string;
	age: string;
	role: string;
	phone: string;
	email: string;
	githubUrl: string;
	linkedinUrl: string;
	about: string;
	professionalActivity: string | null;
	hardSkills: string[];
	softSkills: string[];
	imageBase64: string;
}

@Injectable({
	providedIn: 'root',
})
export class CvPdfService {
	constructor() {
		const fonts = pdfFonts as unknown as { pdfMake?: { vfs?: unknown }; vfs?: unknown };
		const vfs = fonts?.pdfMake?.vfs || fonts?.vfs;
		if (vfs) {
			(pdfMake as unknown as { vfs: unknown }).vfs = vfs;
		}
	}

	async generatePdfDataUrl(payload: CvPayload): Promise<string> {
		const definition = await this._buildDocDefinition(payload);
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

	async generatePdfBlob(payload: CvPayload): Promise<Blob> {
		const definition = await this._buildDocDefinition(payload);
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

	async download(payload: CvPayload, fileName: string): Promise<void> {
		const definition = await this._buildDocDefinition(payload);
		(pdfMake.createPdf(definition as any) as any).download(fileName);
	}

	async toFile(payload: CvPayload, fileName: string): Promise<File> {
		const blob = await this.generatePdfBlob(payload);
		return new File([blob], fileName, { type: 'application/pdf' });
	}

	private async _buildDocDefinition(payload: CvPayload): Promise<Record<string, unknown>> {
		const image = await this._roundProfileImage(payload.imageBase64);
		const plainEmail = this._asPlainEmail(payload.email);
		const hardSkillsItems = payload.hardSkills.length ? payload.hardSkills : ['Не вказано'];
		const softSkillsItems = payload.softSkills.length ? payload.softSkills : ['Не вказано'];
		const hardSkillsLayout = this._buildSkillColumns(hardSkillsItems);
		const softSkillsLayout = this._buildSkillColumns(softSkillsItems);
		const hardSkillsSection = this._buildSkillSection('HARD SKILLS', hardSkillsLayout.columns, hardSkillsLayout.gap);
		const softSkillsSection = this._buildSkillSection('SOFT SKILLS', softSkillsLayout.columns, softSkillsLayout.gap);

		const professionalActivityBlock = payload.professionalActivity
			? [
					{ text: 'ПРОФЕСІЙНА ДІЯЛЬНІСТЬ', style: 'sectionTitle', margin: [0, 0, 0, 8] },
					{ text: payload.professionalActivity, style: 'paragraph', margin: [0, 0, 0, 14] },
				]
			: [];

		return {
			pageSize: 'A4',
			pageMargins: [20, 20, 20, 20],
			content: [
				{
					table: {
						widths: ['35%', '65%'],
						body: [
							[
								{
									fillColor: '#2C3E50',
									stack: [
										{ image, width: 118, height: 118, alignment: 'center', margin: [0, 2, 0, 14] },
										{ text: payload.fullName, style: 'leftName', margin: [0, 0, 0, 4] },
										{ text: payload.role, style: 'leftRole', margin: [0, 0, 0, 16] },
										hardSkillsSection,
										softSkillsSection,
									],
									border: [false, false, false, false],
								},
								{
									fillColor: '#FFFFFF',
									stack: [
										{ text: payload.fullName, style: 'name' },
										{
											columns: [
												{ text: 'Вік:', style: 'metaLabel', width: 90 },
												{ text: payload.age, style: 'metaValue', width: '*' },
											],
											margin: [0, 0, 0, 2],
										},
										{
											columns: [
												{ text: 'Роль:', style: 'metaLabel', width: 90 },
												{ text: payload.role, style: 'metaValue', width: '*' },
											],
											margin: [0, 0, 0, 10],
										},
										{ text: 'КОНТАКТНІ ДАНІ', style: 'sectionTitle' },
										{
											columns: [
												{ text: 'Телефон:', style: 'metaLabel', width: 90 },
												{ text: payload.phone, style: 'metaValue', width: '*' },
											],
											margin: [0, 0, 0, 2],
										},
										{
											columns: [
												{ text: 'Пошта:', style: 'metaLabel', width: 90 },
												{ text: plainEmail, style: 'metaValue', width: '*' },
											],
											margin: [0, 0, 0, 2],
										},
										{
											columns: [
												{ text: 'GitHub:', style: 'metaLabel', width: 90 },
												{ text: payload.githubUrl, link: payload.githubUrl, style: 'linkValue', width: '*' },
											],
											margin: [0, 0, 0, 2],
										},
										{
											columns: [
												{ text: 'LinkedIn:', style: 'metaLabel', width: 90 },
												{ text: payload.linkedinUrl, link: payload.linkedinUrl, style: 'linkValue', width: '*' },
											],
											margin: [0, 0, 0, 14],
										},
										{ text: 'ПРО СЕБЕ', style: 'sectionTitle' },
										{ text: payload.about, style: 'paragraph', margin: [0, 0, 0, 14] },
										...professionalActivityBlock,
									],
									border: [false, false, false, false],
								},
							],
						],
					},
					layout: {
						hLineWidth: () => 0,
						vLineWidth: () => 0,
						paddingLeft: () => 18,
						paddingRight: () => 18,
						paddingTop: () => 20,
						paddingBottom: () => 20,
					},
				},
			],
			styles: {
				leftName: {
					fontSize: 18,
					bold: true,
					color: 'white',
					alignment: 'center',
					margin: [0, 0, 0, 4],
				},
				leftRole: {
					fontSize: 10.6,
					color: 'white',
					opacity: 0.9,
					alignment: 'center',
				},
				name: {
					fontSize: 26,
					bold: true,
					color: '#333333',
					margin: [0, 0, 0, 12],
				},
				sectionTitle: {
					fontSize: 13,
					bold: true,
					color: '#333333',
					margin: [0, 0, 0, 8],
				},
				leftSectionTitle: {
					fontSize: 11,
					bold: true,
					color: 'white',
					margin: [0, 0, 0, 8],
				},
				leftItem: {
					fontSize: 10.3,
					color: 'white',
					opacity: 0.9,
					lineHeight: 1.4,
				},
				metaLabel: {
					fontSize: 10,
					bold: true,
					color: '#333333',
				},
				metaValue: {
					fontSize: 10,
					color: '#333333',
					lineHeight: 1.35,
				},
				linkValue: {
					fontSize: 10,
					color: '#2563eb',
					decoration: 'underline',
				},
				paragraph: {
					fontSize: 10,
					color: '#333333',
					lineHeight: 1.45,
				},
			},
			defaultStyle: {
				fontSize: 10,
				color: '#333333',
			},
		};
	}

	private _buildSkillSection(text: string, columns: Array<Record<string, unknown>>, gap: number): Record<string, unknown> {
		const columnCount = Math.max(1, columns.length);
		const firstRow = [
			{ text, style: 'leftSectionTitle', alignment: 'left', colSpan: columnCount },
			...Array.from({ length: columnCount - 1 }, () => ({ text: '' })),
		];

		const secondRow = columns.map((column) => ({
			...column,
			margin: [0, 0, 0, 0],
		}));

		return {
			margin: [0, 0, 0, 12],
			table: {
				widths: Array.from({ length: columnCount }, () => '*'),
				body: [
					firstRow,
					secondRow,
				],
			},
			layout: {
				hLineWidth: () => 0,
				vLineWidth: () => 0,
				paddingLeft: () => 0,
				paddingRight: (columnIndex: number, node: { table?: { widths?: unknown[] } }) => {
					const total = node?.table?.widths?.length ?? 0;
					return columnIndex < total - 1 ? gap : 0;
				},
				paddingTop: () => 0,
				paddingBottom: () => 2,
			},
		};
	}

	private _buildSkillColumns(skills: string[]): { columns: Array<Record<string, unknown>>; gap: number } {
		const normalized = skills
			.map((skill) => this._normalizeSkillText(skill))
			.filter(Boolean)
			.slice(0, 20);

		const source = normalized.length ? normalized : ['Не вказано'];
		const chunks: string[][] = [];

		if (source.length <= 10) {
			chunks.push(source);
		} else {
			chunks.push(source.slice(0, 10));
			chunks.push(source.slice(10, 20));
		}

		return {
			columns: chunks.map((chunk) => ({
				ul: chunk.map((skill) => ({ text: skill, style: 'leftItem' })),
			})),
			gap: 10,
		};
	}

	private _normalizeSkillText(value: string): string {
		const trimmed = value.trim();
		if (!trimmed) {
			return '';
		}

		return trimmed.replace(/\S+/g, (token) => token.replace(/(.{12})(?=.)/g, '$1\u200b'));
	}

	private _asPlainEmail(email: string): string {
		return email.trim().replace('@', '@\u200b');
	}

	private _roundProfileImage(dataUrl: string): Promise<string> {
		return new Promise((resolve) => {
			if (!dataUrl?.startsWith('data:image/')) {
				resolve(dataUrl || '');
				return;
			}

			const img = new Image();
			img.onload = () => {
				const size = 220;
				const canvas = document.createElement('canvas');
				canvas.width = size;
				canvas.height = size;
				const ctx = canvas.getContext('2d');
				if (!ctx) {
					resolve(dataUrl);
					return;
				}

				ctx.clearRect(0, 0, size, size);
				ctx.save();
				ctx.beginPath();
				ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
				ctx.closePath();
				ctx.clip();

				const ratio = Math.max(size / img.width, size / img.height);
				const w = img.width * ratio;
				const h = img.height * ratio;
				const x = (size - w) / 2;
				const y = (size - h) / 2;
				ctx.drawImage(img, x, y, w, h);
				ctx.restore();

				resolve(canvas.toDataURL('image/png', 0.92));
			};
			img.onerror = () => resolve(dataUrl);
			img.src = dataUrl;
		});
	}
}
