import { NextResponse } from "next/server";

const TOKEN_COOKIE = "admin_token";
const ROLE_COOKIE = "admin_role";

function getApiBaseUrl() {
  const raw =
    process.env.API_BASE_URL ??
    process.env.PRODUCTION_API_BASE_URL ??
    "https://assessment-platfrom-be.onrender.com";
  // Avoid double slashes when appending paths
  return raw.replace(/\/+$/, "");
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 }
    );
  }

  const upstream = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const payload = (await upstream.json().catch(() => null)) as any;

  if (!upstream.ok) {
    const message =
      payload?.message ??
      payload?.error ??
      payload?.errors?.[0]?.message ??
      "Login failed";
    return NextResponse.json(
      {
        success: false,
        message,
        statusCode: upstream.status,
      },
      { status: upstream.status }
    );
  }

  const authPayload = payload?.data ?? payload;
  const accessToken = authPayload?.accessToken as string | undefined;
  const role = authPayload?.role as string | undefined;

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Login succeeded but no token returned" },
      { status: 502 }
    );
  }

  const response = NextResponse.json({
    success: true,
    accessToken,
    role: role ?? null,
  });

  response.cookies.set(TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  if (role) {
    response.cookies.set(ROLE_COOKIE, role, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  } else {
    response.cookies.delete(ROLE_COOKIE);
  }

  return response;
}
