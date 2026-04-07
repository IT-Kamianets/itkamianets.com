export interface MerchProduct {
	_id: string;
	data: {
		name: string;
		price: number;
		description: string;
		image: string;
	};
	name: string;
	price: number;
	description: string;
	image: string;
}

export interface Order {
	_id: string;
	data: {
		items: {
			productId: string;
			name: string;
			price: number;
			quantity: number;
		}[];
		total: number;
		customer: {
			name: string;
			email: string;
			phone: string;
			address: string;
		};
		status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
	};
}
