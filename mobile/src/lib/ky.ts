import ky from "ky";

import { getToken } from "./token";

export const kyInstance = ky.create({
  prefix: process.env.EXPO_PUBLIC_SERVER_URL,
  timeout: 15000,
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        console.log(`🚀 [HTTP OUT] ${request.method} ${request.url}`);
        const token = await getToken();
        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        console.log(`✅ [HTTP IN] ${response.status} ${response.url}`);
        return response;
      },
    ],
    beforeError: [
      ({ error, request }) => {
        console.error(`❌ [HTTP ERROR] ${error.message} (${request.url})`);
        return error;
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
