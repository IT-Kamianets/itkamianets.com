export interface TestResult {
	_id?: string;
	testId: string;
	userId?: string;
	data: TestResultData;
	createdAt?: string;
	updatedAt?: string;
}

export interface TestResultData {
	answers: number[];
	score: number;
	correct?: number;
	total?: number;
	completedAt?: string;
	testTitle?: string;
	[key: string]: unknown;
}
