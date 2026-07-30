import { Container } from "@/components/container";
import { StyledIcons } from "@/lib";
import type { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export interface Screen {
  desc: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
}

export const mainScreens: Screen[] = [
  {
    title: "Social Feed Screen",
    desc: "School social media feed page",
    href: "/feed" as Href,
    icon: "newspaper-outline" as const,
  },
  {
    title: "Create Post Screen",
    desc: "Create a new text post page",
    href: "/create-post" as Href,
    icon: "add-circle-outline" as const,
  },
  {
    title: "Notifications Screen",
    desc: "View activity and notifications page",
    href: "/notifications" as Href,
    icon: "notifications-outline" as const,
  },
];

export const authScreens: Screen[] = [
  {
    title: "Login Screen",
    desc: "User sign in page",
    href: "/auth/login" as Href,
    icon: "log-in-outline" as const,
  },
  {
    title: "Register Screen",
    desc: "User sign up page",
    href: "/auth/register" as Href,
    icon: "person-add-outline" as const,
  },
  {
    title: "Forgot Password Screen",
    desc: "Password reset request page",
    href: "/auth/forgot-password" as Href,
    icon: "key-outline" as const,
  },
  {
    title: "OTP Verification Screen",
    desc: "Verify OTP code page",
    href: "/auth/otp-code" as Href,
    icon: "shield-checkmark-outline" as const,
  },
  {
    title: "Change Password Screen",
    desc: "Change user password page",
    href: "/auth/change-password" as Href,
    icon: "lock-closed-outline" as const,
  },
];

export default function IndexPage() {
  return (
    <Container className="bg-white">
      <View className="items-center px-6 pt-8 pb-10">
        <Text className="mb-3 text-center font-bold text-3xl text-black">
          TechZu App Navigation
        </Text>
        <Text className="text-center text-base text-default-500 leading-6">
          Select a screen to view and test available app flows.
        </Text>
      </View>

      <ShowScreenItems screens={mainScreens} title="Main Screen" />
      <ShowScreenItems screens={authScreens} title="Auth Screens" />
    </Container>
  );
}

const ShowScreenItems = ({
  screens,
  title,
}: {
  title: string;
  screens: Screen[];
}) => (
  <View className="mb-6 px-6">
    <Text className="mb-3 font-semibold text-default-400 text-xs uppercase tracking-wider">
      {title}
    </Text>
    {screens.map((item) => (
      <Link asChild href={item.href} key={item.title}>
        <Pressable className="flex-row items-center gap-4 rounded-2xl bg-content1 p-4 mb-3 active:opacity-75">
          <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <StyledIcons className="text-primary" name={item.icon} size={20} />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-foreground text-sm">
              {item.title}
            </Text>
            <Text className="mt-0.5 text-default-400 text-xs">{item.desc}</Text>
          </View>
          <StyledIcons
            className="text-default-300"
            name="chevron-forward"
            size={16}
          />
        </Pressable>
      </Link>
    ))}
  </View>
);
