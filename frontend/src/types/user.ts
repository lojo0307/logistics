export enum UserRole {
  PACKING = 'PACKING',
  INSPECTION = 'INSPECTION',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
} 