import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useCreatePost } from "@/api/api-hooks/post.api-hook";

const MAX_CHARS = 300;

export function CreatePostCard() {
  const [text, setText] = useState("");
  const { mutate: createPost, isPending } = useCreatePost();

  const handlePost = () => {
    const trimmed = text.trim();
    if (!trimmed || isPending || trimmed.length > MAX_CHARS) return;

    createPost(
      { text: trimmed },
      {
        onSuccess: () => {
          setText("");
        },
      },
    );
  };

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSubmit = text.trim().length > 0 && !isPending && !isOverLimit;

  return (
    <View className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm shadow-slate-200/50">
      {/* Text Input */}
      <View className="min-h-20">
        <TextInput
          className="text-sm text-slate-800 placeholder:text-slate-400 p-0"
          maxLength={MAX_CHARS}
          multiline
          onChangeText={setText}
          placeholder="What's happening today?"
          placeholderTextColor="#94A3B8"
          textAlignVertical="top"
          value={text}
        />
      </View>

      {/* Divider */}
      <View className="h-px bg-slate-100 my-3" />

      {/* Bottom Actions Row */}
      <View className="flex-row items-center justify-between">
        <Text
          className={`text-xs font-medium ${
            isOverLimit ? "text-red-500 font-bold" : "text-slate-400"
          }`}
        >
          {charCount} / {MAX_CHARS}
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          className={`rounded-xl px-5 py-2.5 flex-row items-center justify-center min-w-[76px] ${
            canSubmit ? "bg-emerald-600" : "bg-emerald-300"
          }`}
          disabled={!canSubmit}
          onPress={handlePost}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text className="text-sm font-semibold text-white">Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
