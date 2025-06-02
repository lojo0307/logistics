// API 기본 URL 설정
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API 엔드포인트 정의
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  // 추후 다른 엔드포인트들도 여기에 추가
} as const; 