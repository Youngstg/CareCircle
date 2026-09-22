import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({ googleAuthEnabled: true }));
vi.mock("@/lib/session", () => ({ getSession: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { account: { findFirst: vi.fn() } } }));
vi.mock("@/features/auth/actions", () => ({ signIn: vi.fn(), signUp: vi.fn(), signOut: vi.fn() }));
vi.mock("@/lib/auth-client", () => ({ authClient: { signIn: { social: vi.fn() }, linkSocial: vi.fn() } }));
vi.mock("next/navigation", () => ({ redirect: vi.fn((path: string) => { throw new Error(`redirect:${path}`); }) }));

import AccountPage from "@/app/(auth)/account/page";
import GoogleAuthErrorPage from "@/app/(auth)/auth/error/page";
import { AuthForm } from "@/features/auth/auth-form";
import { GoogleAuthButton } from "@/features/auth/google-auth-button";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const now = new Date("2026-09-22T09:00:00Z");
const session = {
  session: { id: "session-test", token: "test-only-token", userId: "user-test", createdAt: now, updatedAt: now, expiresAt: now },
  user: { id: "user-test", name: "Naya", email: "naya@example.test", emailVerified: false, createdAt: now, updatedAt: now },
};

beforeEach(() => {
  vi.mocked(getSession).mockResolvedValue(session);
  vi.mocked(prisma.account.findFirst).mockResolvedValue(null);
});

describe("Google auth public UI", () => {
  it.each(["sign-in", "sign-up"] as const)("preserves password fields and adds a non-submit Google button to %s", (mode) => {
    const html = renderToStaticMarkup(<AuthForm mode={mode} />);
    const form = /<form\b[\s\S]*?<\/form>/.exec(html)?.[0] ?? "";
    const inputs = [...form.matchAll(/<input\b[^>]*name="([^"]+)"/g)].map((match) => match[1]);
    expect(inputs).toEqual(mode === "sign-up" ? ["displayName", "email", "password"] : ["email", "password"]);
    expect(html).toMatch(/<button type="button"[^>]*>[\s\S]*?Lanjutkan dengan Google/);
    expect(form).not.toContain("Lanjutkan dengan Google");
    expect(html).toContain("atau gunakan email");
  });

  it("explains disabled Google login and does not expose configuration details", () => {
    const html = renderToStaticMarkup(<GoogleAuthButton enabled={false} />);
    expect(html).toContain('disabled=""');
    expect(html).toContain("Masuk dengan Google belum tersedia saat ini.");
    expect(html).not.toMatch(/GOOGLE_CLIENT|clientSecret|BETTER_AUTH_SECRET/);
  });

  it("keeps linking separate from signing in", () => {
    const html = renderToStaticMarkup(<GoogleAuthButton enabled mode="link" />);
    expect(html).toContain("Tautkan akun Google");
    expect(html).not.toContain("atau gunakan email");
  });

  it("maps callback errors and never renders raw descriptions or arbitrary redirects", async () => {
    const page = await GoogleAuthErrorPage({ searchParams: Promise.resolve({ error: "access_denied", flow: "https://untrusted.example", error_description: "PRIVATE_PROVIDER_DETAIL" }) });
    const html = renderToStaticMarkup(page);
    expect(html).toContain("Login Google dibatalkan");
    expect(html).toContain('href="/sign-in"');
    expect(html).not.toContain("PRIVATE_PROVIDER_DETAIL");
    expect(html).not.toContain("https://untrusted.example");
  });

  it("returns link errors to the protected account page", async () => {
    const page = await GoogleAuthErrorPage({ searchParams: Promise.resolve({ error: "email_does_not_match", flow: "link" }) });
    const html = renderToStaticMarkup(page);
    expect(html).toContain("Email Google harus sama");
    expect(html).toContain('href="/account"');
  });

  it("handles repeated or unknown callback parameters safely", async () => {
    const page = await GoogleAuthErrorPage({ searchParams: Promise.resolve({ error: ["access_denied", "PRIVATE_DETAIL"], flow: ["link", "other"] }) });
    const html = renderToStaticMarkup(page);
    expect(html).toContain("Belum berhasil terhubung dengan Google");
    expect(html).not.toContain("PRIVATE_DETAIL");
    expect(html).toContain('href="/sign-in"');
  });
});

describe("Google account management", () => {
  it("requires a verified server session before querying any account", async () => {
    vi.mocked(getSession).mockResolvedValue(null);
    await expect(AccountPage()).rejects.toThrow("redirect:/sign-in");
    expect(prisma.account.findFirst).not.toHaveBeenCalled();
  });

  it("queries only the current user's Google account and offers explicit linking", async () => {
    const html = renderToStaticMarkup(await AccountPage());
    expect(prisma.account.findFirst).toHaveBeenCalledWith({
      where: { userId: "user-test", providerId: "google" },
      select: { id: true },
    });
    expect(html).toContain("naya@example.test");
    expect(html).toContain("Tautkan akun Google");
    expect(html).not.toContain("test-only-token");
  });

  it("shows connected status without serializing account tokens", async () => {
    vi.mocked(prisma.account.findFirst).mockResolvedValue({
      id: "google-link", accountId: "google-sub", providerId: "google", userId: "user-test",
      accessToken: "PRIVATE_ACCESS_TOKEN", refreshToken: "PRIVATE_REFRESH_TOKEN", idToken: "PRIVATE_ID_TOKEN",
      accessTokenExpiresAt: null, refreshTokenExpiresAt: null, scope: "openid email profile", password: null,
      createdAt: now, updatedAt: now,
    });
    const html = renderToStaticMarkup(await AccountPage());
    expect(html).toContain("Akun Google sudah terhubung");
    expect(html).not.toContain("Tautkan akun Google");
    expect(html).not.toMatch(/PRIVATE_.*TOKEN/);
    expect(html).toContain("tidak meminta akses Gmail atau Google Calendar");
  });
});
