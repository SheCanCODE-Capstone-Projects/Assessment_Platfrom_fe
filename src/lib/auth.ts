const TOKEN_KEY = "authToken";

export function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  const token =
    localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? "";
  if (!token || token === "undefined" || token === "null") return "";
  return token;
}

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}

export function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** Supports both flat and ApiResponse-wrapped login bodies. */
export function extractAccessToken(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const root = body as Record<string, unknown>;
  if (typeof root.accessToken === "string" && root.accessToken) {
    return root.accessToken;
  }
  const data = root.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (typeof nested.accessToken === "string" && nested.accessToken) {
      return nested.accessToken;
    }
  }
  return null;
}

export function parseApiErrorMessage(text: string): string {
  try {
    const json = JSON.parse(text) as { message?: string; error?: string };
    return json.message || json.error || text;
  } catch {
    return text;
  }
}
