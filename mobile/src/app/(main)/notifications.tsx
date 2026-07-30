import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabBar, Header, NotificationCard } from "@/components";

export default function NotificationsPage() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");

  const sampleNotifications = [
    {
      id: "1",
      userName: "John Doe",
      type: "like" as const,
      message: "Our group presentation went really well today! Proud of the teamwork.",
      timeAgo: "2m ago",
      isUnread: true,
      avatarText: "JD",
      avatarBgColor: "bg-emerald-100",
      avatarTextColor: "text-emerald-700",
    },
    {
      id: "2",
      userName: "Sarah Malik",
      type: "comment" as const,
      message: "Great reminder! I will prepare the notes for tomorrow's quiz.",
      timeAgo: "15m ago",
      isUnread: true,
      avatarText: "SM",
      avatarBgColor: "bg-amber-100",
      avatarTextColor: "text-amber-700",
    },
    {
      id: "3",
      userName: "Arafat Rahman",
      type: "like" as const,
      message: "Just finished the library project. It's been a long journey...",
      timeAgo: "1h ago",
      isUnread: true,
      avatarText: "AR",
      avatarBgColor: "bg-purple-100",
      avatarTextColor: "text-purple-700",
    },
    {
      id: "4",
      userName: "Mim Naz",
      type: "comment" as const,
      message: "Count me in! Studying outside sounds amazing today ☀️",
      timeAgo: "3h ago",
      isUnread: false,
      avatarText: "MN",
      avatarBgColor: "bg-sky-100",
      avatarTextColor: "text-sky-700",
    },
    {
      id: "5",
      userName: "John Doe",
      type: "comment" as const,
      message: "Thanks everyone for the great feedback on the presentation!",
      timeAgo: "5h ago",
      isUnread: false,
      avatarText: "JD",
      avatarBgColor: "bg-emerald-100",
      avatarTextColor: "text-emerald-700",
    },
  ];

  const filteredNotifications =
    activeFilter === "unread"
      ? sampleNotifications.filter((n) => n.isUnread)
      : sampleNotifications;

  return (
    <View className="flex-1 bg-slate-50">
      {/* Main Scrollable Content */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header
          subtitle="Push alerts & post interactions"
          title="Notifications"
        />

        {/* Filter Pills & Actions Bar */}
        <View className="flex-row items-center justify-between my-3">
          <View className="flex-row items-center space-x-2 gap-2">
            <TouchableOpacity
              activeOpacity={0.7}
              className={`px-4 py-2 rounded-xl border ${
                activeFilter === "all"
                  ? "bg-emerald-600 border-emerald-600"
                  : "bg-white border-slate-200"
              }`}
              onPress={() => setActiveFilter("all")}
            >
              <Text
                className={`text-xs font-semibold ${
                  activeFilter === "all" ? "text-white" : "text-slate-600"
                }`}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              className={`px-4 py-2 rounded-xl border flex-row items-center space-x-1.5 gap-1.5 ${
                activeFilter === "unread"
                  ? "bg-emerald-600 border-emerald-600"
                  : "bg-white border-slate-200"
              }`}
              onPress={() => setActiveFilter("unread")}
            >
              <Text
                className={`text-xs font-semibold ${
                  activeFilter === "unread" ? "text-white" : "text-slate-600"
                }`}
              >
                Unread
              </Text>
              <View className="h-4 w-4 items-center justify-center rounded-full bg-emerald-700">
                <Text className="text-[10px] font-bold text-white">3</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity activeOpacity={0.7} className="flex-row items-center p-1">
            <Ionicons name="checkmark-done" size={16} color="#059669" />
            <Text className="text-xs font-semibold text-emerald-600 ml-1">
              Mark read
            </Text>
          </TouchableOpacity>
        </View>

        {/* Notification Cards List */}
        <View className="mt-2">
          {filteredNotifications.map((item) => (
            <NotificationCard
              avatarBgColor={item.avatarBgColor}
              avatarText={item.avatarText}
              avatarTextColor={item.avatarTextColor}
              isUnread={item.isUnread}
              key={item.id}
              message={item.message}
              timeAgo={item.timeAgo}
              type={item.type}
              userName={item.userName}
            />
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomTabBar activeTab="notifications" />
    </View>
  );
}
