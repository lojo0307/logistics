import dotenv from 'dotenv';
// 환경 변수를 가장 먼저 로드
dotenv.config();

// Firebase 초기화를 다른 import 전에 수행
import './config/firebase';

import express from 'express';
import cron from 'node-cron';
import authRouter from './routes/auth';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우터
app.use('/api/auth', authRouter);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Logistics Backend API' });
});

// 스케줄러 설정 예시
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily cleanup task');
  // 여기에 일일 작업 로직 추가
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 