import { View } from "react-native";

export function PostCardSkeleton() {
  return (
    <View className="rounded-2xl bg-white p-4 border border-slate-100 shadow-sm shadow-slate-200/50 mb-4 animate-pulse">
      {/* Header Skeleton */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center space-x-3 gap-3">
          <View className="h-10 w-10 rounded-full bg-slate-200" />
          <View className="gap-1.5">
            <View className="h-3.5 w-28 rounded bg-slate-200" />
            <View className="h-2.5 w-16 rounded bg-slate-100" />
          </View>
        </View>
      </View>

      {/* Content Skeleton */}
      <View className="gap-2 my-2">
        <View className="h-3 w-full rounded bg-slate-200" />
        <View className="h-3 w-4/5 rounded bg-slate-200" />
        <View className="h-3 w-2/3 rounded bg-slate-100" />
      </View>

      {/* Footer Skeleton */}
      <View className="flex-row items-center justify-between pt-3 mt-1 border-t border-slate-50">
        <View className="flex-row items-center gap-6">
          <View className="h-4 w-12 rounded bg-slate-200" />
          <View className="h-4 w-12 rounded bg-slate-200" />
        </View>
        <View className="h-4 w-6 rounded bg-slate-100" />
      </View>
    </View>
  );
}
