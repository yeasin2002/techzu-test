import { zodResolver } from "@hookform/resolvers/zod";
import type { Href } from "expo-router";
import { Link, router, Stack } from "expo-router";
import { Button, FieldError, InputGroup, TextField } from "heroui-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { z } from "zod";

import { useLogin } from "@/api/api-hooks/auth.api-hook";
import { Container } from "@/components/container";
import { useAuth } from "@/contexts/auth-context";
import { AuthHeader } from "@/feature/auth-header";
import { StyledIcons } from "@/lib";

const loginSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const { setAuthToken } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const onSubmit = (data: LoginSchemaType) => {
    login(
      {
        username: data.username,
        password: data.password,
      },
      {
        onSuccess: async (response) => {
          if (response.data?.token) {
            await setAuthToken(response.data.token);
            router.replace("/feed" as Href);
          }
        },
      },
    );
  };

  return (
    <Container keyboardAvoiding>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 justify-center bg-[#FFFFFF] px-6">
        <AuthHeader
          desc="Sign in to continue your social journey"
          title="Welcome Back!"
        />

        {/* Username / Email Field */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Enter Username or Email
          </Text>
          <TextField isInvalid={!!errors.username}>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white">
                  <InputGroup.Prefix
                    className="absolute top-0 bottom-0 left-0 items-center justify-center pr-2 pl-4"
                    isDecorative
                  >
                    <StyledIcons
                      className="text-muted"
                      name="person-outline"
                      size={20}
                    />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    autoCapitalize="none"
                    className="h-full w-full border-transparent bg-transparent pl-12 text-foreground"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Enter your username"
                    value={value}
                  />
                </InputGroup>
              )}
            />
            <FieldError>{errors.username?.message}</FieldError>
          </TextField>
        </View>

        {/* Password Field */}
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-foreground text-sm">
            Password
          </Text>
          <TextField isInvalid={!!errors.password}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <InputGroup className="relative h-14 w-full flex-row items-center rounded-2xl border border-[#E5E5E5] bg-white">
                  <InputGroup.Prefix
                    className="absolute top-0 bottom-0 left-0 items-center justify-center pr-2 pl-4"
                    isDecorative
                  >
                    <StyledIcons
                      className="text-muted"
                      name="lock-closed-outline"
                      size={20}
                    />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    className="h-full w-full border-transparent bg-transparent pr-12 pl-12 text-foreground"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="••••••••"
                    secureTextEntry={!isPasswordVisible}
                    value={value}
                  />
                  <InputGroup.Suffix className="absolute top-0 right-0 bottom-0 items-center justify-center pr-4 pl-2">
                    <Pressable
                      hitSlop={12}
                      onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      <StyledIcons
                        className="text-muted"
                        name={
                          isPasswordVisible ? "eye-off-outline" : "eye-outline"
                        }
                        size={20}
                      />
                    </Pressable>
                  </InputGroup.Suffix>
                </InputGroup>
              )}
            />
            <FieldError>{errors.password?.message}</FieldError>
          </TextField>
        </View>

        {/* Remember Me + Forgot Password */}
        <View className="mb-8 flex-row items-center justify-between">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field: { value, onChange } }) => (
              <Pressable
                className="flex-row items-center gap-2"
                onPress={() => onChange(!value)}
              >
                <View
                  className={`h-5 w-5 items-center justify-center rounded border ${
                    value
                      ? "border-primary bg-primary"
                      : "border-[#E5E5E5] bg-background"
                  }`}
                >
                  {value && (
                    <StyledIcons
                      className="text-primary-foreground"
                      name="checkmark"
                      size={12}
                    />
                  )}
                </View>
                <Text className="text-foreground text-sm">Remember Me</Text>
              </Pressable>
            )}
          />

          <Pressable>
            <Text className="font-semibold text-foreground text-sm underline">
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        {/* Login Button */}
        <Button
          className="mb-6 h-14 w-full items-center justify-center rounded-2xl bg-emerald-600"
          isDisabled={isPending}
          onPress={handleSubmit(onSubmit)}
          variant="primary"
        >
          <Button.Label className="font-semibold text-base text-primary-foreground">
            {isPending ? "Logging in..." : "Log in"}
          </Button.Label>
        </Button>

        {/* Or divider */}
        <View className="mb-5 flex-row items-center gap-3">
          <View className="h-px flex-1 bg-default-200" />
          <Text className="text-muted text-sm">Or</Text>
          <View className="h-px flex-1 bg-default-200" />
        </View>

        {/* Sign Up Link */}
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-default-500 text-sm">
            Don't have an account?
          </Text>
          <Link asChild href={"/auth/register" as Href}>
            <Pressable>
              <Text className="font-semibold text-primary text-sm">
                Sign Up
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </Container>
  );
}
