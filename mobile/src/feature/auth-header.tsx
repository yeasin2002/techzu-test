import { cn } from "heroui-native";
import { Text, View } from "react-native";

type Props = {
  title: string;
  desc: string;

  className?: string;
};

export const AuthHeader = ({ title, desc, className }: Props) => {
  return (
    <View className={cn("mb-10 items-center", className)}>
      <Text className="mb-2 w-full text-center font-bold text-4xl text-foreground">
        {title}
      </Text>
      <Text className="text-center text-base text-muted">{desc}</Text>
    </View>
  );
};
