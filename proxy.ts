import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  // 1) Mbrojtje me fjalëkalim për tërë faqen (HTTP Basic Auth).
  //    Aktivizohet vetëm nëse SITE_PASSWORD është vendosur (p.sh. në Vercel).
  //    Lokalisht, nëse nuk e vendos, faqja hapet normalisht.
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword) {
    const expectedUser = process.env.SITE_USER || "reklamo";
    const header = req.headers.get("authorization");
    let authorized = false;

    if (header?.startsWith("Basic ")) {
      try {
        const decoded = atob(header.slice(6));
        const sep = decoded.indexOf(":");
        const user = decoded.slice(0, sep);
        const pass = decoded.slice(sep + 1);
        if (user === expectedUser && pass === sitePassword) authorized = true;
      } catch {
        authorized = false;
      }
    }

    if (!authorized) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Reklamo", charset="UTF-8"',
        },
      });
    }
  }

  // 2) Mbrojtje në nivel aplikacioni për dashboard/admin.
  const { pathname } = req.nextUrl;
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.AUTH_SECRET });
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Aplikohet për tërë faqen, përveç aseteve statike dhe rrugëve API.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
