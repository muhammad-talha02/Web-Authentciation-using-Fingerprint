import { NextRequest, NextResponse } from "next/server";

export function middleware(request:NextRequest){
     // Get the token from the request cookies
     const path = request.nextUrl.pathname;
  const token = request.cookies.get('user')?.value;

if (!token && path !== '/login' && path !== '/register') {
  return NextResponse.redirect(new URL('/login', request.url));
}
  console.log("Middle", token)

  return NextResponse.next();

}
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
  };