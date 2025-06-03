import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// 구글 API 인증 설정
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingNumber = searchParams.get('trackingNumber');

    if (!trackingNumber) {
      return NextResponse.json(
        { error: '운송장 번호가 필요합니다.' },
        { status: 400 }
      );
    }

    // 스프레드시트 ID와 범위 설정
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    const range = '작업현황!A:A'; // A열만 검색

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    
    if (!rows) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    // A열에서 운송장번호 찾기 (첫 번째 행은 헤더이므로 제외)
    const exists = rows.slice(1).some(row => row[0] === trackingNumber);

    return NextResponse.json(
      { exists },
      { status: 200 }
    );

  } catch (error) {
    console.error('스프레드시트 조회 중 오류:', error);
    return NextResponse.json(
      { error: '스프레드시트 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 