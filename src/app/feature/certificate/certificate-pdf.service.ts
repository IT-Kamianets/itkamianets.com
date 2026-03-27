import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Certificate } from './certificate.interface';

@Injectable({
	providedIn: 'root',
})
export class CertificatePdfService {
	constructor() {
		const fonts = pdfFonts as unknown as { pdfMake?: { vfs?: unknown }; vfs?: unknown };
		const vfs = fonts?.pdfMake?.vfs || fonts?.vfs;
		if (vfs) {
			(pdfMake as unknown as { vfs: unknown }).vfs = vfs;
		}
	}

	async download(certificate: Certificate): Promise<void> {
		const definition = await this._buildDocDefinition(certificate);
		const fileName = `Certificate_${certificate.data?.['recipientName'] || 'document'}.pdf`.replace(/\s+/g, '_');
		(pdfMake.createPdf(definition as any) as any).download(fileName);
	}

	private async _buildDocDefinition(cert: Certificate): Promise<Record<string, unknown>> {
		const data = cert.data || {};
		const style = data['templateStyle'] || 'classic';
		
		// Common data
		const title = data['title'] || 'CERTIFICATE OF COMPLETION';
		const recipient = data['recipientName'] || 'Recipient Name';
		const description = data['description'] || 'For successful completion of the requirements set forth by IT Kamianets.';
		const date = data['issueDate'] ? new Date(data['issueDate']).toLocaleDateString('uk-UA') : new Date().toLocaleDateString('uk-UA');

		if (style === 'modern') {
			return this._buildModernDefinition(title, recipient, description, date);
		} else if (style === 'minimalist') {
			return this._buildMinimalistDefinition(title, recipient, description, date);
		} else {
			return this._buildClassicDefinition(title, recipient, description, date);
		}
	}

