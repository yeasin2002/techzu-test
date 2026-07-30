import { kyClient } from "@/lib/ky";

export interface UserItem {
  id: string;
  username: string;
  fcmToken?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  data: UserItem[];
}

export const userApi = {
  getAll: () => kyClient.get<UserListResponse>("users"),
};
