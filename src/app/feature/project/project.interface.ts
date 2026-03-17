export type ProjectCategory = 'theme-tailwind' | 'theme-bulma' | 'theme-bootstrap' | 'custom';

export type ProjectImageKind = 'asset' | 'upload';

export interface ManagedProject {
	id: string;
	title: string;
	description: string;
	tags: string[];
	repoUrl: string;
	liveUrl: string;
	image: string;
	imageKind: ProjectImageKind;
	memberIds: number[];
	category: ProjectCategory;
	createdAt: string;
	updatedAt: string;
}

export interface ManagedProjectDraft {
	title: string;
	description: string;
	tags: string[];
	repoUrl: string;
	liveUrl: string;
	image: string;
	imageKind: ProjectImageKind;
	memberIds: number[];
	category: ProjectCategory;
}