import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomTabBarProps = {
  activeTab?: "feed" | "create" | "notifications";
};

export function BottomTabBar({ activeTab = "feed" }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isFeed = activeTab === "feed";
  const isCreate = activeTab === "create";
  const isNotifications = activeTab === "notifications";

  return (
    <View
      className="bg-white border-t border-slate-100 px-8 py-2 flex-row items-center justify-between shadow-lg shadow-slate-200"
      style={{
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      {/* Feed Tab */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="items-center justify-center flex-1"
        onPress={() => router.push("/feed")}
      >
        <Ionicons
          name={isFeed ? "home" : "home-outline"}
          size={22}
          color={isFeed ? "#059669" : "#94A3B8"}
        />
        <Text
          className={`text-xs mt-1 ${
            isFeed ? "font-semibold text-emerald-600" : "font-medium text-slate-400"
          }`}
        >
          Feed
        </Text>
      </TouchableOpacity>

      {/* Create Post Tab (Central Floating Button) */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="items-center justify-center flex-1"
        onPress={() => router.push("/create-post")}
      >
        <View className="h-14 w-14 -mt-7 items-center justify-center rounded-full bg-emerald-600 border-4 border-white shadow-lg shadow-emerald-600/30">
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </View>
        <Text
          className={`text-xs mt-0.5 ${
            isCreate ? "font-bold text-emerald-700" : "font-semibold text-emerald-600"
          }`}
        >
          Create
        </Text>
      </TouchableOpacity>

      {/* Notifications Tab */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="items-center justify-center flex-1"
        onPress={() => router.push("/notifications")}
      >
        <Ionicons
          name={isNotifications ? "notifications" : "notifications-outline"}
          size={22}
          color={isNotifications ? "#059669" : "#94A3B8"}
        />
        <Text
          className={`text-xs mt-1 ${
            isNotifications
              ? "font-semibold text-emerald-600"
              : "font-medium text-slate-400"
          }`}
        >
          Notifications
        </Text>
      </TouchableOpacity>
    </View>
  );
}
