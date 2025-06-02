import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { CreateUserDto, LoginDto, User, UserRole } from '../types/user';
import bcrypt from 'bcrypt';
import { db } from '../config/firebase';

const router = Router();

// 회원가입
router.post('/register', async (req, res) => {
  try {
    console.log('회원가입 요청 데이터:', req.body);
    
    const { username, password, name, role }: CreateUserDto = req.body;

    // 입력값 검증
    if (!username || !password || !name || !role) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    // role 값 검증
    if (!Object.values(UserRole).includes(role as UserRole)) {
      return res.status(400).json({ message: '유효하지 않은 role 값입니다.' });
    }

    // 사용자 이름 중복 체크
    const userSnapshot = await db.collection('users')
      .where('username', '==', username)
      .get();

    if (!userSnapshot.empty) {
      return res.status(400).json({ message: '이미 존재하는 사용자 이름입니다.' });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      username,
      password: hashedPassword,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('저장할 사용자 데이터:', { ...userData, password: '***' });

    // 사용자 정보 저장
    const userDoc = await db.collection('users').add(userData);

    const user: Partial<User> = {
      id: userDoc.id,
      username,
      name,
      role: role as UserRole
    };

    // JWT 토큰 생성
    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.status(201).json({ user, token });
  } catch (error) {
    console.error('회원가입 에러 상세:', error);
    res.status(500).json({ 
      message: '회원가입 중 오류가 발생했습니다.',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password }: LoginDto = req.body;

    // 사용자 찾기
    const userSnapshot = await db.collection('users')
      .where('username', '==', username)
      .get();

    if (userSnapshot.empty) {
      return res.status(401).json({ message: '사용자 이름 또는 비밀번호가 잘못되었습니다.' });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: '사용자 이름 또는 비밀번호가 잘못되었습니다.' });
    }

    const user: Partial<User> = {
      id: userDoc.id,
      username: userData.username,
      name: userData.name,
      role: userData.role as UserRole
    };

    // JWT 토큰 생성
    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '1d' });

    res.json({ user, token });
  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '로그인 중 오류가 발생했습니다.' });
  }
});

export default router; 