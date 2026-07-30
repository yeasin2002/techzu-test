import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getApiErrorMessage, setToken, toast } from "@/lib";
import { authApi, type LoginData, type SignupData } from "../query-list/auth.query";

const AUTH_KEYS = {
  all: () => ["auth"] as const,
  me: () => ["auth", "me"] as const,
};

export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: AUTH_KEYS.me(),
    queryFn: () => authApi.getMe(),
    enabled,
    select: (response) => response.data.user,
  });
};

export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SignupData) => authApi.signup(data),
    onSuccess: async (response) => {
      if (response.data?.token) {
        await setToken(response.data.token);
      }
      await queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all() });
      toast.success(response.message || "User registered successfully");
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(error, "Failed to register user");
      toast.error(message);
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: async (response) => {
      if (response.data?.token) {
        await setToken(response.data.token);
      }
      await queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all() });
      toast.success(response.message || "Logged in successfully");
    },
    onError: async (error) => {
      const message = await getApiErrorMessage(error, "Failed to log in");
      toast.error(message);
    },
  });
};
