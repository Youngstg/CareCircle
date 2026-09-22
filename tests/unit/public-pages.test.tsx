import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import AuthLayout from "@/app/(auth)/layout";
import Home from "@/app/page";
import { Logo } from "@/components/ui/logo";

// Assert React's controlled server output without a browser, database, or DOM runner.
const home = renderToStaticMarkup(<Home />);

function attribute(tag: string, name: string) {
  return new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1].replaceAll("&amp;", "&");
}

function links(markup: string) {
  return [...markup.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)].map(([tag]) => ({
    href: attribute(tag, "href"),
    label: tag.replace(/<[^>]*>/g, "").trim(),
    markup: tag,
  }));
}

function imageSource(tag: string) {
  const source = attribute(tag, "src") ?? "";
  expect(source).toMatch(/^\/(?!\/)/);
  const url = new URL(source, "https://carecircle.test");
  return url.pathname === "/_next/image" ? url.searchParams.get("url") : url.pathname;
}

function readPublicAsset(source: string) {
  expect(source).toMatch(/^\/(?:images|brand)\/[\w.-]+$/);
  return readFileSync(new URL(`../../public${source}`, import.meta.url));
}

function expectPhoto(markup: string, source: string, description: RegExp) {
  const tags = [...markup.matchAll(/<img\b[^>]*>/g)]
    .map(([tag]) => tag)
    .filter((tag) => imageSource(tag) === source);
  expect(tags).toHaveLength(1);
  expect(attribute(tags[0], "alt")).toMatch(description);
  const bytes = readPublicAsset(source);
  expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
  expect(bytes.toString("ascii", 8, 12)).toBe("WEBP");
}

describe("public homepage", () => {
  it.each(["header", "footer"])("preserves public navigation in the %s", (region) => {
    const markup = new RegExp(`<${region}\\b[^>]*>[\\s\\S]*?<\\/${region}>`).exec(home)?.[0];
    expect(markup).toBeDefined();
    const navigation = links(markup!);
    for (const [href, label] of [
      ["#cara-kerja", "Cara kerja"],
      ["#privasi", "Privasi"],
      ["/sign-up", "Buat akun"],
      ["/sign-in", "Masuk"],
    ]) {
      expect(navigation).toEqual(expect.arrayContaining([expect.objectContaining({ href, label })]));
    }
  });

  it("resolves every fragment link to a unique target inside main", () => {
    const main = /<main\b[^>]*>[\s\S]*?<\/main>/.exec(home)?.[0] ?? "";
    const ids = [...main.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const fragments = links(home).filter((link) => link.href?.startsWith("#"));
    expect(fragments.length).toBeGreaterThan(0);
    for (const { href } of fragments) {
      expect(ids.filter((id) => id === href!.slice(1))).toHaveLength(1);
    }
  });

  it("has one primary heading and a first-link keyboard skip target", () => {
    expect([...home.matchAll(/<h1\b/g)]).toHaveLength(1);
    const main = /<main\b[^>]*>/.exec(home)?.[0] ?? "";
    expect(attribute(main, "tabindex")).toBe("-1");
    expect(links(home)[0]).toMatchObject({
      href: `#${attribute(main, "id")}`,
      label: "Lewati ke konten utama",
    });
  });

  it("prioritizes the hero image and defers supporting photos", () => {
    const images = [...home.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
    const hero = images.find((tag) => imageSource(tag) === "/images/family-together.webp");
    expect(hero).toBeDefined();
    expect(attribute(hero!, "loading")).toBe("eager");
    expect(hero).toMatch(/fetchpriority="high"/i);
    for (const source of ["/images/family-moment.webp", "/images/family-connection.webp"]) {
      const image = images.find((tag) => imageSource(tag) === source);
      expect(image).toBeDefined();
      expect(attribute(image!, "loading")).toBe("lazy");
    }
  });

  it.each([
    { source: "/images/family-together.webp", description: /keluarga.*dapur/i },
    { source: "/images/family-moment.webp", description: /laptop.*catatan/i },
    { source: "/images/family-connection.webp", description: /perempuan.*tangan/i },
  ])("renders a descriptive local photo: $source", ({ source, description }) => {
    expectPhoto(home, source, description);
  });
});

describe("public logo", () => {
  it.each([false, true])("keeps an accessible home link with compact=%s", (compact) => {
    const markup = renderToStaticMarkup(<Logo compact={compact} />);
    const navigation = links(markup);
    expect(navigation).toHaveLength(1);
    expect(navigation[0]).toMatchObject({ href: "/", label: compact ? "" : "CareCircle" });
    expect(attribute(navigation[0].markup, "aria-label")).toBe("CareCircle, halaman utama");
    const mark = /<img\b[^>]*>/.exec(markup)?.[0] ?? "";
    expect(attribute(mark, "alt")).toBe("");
    expect(imageSource(mark)).toBe("/brand/carecircle-mark.svg");
  });

  it("uses the same scalable mark for branding and the app icon", () => {
    const mark = readPublicAsset("/brand/carecircle-mark.svg").toString("utf8");
    const icon = readFileSync(new URL("../../src/app/icon.svg", import.meta.url), "utf8");
    expect(mark).toBe(icon);
    expect(attribute(mark, "xmlns")).toBe("http://www.w3.org/2000/svg");
    const viewBox = (attribute(mark, "viewBox") ?? "").split(/\s+/).map(Number);
    expect(viewBox).toHaveLength(4);
    expect(viewBox.every(Number.isFinite)).toBe(true);
    expect(viewBox[2]).toBeGreaterThan(0);
    expect(viewBox[3]).toBeGreaterThan(0);
    const favicon = readFileSync(new URL("../../src/app/favicon.ico", import.meta.url));
    expect(favicon.readUInt16LE(2)).toBe(1);
    expect(favicon.readUInt16LE(4)).toBeGreaterThan(0);
  });
});

// Inert children avoid importing authentication actions or accessing the database.
const authContent = (
  <form aria-label="Formulir akun">
    <h1>Masuk ke CareCircle</h1>
    <label htmlFor="public-test-email">Email</label>
    <input id="public-test-email" name="email" type="email" />
    <button type="submit">Masuk</button>
  </form>
);
const auth = renderToStaticMarkup(<AuthLayout>{authContent}</AuthLayout>);

describe("public authentication layout", () => {
  it("preserves the supplied form and its primary heading inside main", () => {
    const main = /<main\b[^>]*>[\s\S]*?<\/main>/.exec(auth)?.[0] ?? "";
    expect(main).toContain(renderToStaticMarkup(authContent));
    expect([...auth.matchAll(/<h1\b/g)]).toHaveLength(1);
  });

  it("keeps the non-medical disclaimer outside the form", () => {
    const disclaimer = "CareCircle membantu koordinasi non-medis dan tidak menggantikan panduan tenaga profesional.";
    expect(auth.split(disclaimer)).toHaveLength(2);
    const form = /<form\b[^>]*>[\s\S]*?<\/form>/.exec(auth)?.[0] ?? "";
    expect(form).not.toContain(disclaimer);
  });

  it("keeps a descriptive companion photo in a labelled aside", () => {
    const aside = /<aside\b[^>]*>[\s\S]*?<\/aside>/.exec(auth)?.[0] ?? "";
    const heading = /<h2\b[^>]*>/.exec(aside)?.[0] ?? "";
    expect(attribute(aside, "aria-labelledby")).toBe("auth-story-title");
    expect(attribute(heading, "id")).toBe("auth-story-title");
    expectPhoto(aside, "/images/family-connection.webp", /perempuan.*tangan/i);
  });
});
