import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomTabBarProps = {
  activeTab?: "feed" | "notifications" | "profile";
};

export function BottomTabBar({ activeTab = "feed" }: BottomTabBarProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isFeed = activeTab === "feed";
  const isNotifications = activeTab === "notifications";
  const isProfile = activeTab === "profile";

  return (
    <View
      className="bg-white border-t border-slate-100 px-6 py-2 flex-row items-center justify-around shadow-lg shadow-slate-200"
      style={{
        paddingBottom: Math.max(insets.bottom, 12),
      }}
    >
      {/* Feed Tab */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="items-center justify-center flex-1 py-1"
        onPress={() => router.push("/feed")}
      >
        <Ionicons
          name={isFeed ? "home" : "home-outline"}
          size={22}
          color={isFeed ? "#059669" : "#94A3B8"}
        />
        <Text
          className={`text-xs mt-1 ${
            isFeed
              ? "font-semibold text-emerald-600"
              : "font-medium text-slate-400"
          }`}
        >
          Feed
        </Text>
      </TouchableOpacity>

      {/* Notifications Tab */}
      {/* <TouchableOpacity
        activeOpacity={0.7}
        className="items-center justify-center flex-1 py-1"
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
      </TouchableOpacity> */}

      {/* Profile Tab */}
      <TouchableOpacity
        activeOpacity={0.7}
        className="items-center justify-center flex-1 py-1"
        onPress={() => router.push("/profile")}
      >
        <Ionicons
          name={isProfile ? "person" : "person-outline"}
          size={22}
          color={isProfile ? "#059669" : "#94A3B8"}
        />
        <Text
          className={`text-xs mt-1 ${
            isProfile
              ? "font-semibold text-emerald-600"
              : "font-medium text-slate-400"
          }`}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
