import type { BetterAuthOptions } from "better-auth";

type AuthEnvironment = {
  BETTER_AUTH_URL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

function isAuthOrigin(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol)
      && !url.username && !url.password && !url.search && !url.hash
      && url.pathname === "/";
  } catch {
    return false;
  }
}

export function buildAuthOptions(environment: AuthEnvironment) {
  const baseURL = environment.BETTER_AUTH_URL?.trim() || undefined;
  const clientId = environment.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = environment.GOOGLE_CLIENT_SECRET?.trim();
  const google = clientId && clientSecret && isAuthOrigin(baseURL)
    ? {
        clientId,
        clientSecret,
        prompt: "select_account" as const,
        accessType: "online" as const,
        includeGrantedScopes: false,
      }
    : undefined;

  return {
    baseURL,
    emailAndPassword: { enabled: true },
    socialProviders: google ? { google } : {},
    account: {
      encryptOAuthTokens: true,
      storeAccountCookie: false,
      accountLinking: {
        enabled: true,
        // A matching email is not consent to attach another login method.
        disableImplicitLinking: true,
        trustedProviders: [],
        allowDifferentEmails: false,
        allowUnlinkingAll: false,
      },
    },
    onAPIError: { errorURL: "/auth/error" },
  } satisfies BetterAuthOptions;
}
