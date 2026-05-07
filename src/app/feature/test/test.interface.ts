export interface Test {
	_id?: string;
	data: TestData;
	createdAt?: string;
	updatedAt?: string;
}

export interface TestData {
	title: string;
	description: string;
	questions: Question[];
	category?: string;
	badge?: string;
	[key: string]: unknown;
}

export interface Question {
	question: string;
	options: string[];
	correct: number;
}
