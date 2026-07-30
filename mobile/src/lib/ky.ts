import ky from "ky";

import { env } from "./env";
import { getToken } from "./token";

export const kyInstance = ky.create({
  prefix: env.EXPO_PUBLIC_SERVER_URL,
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        const token = await getToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
  },
});

export const kyClient = {
  get: <T>(url: string, searchParams?: URLSearchParams | Record<string, any>): Promise<T> =>
    kyInstance.get(url, { searchParams }).json<T>(),

  post: <T>(url: string, json?: unknown): Promise<T> =>
    kyInstance.post(url, { json }).json<T>(),

  patch: <T>(url: string, json?: unknown): Promise<T> =>
    kyInstance.patch(url, { json }).json<T>(),

  put: <T>(url: string, json?: unknown): Promise<T> =>
    kyInstance.put(url, { json }).json<T>(),

  delete: <T>(url: string): Promise<T> =>
    kyInstance.delete(url).json<T>(),
};
