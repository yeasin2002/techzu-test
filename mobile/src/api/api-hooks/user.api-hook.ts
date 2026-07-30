import { useQuery } from "@tanstack/react-query";

import { userApi } from "../query-list/user.query";

const USER_KEYS = {
  all: () => ["users"] as const,
  lists: () => ["users", "list"] as const,
};

export const useUsers = () => {
  return useQuery({
    queryKey: USER_KEYS.lists(),
    queryFn: () => userApi.getAll(),
    select: (response) => response.data,
  });
};
