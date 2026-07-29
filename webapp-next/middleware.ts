import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ELASTIC_API_KEY_NAME } from '@/utils/tools';
 
export function middleware(request: NextRequest) {

  // Ce middleware ne teste que la PRÉSENCE du cookie, pas la validité de l'API
  // key ES (impossible sur le runtime edge : le client ES et le certificat CA
  // ne sont pas disponibles ici). Ce test n'est fiable que parce que le cookie
  // expire désormais en même temps que la key (Max-Age aligné sur `expiration:
  // '1d'`, cf. setCookieServerSide). La validation réelle se fait côté API
  // (401 → panneau "session expirée" + reconnexion), pas ici.
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