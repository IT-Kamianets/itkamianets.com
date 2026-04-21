const API_BASE = 'https://api.webart.work/api/itreview';

function getAuthHeaders(): Record<string, string> {
	if (typeof window === 'undefined') {
		return {};
	}

	try {
		const storedUser = localStorage.getItem('waw_user');
		if (!storedUser) {
			return {};
		}

		const user = JSON.parse(storedUser) as { token?: string };
		const token = user.token?.trim();

		return token ? { token } : {};
	} catch (error) {
		console.error(error);
		return {};
	}
}

async function request<T>(path: string, init?: RequestInit) {
	try {
		const headers = new Headers(init?.headers);

		headers.set('Content-Type', 'application/json');
		headers.set('Cache-Control', 'no-cache');
		headers.set('Pragma', 'no-cache');

		for (const [key, value] of Object.entries(getAuthHeaders())) {
			headers.set(key, value);
		}

		const response = await fetch(`${API_BASE}${path}`, {
			cache: 'no-store',
			...init,
			headers,
		});

		if (!response.ok) {
			throw new Error(`Review API request failed: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as T;
	} catch (error) {
		console.error(error);
		return null;
	}
}

export async function getReviews<T = unknown>() {
	return request<T>('/get', {
		method: 'GET',
	});
}

export async function getReviewById<T = unknown>(id: string) {
	return request<T>('/fetch', {
		method: 'POST',
		body: JSON.stringify({ _id: id }),
	});
}

export async function createReview<T = unknown, D = unknown>(data: D) {
	return request<T>('/create', {
		method: 'POST',
		body: JSON.stringify(data),
	});
}

export async function updateReview<T = unknown, D = unknown>(id: string, data: D) {
	return request<T>('/update', {
		method: 'POST',
		body: JSON.stringify({ _id: id, ...((data as object) || {}) }),
	});
}

export async function deleteReview<T = unknown>(id: string) {
	return request<T>('/delete', {
		method: 'POST',
		body: JSON.stringify({ _id: id }),
	});
}
