import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({
  title = "School Feed",
  subtitle = "Stay updated with everyone.",
}: HeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between pt-2 pb-4">
      {/* Left side greetings */}
      <View>
        <Text className="text-xs font-medium text-slate-500">👋 Hello, Yeasin</Text>
        <Text className="mt-0.5 text-2xl font-bold text-slate-900">{title}</Text>
        <Text className="mt-0.5 text-xs text-slate-400">{subtitle}</Text>
      </View>

      {/* Right side notification bell and avatar */}
      <View className="flex-row items-center space-x-3 gap-3">
        {/* Notification Bell */}
        <TouchableOpacity
          activeOpacity={0.7}
          className="relative p-2"
          onPress={() => router.push("/notifications")}
        >
          <Ionicons name="notifications-outline" size={22} color="#475569" />
          <View className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 border border-white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
