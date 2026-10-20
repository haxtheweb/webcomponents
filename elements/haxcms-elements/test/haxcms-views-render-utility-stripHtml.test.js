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
    const start = performance.now();
    stripHtml("<".repeat(100000));
    expect(performance.now() - start).to.be.below(1000);
  });
});
