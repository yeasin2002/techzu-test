import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage, toast } from "@/lib";
import {
  postApi,
  type CreateCommentData,
  type CreatePostData,
  type PostFilters,
} from "../query-list/post.query";

const POST_KEYS = {
  all: () => ["posts"] as const,
  lists: () => ["posts", "list"] as const,
  list: (filters?: PostFilters) => ["posts", "list", filters] as const,
  comments: (id: string) => ["posts", "detail", id, "comments"] as const,
};

export const usePostFeed = (filters?: PostFilters) => {
  return useQuery({
    queryKey: POST_KEYS.list(filters),
    queryFn: () => postApi.getFeed(filters),
    select: (response) => response.data,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostData) => postApi.create(data),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: POST_KEYS.all() });
      toast.success(response.message || "Post created successfully");
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(error, "Failed to create post");
      toast.error(message);
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postApi.toggleLike(id),
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: POST_KEYS.all() });
      toast.success(response.message || "Updated post like");
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(error, "Failed to toggle like");
      toast.error(message);
    },
  });
};

export const usePostComments = (id?: string) => {
  return useQuery({
    queryKey: POST_KEYS.comments(id ?? "unknown"),
    queryFn: () => postApi.getComments(id!),
    enabled: !!id,
    select: (response) => response.data,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateCommentData }) =>
      postApi.addComment(id, data),
    onSuccess: async (response, variables) => {
      await queryClient.invalidateQueries({ queryKey: POST_KEYS.comments(variables.id) });
      await queryClient.invalidateQueries({ queryKey: POST_KEYS.all() });
      toast.success(response.message || "Comment added successfully");
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(error, "Failed to add comment");
      toast.error(message);
    },
  });
};
