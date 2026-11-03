import { expect } from "@open-wc/testing";

import { DDDReadingSurface, dddReadingProse } from "../lib/DDDReading.js";
import { DDDVariables } from "../lib/DDDStyles.js";

describe("DDDReading", () => {
  it("declares the reading line height token", () => {
    expect(DDDVariables.cssText).to.include("--ddd-lh-170: 170%");
  });

  it("reading surface uses DDD tokens for color, line height and measure", () => {
    const text = DDDReadingSurface.cssText;
    expect(text).to.include(".ddd-reading");
    expect(text).to.include("--ddd-lh-170");
    expect(text).to.include("--ddd-theme-default-coalyGray");
    expect(text).to.include("--ddd-theme-default-limestoneMaxLight");
    expect(text).to.include("--ddd-theme-measure: var(--ddd-content-width-sm)");
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
