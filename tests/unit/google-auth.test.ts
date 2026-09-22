// @vitest-environment node

import { createHash } from "node:crypto";
import {
  betterAuth,
  type Account,
  type BetterAuthOptions,
  type GoogleProfile,
  type Session,
  type User,
  type Verification,
} from "better-auth";
import { memoryAdapter } from "better-auth/adapters/memory";
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import { getGoogleAuthErrorMessage } from "@/features/auth/google-errors";
import { buildAuthOptions } from "@/lib/auth-options";

type AuthEnvironment = Parameters<typeof buildAuthOptions>[0];

const AUTH_ORIGIN = "https://carecircle.test";
const AUTH_SECRET = "unit-test-only-secret-not-for-production-42";
const ID_TOKEN = "unit-test-google-id-token";
const ACCESS_TOKEN = "unit-test-google-access-token";
const PASSWORD = "unit-test-password-42";
const EMAIL = "caregiver@example.test";
const GOOGLE_ENVIRONMENT = {
  BETTER_AUTH_URL: AUTH_ORIGIN,
  GOOGLE_CLIENT_ID: "unit-test-client.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "unit-test-google-client-secret",
} satisfies AuthEnvironment;

const missingConfiguration: [string, AuthEnvironment][] = [
  ["no configuration", {}],
  ["only an origin", { BETTER_AUTH_URL: AUTH_ORIGIN }],
  ["only a client ID", { GOOGLE_CLIENT_ID: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_ID }],
  ["only a client secret", { GOOGLE_CLIENT_SECRET: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_SECRET }],
  ["no origin", { ...GOOGLE_ENVIRONMENT, BETTER_AUTH_URL: undefined }],
  ["no client ID", { ...GOOGLE_ENVIRONMENT, GOOGLE_CLIENT_ID: undefined }],
  ["no client secret", { ...GOOGLE_ENVIRONMENT, GOOGLE_CLIENT_SECRET: undefined }],
  ["empty origin", { ...GOOGLE_ENVIRONMENT, BETTER_AUTH_URL: "" }],
  ["blank origin", { ...GOOGLE_ENVIRONMENT, BETTER_AUTH_URL: " \n\t " }],
  ["empty client ID", { ...GOOGLE_ENVIRONMENT, GOOGLE_CLIENT_ID: "" }],
  ["blank client ID", { ...GOOGLE_ENVIRONMENT, GOOGLE_CLIENT_ID: " \n\t " }],
  ["empty client secret", { ...GOOGLE_ENVIRONMENT, GOOGLE_CLIENT_SECRET: "" }],
  ["blank client secret", { ...GOOGLE_ENVIRONMENT, GOOGLE_CLIENT_SECRET: " \n\t " }],
];

const invalidOrigins = [
  "not a URL",
  "carecircle.test",
  "/auth",
  "//carecircle.test",
  "https://",
  "https://carecircle.test:invalid",
  "ftp://carecircle.test",
  "file:///carecircle.test",
  "javascript:alert(1)",
  "data:text/html,untrusted",
  "https://user@carecircle.test",
  "https://:password@carecircle.test",
  "https://user:password@carecircle.test",
  "https://carecircle.test/api/auth",
  "https://carecircle.test/api/auth/",
  "https://carecircle.test/?redirect=untrusted",
  "https://carecircle.test/#untrusted",
];

