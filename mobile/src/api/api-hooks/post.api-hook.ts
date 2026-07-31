import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage, toast } from "@/lib";
import {
  postApi,
  type CreateCommentData,
  type CreatePostData,
  type PostFeedResponse,
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
      if (response?.data) {
        // Prepend new post into active feed cache instantly
        queryClient.setQueriesData<PostFeedResponse>(
          { queryKey: POST_KEYS.all() },
          (old) => {
            if (!old || !old.data) return old;
            const newPost = response.data;
            if (old.data.posts.some((p) => p.id === newPost.id)) return old;
            return {
              ...old,
              data: {
                ...old.data,
                posts: [newPost, ...old.data.posts],
                pagination: {
                  ...old.data.pagination,
                  total: (old.data.pagination.total || 0) + 1,
                },
              },
            };
          },
        );
      }
      // Re-fetch posts & user profile stats in background to ensure sync
      await queryClient.invalidateQueries({
        queryKey: POST_KEYS.all(),
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["auth"],
        refetchType: "all",
      });
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

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => postApi.delete(id),
    onSuccess: async (response, postId) => {
      // Optimistically filter out deleted post from feed cache
      queryClient.setQueriesData<PostFeedResponse>(
        { queryKey: POST_KEYS.all() },
        (old) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              posts: old.data.posts.filter((p) => p.id !== postId),
              pagination: {
                ...old.data.pagination,
                total: Math.max(0, (old.data.pagination.total || 0) - 1),
              },
            },
          };
        },
      );
      await queryClient.invalidateQueries({
        queryKey: POST_KEYS.all(),
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["auth"],
        refetchType: "all",
      });
      toast.success(response.message || "Post deleted successfully");
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(error, "Failed to delete post");
      toast.error(message);
    },
  });
};
