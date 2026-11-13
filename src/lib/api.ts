const TOKEN_KEY = 'tws_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable */
  }
};

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

export async function api<T = any>(path: string, options: { method?: string; body?: any } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const isForm = options.body instanceof FormData;
  if (options.body !== undefined && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`/api${path}`, {
    method: options.method || (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: options.body === undefined ? undefined : isForm ? options.body : JSON.stringify(options.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || 'Request failed', res.status, data);
  return data as T;
}

export const inr = (n: number) => '₹' + Number(n || 0).toLocaleString('en-IN');

export const formatDate = (d: string | Date) =>
  new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
