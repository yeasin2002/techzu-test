import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function BottomTabBar() {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-white border-t border-slate-100 px-8 py-2 flex-row items-center justify-between shadow-lg shadow-slate-200"
      style={{
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      {/* Feed Tab */}
      <TouchableOpacity activeOpacity={0.7} className="items-center justify-center flex-1">
        <Ionicons name="home-outline" size={22} color="#4F46E5" />
        <Text className="text-xs font-semibold text-indigo-600 mt-1">Feed</Text>
      </TouchableOpacity>

      {/* Create Post Tab (Central Floating Button) */}
      <TouchableOpacity activeOpacity={0.8} className="items-center justify-center flex-1">
        <View className="h-14 w-14 -mt-7 items-center justify-center rounded-full bg-indigo-600 border-4 border-white shadow-lg shadow-indigo-600/40">
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </View>
        <Text className="text-xs font-semibold text-indigo-600 mt-0.5">Create</Text>
      </TouchableOpacity>

      {/* Notifications Tab */}
      <TouchableOpacity activeOpacity={0.7} className="items-center justify-center flex-1">
        <Ionicons name="notifications-outline" size={22} color="#94A3B8" />
        <Text className="text-xs font-medium text-slate-400 mt-1">Notifications</Text>
      </TouchableOpacity>
    </View>
  );
}
