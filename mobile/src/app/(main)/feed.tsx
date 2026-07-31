import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePostFeed } from "@/api/api-hooks/post.api-hook";
import type { Post } from "@/api/query-list/post.query";
import {
  CreatePostCard,
  Header,
  PostCard,
  PostCardSkeleton,
} from "@/components";

export default function FeedPage() {
  const insets = useSafeAreaInsets();
  const [usernameFilter, setUsernameFilter] = useState("");
  const {
    data: feedData,
    isLoading,
    isRefetching,
    refetch,
  } = usePostFeed(usernameFilter.trim() ? { username: usernameFilter.trim() } : undefined);

  const posts = feedData?.posts ?? [];

  const renderHeader = () => (
    <View>
      {/* Top Header */}
      <Header />

      {/* Username Filter Search Bar */}
      <View className="flex-row items-center rounded-2xl bg-white px-4 py-3 border border-slate-100 shadow-sm shadow-slate-200/50 mb-4">
        <Ionicons name="search-outline" size={20} color="#94A3B8" />
        <TextInput
          className="flex-1 ml-3 text-sm text-slate-800 placeholder:text-slate-400 p-0"
          onChangeText={setUsernameFilter}
          placeholder="Filter feed by username..."
          placeholderTextColor="#94A3B8"
          value={usernameFilter}
        />
        {Boolean(usernameFilter) && (
          <Ionicons
            color="#94A3B8"
            name="close-circle"
            onPress={() => setUsernameFilter("")}
            size={18}
          />
        )}
      </View>

      {/* Create Post Card */}
      <View className="mb-4">
        <CreatePostCard />
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View>
          <PostCardSkeleton />
          <PostCardSkeleton />
          <PostCardSkeleton />
        </View>
      );
    }

    return (
      <View className="items-center justify-center py-12 px-4 rounded-2xl bg-white border border-slate-100 my-2">
        <Text className="text-base font-semibold text-slate-800">
          No posts found
        </Text>
        <Text className="text-xs text-slate-400 text-center mt-1">
          {usernameFilter
            ? `No posts found for user "@${usernameFilter}"`
            : "Be the first to share an update with the community!"}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Post }) => {
    return <PostCard post={item} />;
  };

  return (
    <View className="flex-1 bg-slate-50">
      <FlashList
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: 24,
          paddingHorizontal: 16,
        }}
        data={isLoading ? [] : posts}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={renderEmpty}
        ListHeaderComponent={renderHeader}
        onRefresh={refetch}
        refreshing={isRefetching}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
