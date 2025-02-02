import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /protected)
  const path = request.nextUrl.pathname

  // Define paths that are public (accessible without authentication)
  const isPublicPath = path === '/auth/signin' || path === '/auth/signup'

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value || ''

  // If the path is public and no token exists, allow access
  if (isPublicPath && !token) {
    return NextResponse.next()
  }

  // If the path is public and a token exists, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard/home', request.url))
  }

  // If the path is not public and no token exists, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/test',
  ]
}