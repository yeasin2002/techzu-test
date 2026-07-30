import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export type NotificationType = "like" | "comment";

type NotificationCardProps = {
  userName: string;
  type: NotificationType;
  message: string;
  timeAgo: string;
  isUnread?: boolean;
  avatarText?: string;
  avatarBgColor?: string;
  avatarTextColor?: string;
};

export function NotificationCard({
  userName,
  type,
  message,
  timeAgo,
  isUnread = false,
  avatarText = "JD",
  avatarBgColor = "bg-emerald-100",
  avatarTextColor = "text-emerald-700",
}: NotificationCardProps) {
  const isLike = type === "like";

  return (
    <View
      className={`rounded-2xl p-4 mb-3 border shadow-sm shadow-slate-200/40 flex-row items-start justify-between ${
        isUnread
          ? "bg-white border-emerald-200"
          : "bg-white border-slate-100"
      }`}
    >
      <View className="flex-row items-start space-x-3 gap-3 flex-1">
        {/* User Avatar with Type Badge */}
        <View className="relative">
          <View className={`h-11 w-11 items-center justify-center rounded-full ${avatarBgColor}`}>
            <Text className={`text-sm font-semibold ${avatarTextColor}`}>{avatarText}</Text>
          </View>

          {/* Type Badge (Emerald Heart or Teal Comment) */}
          <View
            className={`absolute -bottom-1 -right-1 h-5 w-5 items-center justify-center rounded-full border-2 border-white ${
              isLike ? "bg-emerald-500" : "bg-teal-500"
            }`}
          >
            <Ionicons
              name={isLike ? "heart" : "chatbubble"}
              size={10}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Details */}
        <View className="flex-1">
          <Text className="text-sm text-slate-800 leading-5">
            <Text className="font-bold text-slate-900">{userName}</Text>{" "}
            {isLike ? "liked your post" : "commented on your post"}
          </Text>

          {/* Message snippet */}
          <Text className="text-xs text-slate-500 mt-1 italic" numberOfLines={2}>
            "{message}"
          </Text>

          {/* Timestamp & Tag */}
          <View className="flex-row items-center space-x-2 gap-2 mt-2">
            <Text className="text-[11px] font-medium text-slate-400">{timeAgo}</Text>
            <View className="h-1 w-1 rounded-full bg-slate-300" />
            <Text className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              FCM Push
            </Text>
          </View>
        </View>
      </View>

      {/* Unread Dot Indicator */}
      {isUnread && (
        <View className="h-2.5 w-2.5 rounded-full bg-emerald-600 mt-1.5 ml-2" />
      )}
    </View>
  );
}
