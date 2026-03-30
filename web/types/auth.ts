export type UserRole =
  | 'CEO'
  | 'EXECUTIVE'
  | 'PM'
  | 'FIELD_MANAGER'
  | 'MATERIAL_TEAM'
  | 'HR_TEAM'
  | 'EMPLOYEE'
  | 'CONTRACT_WORKER'
  | 'GUEST';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'LOCKED' | 'PENDING';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  department?: string;
  position?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
  };
}
