export const ACCESS_TOKEN_KEY = "accessToken";
export const ROLE_KEY = "role";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAuth(accessToken: string, role?: string | null) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (role) localStorage.setItem(ROLE_KEY, role);
  else localStorage.removeItem(ROLE_KEY);
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}

