import { authHeaders, parseApiErrorMessage } from "@/lib/auth";

export function getApiBase(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ??
    "https://assessment-platfrom-be.onrender.com"
  ).replace(/\/$/, "");
}

export type ApiQuery = Record<string, string | number | boolean | undefined | null>;

export type ApiRequestConfig = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: ApiQuery;
  json?: unknown;
  formData?: FormData;
  /** POST with query params + multipart body (Spring create-candidate). */
  multipartQuery?: ApiQuery;
  auth?: boolean;
};

function buildUrl(path: string, query?: ApiQuery): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${getApiBase()}${normalizedPath}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/** Backend wraps payloads as `{ success, data, message }`. */
export function unwrapData<T>(body: unknown): T {
  if (body !== null && typeof body === "object" && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export function unwrapList<T>(body: unknown): T[] {
  const data = unwrapData<T[] | T>(body);
  if (Array.isArray(data)) return data;
  return data ? [data] : [];
}

/** Matches OpenAPI pattern: ^\\+?[0-9]{10,15}$ */
export function normalizePhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\-().]/g, "");
  if (/^\+[0-9]{10,15}$/.test(cleaned)) return cleaned;
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return cleaned;
}

export async function apiRequest<T = unknown>(
  path: string,
  config: ApiRequestConfig = {},
): Promise<T> {
  const {
    method = "GET",
    query,
    json,
    formData,
    multipartQuery,
    auth = true,
  } = config;

  const url = buildUrl(path, multipartQuery ?? query);
  const headers: Record<string, string> = auth ? { ...authHeaders() } : {};

  let body: BodyInit | undefined;
  if (formData !== undefined) {
    body = formData;
  } else if (multipartQuery !== undefined && method !== "GET") {
    body = new FormData();
  } else if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  }

  const res = await fetch(url, { method, headers, body });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(parseApiErrorMessage(text) || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    return text as T;
  }

  return (await res.json()) as T;
}

export function apiGet<T>(path: string, query?: ApiQuery, auth = true) {
  return apiRequest<T>(path, { method: "GET", query, auth });
}

export function apiPost<T>(path: string, config: Omit<ApiRequestConfig, "method"> = {}) {
  return apiRequest<T>(path, { ...config, method: "POST" });
}

export function apiPut<T>(path: string, config: Omit<ApiRequestConfig, "method"> = {}) {
  return apiRequest<T>(path, { ...config, method: "PUT" });
}

export function apiDelete(path: string, auth = true) {
  return apiRequest<void>(path, { method: "DELETE", auth });
}
