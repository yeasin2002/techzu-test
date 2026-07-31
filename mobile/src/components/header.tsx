import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/contexts/auth-context";

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export function Header({
  title = "Social Feed",
  subtitle = "Stay updated with everyone.",
}: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <View className="flex-row items-center justify-between pt-2 pb-4">
      {/* Left side greetings */}
      <View>
        <Text className="text-xs font-medium text-slate-500">
          👋 Hello, {user?.username || "User"}
        </Text>
        <Text className="mt-0.5 text-2xl font-bold text-slate-900">{title}</Text>
        <Text className="mt-0.5 text-xs text-slate-400">{subtitle}</Text>
      </View>

      {/* Right side logout button */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100"
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={18} color="#E11D48" />
        <Text className="text-xs font-semibold text-rose-600">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
