'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, Result } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
}

export function BarcodeScanner({ onScan }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let mounted = true;

    async function initializeScanner() {
      try {
        if (!videoRef.current) return;

        // 기존 스트림 정리
        if (videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }

        // 모바일 환경 체크
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        
        // 카메라 설정
        const constraints = {
          video: isMobile 
            ? { facingMode: { ideal: 'environment' } }  // 모바일: 후면 카메라 선호
            : true  // 데스크톱: 기본 카메라
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!mounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // play() 호출 전에 loadedmetadata 이벤트를 기다립니다
          await new Promise((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = resolve;
            }
          });
          await videoRef.current.play();
        }

        // 바코드 스캔 시작
        await codeReader.decodeFromStream(
          stream,
          videoRef.current,
          (result: Result | null, error: Error | undefined) => {
            if (result && mounted) {
              onScan(result.getText());
            }
          }
        );
      } catch (error) {
        console.error('카메라 접근 실패:', error);
        setError('카메라를 시작할 수 없습니다. 카메라 권한을 확인해주세요.');
      }
    }

    initializeScanner();

    return () => {
      mounted = false;
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      codeReader.reset();
    };
  }, [onScan]);

  if (error) {
    return (
      <div className="relative w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-red-500 text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video">
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-lg"
        playsInline
        muted
      />
      <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none" />
    </div>
  );
} 