import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useMe } from "@/api/api-hooks/auth.api-hook";
import type { User } from "@/api/query-list/auth.query";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { getToken, removeToken, setToken } from "@/lib/token";

type AuthContextType = {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuthToken: (newToken: string | null) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    async function loadToken() {
      try {
        const storedToken = await getToken();
        setTokenState(storedToken);
      } catch (error) {
        console.error("Failed to load auth token:", error);
      } finally {
        setIsInitializing(false);
      }
    }
    loadToken();
  }, []);

  const {
    data: user,
    isLoading: isUserLoading,
    refetch,
  } = useMe(Boolean(token));

  const setAuthToken = async (newToken: string | null) => {
    if (newToken) {
      await setToken(newToken);
      setTokenState(newToken);
      await refetch();
    } else {
      await removeToken();
      setTokenState(null);
    }
  };

  const logout = async () => {
    await removeToken();
    setTokenState(null);
  };

  const isLoading = isInitializing || (Boolean(token) && isUserLoading);
  const isAuthenticated = Boolean(token) && Boolean(user);

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotificationsAsync();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user: user ?? null,
        isLoading,
        isAuthenticated,
        setAuthToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
