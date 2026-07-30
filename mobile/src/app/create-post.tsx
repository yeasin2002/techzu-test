import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabBar, Header } from "@/components";

export default function CreatePostPage() {
  const insets = useSafeAreaInsets();
  const [postText, setPostText] = useState("");

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Header
          subtitle="Share an update or announcement"
          title="Create Post"
        />

        {/* Main Compose Card */}
        <View className="rounded-2xl bg-white p-5 border border-slate-100 shadow-sm shadow-slate-200/50 mt-2">
          {/* User Meta Row */}
          <View className="flex-row items-center space-x-3 gap-3 mb-4">
            <View className="relative h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
              <Text className="text-sm font-semibold text-emerald-700">YK</Text>
              <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
            </View>

            <View>
              <Text className="text-sm font-bold text-slate-900">Yeasin</Text>
              <View className="flex-row items-center space-x-1 gap-1 mt-0.5">
                <Ionicons name="earth" size={12} color="#94A3B8" />
                <Text className="text-xs text-slate-400">Public • School Feed</Text>
              </View>
            </View>
          </View>

          {/* Text Input Area */}
          <TextInput
            className="min-h-[140px] text-base text-slate-800 placeholder:text-slate-400 p-0"
            maxLength={300}
            multiline
            onChangeText={setPostText}
            placeholder="What's happening today? Share your thoughts, project updates, or announcements..."
            placeholderTextColor="#94A3B8"
            textAlignVertical="top"
            value={postText}
          />

          {/* Divider */}
          <View className="h-px bg-slate-100 my-4" />

          {/* Action Tools & Counter */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center space-x-3 gap-3">
              <TouchableOpacity activeOpacity={0.7} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Ionicons name="happy-outline" size={20} color="#64748B" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <Ionicons name="document-text-outline" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs font-medium text-slate-400">
              {postText.length} / 300
            </Text>
          </View>

          {/* Publish Post Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            className={`rounded-xl py-3.5 items-center justify-center shadow-md ${
              postText.trim().length > 0
                ? "bg-emerald-600 shadow-emerald-600/30"
                : "bg-emerald-400 shadow-emerald-400/20"
            }`}
          >
            <Text className="text-sm font-bold text-white">Publish Post</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomTabBar activeTab="create" />
    </View>
  );
}
