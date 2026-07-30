import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  BottomTabBar,
  CreatePostCard,
  Header,
  PostCard,
  SearchBar,
} from "@/components";

export default function HomePage() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-slate-50">
      {/* Scrollable Feed Body */}
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 16),
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Header */}
        <Header />

        {/* Search Bar */}
        <View className="my-3">
          <SearchBar />
        </View>

        {/* Create Post Card */}
        <View className="mb-4">
          <CreatePostCard />
        </View>

        {/* Feed Posts */}
        <PostCard
          authorName="John Doe"
          avatarBgColor="bg-emerald-100"
          avatarText="JD"
          avatarTextColor="text-emerald-700"
          commentsCount={5}
          content={`Our group presentation went really well today!\nProud of the teamwork and effort everyone put in. 🙌`}
          likesCount={12}
          timeAgo="2 minutes ago"
        />

        <PostCard
          authorName="Sarah Malik"
          avatarBgColor="bg-amber-100"
          avatarText="SM"
          avatarTextColor="text-amber-700"
          commentsCount={3}
          content={`Don't forget the math quiz tomorrow.\nLet's all do our best! 💪`}
          likesCount={8}
          timeAgo="10 minutes ago"
        />

        <PostCard
          authorName="Arafat Rahman"
          avatarBgColor="bg-purple-100"
          avatarText="AR"
          avatarTextColor="text-purple-700"
          commentsCount={6}
          content={`Just finished the library project.\nIt's been a long journey but totally worth it! 📚`}
          likesCount={15}
          timeAgo="25 minutes ago"
        />

        <PostCard
          authorName="Mim Naz"
          avatarBgColor="bg-sky-100"
          avatarText="MN"
          avatarTextColor="text-sky-700"
          commentsCount={9}
          content={`Beautiful day on campus today ☀️\nPerfect weather to study outside.`}
          likesCount={22}
          timeAgo="1 hour ago"
        />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <BottomTabBar />
    </View>
  );
}
