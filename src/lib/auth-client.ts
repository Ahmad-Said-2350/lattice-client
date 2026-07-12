import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export const authClient = createAuthClient({
  baseURL: apiOrigin,
  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
          input: false,
        },
      },
    }),
  ],
});

export const { useSession, signIn, signUp, signOut } = authClient;

export type AppRole = "user" | "admin";

export function getUserRole(
  user?: { role?: string | null } | null
): AppRole {
  return user?.role === "admin" ? "admin" : "user";
}

export function dashboardPathForRole(role: AppRole): string {
  return role === "admin" ? "/dashboard/admin" : "/dashboard/user";
}