describe("buildAuthOptions", () => {
  it.each(missingConfiguration)("disables only Google with %s", (_name, environment) => {
    const options = buildAuthOptions(environment);

    expect(options.socialProviders).toEqual({});
    expect(options.emailAndPassword).toEqual({ enabled: true });
  });

  it.each(invalidOrigins)("disables Google for invalid auth origin %s without disabling passwords", (origin) => {
    const options = buildAuthOptions({ ...GOOGLE_ENVIRONMENT, BETTER_AUTH_URL: origin });

    expect(options.socialProviders).toEqual({});
    expect(options.emailAndPassword).toEqual({ enabled: true });
  });

  it.each([
    "https://carecircle.test",
    "https://carecircle.test/",
    "https://carecircle.test:8443",
    "http://carecircle.test",
    "http://localhost:3000",
    "http://127.0.0.1:3000/",
    "http://[::1]:3000",
  ])("enables Google for complete credentials and origin %s", (origin) => {
    const options = buildAuthOptions({ ...GOOGLE_ENVIRONMENT, BETTER_AUTH_URL: origin });

    expectTypeOf(options).toMatchTypeOf<BetterAuthOptions>();
    expect(options.baseURL).toBe(origin);
    expect(options.emailAndPassword.enabled).toBe(true);
    expect(options.socialProviders).toEqual({
      google: {
        clientId: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_SECRET,
        prompt: "select_account",
        accessType: "online",
        includeGrantedScopes: false,
      },
    });
  });

  it("trims configuration without mutating the supplied environment or adding scopes", () => {
    const environment = Object.freeze({
      BETTER_AUTH_URL: ` \t${AUTH_ORIGIN}/\n`,
      GOOGLE_CLIENT_ID: `  ${GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_ID}\n`,
      GOOGLE_CLIENT_SECRET: `\t${GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_SECRET}  `,
    });
    const original = { ...environment };
    const options = buildAuthOptions(environment);

    expect(options.baseURL).toBe(`${AUTH_ORIGIN}/`);
    expect(options.socialProviders.google).toEqual({
      clientId: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
      accessType: "online",
      includeGrantedScopes: false,
    });
    expect(options.socialProviders.google).not.toHaveProperty("scope");
    expect(options.socialProviders.google).not.toHaveProperty("disableDefaultScope");
    expect(environment).toEqual(original);
  });

  it.each([
    ["enabled", GOOGLE_ENVIRONMENT],
    ["disabled", {}],
  ] satisfies [string, AuthEnvironment][])("retains account security policy when Google is %s", (_name, environment) => {
    const options = buildAuthOptions(environment);

    expect(options.account).toEqual({
      encryptOAuthTokens: true,
      storeAccountCookie: false,
      accountLinking: {
        enabled: true,
        disableImplicitLinking: true,
        trustedProviders: [],
        allowDifferentEmails: false,
        allowUnlinkingAll: false,
      },
    });
    expect(options.onAPIError).toEqual({ errorURL: "/auth/error" });
  });
});

const FALLBACK_MESSAGE = "Belum berhasil terhubung dengan Google. Coba lagi atau gunakan email dan kata sandi. Jika masalah berlanjut, hubungi pengelola CareCircle.";
const DENIED_MESSAGE = "Login Google dibatalkan atau izinnya tidak diberikan. Anda bisa mencoba lagi atau masuk dengan email.";
const knownErrors: [string, string][] = [
  ["access_denied", DENIED_MESSAGE],
  ["account_not_linked", "Email ini sudah memiliki akun CareCircle. Masuk dengan email dan kata sandi terlebih dahulu, lalu buka Kelola akun untuk menautkan Google."],
  ["email_does_not_match", "Email Google harus sama dengan email akun CareCircle Anda. Coba lagi dengan akun Google yang sesuai."],
  ["linking_different_emails_not_allowed", "Email Google harus sama dengan email akun CareCircle Anda. Coba lagi dengan akun Google yang sesuai."],
  ["account_already_linked_to_different_user", "Akun Google ini sudah terhubung ke akun CareCircle lain. Gunakan metode masuk yang sudah terhubung."],
  ["social_account_already_linked", "Akun Google ini sudah terhubung ke akun CareCircle lain. Gunakan metode masuk yang sudah terhubung."],
  ["email_not_verified", "Alamat email Google belum terverifikasi. Verifikasi email pada akun Google Anda sebelum mencoba lagi."],
  ["email_not_found", "Google tidak memberikan alamat email yang diperlukan. Coba akun Google lain atau gunakan email dan kata sandi."],
  ["state_not_found", "Sesi login Google tidak valid atau sudah berakhir. Mulai lagi dari halaman masuk dan gunakan tab browser yang sama."],
  ["state_mismatch", "Sesi login Google tidak valid atau sudah berakhir. Mulai lagi dari halaman masuk dan gunakan tab browser yang sama."],
  ["state_expired", "Sesi login Google sudah berakhir. Silakan mulai lagi."],
  ["invalid_state", "Sesi login Google tidak valid atau sudah berakhir. Silakan mulai lagi."],
  ["please_restart_the_process", "Sesi login Google sudah berakhir. Silakan mulai lagi."],
  ["provider_not_found", "Login Google belum tersedia saat ini. Silakan gunakan email dan kata sandi."],
  ["oauth_provider_not_found", "Login Google belum tersedia saat ini. Silakan gunakan email dan kata sandi."],
  ["unauthorized", "Sesi Anda sudah berakhir. Masuk kembali sebelum menautkan akun Google."],
  ["session_expired", "Sesi Anda sudah berakhir. Masuk kembali sebelum menautkan akun Google."],
  ["too_many_requests", "Terlalu banyak percobaan. Tunggu sebentar sebelum mencoba lagi."],
];

