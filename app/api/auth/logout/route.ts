import { NextResponse } from "next/server";

const TOKEN_COOKIE = "admin_token";
const ROLE_COOKIE = "admin_role";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete(TOKEN_COOKIE);
  res.cookies.delete(ROLE_COOKIE);
  return res;
}

