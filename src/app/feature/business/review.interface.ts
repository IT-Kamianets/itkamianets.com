export interface Review {
	id: number;
	businessId: string;
	author: string;
	rating: 1 | 2 | 3 | 4 | 5;
	text: string;
	date: string; // ISO date string
}
