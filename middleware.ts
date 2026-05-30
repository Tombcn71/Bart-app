import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function withPathname(response: NextResponse, pathname: string) {
  response.headers.set("x-pathname", pathname);
  return response;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // 1. Admin routes — auth check
  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login") {
      const token = request.cookies.get("admin_token")?.value;
      if (token !== process.env.ADMIN_TOKEN) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return withPathname(NextResponse.next(), pathname);
  }

  // 2. Aluminium configurators — direct
  if (pathname.startsWith("/aluminium")) {
    return withPathname(NextResponse.next(), pathname);
  }

  // 3. Accepteer pagina — direct (niet herschrijven)
  if (pathname.startsWith("/accepteer")) {
    return withPathname(NextResponse.next(), pathname);
  }

  // 3. Alle overige routes → configurators
  url.pathname =
    pathname === "/" ? "/configurators/kozijnen" : `/configurators${pathname}`;
  return withPathname(NextResponse.rewrite(url), pathname);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
