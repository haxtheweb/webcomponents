import { expect } from "@open-wc/testing";
import { stripHtmlComments } from "../lib/stripHtmlComments.js";

describe("stripHtmlComments", () => {
  it("removes comments, including ones with digits and parentheses", () => {
    expect(stripHtmlComments("a<!-- c1 (x) -->b<!-- 2 -->c")).to.equal("abc");
    expect(stripHtmlComments("<!--\nmulti\nline\n-->x")).to.equal("x");
  });
  it("does not leave a comment opener behind for nested input", () => {
    expect(stripHtmlComments("a<!<!-- x -->-- y -->b")).to.equal("ab");
  });
  it("handles empty input and unterminated comments", () => {
    expect(stripHtmlComments("")).to.equal("");
    expect(stripHtmlComments(null)).to.equal("");
    expect(stripHtmlComments("x<!-- never closed")).to.equal(
      "x<!-- never closed",
    );
  });
});
