// Prefer the new key used by the admin portal (localStorage-based auth).
// Keep backward compatibility with the previous key.
const PRIMARY_TOKEN_KEY = "accessToken";
const LEGACY_TOKEN_KEY = "authToken";

export function getAuthToken(): string {
  if (typeof window === "undefined") return "";
  const token =
    localStorage.getItem(PRIMARY_TOKEN_KEY) ??
    sessionStorage.getItem(PRIMARY_TOKEN_KEY) ??
    localStorage.getItem(LEGACY_TOKEN_KEY) ??
    sessionStorage.getItem(LEGACY_TOKEN_KEY) ??
    "";
  if (!token || token === "undefined" || token === "null") return "";
  return token;
}

export function setAuthToken(token: string): void {
  localStorage.setItem(PRIMARY_TOKEN_KEY, token);
  // Also set legacy key so older code paths keep working if any remain.
  localStorage.setItem(LEGACY_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  localStorage.removeItem(PRIMARY_TOKEN_KEY);
  sessionStorage.removeItem(PRIMARY_TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  sessionStorage.removeItem(LEGACY_TOKEN_KEY);
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
