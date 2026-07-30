import { registry } from "@/lib/openapi";

registry.registerPath({
  method: "get",
  path: "/api/users",
  description: "Get all users from PostgreSQL database using Drizzle ORM",
  summary: "Get all users",
  tags: ["Users"],
  responses: {
    200: {
      description: "Users retrieved successfully",
    },
    500: {
      description: "Internal server error",
    },
  },
});
