import { expect } from "@open-wc/testing";
import { isCrossOriginURL, iframeSandboxForSource } from "../lib/url.js";

// allow-scripts together with allow-same-origin is only safe when the framed
// document has a real foreign origin. Sources with an opaque or inherited
// origin (javascript:, about:, data:, blob:) would run as the embedding page
// (or be able to drop their own sandbox), so they must get the strict value.
const STRICT = "allow-scripts";
const LOOSE = "allow-scripts allow-same-origin";

describe("utils isCrossOriginURL: only http(s) can be cross-origin", () => {
  const notCrossOrigin = [
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "  javascript:alert(1)",
    "about:blank",
    "about:srcdoc",
    "data:text/html,<p>x</p>",
    "vbscript:msgbox(1)",
    "blob:https://other.example/1234",
    "file:///etc/passwd",
  ];
  notCrossOrigin.forEach((value) => {
    it(`treats ${value} as not cross-origin`, () => {
      expect(isCrossOriginURL(value)).to.be.false;
    });
  });

  it("still reports other http(s) hosts as cross-origin", () => {
    expect(isCrossOriginURL("https://www.youtube.com/embed/abc")).to.be.true;
    expect(isCrossOriginURL("http://other.example/page")).to.be.true;
    expect(isCrossOriginURL("//other.example/page")).to.be.true;
  });

  it("reports same-origin and relative URLs as not cross-origin", () => {
    expect(isCrossOriginURL(globalThis.location.origin + "/x")).to.be.false;
    expect(isCrossOriginURL("/files/page")).to.be.false;
    expect(isCrossOriginURL("page.html")).to.be.false;
  });

  it("treats empty and unparseable values as not cross-origin", () => {
    expect(isCrossOriginURL("")).to.be.false;
    expect(isCrossOriginURL(null)).to.be.false;
    expect(isCrossOriginURL(undefined)).to.be.false;
    expect(isCrossOriginURL("http://[")).to.be.false;
  });
});

describe("utils iframeSandboxForSource", () => {
  [
    "javascript:alert(1)",
    "about:blank",
    "data:text/html,<p>x</p>",
    "blob:https://other.example/1234",
  ].forEach((value) => {
    it(`gives ${value} the strict sandbox`, () => {
      expect(iframeSandboxForSource(value)).to.equal(STRICT);
    });
  });

  it("keeps allow-same-origin for real cross-origin embeds", () => {
    expect(
      iframeSandboxForSource("https://www.youtube.com/embed/abc"),
    ).to.equal(LOOSE);
  });

  it("gives same-origin and missing sources the strict sandbox", () => {
    expect(iframeSandboxForSource("/files/page")).to.equal(STRICT);
    expect(iframeSandboxForSource("")).to.equal(STRICT);
    expect(iframeSandboxForSource(null)).to.equal(STRICT);
  });

  it("an about:blank frame using the returned sandbox is isolated from the page", async () => {
    // with allow-same-origin an about:blank frame shares the page's origin
    // and its document is reachable from the parent (and vice versa); with
    // the strict value its origin is opaque and contentDocument is null
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox", iframeSandboxForSource("about:blank"));
    frame.setAttribute("src", "about:blank");
    // wait for the load, but never longer than a second, so a regression
    // fails this assertion instead of hanging the run
    const loaded = new Promise((resolve) => {
      frame.addEventListener("load", resolve, { once: true });
      setTimeout(resolve, 1000);
    });
    document.body.appendChild(frame);
    await loaded;
    try {
      // compare as a boolean: a failing assertion that tries to print a
      // live Document can stall the test reporter
      expect(
        frame.contentDocument === null,
        "the framed document is reachable from the page (allow-same-origin granted)",
      ).to.be.true;
    } finally {
      frame.remove();
    }
  });
});
