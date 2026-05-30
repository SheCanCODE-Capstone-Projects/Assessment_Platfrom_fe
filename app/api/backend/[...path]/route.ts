import { cookies } from "next/headers";

const TOKEN_COOKIE = "admin_token";

function getApiBaseUrl() {
  return (
    process.env.API_BASE_URL ??
    process.env.PRODUCTION_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "https://assessment-platfrom-be.onrender.com"
  ).replace(/\/+$/, "");
}

function buildUpstreamUrl(req: Request, pathParts: string[]) {
  const url = new URL(req.url);
  const upstream = new URL(`${getApiBaseUrl()}/${pathParts.join("/")}`);
  upstream.search = url.search;
  return upstream.toString();
}

function buildUpstreamHeaders(req: Request, token?: string) {
  const headers = new Headers();
  const authorization = req.headers.get("authorization");
  const contentType = req.headers.get("content-type");
  const accept = req.headers.get("accept");

  if (authorization) {
    headers.set("authorization", authorization);
  } else if (token) {
    headers.set("authorization", `Bearer ${token}`);
  }

  if (contentType) headers.set("content-type", contentType);
  if (accept) headers.set("accept", accept);

  return headers;
}

async function proxy(req: Request, ctx: { params: Promise<{ path?: string[] }> }) {
  const { path = [] } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  const upstreamUrl = buildUpstreamUrl(req, path);
  const headers = buildUpstreamHeaders(req, token);

  const method = req.method.toUpperCase();
  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  let upstreamRes: Response;

  try {
    upstreamRes = await fetch(upstreamUrl, {
      method,
      headers,
      body,
      // Ensure cookies are not forwarded cross-origin implicitly
      credentials: "omit",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Backend request failed";

    return Response.json(
      {
        success: false,
        message: `Unable to reach backend API: ${message}`,
      },
      { status: 502 },
    );
  }

  const resHeaders = new Headers(upstreamRes.headers);
  // Avoid leaking hop-by-hop or body-size headers. Fetch may decompress the
  // upstream body, making the original content-length/content-encoding invalid.
  resHeaders.delete("transfer-encoding");
  resHeaders.delete("connection");
  resHeaders.delete("content-encoding");
  resHeaders.delete("content-length");

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
