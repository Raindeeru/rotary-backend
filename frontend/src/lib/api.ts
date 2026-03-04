const API_BASE = 'http://localhost:8000';

function getToken(): string {
  return localStorage.getItem('rotary_access_token') ?? '';
}

function authHeaders(): Record<string, string> {
  return { Authorization: `Bearer ${getToken()}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) message = body.detail;
    } catch { /* ignore */ }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

/* ── Auth ─────────────────────────────────────────────── */
export async function loginRequest(username: string, password: string) {
  const body = new URLSearchParams();
  body.append('username', username);
  body.append('password', password);

  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  const data = await handleResponse<{ access_token: string; token_type: string }>(res);
  localStorage.setItem('rotary_access_token', data.access_token);
  return data; // returns { access_token, token_type }
}

/* ── Members ──────────────────────────────────────────── */
export async function inviteMemberRequest(params: { username: string; email: string; role?: string }) {
  const query = new URLSearchParams({
    username: params.username,
    email: params.email,
    ...(params.role ? { role: params.role } : {}),
  });

  const res = await fetch(`${API_BASE}/members/invite?${query}`, {
    method: 'POST',                        // ← must be POST
    headers: { ...authHeaders() },
  });

  return handleResponse<{ message: string; temporary_password?: string }>(res);
}

/* ── Projects ─────────────────────────────────────────── */
export type Project = {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
  total_expenses: number;
  remaining_balance: number;
};

export async function listProjectsRequest(): Promise<Project[]> {
  const res = await fetch(`${API_BASE}/projects/`);
  return handleResponse<Project[]>(res);
}