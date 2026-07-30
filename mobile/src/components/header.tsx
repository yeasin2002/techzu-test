import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export function Header() {
  return (
    <View className="flex-row items-center justify-between pt-2 pb-4">
      {/* Left side greetings */}
      <View>
        <Text className="text-xs font-medium text-slate-500">👋 Hello, Yeasin</Text>
        <Text className="mt-0.5 text-2xl font-bold text-slate-900">School Feed</Text>
        <Text className="mt-0.5 text-xs text-slate-400">Stay updated with everyone.</Text>
      </View>

      {/* Right side notification and avatar */}
      <View className="flex-row items-center space-x-3 gap-3">
        {/* Notification Bell */}
        <View className="relative p-2">
          <Ionicons name="notifications-outline" size={22} color="#475569" />
          <View className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-white" />
        </View>

        {/* User Avatar */}
        <View className="relative h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
          <Text className="text-sm font-semibold text-indigo-600">YK</Text>
          {/* Online indicator */}
          <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
        </View>
      </View>
    </View>
  );
}