	private _buildClassicDefinition(title: string, recipient: string, description: string, date: string): Record<string, unknown> {
		return {
			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [40, 40, 40, 40],
			background: (currentPage: number) => {
				return {
					canvas: [
						{
							type: 'rect',
							x: 20, y: 20, w: 802, h: 554,
							lineWidth: 2,
							lineColor: '#b4975a'
						},
						{
							type: 'rect',
							x: 25, y: 25, w: 792, h: 544,
							lineWidth: 1,
							lineColor: '#b4975a'
						}
					]
				};
			},
			content: [
				{ text: 'IT KAMIANETS', style: 'classicLogo', alignment: 'center', margin: [0, 30, 0, 15] },
				{ text: title.toUpperCase(), style: 'classicHeader', alignment: 'center', margin: [0, 15, 0, 30] },
				{ text: 'THIS IS TO CERTIFY THAT', style: 'classicSubHeader', alignment: 'center', margin: [0, 0, 0, 10] },
				{ text: recipient, style: 'classicRecipient', alignment: 'center', margin: [0, 10, 0, 10] },
				{ 
					canvas: [{ type: 'line', x1: 200, y1: 0, x2: 560, y2: 0, lineWidth: 1, lineColor: '#333' }],
					alignment: 'center',
					margin: [0, 0, 0, 25]
				},
				{ text: description, style: 'classicDescription', alignment: 'center', margin: [100, 0, 100, 30] },
				{
					columns: [
						{
							stack: [
								{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 5] },
								{ text: 'DATE', style: 'classicLabel' },
								{ text: date, style: 'classicValue' }
							],
							alignment: 'center'
						},
						{ text: '', alignment: 'center' },
						{
							stack: [
								{ canvas: [{ type: 'line', x1: 0, y1: 0, x2: 150, y2: 0, lineWidth: 1 }], margin: [0, 0, 0, 5] },
								{ text: 'SIGNATURE', style: 'classicLabel' },
								{ text: 'IT Kamianets Team', style: 'classicValue' }
							],
							alignment: 'center'
						}
					],
					margin: [40, 30, 40, 0]
				}
			],
			styles: {
				classicLogo: { fontSize: 18, bold: true, color: '#2c3e50', letterSpacing: 2 },
				classicHeader: { fontSize: 32, bold: true, color: '#b4975a' },
				classicSubHeader: { fontSize: 14, italics: true, color: '#666' },
				classicRecipient: { fontSize: 38, bold: true, color: '#2c3e50' },
				classicDescription: { fontSize: 15, lineHeight: 1.4, color: '#444' },
				classicLabel: { fontSize: 9, bold: true, color: '#888' },
				classicValue: { fontSize: 11, bold: true, color: '#333' }
			}
		};
	}

	private _buildModernDefinition(title: string, recipient: string, description: string, date: string): Record<string, unknown> {
		return {
			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [0, 0, 0, 0],
			content: [
				{
					table: {
						widths: ['30%', '70%'],
						heights: [590],
						body: [
							[
								{
									fillColor: '#2563eb',
									stack: [
										{ text: 'ITK', style: 'modernLogo', margin: [40, 60, 0, 0] },
										{ text: 'IT KAMIANETS', style: 'modernLogoText', margin: [40, 0, 0, 0] }
									],
									border: [false, false, false, false]
								},
								{
									fillColor: '#ffffff',
									stack: [
										{ text: title, style: 'modernHeader', margin: [40, 80, 40, 15] },
										{ text: 'CERTIFICATE OF ACHIEVEMENT', style: 'modernSubHeader', margin: [40, 0, 40, 35] },
										{ text: 'PRESENTED TO', style: 'modernPresented', margin: [40, 0, 40, 10] },
										{ text: recipient, style: 'modernRecipient', margin: [40, 0, 40, 25] },
										{ text: description, style: 'modernDescription', margin: [40, 0, 80, 50] },
										{
											columns: [
												{
													stack: [
														{ text: 'DATE', style: 'modernLabel' },
														{ text: date, style: 'modernValue' }
													],
													margin: [40, 0, 0, 0]
												},
												{
													stack: [
														{ text: 'AUTHORITY', style: 'modernLabel' },
														{ text: 'IT Kamianets', style: 'modernValue' }
													]
												}
											]
										}
									],
									border: [false, false, false, false]
								}
							]
						]
					},
					layout: {
						hLineWidth: () => 0,
						vLineWidth: () => 0,
						paddingLeft: () => 0,
						paddingRight: () => 0,
						paddingTop: () => 0,
						paddingBottom: () => 0
					}
				}
			],
			styles: {
				modernLogo: { fontSize: 60, bold: true, color: '#ffffff' },
				modernLogoText: { fontSize: 14, color: '#ffffff', opacity: 0.8, letterSpacing: 2 },
				modernHeader: { fontSize: 32, bold: true, color: '#1e293b' },
				modernSubHeader: { fontSize: 12, bold: true, color: '#2563eb', letterSpacing: 2 },
				modernPresented: { fontSize: 10, color: '#64748b', bold: true },
				modernRecipient: { fontSize: 42, bold: true, color: '#2563eb' },
				modernDescription: { fontSize: 14, color: '#475569', lineHeight: 1.4 },
				modernLabel: { fontSize: 9, bold: true, color: '#94a3b8', letterSpacing: 1 },
				modernValue: { fontSize: 12, bold: true, color: '#1e293b' }
			}
		};
	}

	private _buildMinimalistDefinition(title: string, recipient: string, description: string, date: string): Record<string, unknown> {
		return {
			pageSize: 'A4',
			pageOrientation: 'landscape',
			pageMargins: [80, 80, 80, 80],
			content: [
				{ text: 'IT KAMIANETS', style: 'minLogo', margin: [0, 0, 0, 60] },
				{ text: recipient, style: 'minRecipient', margin: [0, 0, 0, 10] },
				{ text: title, style: 'minTitle', margin: [0, 0, 0, 30] },
				{ text: description, style: 'minDescription', margin: [0, 0, 0, 60] },
				{
					columns: [
						{ text: date, style: 'minDate' },
						{ text: 'Verified Certificate', style: 'minFooter', alignment: 'right' }
					]
				}
			],
			styles: {
				minLogo: { fontSize: 12, bold: true, color: '#000', letterSpacing: 3 },
				minRecipient: { fontSize: 48, color: '#000', font: 'Roboto' },
				minTitle: { fontSize: 14, color: '#666', letterSpacing: 1 },
				minDescription: { fontSize: 14, color: '#333', lineHeight: 1.6 },
				minDate: { fontSize: 12, color: '#999' },
				minFooter: { fontSize: 10, color: '#ccc', italics: true }
			}
		};
	}
}
