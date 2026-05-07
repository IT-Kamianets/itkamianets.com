export type SaleData = Record<string, unknown>;

export interface Sale {
	_id: string;
	name: string;
	description?: string;
	data: SaleData;
}