describe("getGoogleAuthErrorMessage", () => {
  it.each(knownErrors)("maps %s to actionable Indonesian text, including uppercase and space-separated codes", (code, message) => {
    expect(getGoogleAuthErrorMessage(code)).toBe(message);
    expect(getGoogleAuthErrorMessage(code.toUpperCase())).toBe(message);
    expect(getGoogleAuthErrorMessage(code.toUpperCase().replaceAll("_", " "))).toBe(message);
  });

  it.each([
    undefined,
    "",
    " \t\n ",
    "unknown_google_error",
    "OAUTH_LINK_ERROR",
    "constructor",
    "CONSTRUCTOR",
    "__proto__",
    "prototype",
    "toString",
    "toLocaleString",
    "valueOf",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "__defineGetter__",
    "__defineSetter__",
    "__lookupGetter__",
    "__lookupSetter__",
    "<script>alert('untrusted-error')</script>",
    "https://untrusted.example.test/?token=do-not-reflect",
    "access_denied&error_description=<img src=x onerror=alert(1)>",
    "access denied: untrusted provider description",
  ])("uses the exact safe fallback for %j, never reflecting the input", (code) => {
    expect(getGoogleAuthErrorMessage(code)).toBe(FALLBACK_MESSAGE);
  });
});

type TestDatabase = {
  user: User[];
  account: Account[];
  session: Session[];
  verification: Verification[];
};

function cookiesFrom(response: Response): string {
  return response.headers.getSetCookie().map((cookie) => cookie.split(";", 1)[0]).join("; ");
}

