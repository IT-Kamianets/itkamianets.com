export type ProjectCategory =
	| 'hotel-business'
	| 'retail-business'
	| 'restaurant-business'
	| 'coffee-business'
	| 'salon-business';

export interface ProjectData {
	category?: string;
	completionDate?: string;
	description?: string;
	githubLink?: string;
	imageKind?: string;
	liveUrl?: string;
	memberIds?: number[];
	photo?: string;
	title?: string;
	tags?: string[];
	websiteLink?: string;
	team?: number[];
	[key: string]: unknown;
}

export interface Project {
	_id?: string;
	data: ProjectData;
	createdAt?: string;
	updatedAt?: string;
}