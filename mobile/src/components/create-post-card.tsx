import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export function CreatePostCard() {
  return (
    <View className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm shadow-slate-200/50">
      {/* Top Input Row */}
      <View className="flex-row items-center">
        {/* Avatar */}
        <View className="relative h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <Text className="text-sm font-semibold text-emerald-700">YK</Text>
          <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
        </View>

        {/* Input */}
        <TextInput
          className="flex-1 ml-3 text-sm text-slate-800 placeholder:text-slate-400 p-0"
          multiline
          placeholder="What's happening today?"
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Divider */}
      <View className="h-px bg-slate-100 my-3" />

      {/* Bottom Actions Row */}
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-medium text-slate-400">0 / 300</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-xl bg-emerald-600 px-5 py-2"
        >
          <Text className="text-sm font-semibold text-white">Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
