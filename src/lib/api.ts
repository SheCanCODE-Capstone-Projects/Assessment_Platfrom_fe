const API_BASE_URL = "/api/backend";

type ApiRequestOptions = RequestInit & {
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getStoredToken() {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem("assessment-platform.authToken") ||
    window.localStorage.getItem("accessToken") ||
    window.localStorage.getItem("authToken") ||
    window.localStorage.getItem("token")
  );
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return response.text();
  }

  return response.json();
}

export async function apiRequest<T>(
  path: string,
  { headers, auth = true, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const token = auth ? getStoredToken() : null;
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has("Content-Type") && options.body) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (token && !requestHeaders.has("Authorization")) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL.replace(/\/+$/, "")}${path}`, {
    ...options,
    headers: requestHeaders,
  });
  const payload = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return payload as T;
}
