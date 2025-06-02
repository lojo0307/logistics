export enum UserRole {
  PACKING = 'PACKING',    // 포장
  INSPECTION = 'INSPECTION',  // 검수
  ADMIN = 'ADMIN'     // 관리자
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginDto {
  username: string;
  password: string;
} 