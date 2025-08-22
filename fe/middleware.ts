import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { User } from "./lib/types/user";
import { apiGet } from "./lib/api";
const authURL = ["/login", "/register"];
const privateURL = ["/cart", "/me", "/order"];
const adminURL = ["/admin"];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  const url = request.nextUrl.pathname;
  if (authURL.some((path) => url.includes(path)) && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (privateURL.some((path) => url.includes(path)) && !accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (adminURL.some((path) => url.includes(path))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables.");
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(accessToken.value, secret);
    const user = payload as unknown as User;
    if (!user || user.type !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: ["/login", "/register", "/cart", "/me", "/order", "/admin/:path*"],
};
