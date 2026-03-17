export type EducationInstitutionType =
	| 'lyceum'
	| 'gymnasium'
	| 'kindergarten'
	| 'college'
	| 'university'
	| 'art-school';

export type EducationInstitutionOwnership = 'municipal' | 'state' | 'private';

export type EducationInstitutionStatus = 'active' | 'planned' | 'renovation';

export interface EducationInstitution {
	id: string;
	name: string;
	shortName: string;
	type: EducationInstitutionType;
	ownership: EducationInstitutionOwnership;
	address: string;
	district: string;
	phone: string;
	email: string;
	website: string;
	principal: string;
	studentsCount: number;
	foundedYear: number;
	status: EducationInstitutionStatus;
	featured: boolean;
	published: boolean;
	notes: string;
	updatedAt: string;
}

export type EducationInstitutionDraft = Omit<EducationInstitution, 'id' | 'updatedAt'>;