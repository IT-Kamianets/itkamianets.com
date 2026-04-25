export interface SalaryData {
	id: string;
	name: string;
	category: 'frontend' | 'backend';
	averageSalary: number; // in USD
	openJobs: number;
	competitorsHiring: number;
	trend?: 'up' | 'down' | 'stable';
}

export interface SalaryCategory {
	id: 'frontend' | 'backend';
	label: string;
	label_ua: string;
	count: number;
}