async function createTestAuth({
  environment = GOOGLE_ENVIRONMENT,
  profile: profileOverrides = {},
}: {
  environment?: AuthEnvironment;
  profile?: Partial<GoogleProfile>;
} = {}) {
  const options = buildAuthOptions(environment);
  const db: TestDatabase = { user: [], account: [], session: [], verification: [] };
  const now = Math.floor(Date.now() / 1000);
  const profile: GoogleProfile = {
    sub: "google-subject-unit-test-123",
    email: EMAIL,
    email_verified: true,
    name: "Test Caregiver",
    given_name: "Test",
    family_name: "Caregiver",
    picture: "https://images.example.test/caregiver.png",
    aud: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_ID,
    azp: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_ID,
    iss: "https://accounts.google.com",
    iat: now,
    exp: now + 3600,
    ...profileOverrides,
  };
  // Only external identity verification is replaced, on this isolated instance.
  // The real Google provider still derives account identity from data.sub.
  const verifyIdToken = vi.fn(async (token: string) => token === ID_TOKEN);
  const getUserInfo = vi.fn(async () => ({
    user: {
      name: profile.name,
      email: profile.email,
      emailVerified: profile.email_verified,
      image: profile.picture,
    },
    data: { ...profile },
  }));
  const auth = betterAuth({
    ...options,
    database: memoryAdapter(db),
    secret: AUTH_SECRET,
    secrets: [{ version: 1, value: AUTH_SECRET }],
    telemetry: { enabled: false },
    logger: { disabled: true },
    // BetterAuth otherwise skips origin checks automatically in NODE_ENV=test.
    advanced: { disableOriginCheck: false },
    socialProviders: options.socialProviders.google ? {
      google: { ...options.socialProviders.google, verifyIdToken, getUserInfo },
    } : options.socialProviders,
  });
  const context = await auth.$context;

  function request(path: string, body?: Record<string, unknown>, cookie = "") {
    return auth.handler(new Request(`${AUTH_ORIGIN}/api/auth${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        origin: AUTH_ORIGIN,
        ...(body ? { "content-type": "application/json" } : {}),
        ...(cookie ? { cookie } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    }));
  }

  async function signUpPassword(email = EMAIL) {
    const response = await request("/sign-up/email", { name: "Local Caregiver", email, password: PASSWORD });
    expect(response.status).toBe(200);
    const result = await response.json() as { user: User; token: string };
    expect(result.user.email).toBe(email);
    expect(result.token).toEqual(expect.any(String));
    return { user: result.user, cookie: cookiesFrom(response) };
  }

  async function authorize(path = "/sign-in/social", cookie = "") {
    const response = await request(path, {
      provider: "google",
      callbackURL: `${AUTH_ORIGIN}/dashboard`,
      disableRedirect: true,
    }, cookie);
    expect(response.status).toBe(200);
    const result = await response.json() as { url: string; redirect: boolean };
    expect(result.redirect).toBe(false);
    const url = new URL(result.url);
    const state = url.searchParams.get("state");
    expect(state).toMatch(/^[a-zA-Z0-9_-]{32}$/);
    return { response, url, state: state!, cookie: cookiesFrom(response) };
  }

  function callback(query: Record<string, string>, cookie = "") {
    return request(`/callback/google?${new URLSearchParams(query)}`, undefined, cookie);
  }

  function signInGoogle() {
    return request("/sign-in/social", {
      provider: "google",
      idToken: { token: ID_TOKEN, accessToken: ACCESS_TOKEN },
    });
  }

  return { auth, context, db, profile, verifyIdToken, getUserInfo, request, signUpPassword, authorize, callback, signInGoogle };
}

function expectErrorRedirect(response: Response, code: string) {
  expect(response.status).toBe(302);
  expect(response.headers.get("location")).toEqual(expect.any(String));
  const location = new URL(response.headers.get("location")!, AUTH_ORIGIN);
  expect(location.origin).toBe(AUTH_ORIGIN);
  expect(location.pathname).toBe("/auth/error");
  expect(location.searchParams.get("error")).toBe(code);
  expect(cookiesFrom(response)).not.toContain("session_token=");
  return location;
}

function expectNoIdentityRecords(db: TestDatabase) {
  expect(db.user).toEqual([]);
  expect(db.account).toEqual([]);
  expect(db.session).toEqual([]);
}

function expectNoAccountCookie(response: Response) {
  expect(cookiesFrom(response)).not.toContain("account_data=");
  expect(cookiesFrom(response)).not.toContain(ACCESS_TOKEN);
  expect(cookiesFrom(response)).not.toContain(ID_TOKEN);
}

describe("Google login and linking through real BetterAuth with an isolated memory adapter", () => {
  const network = vi.fn<typeof fetch>();

  beforeEach(() => {
    network.mockImplementation(async () => {
      throw new Error("External network access is forbidden in Google auth tests");
    });
    vi.stubGlobal("fetch", network);
  });

  afterEach(() => {
    try {
      // Some provider failures are caught by BetterAuth; also fail on attempted I/O.
      expect(network).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllGlobals();
      vi.useRealTimers();
    }
  });

  it.each([
    ["missing", {}],
    ["client ID only", { GOOGLE_CLIENT_ID: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_ID }],
    ["client secret only", { GOOGLE_CLIENT_SECRET: GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_SECRET }],
  ] satisfies [string, AuthEnvironment][])("keeps real password sign-up/sign-in working with %s Google credentials", async (_name, credentials) => {
    const local = await createTestAuth({ environment: { BETTER_AUTH_URL: AUTH_ORIGIN, ...credentials } });
    const { user, cookie } = await local.signUpPassword();
    expect((await local.request("/sign-out", {}, cookie)).status).toBe(200);
    expect(local.db.session).toHaveLength(0);

    const googleResponse = await local.signInGoogle();
    expect(googleResponse.status).toBe(404);
    expect(await googleResponse.json()).toMatchObject({ code: "PROVIDER_NOT_FOUND" });
    expect(local.db.session).toHaveLength(0);

    const passwordResponse = await local.request("/sign-in/email", { email: EMAIL, password: PASSWORD });
    expect(passwordResponse.status).toBe(200);
    expect(await passwordResponse.json()).toMatchObject({ user: { id: user.id, email: EMAIL } });
    const session = await local.request("/get-session", undefined, cookiesFrom(passwordResponse));
    expect(await session.json()).toMatchObject({ user: { id: user.id } });
    expect(local.db.account).toHaveLength(1);
    expect(local.db.account[0]).toMatchObject({ providerId: "credential", userId: user.id });
    expect(local.verifyIdToken).not.toHaveBeenCalled();
  });

  it.each(["/sign-in/social", "/link-social"])("builds a login-only Google authorization URL with PKCE and bound state for %s", async (path) => {
    const local = await createTestAuth();
    const signedIn = path === "/link-social" ? await local.signUpPassword() : undefined;
    const flow = await local.authorize(path, signedIn?.cookie);
    const params = flow.url.searchParams;

    expect(`${flow.url.origin}${flow.url.pathname}`).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(params.get("client_id")).toBe(GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_ID);
    expect(params.get("redirect_uri")).toBe(`${AUTH_ORIGIN}/api/auth/callback/google`);
    expect(params.get("response_type")).toBe("code");
    expect(params.get("scope")?.split(" ").sort()).toEqual(["email", "openid", "profile"]);
    expect(params.get("scope")).not.toMatch(/calendar|gmail|mail\.google|offline_access/i);
    expect(params.get("prompt")).toBe("select_account");
    expect(params.get("access_type")).toBe("online");
    expect(params.has("include_granted_scopes")).toBe(false);
    expect(params.has("refresh_token")).toBe(false);
    expect(params.has("client_secret")).toBe(false);
    expect(params.has("code_verifier")).toBe(false);
    expect(flow.url.toString()).not.toContain(GOOGLE_ENVIRONMENT.GOOGLE_CLIENT_SECRET);
    expect(params.get("code_challenge_method")).toBe("S256");
    expect(params.get("code_challenge")).toMatch(/^[a-zA-Z0-9_-]{43}$/);

    expect(local.db.verification).toHaveLength(1);
    const record = local.db.verification[0];
    expect(record.identifier).toBe(flow.state);
    const stored = JSON.parse(record.value) as {
      codeVerifier: string;
      oauthState: string;
      callbackURL: string;
      link?: { userId: string; email: string };
    };
    expect(stored.oauthState).toBe(flow.state);
    expect(stored.codeVerifier).toHaveLength(128);
    expect(params.get("code_challenge")).toBe(createHash("sha256").update(stored.codeVerifier).digest("base64url"));
    expect(stored.callbackURL).toBe(`${AUTH_ORIGIN}/dashboard`);
    expect(stored.link).toEqual(signedIn ? { userId: signedIn.user.id, email: EMAIL } : undefined);
    const stateCookieName = local.context.createAuthCookie("state").name;
    const stateCookie = flow.response.headers.getSetCookie().find((cookie) => cookie.startsWith(`${stateCookieName}=`));
    expect(stateCookie).toMatch(/httponly/i);
    expect(stateCookie).toMatch(/secure/i);
    expect(stateCookie).toMatch(/samesite=lax/i);
    expectNoAccountCookie(flow.response);
    expect(local.verifyIdToken).not.toHaveBeenCalled();
    expect(local.getUserInfo).not.toHaveBeenCalled();
  });

  it("generates independent state and PKCE challenges for separate login attempts", async () => {
    const local = await createTestAuth();
    const first = await local.authorize();
    const second = await local.authorize();

    expect(first.state).not.toBe(second.state);
    expect(first.url.searchParams.get("code_challenge")).not.toBe(second.url.searchParams.get("code_challenge"));
    expect(first.cookie).not.toBe(second.cookie);
    expect(local.db.verification).toHaveLength(2);
    expectNoIdentityRecords(local.db);
  });

  it("handles denial, maps only the trusted error code, consumes state, and rejects replay", async () => {
    const local = await createTestAuth();
    const flow = await local.authorize();
    const description = "<img src=x onerror=alert('untrusted-description')>";
    const query = { state: flow.state, error: "access_denied", error_description: description };
    const response = await local.callback(query, flow.cookie);
    const location = expectErrorRedirect(response, "access_denied");

    // BetterAuth may carry the description in the redirect; the UI helper must not display it.
    const message = getGoogleAuthErrorMessage(location.searchParams.get("error") ?? undefined);
    expect(message).toBe(DENIED_MESSAGE);
    expect(message).not.toContain(description);
    expect(local.db.verification).toHaveLength(0);
    expectErrorRedirect(await local.callback(query, flow.cookie), "state_mismatch");
    expectNoIdentityRecords(local.db);
    expect(local.verifyIdToken).not.toHaveBeenCalled();
    expect(local.getUserInfo).not.toHaveBeenCalled();
  });

  it.each([
    ["missing state", "state_not_found"],
    ["unknown state", "state_mismatch"],
    ["missing cookie", "state_mismatch"],
    ["forged cookie", "state_mismatch"],
    ["another attempt's cookie", "state_mismatch"],
  ])("rejects callbacks with %s before exchanging an authorization code", async (scenario, code) => {
    const local = await createTestAuth();
    const flow = await local.authorize();
    const query: Record<string, string> = { code: "never-exchange-this-code", state: flow.state };
    let cookie = flow.cookie;
    if (scenario === "missing state") delete query.state;
    if (scenario === "unknown state") query.state = `${flow.state}-tampered`;
    if (scenario === "missing cookie") cookie = "";
    if (scenario === "forged cookie") cookie = `${local.context.createAuthCookie("state").name}=forged-signature`;
    if (scenario === "another attempt's cookie") cookie = (await local.authorize()).cookie;

    expectErrorRedirect(await local.callback(query, cookie), code);
    expectNoIdentityRecords(local.db);
    expect(local.getUserInfo).not.toHaveBeenCalled();
  });

  it("rejects expired state without exchanging an authorization code", async () => {
    const local = await createTestAuth();
    const flow = await local.authorize();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(Date.now() + 11 * 60 * 1000);

    expectErrorRedirect(await local.callback({ state: flow.state, code: "never-exchange-this-code" }, flow.cookie), "state_mismatch");
    expectNoIdentityRecords(local.db);
    expect(local.getUserInfo).not.toHaveBeenCalled();
  });

  it.each(["redirect", "ID token"])("requires a session for manual linking via %s", async (flow) => {
    const local = await createTestAuth();
    const response = await local.request("/link-social", {
      provider: "google",
      ...(flow === "ID token" ? { idToken: { token: ID_TOKEN } } : {}),
    });

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "UNAUTHORIZED" });
    expectNoIdentityRecords(local.db);
    expect(local.db.verification).toHaveLength(0);
    expect(local.verifyIdToken).not.toHaveBeenCalled();
    expect(local.getUserInfo).not.toHaveBeenCalled();
  });

  it.each([EMAIL, EMAIL.toUpperCase()])("denies implicit linking to an already verified local user for Google email %s", async (email) => {
    const local = await createTestAuth({ profile: { email } });
    const { user, cookie } = await local.signUpPassword();
    // Both identities are verified, so denial must come from disableImplicitLinking.
    await local.context.internalAdapter.updateUser(user.id, { emailVerified: true });
    expect((await local.request("/sign-out", {}, cookie)).status).toBe(200);
    const before = structuredClone(local.db);

    const response = await local.signInGoogle();

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "OAUTH_LINK_ERROR", message: "account not linked" });
    expect(local.db).toEqual(before);
    expect(local.db.user[0].emailVerified).toBe(true);
    expect(local.db.session).toHaveLength(0);
    expect(cookiesFrom(response)).not.toContain("session_token=");
    expect(local.verifyIdToken).toHaveBeenCalledOnce();
    expect(local.getUserInfo).toHaveBeenCalledOnce();
  });

  it("allows a new Google user, keys the account by sub, encrypts the access token, and creates a usable session", async () => {
    const local = await createTestAuth();
    const response = await local.signInGoogle();

    expect(response.status).toBe(200);
    expect(local.db.user).toHaveLength(1);
    expect(local.db.account).toHaveLength(1);
    expect(local.db.session).toHaveLength(1);
    const user = local.db.user[0];
    const account = local.db.account[0];
    expect(await response.json()).toMatchObject({ redirect: false, user: { id: user.id, email: EMAIL, emailVerified: true } });
    expect(account).toMatchObject({ providerId: "google", accountId: local.profile.sub, userId: user.id });
    expect(account.accessToken).toEqual(expect.any(String));
    expect(account.accessToken).not.toBe(ACCESS_TOKEN);
    expect(account.accessToken).not.toHaveLength(0);
    expect(account.refreshToken ?? null).toBeNull();
    expectNoAccountCookie(response);
    expect(cookiesFrom(response)).toContain("session_token=");
    const session = await local.request("/get-session", undefined, cookiesFrom(response));
    expect(session.status).toBe(200);
    expect(await session.json()).toMatchObject({ user: { id: user.id, email: EMAIL } });
    expect(local.verifyIdToken).toHaveBeenCalledOnce();
    expect(local.getUserInfo).toHaveBeenCalledOnce();
  });

  it("allows an already-linked subject without duplicating accounts or rebinding the local email", async () => {
    const local = await createTestAuth();
    const first = await local.signInGoogle();
    expect(first.status).toBe(200);
    const userId = local.db.user[0].id;
    const accountId = local.db.account[0].id;
    expect((await local.request("/sign-out", {}, cookiesFrom(first))).status).toBe(200);
    local.profile.email = "renamed-google-user@example.test";

    const second = await local.signInGoogle();

    expect(second.status).toBe(200);
    expect(await second.json()).toMatchObject({ user: { id: userId, email: EMAIL } });
    expect(local.db.user).toHaveLength(1);
    expect(local.db.account).toHaveLength(1);
    expect(local.db.account[0]).toMatchObject({ id: accountId, accountId: local.profile.sub, userId });
    expect(local.db.session).toHaveLength(1);
    expect(local.db.session[0].userId).toBe(userId);
    expectNoAccountCookie(second);
  });

  it("allows explicit, idempotent linking of a verified same-email Google account, then Google sign-in", async () => {
    const local = await createTestAuth({ profile: { email: EMAIL.toUpperCase() } });
    const { user, cookie } = await local.signUpPassword();
    const body = { provider: "google", idToken: { token: ID_TOKEN, accessToken: ACCESS_TOKEN } };

    for (let attempt = 0; attempt < 2; attempt++) {
      const response = await local.request("/link-social", body, cookie);
      expect(response.status).toBe(200);
      expect(await response.json()).toMatchObject({ status: true, redirect: false });
      expectNoAccountCookie(response);
      expect(local.db.user).toHaveLength(1);
      expect(local.db.account).toHaveLength(2);
      expect(local.db.session).toHaveLength(1);
    }
    const account = local.db.account.find((entry) => entry.providerId === "google");
    expect(account).toMatchObject({ accountId: local.profile.sub, userId: user.id, accessToken: expect.any(String) });
    expect(account?.accessToken).not.toBe(ACCESS_TOKEN);
    expect(account?.refreshToken ?? null).toBeNull();
    expect((await local.request("/sign-out", {}, cookie)).status).toBe(200);

    const response = await local.signInGoogle();
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ user: { id: user.id, email: EMAIL } });
    expect(local.db.account).toHaveLength(2);
  });

  it.each([
    ["different email", { email: "other@example.test" }, "LINKING_DIFFERENT_EMAILS_NOT_ALLOWED"],
    ["unverified Google email", { email_verified: false }, "LINKING_NOT_ALLOWED"],
  ] satisfies [string, Partial<GoogleProfile>, string][])("rejects manual linking with %s without changing accounts", async (_name, profile, code) => {
    const local = await createTestAuth({ profile });
    const { cookie } = await local.signUpPassword();
    const before = structuredClone(local.db);
    const response = await local.request("/link-social", { provider: "google", idToken: { token: ID_TOKEN } }, cookie);

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code });
    expect(local.db).toEqual(before);
    expectNoAccountCookie(response);
  });

  it("refuses to attach a Google subject already owned by a different user", async () => {
    const local = await createTestAuth();
    const owner = await local.signInGoogle();
    expect(owner.status).toBe(200);
    const ownerId = local.db.user[0].id;
    const other = await local.signUpPassword("other@example.test");
    local.profile.email = other.user.email;
    const before = structuredClone(local.db);

    const response = await local.request("/link-social", { provider: "google", idToken: { token: ID_TOKEN } }, other.cookie);

    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({ code: "SOCIAL_ACCOUNT_ALREADY_LINKED" });
    expect(local.db).toEqual(before);
    expect(local.db.account.find((account) => account.providerId === "google")?.userId).toBe(ownerId);
  });

  it("refuses to unlink the last sign-in method", async () => {
    const local = await createTestAuth();
    const signedIn = await local.signInGoogle();
    expect(signedIn.status).toBe(200);
    const before = structuredClone(local.db);
    const response = await local.request("/unlink-account", { accountId: local.db.account[0].id }, cookiesFrom(signedIn));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ code: "FAILED_TO_UNLINK_LAST_ACCOUNT" });
    expect(local.db).toEqual(before);
  });

  it("rejects an ID token the isolated verifier does not accept before reading a profile", async () => {
    const local = await createTestAuth();
    const response = await local.request("/sign-in/social", { provider: "google", idToken: { token: "unrecognized-token" } });

    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "INVALID_TOKEN" });
    expect(local.verifyIdToken).toHaveBeenCalledOnce();
    expect(local.getUserInfo).not.toHaveBeenCalled();
    expectNoIdentityRecords(local.db);
  });
});
