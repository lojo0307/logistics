import LoginForm from '@/components/LoginForm';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* 로고 */}
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo.png"
            alt="회사 로고"
            width={120}
            height={120}
            className="mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            물류 포장 시스템
          </h1>
        </div>

        {/* 로그인 폼 */}
        <LoginForm />
      </div>
    </main>
  );
}
