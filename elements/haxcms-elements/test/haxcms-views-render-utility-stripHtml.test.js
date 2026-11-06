import { expect } from "@open-wc/testing";
import { stripHtml } from "../lib/core/utils/haxcms-views-render-utility.js";

describe("haxcms-views-render-utility stripHtml", () => {
  it("removes tags and collapses whitespace", () => {
    expect(stripHtml("<p>Hello   <b>world</b></p>\n<p>again</p>")).to.equal(
      "Hello world again",
    );
    expect(stripHtml(null)).to.equal("");
  });
  it("does not leave a tag behind for nested input", () => {
    const out = stripHtml("<<b>script>alert(1)<</b>/script>");
    expect(out).to.not.contain("<script");
    expect(out).to.not.contain("</script");
  });
});

describe("haxcms-views-render-utility stripHtml performance", () => {
  it("handles long runs of '<' in linear time", () => {
    // keeps a time limit because it guards quadratic behavior on long
    // "<" runs; normal is ~1ms, so 1000ms is far above 5x. Fastest of 3 so
    // one GC pause or busy runner cannot fail it.
    let best = Infinity;
    for (let run = 0; run < 3; run++) {
      const start = performance.now();
      stripHtml("<".repeat(100000));
      best = Math.min(best, performance.now() - start);
    }
    expect(best).to.be.below(1000);
  });
});
