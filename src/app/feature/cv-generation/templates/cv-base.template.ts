import { CvTemplateData } from './cv-template-data.interface';
import { CvTemplateInterface } from './cv-template.interface';

interface CvTemplatePalette {
	leftPanelBg: string;
	rightPanelBg: string;
	pageBackground?: string;
	leftTitle: string;
	leftText: string;
	rightTitle: string;
	rightText: string;
	linkText: string;
	leftRoleOpacity: number;
}

export abstract class CvBaseTemplate implements CvTemplateInterface {
	protected abstract readonly palette: CvTemplatePalette;

	async getDocDefinition(payload: CvTemplateData): Promise<Record<string, unknown>> {
		const image = await this._roundProfileImage(payload.imageBase64);
		const plainEmail = this._asPlainEmail(payload.email);
		const displayName = payload.fullName.trim();
		const hardSkillsItems = payload.hardSkills.length ? payload.hardSkills : ['Not specified'];
		const softSkillsItems = payload.softSkills.length ? payload.softSkills : ['Not specified'];
		const hardSkillsLayout = this._buildSkillColumns(hardSkillsItems);
		const softSkillsLayout = this._buildSkillColumns(softSkillsItems);
		const hardSkillsSection = this._buildSkillSection('Hard skills', hardSkillsLayout.columns, hardSkillsLayout.gap);
		const softSkillsSection = this._buildSkillSection('Soft skills', softSkillsLayout.columns, softSkillsLayout.gap);

		const professionalActivityBlock = payload.professionalActivity
			? [
					{ text: 'Професійна діяльність', style: 'sectionTitle' },
					{ text: payload.professionalActivity, style: 'paragraph', margin: [0, 0, 0, 14] },
				]
			: [];

		return {
			pageSize: 'A4',
			pageMargins: [20, 20, 20, 20],
			background: this.palette.pageBackground
				? (currentPage: number, pageSize: { width: number; height: number }) => ({
					canvas: [{ type: 'rect', x: 0, y: 0, w: pageSize.width, h: pageSize.height, color: this.palette.pageBackground }],
				})
				: undefined,
			content: [
				{
					table: {
						widths: ['35%', '65%'],
						body: [
							[
								{
									fillColor: this.palette.leftPanelBg,
									stack: [
										{ image, width: 118, height: 118, alignment: 'center', margin: [0, 2, 0, 10] },
										{ text: displayName, style: 'leftName', margin: [0, 0, 0, 2] },
										{ text: payload.role, style: 'leftRole', margin: [0, 0, 0, 10] },
										hardSkillsSection,
										softSkillsSection,
									],
									border: [false, false, false, false],
								},
								{
									fillColor: this.palette.rightPanelBg,
									stack: [
										{ text: displayName, style: 'name' },
										{
											columns: [
												{ text: 'Вік:', style: 'metaLabel', width: 96 },
												{ text: payload.age, style: 'metaValue', width: '*' },
											],
											margin: [0, 0, 0, 2],
										},
										{
											columns: [
												{ text: 'Роль:', style: 'metaLabel', width: 96 },
												{ text: payload.role, style: 'metaValue', width: '*' },
											],
											margin: [0, 0, 0, 10],
										},
										{ text: 'Контактні дані', style: 'sectionTitle' },
										{
											columns: [
												{ text: 'Номер телефону:', style: 'metaLabel', width: 96 },
												{ text: payload.phone, style: 'metaValue', width: '*' },
											],
											margin: [0, 0, 0, 2],
										},
										{
											columns: [
												{ text: 'Електронна пошта:', style: 'metaLabel', width: 96 },
												{ text: plainEmail, style: 'metaValue', width: '*' },
											],
											margin: [0, 0, 0, 2],
										},
										{
											columns: [
												{ text: 'Посилання на GitHub:', style: 'metaLabel', width: 96 },
												{ text: payload.githubUrl, link: payload.githubUrl, style: 'linkValue', width: '*' },
											],
											margin: [0, 0, 0, 2],
										},
										{
											columns: [
												{ text: 'Посилання на LinkedIn:', style: 'metaLabel', width: 96 },
												{ text: payload.linkedinUrl, link: payload.linkedinUrl, style: 'linkValue', width: '*' },
											],
											margin: [0, 0, 0, 14],
										},
										{ text: 'Про себе', style: 'sectionTitle' },
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
					color: this.palette.leftTitle,
					alignment: 'center',
					lineHeight: 1.2,
				},
				leftRole: {
					fontSize: 10.6,
					color: this.palette.leftTitle,
					opacity: 1,
					alignment: 'center',
					lineHeight: 1.2,
				},
				name: {
					fontSize: 26,
					bold: true,
					color: this.palette.rightTitle,
					lineHeight: 1.2,
					margin: [0, 0, 0, 12],
				},
				sectionTitle: {
					fontSize: 13,
					bold: true,
					color: this.palette.rightTitle,
					lineHeight: 1.2,
					margin: [0, 0, 0, 8],
				},
				leftSectionTitle: {
					fontSize: 11,
					bold: true,
					color: this.palette.leftTitle,
					lineHeight: 1.2,
					margin: [0, 0, 0, 5],
				},
				leftItem: {
					fontSize: 10.3,
					color: this.palette.leftText,
					opacity: 0.9,
					lineHeight: 1.4,
				},
				metaLabel: {
					fontSize: 10,
					bold: true,
					color: this.palette.rightTitle,
				},
				metaValue: {
					fontSize: 10,
					color: this.palette.rightText,
					lineHeight: 1.35,
				},
				linkValue: {
					fontSize: 10,
					color: this.palette.linkText,
					decoration: 'underline',
				},
				paragraph: {
					fontSize: 10,
					color: this.palette.rightText,
					lineHeight: 1.45,
				},
			},
			defaultStyle: {
				fontSize: 10,
				color: this.palette.rightText,
				lineHeight: 1.35,
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
			margin: [0, 0, 0, 8],
			table: {
				widths: Array.from({ length: columnCount }, () => '*'),
				body: [firstRow, secondRow],
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

		const source = normalized.length ? normalized : ['Not specified'];
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
