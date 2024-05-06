import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ELASTIC_API_KEY_NAME } from '@/utils/tools';
 
export function middleware(request: NextRequest) {

  const cookie = request.cookies.get(ELASTIC_API_KEY_NAME)?.value;

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

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};