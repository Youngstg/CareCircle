import "server-only";

import { prismaAdapter } from "@better-auth/prisma-adapter";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { buildAuthOptions } from "@/lib/auth-options";

const options = buildAuthOptions({
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});
export const googleAuthEnabled = Boolean(options.socialProviders.google);

export const auth = betterAuth({
  ...options,
  database: prismaAdapter(prisma, { provider: "mysql" }),
  plugins: [nextCookies()],
});
