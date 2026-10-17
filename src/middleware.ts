import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Never serve secrets, env files, or service-account JSON via HTTP. */
const BLOCKED =
  /(^|\/)(\.env(\..+)?|usemeai\.json|.*firebase-adminsdk.*\.json|serviceAccount.*\.json|credentials\.json|.*\.pem)$/i;

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (BLOCKED.test(path)) {
    return new NextResponse("Not found", { status: 404 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|favicon.svg|favicon.jpg|apple-touch-icon.jpg).*)",
  ],
};
