import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { parseJwt } from "@/util/parseJwt";
import { Role } from "@/api/mapped-models";

interface JwtAuthToken {
  sub: string;
  roles: Role[];
  name: string;
  avatar: string;
}

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("dota2classic_auth_token");
  if (!cookie) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }
  const parsedToken = parseJwt<JwtAuthToken>(cookie.value);
  if (
    !parsedToken.roles.includes(Role.MODERATOR) &&
    !parsedToken.roles.includes(Role.ADMIN)
  ) {
    return NextResponse.redirect(new URL("/forbidden", request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin/(.+)",
};
