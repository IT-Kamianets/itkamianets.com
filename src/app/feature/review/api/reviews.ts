const API_BASE_URL = 'https://api.webart.work/api/itreview';

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
		console.error('Reviews API auth header error:', error);
		return {};
	}
}

async function request<T>(path: string, init?: RequestInit) {
	const headers = new Headers(init?.headers);

	headers.set('Content-Type', 'application/json');
	headers.set('Cache-Control', 'no-cache');
	headers.set('Pragma', 'no-cache');

	for (const [key, value] of Object.entries(getAuthHeaders())) {
		headers.set(key, value);
	}

	const response = await fetch(`${API_BASE_URL}${path}`, {
		cache: 'no-store',
		...init,
		headers,
	});

	if (!response.ok) {
		throw new Error(`Reviews API request failed: ${response.status} ${response.statusText}`);
	}

	return (await response.json()) as T;
}

function handleError(methodName: string, error: unknown) {
	console.error(`Reviews API ${methodName} failed:`, error);
	return null;
}

export async function getReviews<T = unknown>() {
	try {
		return await request<T>('/get', {
			method: 'GET',
		});
	} catch (error) {
		return handleError('getReviews', error);
	}
}

export async function fetchReview<T = unknown>(id: string) {
	try {
		return await request<T>('/fetch', {
			method: 'POST',
			body: JSON.stringify({ _id: id }),
		});
	} catch (error) {
		return handleError('fetchReview', error);
	}
}

export async function createReview<T = unknown, D = unknown>(data: D) {
	try {
		return await request<T>('/create', {
			method: 'POST',
			body: JSON.stringify(data),
		});
	} catch (error) {
		return handleError('createReview', error);
	}
}

export async function updateReview<T = unknown, D = unknown>(id: string, data: D) {
	try {
		return await request<T>('/update', {
			method: 'POST',
			body: JSON.stringify({ _id: id, ...((data as object) || {}) }),
		});
	} catch (error) {
		return handleError('updateReview', error);
	}
}

export async function deleteReview<T = unknown>(id: string) {
	try {
		return await request<T>('/delete', {
			method: 'POST',
			body: JSON.stringify({ _id: id }),
		});
	} catch (error) {
		return handleError('deleteReview', error);
	}
}
