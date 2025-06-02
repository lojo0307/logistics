'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { UserCircleIcon } from '@heroicons/react/24/outline';

const pageNames: { [key: string]: string } = {
  '/pack': '포장 작업',
  '/check': '검수 작업',
  '/admin': '관리자',
  '/mypage': '마이페이지',
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const pageName = pageNames[pathname] || '';

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* 왼쪽: 로고와 페이지 이름 */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.svg"
            alt="로고"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <h1 className="text-xl font-semibold text-gray-900">
            {pageName}
          </h1>
        </div>

        {/* 오른쪽: 마이페이지 버튼 */}
        <button
          onClick={() => router.push('/mypage')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="마이페이지"
        >
          <UserCircleIcon className="w-6 h-6 text-gray-600" />
        </button>
      </div>
    </header>
  );
} 