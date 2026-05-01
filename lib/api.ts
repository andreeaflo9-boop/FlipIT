type RequestOptions = RequestInit & {
    token?: string;
};

export async function apiCall<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { token, headers, ...rest } = options;

    const response = await fetch(endpoint, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(headers as Record<string, string> | undefined),
        },
    });

    if (!response.ok) {
        const message = await getErrorMessage(response);
        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

async function getErrorMessage(response: Response): Promise<string> {
    const text = await response.text();

    if (!text) {
        return `Request failed with status ${response.status}`;
    }

    try {
        const data = JSON.parse(text);
        return data.error || data.message || text;
    } catch {
        return text;
    }
}

export function login(email: string, password: string) {
    return apiCall("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function register(name: string, email: string, password: string) {
    return apiCall("/api/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}

export function logout(token?: string) {
    return apiCall("/api/logout", {
        method: "POST",
        token,
    });
}

export function getCurrentUser(token?: string) {
    return apiCall("/api/me", {
        method: "GET",
        token,
    });
}