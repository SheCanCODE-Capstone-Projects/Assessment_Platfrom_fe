import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// LocalStorage-based auth can't be enforced at Proxy time.
// Keep this file as a no-op (or remove entirely) to avoid unexpected redirects.
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

