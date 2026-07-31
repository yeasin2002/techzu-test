import { kyClient } from "@/lib/ky";

export interface UserStats {
  postsCount: number;
  likesCount: number;
  commentsCount: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  username: string;
  createdAt: string;
  stats?: UserStats;
}

export interface AuthData {
  user: User;
  token: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface SignupData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  fcmToken?: string;
}

export interface LoginData {
  username: string;
  password: string;
  fcmToken?: string;
}

export const authApi = {
  signup: (data: SignupData) => kyClient.post<AuthResponse>("auth/signup", data),
  login: (data: LoginData) => kyClient.post<AuthResponse>("auth/login", data),
  getMe: () => kyClient.get<UserProfileResponse>("auth/me"),
};
