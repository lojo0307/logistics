'use client';

import AppLayout from '@/components/AppLayout';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function MyPage() {
  const router = useRouter();

  const handleLogout = () => {
    // 쿠키에서 토큰과 사용자 정보 삭제
    Cookies.remove('token');
    Cookies.remove('user');
    
    // 로그인 페이지로 리다이렉션
    router.push('/login');
  };

  return (
    <AppLayout>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">마이페이지</h2>
        
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          로그아웃
        </button>
      </div>
    </AppLayout>
  );
} 