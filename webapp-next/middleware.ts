import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ELASTIC_API_KEY_NAME } from '@/utils/tools';
 
export function middleware(request: NextRequest) {

  // Simple test de présence : le runtime edge ne peut pas valider la key ES.
  // Fiable uniquement parce que le cookie expire avec la key (cf.
  // setCookieServerSide) ; la vraie validation se fait côté API.
  const cookie = request.cookies.get(ELASTIC_API_KEY_NAME)?.value;

  if (request.nextUrl.pathname.startsWith('/bo')) {
    if (!cookie) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else if (request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/login')) {
    if (cookie) {
      return NextResponse.redirect(new URL('/bo', request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};