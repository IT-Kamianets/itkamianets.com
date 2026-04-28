import { CvTemplateData } from './cv-template-data.interface';

export interface CvTemplateInterface {
	getDocDefinition(data: CvTemplateData): Promise<Record<string, unknown>>;
}
