import { FlashList } from "@shopify/flash-list";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { usePostFeed } from "@/api/api-hooks/post.api-hook";
import type { Post } from "@/api/query-list/post.query";
import {
  BottomTabBar,
  CreatePostCard,
  Header,
  PostCard,
  PostCardSkeleton,
} from "@/components";
import { useAuth } from "@/contexts/auth-context";

export default function FeedPage() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: feedData, isLoading, isRefetching, refetch } = usePostFeed();

  const posts = feedData?.posts ?? [];

  const renderHeader = () => (
    <View>
      {/* Top Header */}
      <Header />

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
          No posts yet
        </Text>
        <Text className="text-xs text-slate-400 text-center mt-1">
          Be the first to share an update with the community!
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Post }) => {
    const isOwnPost =
      Boolean(user?.id && item.author.id === user.id) ||
      Boolean(user?.username && item.author.username === user.username);

    return <PostCard isOwnPost={isOwnPost} post={item} />;
  };

  return (
    <View className="flex-1 bg-slate-50">
      <View className="flex-1">
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

      {/* Fixed Bottom Navigation */}
      <BottomTabBar activeTab="feed" />
    </View>
  );
}
