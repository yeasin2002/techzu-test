import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabBar, Header } from "@/components";
import { useAuth } from "@/contexts/auth-context";

export default function ProfilePage() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      queryClient.clear();
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fullName = user?.fullName ?? "User Profile";
  const username = user?.username ?? "";
  const email = user?.email ?? "";
  const initials = (user?.fullName || user?.username || "U")
    .slice(0, 2)
    .toUpperCase();

  const postsCount = user?.stats?.postsCount ?? 0;
  const likesCount = user?.stats?.likesCount ?? 0;
  const commentsCount = user?.stats?.commentsCount ?? 0;

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header subtitle="Manage your profile & preferences" title="Profile" />

        {/* Profile Card */}
        <View className="rounded-2xl bg-white p-6 border border-slate-100 shadow-sm shadow-slate-200/50 items-center mt-2">
          {/* Avatar */}
          <View className="relative h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-3">
            <Text className="text-2xl font-bold text-emerald-700">{initials}</Text>
            <View className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
          </View>

          {/* User Info */}
          <Text className="text-xl font-bold text-slate-900">{fullName}</Text>
          {Boolean(username) && (
            <Text className="text-xs font-semibold text-emerald-600 mt-0.5">
              @{username}
            </Text>
          )}
          {Boolean(email) && (
            <Text className="text-xs font-medium text-slate-400 mt-0.5">
              {email}
            </Text>
          )}

          {/* Stats Row */}
          <View className="flex-row items-center justify-around w-full mt-6 pt-5 border-t border-slate-100">
            <View className="items-center">
              <Text className="text-base font-bold text-slate-900">{postsCount}</Text>
              <Text className="text-xs text-slate-400 mt-0.5">Posts</Text>
            </View>
            <View className="h-6 w-px bg-slate-100" />
            <View className="items-center">
              <Text className="text-base font-bold text-slate-900">{likesCount}</Text>
              <Text className="text-xs text-slate-400 mt-0.5">Likes</Text>
            </View>
            <View className="h-6 w-px bg-slate-100" />
            <View className="items-center">
              <Text className="text-base font-bold text-slate-900">{commentsCount}</Text>
              <Text className="text-xs text-slate-400 mt-0.5">Comments</Text>
            </View>
          </View>
        </View>

        {/* Profile Options List */}
        <View className="mt-4 gap-3">
          <ProfileOptions
            icon={`log-out-outline`}
            title={`Logout`}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomTabBar activeTab="profile" />
    </View>
  );
}

export const ProfileOptions = ({
  icon,
  title,
  onPress = () => {},
}: {
  icon: string;
  title: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      // activeOpacity={0.7}
      className="flex-row items-center justify-between rounded-2xl bg-white p-4 border border-slate-100 shadow-sm shadow-slate-200/40"
      key={title}
      onPress={onPress}
    >
      <View className="flex-row items-center space-x-3 gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
          <Ionicons name={icon as any} size={20} color="#059669" />
        </View>
        <Text className="text-sm font-semibold text-slate-800">{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
    </Pressable>
  );
};
