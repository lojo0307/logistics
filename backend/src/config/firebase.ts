import * as admin from 'firebase-admin';
import path from 'path';
import dotenv from 'dotenv';

// 환경 변수 설정을 가장 먼저 로드
dotenv.config();

const serviceAccount = require(path.join(process.cwd(), 'service-account-key.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID
});

export const db = admin.firestore();
export default admin; 