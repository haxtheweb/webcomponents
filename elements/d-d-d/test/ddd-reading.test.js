import { expect } from "@open-wc/testing";

import { DDDReadingSurface, dddReadingProse } from "../lib/DDDReading.js";
import { DDDVariables } from "../lib/DDDStyles.js";

describe("DDDReading", () => {
  it("declares the reading line height token", () => {
    expect(DDDVariables.cssText).to.include("--ddd-lh-170: 170%");
  });

  it("reading surface uses DDD tokens for line height and measure", () => {
    const text = DDDReadingSurface.cssText;
    expect(text).to.include(".ddd-reading");
    expect(text).to.include("--ddd-lh-170");
    expect(text).to.include("--ddd-theme-measure: var(--ddd-content-width-sm)");
    // the reading color lives on running text, so headings keep the theme's
    expect(text).to.not.include("color:");
  });

  it("colors running text, not headings, with DDD reading tokens", () => {
    const text = dddReadingProse("clean-one").cssText;
    expect(text).to.include("--ddd-theme-default-coalyGray");
    expect(text).to.include("--ddd-theme-default-limestoneMaxLight");
    expect(text).to.match(
      /clean-one > :is\(p, ul, ol, dl, blockquote\) \{\s*color: light-dark/,
    );
    // no rule that selects headings sets a color
    expect(text).to.not.match(/h[1-6][^{}]*\{[^}]*\bcolor:/);
  });

  it("keeps a start-aligned blockquote's indent inside the measure", () => {
    const start = dddReadingProse("training-theme", "start").cssText;
    expect(start).to.include("training-theme > blockquote");
    expect(start).to.match(/-\s+var\(\s*--ddd-spacing-10\s*\)/);
    expect(dddReadingProse("clean-two").cssText).to.not.include(
      "clean-two > blockquote",
    );
  });

  it("scopes prose rules to direct children of the theme tag", () => {
    const text = dddReadingProse("clean-one").cssText;
    expect(text).to.include("clean-one > :is(p, ul, ol, dl, blockquote");
    expect(text).to.include("clean-one > p");
    expect(text).to.include("body.dark-mode clean-one >");
    expect(text).to.include("var(--ddd-spacing-8)");
    // media, tables and other elements are never capped
    expect(text).to.not.include("table");
    expect(text).to.not.include("video-player");
  });

  it("centers capped prose by default and keeps it on the start edge on request", () => {
    expect(dddReadingProse("clean-two").cssText).to.include(
      "margin-inline: auto",
    );
    const start = dddReadingProse("polaris-invent-theme", "start").cssText;
    expect(start).to.include("margin-inline-end: auto");
    expect(start).to.not.include("margin-inline: auto");
  });

  it("returns empty CSS for anything that is not a custom element name", () => {
    expect(dddReadingProse("p").cssText).to.equal("");
    expect(dddReadingProse("clean-one, body").cssText).to.equal("");
    expect(dddReadingProse("x-y{}").cssText).to.equal("");
  });
});
