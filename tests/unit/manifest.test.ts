import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

describe("PWA manifest", () => {
  it("exports valid web app manifest with standalone display and brand icons", () => {
    const data = manifest();

    expect(data.name).toContain("CareCircle");
    expect(data.short_name).toBe("CareCircle");
    expect(data.start_url).toBe("/dashboard");
    expect(data.display).toBe("standalone");
    expect(data.theme_color).toBe("#356859");
    expect(data.background_color).toBe("#F8FAF7");

    expect(data.icons).toBeDefined();
    expect(data.icons?.length).toBeGreaterThanOrEqual(2);

    const icon192 = data.icons?.find((i) => i.sizes === "192x192");
    expect(icon192).toBeDefined();
    expect(icon192?.src).toBe("/brand/icon-192.png");

    const icon512 = data.icons?.find((i) => i.sizes === "512x512" && i.purpose === "any");
    expect(icon512).toBeDefined();
    expect(icon512?.src).toBe("/brand/icon-512.png");

    const maskable = data.icons?.find((i) => i.purpose === "maskable");
    expect(maskable).toBeDefined();
    expect(maskable?.src).toBe("/brand/icon-maskable-512.png");
  });
});
