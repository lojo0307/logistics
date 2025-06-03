'use client';

import { useState } from 'react';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function PackPage() {
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [isValidTrackingNumber, setIsValidTrackingNumber] = useState<boolean>(false);
  
  // 임시 통계 데이터 (나중에 API로 대체)
  const stats = {
    total: 150,
    myWork: 45,
    incomplete: 105
  };

  const handleBarcodeScan = async (result: string) => {
    try {
      // 스프레드시트에서 운송장번호 확인
      const response = await fetch(`/api/sheets?trackingNumber=${result}`);
      const data = await response.json();

      if (data.error) {
        alert('운송장번호 확인 중 오류가 발생했습니다.');
        return;
      }

      if (!data.exists) {
        alert('전산에 해당 운송장번호가 존재하지 않습니다.');
        setTrackingNumber('');
        setIsValidTrackingNumber(false);
        return;
      }

      setTrackingNumber(result);
      setIsValidTrackingNumber(true);
    } catch (error) {
      console.error('API 호출 중 오류:', error);
      alert('운송장번호 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              물류 포장 모드
            </h1>
            <Link
              href="/mypage"
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              title="마이페이지"
            >
              <UserCircle className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* 작업 통계 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">전체</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}건</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">내 작업량</p>
              <p className="text-lg font-semibold text-gray-900">{stats.myWork}건</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500">미완</p>
              <p className="text-lg font-semibold text-gray-900">{stats.incomplete}건</p>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <BarcodeScanner onScan={handleBarcodeScan} />
          
          {/* 스캔 결과 */}
          {isValidTrackingNumber && trackingNumber && (
            <div className="p-4 border-t">
              <p className="text-gray-900">
                <span className="font-medium">운송장번호:</span> {trackingNumber}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 