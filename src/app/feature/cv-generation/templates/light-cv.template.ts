import { CvBaseTemplate } from './cv-base.template';

export class LightCvTemplate extends CvBaseTemplate {
	protected readonly palette = {
		leftPanelBg: '#2C3E50',
		rightPanelBg: '#FFFFFF',
		leftTitle: '#FFFFFF',
		leftText: '#FFFFFF',
		rightTitle: '#333333',
		rightText: '#333333',
		linkText: '#2563EB',
		leftRoleOpacity: 0.9,
	};
}
