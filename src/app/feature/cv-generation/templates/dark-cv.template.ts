import { CvBaseTemplate } from './cv-base.template';

export class DarkCvTemplate extends CvBaseTemplate {
	protected readonly palette = {
		leftPanelBg: '#0F172A',
		rightPanelBg: '#1E293B',
		pageBackground: '#1E293B',
		leftTitle: '#F8FAFC',
		leftText: '#E2E8F0',
		rightTitle: '#F8FAFC',
		rightText: '#E2E8F0',
		linkText: '#60A5FA',
		leftRoleOpacity: 1,
	};
}
