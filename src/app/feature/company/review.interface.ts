export type ReviewStatus = 'approved' | 'pending' | 'rejected';

export interface Review {
	id: number;
	companyId: string;
	author: string;
	rating: 1 | 2 | 3 | 4 | 5;
	text: string;
	date: string; // ISO date string
	status: ReviewStatus;
}
