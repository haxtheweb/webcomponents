import { expect } from "@open-wc/testing";
import { mergeGoogleFontsURLs } from "../lib/DesignSystemManager.js";
import { DDDFonts } from "../lib/DDDStyles.js";

describe("DesignSystemManager font loading", () => {
  it("loads the three DDD families from one Google Fonts request", () => {
    const merged = mergeGoogleFontsURLs(DDDFonts);
    expect(merged.length).to.equal(1);
    const url = new URL(merged[0]);
    expect(url.hostname).to.equal("fonts.googleapis.com");
    expect(url.pathname).to.equal("/css2");
    expect(url.searchParams.getAll("family")).to.deep.equal(
      DDDFonts.map((f) => new URL(f).searchParams.get("family")),
    );
    expect(url.searchParams.get("display")).to.equal("swap");
    // the css2 syntax survives as Google writes it
    expect(merged[0]).to.contain("family=Roboto+Slab:wght@300;400;500;700;900");
  });

  it("keeps other stylesheets and differing display values apart", () => {
    const merged = mergeGoogleFontsURLs([
      "https://example.com/fonts.css",
      "https://fonts.googleapis.com/css2?family=A&display=swap",
      "https://fonts.googleapis.com/css2?family=B&display=optional",
      "https://fonts.googleapis.com/css2?family=C&display=swap",
      "https://fonts.googleapis.com/css2?family=D&text=abc",
      "https://fonts.googleapis.com/css?family=Old",
    ]);
    expect(merged).to.deep.equal([
      "https://example.com/fonts.css",
      "https://fonts.googleapis.com/css2?family=A&family=C&display=swap",
      "https://fonts.googleapis.com/css2?family=B&display=optional",
      "https://fonts.googleapis.com/css2?family=D&text=abc",
      "https://fonts.googleapis.com/css?family=Old",
    ]);
  });

  it("the active system adds a single font link", async () => {
    const manager = globalThis.DesignSystemManager.requestAvailability();
    manager.addDesignSystem({
      name: "fonts-test-system",
      styles: [],
      fonts: DDDFonts,
    });
    manager.active = "fonts-test-system";
    await manager.updateComplete;
    const links = globalThis.document.head.querySelectorAll(
      'link[data-ds="font"]',
    );
    expect(links.length).to.equal(1);
    expect(links[0].getAttribute("fetchpriority")).to.equal("low");
  });

  it("is empty for no fonts", () => {
    expect(mergeGoogleFontsURLs(undefined)).to.deep.equal([]);
  });
});
