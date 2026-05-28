import { cookies } from "next/headers";

const TOKEN_COOKIE = "admin_token";

function getApiBaseUrl() {
  return process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
}

function buildUpstreamUrl(req: Request, pathParts: string[]) {
  const url = new URL(req.url);
  const upstream = new URL(`${getApiBaseUrl()}/${pathParts.join("/")}`);
  upstream.search = url.search;
  return upstream.toString();
}

async function proxy(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  const upstreamUrl = buildUpstreamUrl(req, path);

  const headers = new Headers(req.headers);
  headers.delete("host");
  // For localStorage-based auth, the client should pass Authorization explicitly.
  // If you still have a cookie token, we can fallback to it.
  if (!headers.get("authorization") && token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  const upstreamRes = await fetch(upstreamUrl, {
    method,
    headers,
    body,
    // Ensure cookies are not forwarded cross-origin implicitly
    credentials: "omit",
  });

  const resHeaders = new Headers(upstreamRes.headers);
  // Avoid leaking hop-by-hop headers
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("connection");

  return new Response(await upstreamRes.arrayBuffer(), {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}

export async function GET(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function POST(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function PUT(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function PATCH(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}
export async function DELETE(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  return proxy(req, ctx);
}

