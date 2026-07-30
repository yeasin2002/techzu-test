import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabBar, Header } from "@/components";

export default function ProfilePage() {
  const insets = useSafeAreaInsets();

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
            <Text className="text-2xl font-bold text-emerald-700">YK</Text>
            <View className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
          </View>

          {/* User Info */}
          <Text className="text-xl font-bold text-slate-900">Yeasin</Text>
          <Text className="text-xs font-medium text-slate-400 mt-0.5">
            @yeasin2002 • Computer Science
          </Text>

          {/* Stats Row */}
          <View className="flex-row items-center justify-around w-full mt-6 pt-5 border-t border-slate-100">
            <View className="items-center">
              <Text className="text-base font-bold text-slate-900">12</Text>
              <Text className="text-xs text-slate-400 mt-0.5">Posts</Text>
            </View>
            <View className="h-6 w-px bg-slate-100" />
            <View className="items-center">
              <Text className="text-base font-bold text-slate-900">148</Text>
              <Text className="text-xs text-slate-400 mt-0.5">Likes</Text>
            </View>
            <View className="h-6 w-px bg-slate-100" />
            <View className="items-center">
              <Text className="text-base font-bold text-slate-900">34</Text>
              <Text className="text-xs text-slate-400 mt-0.5">Comments</Text>
            </View>
          </View>
        </View>

        {/* Profile Options List */}
        <View className="mt-4 gap-3">
          {[
            { icon: "person-outline" as const, title: "Edit Profile" },
            { icon: "notifications-outline" as const, title: "Push Notification Settings" },
            { icon: "shield-checkmark-outline" as const, title: "Privacy & Security" },
            { icon: "help-circle-outline" as const, title: "Help & Support" },
          ].map((item) => (
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center justify-between rounded-2xl bg-white p-4 border border-slate-100 shadow-sm shadow-slate-200/40"
              key={item.title}
            >
              <View className="flex-row items-center space-x-3 gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Ionicons name={item.icon} size={20} color="#059669" />
                </View>
                <Text className="text-sm font-semibold text-slate-800">
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomTabBar activeTab="profile" />
    </View>
  );
}
