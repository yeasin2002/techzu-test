import { HTTPError } from "ky";

export const getApiErrorMessage = async (
  error: unknown,
  fallback = "An unexpected error occurred",
): Promise<string> => {
  if (error instanceof HTTPError) {
    try {
      const data = (await error.response.json()) as { message?: string };
      if (data?.message) {
        return data.message;
      }
    } catch {
      // Failed to parse response JSON, fall back to status text or fallback
      if (error.response.statusText) {
        return error.response.statusText;
      }
    }
  } else if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
