import { kyClient } from "@/lib/ky";

export interface PostAuthor {
  id: string;
  username: string;
}

export interface Post {
  id: string;
  text: string;
  author: PostAuthor;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface CreatePostData {
  text: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PostFeedData {
  posts: Post[];
  pagination: PaginationMeta;
}

export interface PostFeedResponse {
  success: boolean;
  message: string;
  data: PostFeedData;
}

export interface PostFilters {
  page?: number;
  limit?: number;
  username?: string;
}

export interface ToggleLikeData {
  postId: string;
  isLiked: boolean;
  likesCount: number;
}

export interface ToggleLikeResponse {
  success: boolean;
  message: string;
  data: ToggleLikeData;
}

export interface CommentUser {
  id: string;
  username: string;
}

export interface Comment {
  id: string;
  postId: string;
  text: string;
  createdAt: string;
  user: CommentUser;
}

export interface CommentListResponse {
  success: boolean;
  message: string;
  data: Comment[];
}

export interface CreateCommentData {
  text: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string;
  data: Comment;
}

export const postApi = {
  create: (data: CreatePostData) =>
    kyClient.post<PostResponse>("posts", data),

  getFeed: (filters?: PostFilters) => {
    const searchParams = new URLSearchParams();
    if (filters?.page !== undefined) searchParams.append("page", String(filters.page));
    if (filters?.limit !== undefined) searchParams.append("limit", String(filters.limit));
    if (filters?.username) searchParams.append("username", filters.username);
    return kyClient.get<PostFeedResponse>("posts", searchParams);
  },

  toggleLike: (id: string) =>
    kyClient.post<ToggleLikeResponse>(`posts/${id}/like`),

  getComments: (id: string) =>
    kyClient.get<CommentListResponse>(`posts/${id}/comments`),

  addComment: (id: string, data: CreateCommentData) =>
    kyClient.post<CreateCommentResponse>(`posts/${id}/comment`, data),

  delete: (id: string) =>
    kyClient.delete<{ success: boolean; message: string }>(`posts/${id}`),
};
