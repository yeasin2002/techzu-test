import { Text, View } from "react-native";

type AuthHeaderProps = {
  title: string;
  desc: string;
  className?: string;
};

export function AuthHeader({ title, desc, className = "mb-6" }: AuthHeaderProps) {
  return (
    <View className={className}>
      <Text className="text-2xl font-bold text-slate-900">{title}</Text>
      <Text className="mt-1 text-sm text-slate-500">{desc}</Text>
    </View>
  );
}
