import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type PostCardProps = {
  authorName?: string;
  timeAgo?: string;
  avatarText?: string;
  avatarBgColor?: string;
  avatarTextColor?: string;
  content?: string;
  likesCount?: number;
  commentsCount?: number;
};

export function PostCard({
  authorName = "John Doe",
  timeAgo = "2 minutes ago",
  avatarText = "JD",
  avatarBgColor = "bg-emerald-100",
  avatarTextColor = "text-emerald-700",
  content = "Our group presentation went really well today!\nProud of the teamwork and effort everyone put in. 🙌",
  likesCount = 12,
  commentsCount = 5,
}: PostCardProps) {
  return (
    <View className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm shadow-slate-200/50 mb-4">
      {/* Post Header */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center space-x-3 gap-3">
          {/* Avatar */}
          <View className={`h-10 w-10 items-center justify-center rounded-full ${avatarBgColor}`}>
            <Text className={`text-sm font-semibold ${avatarTextColor}`}>{avatarText}</Text>
          </View>

          {/* Author info */}
          <View>
            <Text className="text-sm font-bold text-slate-900">{authorName}</Text>
            <View className="flex-row items-center space-x-1 gap-1 mt-0.5">
              <Text className="text-xs text-slate-400">{timeAgo}</Text>
              <Ionicons name="earth" size={12} color="#94A3B8" />
            </View>
          </View>
        </View>

        {/* Options Menu Button */}
        <TouchableOpacity activeOpacity={0.7} className="p-1">
          <Ionicons name="ellipsis-horizontal" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text className="mt-3 mb-4 text-sm leading-5 text-slate-700 font-normal">
        {content}
      </Text>

      {/* Post Footer Actions */}
      <View className="flex-row items-center justify-between pt-1">
        <View className="flex-row items-center space-x-6 gap-6">
          {/* Like Button (Smooth Emerald Green Heart) */}
          <TouchableOpacity activeOpacity={0.7} className="flex-row items-center">
            <Ionicons name="heart" size={20} color="#059669" />
            <Text className="ml-1.5 text-xs font-semibold text-slate-600">{likesCount}</Text>
          </TouchableOpacity>

          {/* Comment Button */}
          <TouchableOpacity activeOpacity={0.7} className="flex-row items-center">
            <Ionicons name="chatbubble-outline" size={18} color="#64748B" />
            <Text className="ml-1.5 text-xs font-semibold text-slate-600">{commentsCount}</Text>
          </TouchableOpacity>
        </View>

        {/* Bookmark Button */}
        <TouchableOpacity activeOpacity={0.7} className="p-1">
          <Ionicons name="bookmark-outline" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
