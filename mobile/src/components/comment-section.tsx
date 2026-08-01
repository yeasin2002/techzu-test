import { Ionicons } from "@expo/vector-icons";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { BottomSheet, useBottomSheetAwareHandlers } from "heroui-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useCreateComment, usePostComments } from "@/api/api-hooks/post.api-hook";
import type { Comment } from "@/api/query-list/post.query";

type CommentSectionProps = {
  postId: string;
  commentsCount: number;
};

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return "just now";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function CommentInputFooter({
  postId,
  onCommentSent,
}: {
  postId: string;
  onCommentSent?: () => void;
}) {
  const { onFocus, onBlur } = useBottomSheetAwareHandlers();
  const [text, setText] = useState("");
  const { mutate: createComment, isPending } = useCreateComment();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isPending) return;

    onCommentSent?.();

    createComment(
      { id: postId, data: { text: trimmed } },
      {
        onSuccess: () => {
          setText("");
        },
      },
    );
  };

  return (
    <View className="flex-row items-center gap-2 pt-3 border-t border-slate-100 mt-auto bg-white pb-2">
      <TextInput
        className="flex-1 rounded-xl bg-slate-100 px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400"
        placeholder="Add a comment..."
        placeholderTextColor="#94A3B8"
        value={text}
        onChangeText={setText}
        onFocus={onFocus}
        onBlur={onBlur}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <TouchableOpacity
        activeOpacity={0.8}
        className={`size-9 rounded-xl items-center justify-center ${
          text.trim() && !isPending ? "bg-emerald-600" : "bg-slate-200"
        }`}
        disabled={!text.trim() || isPending}
        onPress={handleSend}
      >
        {isPending ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Ionicons
            name="send"
            size={16}
            color={text.trim() ? "#FFFFFF" : "#94A3B8"}
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

export function CommentSection({ postId, commentsCount: initialCommentsCount }: CommentSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(initialCommentsCount);

  useEffect(() => {
    setCount(initialCommentsCount);
  }, [initialCommentsCount]);

  const { data: comments, isLoading } = usePostComments(isOpen ? postId : undefined);

  useEffect(() => {
    if (comments && comments.length > count) {
      setCount(comments.length);
    }
  }, [comments]);

  const renderItem = ({ item }: { item: Comment }) => {
    const username = item.user?.username || "User";
    const userInitials = username.substring(0, 2).toUpperCase();

    return (
      <View className="flex-row gap-3 py-3 border-b border-slate-100">
        {/* Avatar Circle */}
        <View className="size-9 rounded-full bg-emerald-100 items-center justify-center">
          <Text className="text-xs font-bold text-emerald-800">
            {userInitials}
          </Text>
        </View>

        {/* Comment Body */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold text-slate-900">
              {username}
            </Text>
            <Text className="text-[10px] text-slate-400">
              {formatTimeAgo(item.createdAt)}
            </Text>
          </View>
          <Text className="text-xs leading-4 text-slate-700 mt-1 font-normal">
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <BottomSheet isOpen={isOpen} onOpenChange={setIsOpen}>
      <BottomSheet.Trigger asChild>
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center"
          onPress={() => setIsOpen(true)}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#64748B" />
          <Text className="ml-1.5 text-xs font-semibold text-slate-600">
            {count}
          </Text>
        </TouchableOpacity>
      </BottomSheet.Trigger>

      <BottomSheet.Portal>
        <BottomSheet.Overlay />
        <BottomSheet.Content
          snapPoints={["80%"]}
          enableOverDrag={false}
          enableDynamicSizing={false}
          keyboardBehavior="extend"
          contentContainerClassName="h-full px-4 pb-6"
        >
          {/* Bottom Sheet Header */}
          <View className="flex-row items-center justify-between py-3 border-b border-slate-100 mb-2">
            <BottomSheet.Title className="text-base font-bold text-slate-900">
              Comments ({count})
            </BottomSheet.Title>
            <BottomSheet.Close />
          </View>

          {/* Comments List */}
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-8">
              <ActivityIndicator size="small" color="#059669" />
            </View>
          ) : (
            <BottomSheetFlatList
              data={comments || []}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              keyboardShouldPersistTaps="handled"
              contentContainerClassName="pb-4"
              ListEmptyComponent={
                <View className="items-center justify-center py-10">
                  <Ionicons name="chatbubbles-outline" size={36} color="#CBD5E1" />
                  <Text className="text-xs text-slate-400 mt-2 text-center">
                    No comments yet. Be the first to comment!
                  </Text>
                </View>
              }
            />
          )}

          {/* Keyboard Aware Comment Input Footer */}
          <CommentInputFooter
            postId={postId}
            onCommentSent={() => setCount((prev) => prev + 1)}
          />
        </BottomSheet.Content>
      </BottomSheet.Portal>
    </BottomSheet>
  );
}

export default CommentSection;