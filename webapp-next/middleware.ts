import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {

  const cookie = request.cookies.get('cm2d_api_key')?.value;

  if (request.nextUrl.pathname.startsWith('/bo')) {
    if (!cookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login') {
    if (cookie) {
      return NextResponse.redirect(new URL('/bo', request.url));
    }
  }
}