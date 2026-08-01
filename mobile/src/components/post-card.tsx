import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useToggleLike } from "@/api/api-hooks/post.api-hook";
import type { Post } from "@/api/query-list/post.query";
import CommentSection from "./comment-section";

type PostCardProps = {
  post: Post;
};

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export function PostCard({ post }: PostCardProps) {
  const { mutate: toggleLike } = useToggleLike();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  useEffect(() => {
    setIsLiked(post.isLiked);
    setLikesCount(post.likesCount);
  }, [post.isLiked, post.likesCount]);

  const handleLike = () => {
    const nextIsLiked = !isLiked;
    setIsLiked(nextIsLiked);
    setLikesCount((prev) => (nextIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    toggleLike(post.id, {
      onError: () => {
        setIsLiked(post.isLiked);
        setLikesCount(post.likesCount);
      },
    });
  };

  const authorName = post.author.username;
  const timeAgo = formatTimeAgo(post.createdAt);

  return (
    <View className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm shadow-slate-200/50 mb-4">
      {/* Post Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3 gap-3">
          <View>
            <Text className="text-sm font-bold text-slate-900">
              {authorName}
            </Text>
            <Text className="text-xs text-slate-400 mt-0.5">{timeAgo}</Text>
          </View>
        </View>
      </View>

      {/* Post Content */}
      <Text className="mt-3 mb-4 text-sm leading-5 text-slate-700 font-normal">
        {post.text}
      </Text>

      {/* Post Footer Actions */}
      <View className="flex-row items-center justify-between pt-1 border-t border-slate-50">
        <View className="flex-row items-center space-x-6 gap-6">
          {/* Like Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center"
            onPress={handleLike}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? "#059669" : "#64748B"}
            />
            <Text
              className={`ml-1.5 text-xs font-semibold ${
                isLiked ? "text-emerald-600" : "text-slate-600"
              }`}
            >
              {likesCount}
            </Text>
          </TouchableOpacity>

          {/* Comment Count */}
          <CommentSection postId={post.id} commentsCount={post.commentsCount} />
        </View>
      </View>
    </View>
  );
}
