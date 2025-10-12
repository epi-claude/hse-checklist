export interface User {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: User;
}
