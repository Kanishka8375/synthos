import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected app routes — redirect to login if not authenticated
  const isAppRoute = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/episode-pipeline") ||
    pathname.startsWith("/render-queue") ||
    pathname.startsWith("/soundtrack-forge") ||
    pathname.startsWith("/character-dna-vault") ||
    pathname.startsWith("/world-atlas") ||
    pathname.startsWith("/emotion-choreography") ||
    pathname.startsWith("/workflow-canvas") ||
    pathname.startsWith("/production-bible") ||
    pathname.startsWith("/multilingual-engine") ||
    pathname.startsWith("/trend-radar") ||
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/settings");

  if (isAppRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Auth routes — redirect to dashboard if already logged in
  if ((pathname === "/login" || pathname === "/signup") && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
