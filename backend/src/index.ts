import express from 'express';
import dotenv from 'dotenv';
import * as admin from 'firebase-admin';
import cron from 'node-cron';

dotenv.config();

// Firebase Admin 초기화
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId: process.env.FIREBASE_PROJECT_ID
});

const db = admin.firestore();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

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