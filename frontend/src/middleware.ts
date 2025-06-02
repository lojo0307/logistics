import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 역할별 접근 가능한 경로 정의
const roleRoutes = {
  'PACKING': ['/pack'],
  'INSPECTION': ['/check'],
  'ADMIN': ['/admin'],
};

// 공개 경로 (로그인 없이 접근 가능)
const publicRoutes = ['/', '/login'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const user = request.cookies.get('user')?.value;
  const path = request.nextUrl.pathname;

  // 공개 경로는 통과
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // 토큰이 없으면 로그인 페이지로
  if (!token || !user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const userData = JSON.parse(decodeURIComponent(user));
    const userRole = userData.role;
    
    // 관리자는 모든 경로 접근 가능
    if (userRole === 'ADMIN') {
      return NextResponse.next();
    }

    // 해당 역할이 접근할 수 있는 경로인지 확인
    const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
    if (!allowedRoutes.some(route => path.startsWith(route))) {
      // 권한이 없는 경로는 사용자의 기본 페이지로 리다이렉트
      return NextResponse.redirect(new URL(roleRoutes[userRole as keyof typeof roleRoutes][0], request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // 사용자 데이터 파싱 에러 시 로그인 페이지로
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 