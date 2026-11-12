import { expect } from "@open-wc/testing";
import {
  vhsBlogCase,
  vhsBlogContrast,
  vhsBlogSpineSize,
  vhsBlogHash,
  VHS_BLOG_PALETTES,
  VHS_BLOG_FACES,
  VHS_BLOG_STICKERS,
} from "../lib/vhs-blog-case.js";

// a spread of real-world titles, short and very long
const TITLES = [
  "Dood",
  "Pure Joy",
  "The Climb",
  "Reclaim the web",
  "OCCUPY... the bridge",
  "Golden, shimmering, joy",
  "Open source CMS - The 4th turning",
  "The LMS is Cable, We are Roku. Expect Us",
  "Singularity, Digital Activism, and saving our institutions",
  "",
];

describe("vhs-blog case generator", () => {
  it("every palette ink reads at 4.5:1 or better on its case", () => {
    VHS_BLOG_PALETTES.forEach(([bg, ink]) => {
      expect(vhsBlogContrast(bg, ink)).to.be.at.least(4.5);
    });
  });

  it("every sticker colour reads at 4.5:1 with its sticker ink", () => {
    VHS_BLOG_STICKERS.forEach((bg) => {
      expect(vhsBlogContrast(bg, "#1b1b1b")).to.be.at.least(4.5);
    });
  });

  it("uses no decorative display faces for titles", () => {
    const names = VHS_BLOG_FACES.map((f) => f[0]);
    expect(names).to.not.include("Monoton");
  });

  it("only colours title text with an accent that reads at 4.5:1", () => {
    // sweep many titles so every palette and treatment gets exercised
    for (let i = 0; i < 2000; i++) {
      const c = vhsBlogCase("post number " + i);
      if (c.last) {
        expect(c.treatment).to.equal("twotone");
        expect(vhsBlogContrast(c.bg, c.accent)).to.be.at.least(4.5);
      }
      if (c.treatment === "shadow") {
        // shadows only sit under light ink
        expect(vhsBlogContrast(c.ink, "#000000")).to.be.above(7);
      }
    }
  });

  it("never sets a spine title below 18px", () => {
    for (let len = 1; len < 120; len++) {
      VHS_BLOG_FACES.forEach((f) => {
        expect(vhsBlogSpineSize(len, f[5])).to.be.at.least(18);
      });
    }
  });

  it("is deterministic per title and seed", () => {
    TITLES.forEach((t) => {
      expect(vhsBlogCase(t)).to.deep.equal(vhsBlogCase(t));
    });
    expect(vhsBlogHash("Reclaim the web", 1)).to.equal(
      vhsBlogHash("Reclaim the web", 1),
    );
    // a seed re-rolls the case without renaming the post
    let differs = false;
    for (let s = 1; s < 10; s++) {
      if (
        JSON.stringify(vhsBlogCase("Reclaim the web", s)) !==
        JSON.stringify(vhsBlogCase("Reclaim the web"))
      ) {
        differs = true;
      }
    }
    expect(differs).to.equal(true);
  });

  it("keeps the whole title in the two-tone split", () => {
    TITLES.forEach((t) => {
      const c = vhsBlogCase(t);
      const joined = c.last ? c.first + " " + c.last : c.first;
      expect(joined.replace(/\s+/g, " ")).to.equal(
        (t.trim() || "Untitled").replace(/\s+/g, " "),
      );
    });
  });
});
