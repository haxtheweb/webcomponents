import { expect } from "@open-wc/testing";
import {
  isCrossOriginURL,
  isSameOriginUploadedMarkup,
  iframeSandboxForSource,
  sanitizeEmbeddableURL,
  urlHostMatches,
} from "../lib/url.js";
import { trimLineEdges, findClosingCustomTags } from "../lib/safe-html.js";

// Security-relevant URL helpers that decide how content is framed:
// iframe-loader and hax-store give every iframe the sandbox from
// iframeSandboxForSource(), and both refuse to frame same-origin uploads
// (isSameOriginUploadedMarkup). allow-scripts together with
// allow-same-origin on a document that runs with this page's origin lets it
// remove its own sandbox, so only real cross-origin sources may get it.
// Also covers two linear-time replacements for old regexes in safe-html.js
// that had no browser tests: trimLineEdges (hax-view-source) and
// findClosingCustomTags, each checked against the regex it replaced.

const here = globalThis.location;
const STRICT = "allow-scripts";
const LOOSE = "allow-scripts allow-same-origin";

// seeded PRNG so fuzz failures reproduce (not used for anything secret)
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

describe("iframe / URL safety helpers", () => {
  describe("isCrossOriginURL", () => {
    it("is false for this page's own origin in any form", () => {
      [
        "/files/doc.pdf",
        "files/doc.pdf",
        "./x",
        "?q=1",
        "#frag",
        here.href,
        `${here.origin}/some/path`,
        `//${here.host}/path`,
      ].forEach((value) => {
        expect(isCrossOriginURL(value), value).to.equal(false);
      });
    });

    it("is true for other hosts, ports and schemes", () => {
      const otherPort = `${here.protocol}//${here.hostname}:${
        Number(here.port || 80) + 1
      }/x`;
      [
        "https://example.com/embed",
        "//example.com/embed",
        "https://www.youtube.com/embed/abc",
        otherPort,
      ].forEach((value) => {
        expect(isCrossOriginURL(value), value).to.equal(true);
      });
      if (here.protocol === "http:") {
        expect(isCrossOriginURL(`https://${here.host}/x`)).to.equal(true);
      }
    });

    it("is false for empty and unparseable values", () => {
      [null, undefined, "", "http://[bad"].forEach((value) => {
        expect(isCrossOriginURL(value), String(value)).to.equal(false);
      });
    });
  });

  describe("iframeSandboxForSource", () => {
    it("never allows same-origin for same-origin sources", () => {
      [
        "/files/page.html",
        "files/embed/index.html",
        `${here.origin}/x`,
      ].forEach((src) => {
        expect(iframeSandboxForSource(src), src).to.equal(STRICT);
      });
    });

    it("allows same-origin only for cross-origin http(s) sources", () => {
      expect(iframeSandboxForSource("https://example.com/e")).to.equal(LOOSE);
      expect(iframeSandboxForSource("//cdn.example.org/e")).to.equal(LOOSE);
    });

    it("uses the strict sandbox for missing or unparseable sources", () => {
      [null, undefined, "", "http://[bad"].forEach((src) => {
        expect(iframeSandboxForSource(src), String(src)).to.equal(STRICT);
      });
    });

    // javascript: / about: frames run as the embedding page, so they never
    // get allow-same-origin
    it("uses the strict sandbox for javascript: and about: sources", () => {
      ["javascript:alert(1)", "JavaScript:void(0)", "about:blank"].forEach(
        (src) => {
          expect(iframeSandboxForSource(src), src).to.equal(STRICT);
        },
      );
    });
  });

  describe("isSameOriginUploadedMarkup", () => {
    it("flags uploaded html / xml documents on this origin", () => {
      [
        "/files/page.html",
        "/files/page.htm",
        "/files/page.xhtml",
        "/files/data.xml",
        "/files/nested/dir/PAGE.HTML",
        "files/page.html",
        `${here.origin}/site/files/page.html`,
        "/files/page.html?x=1#y",
      ].forEach((value) => {
        expect(isSameOriginUploadedMarkup(value), value).to.equal(true);
      });
    });

    it("leaves other files, folders and origins alone", () => {
      [
        "/files/doc.pdf",
        "/files/image.png",
        "/files/page.html.png",
        "/pages/page/index.html",
        "/filesx/page.html",
        "https://example.com/files/page.html",
        "",
        null,
        "http://[bad",
      ].forEach((value) => {
        expect(isSameOriginUploadedMarkup(value), String(value)).to.equal(
          false,
        );
      });
    });

    it("stays fast on long hostile paths", () => {
      const hostile = `/files/${"a/".repeat(20000)}x.htm${"l".repeat(5)}`;
      const start = performance.now();
      expect(isSameOriginUploadedMarkup(hostile)).to.equal(false);
      expect(performance.now() - start).to.be.lessThan(250);
    });
  });

  describe("sanitizeEmbeddableURL", () => {
    it("keeps http(s), relative and protocol-relative URLs", () => {
      [
        "https://example.com/a",
        "http://example.com/a",
        "/files/a.pdf",
        "files/a.pdf",
        "//example.com/a",
      ].forEach((value) => {
        expect(sanitizeEmbeddableURL(value), value).to.equal(value);
      });
      expect(sanitizeEmbeddableURL("  https://example.com/a  ")).to.equal(
        "https://example.com/a",
      );
    });

    it("returns the fallback for script, data and other schemes", () => {
      [
        "javascript:alert(1)",
        " JaVaScRiPt:alert(1)",
        "java\nscript:alert(1)",
        "java\u0000script:alert(1)",
        "data:text/html,<p>x</p>",
        "vbscript:msgbox(1)",
        "ftp://example.com/file",
        "about:blank",
        "blob:https://example.com/uuid",
        "",
        null,
        42,
      ].forEach((value) => {
        expect(
          sanitizeEmbeddableURL(value, "FALLBACK"),
          String(value),
        ).to.equal("FALLBACK");
      });
    });
  });

  describe("urlHostMatches", () => {
    it("matches the host and its subdomains only", () => {
      expect(
        urlHostMatches("https://youtube.com/watch", "youtube.com"),
      ).to.equal(true);
      expect(
        urlHostMatches("https://www.YouTube.com/watch", [
          "vimeo.com",
          "youtube.com",
        ]),
      ).to.equal(true);
      [
        "https://evil.example/?u=youtube.com",
        "https://youtube.com.evil.example/",
        "https://notyoutube.com/",
        "javascript://youtube.com/%0aalert(1)",
        "/youtube.com/path",
      ].forEach((value) => {
        expect(urlHostMatches(value, "youtube.com"), value).to.equal(false);
      });
    });

    it("only treats scheme-less values as https when asked to", () => {
      expect(urlHostMatches("youtu.be/abc", "youtu.be")).to.equal(false);
      expect(
        urlHostMatches("youtu.be/abc", "youtu.be", { allowSchemeless: true }),
      ).to.equal(true);
      expect(
        urlHostMatches("/youtu.be/abc", "youtu.be", { allowSchemeless: true }),
      ).to.equal(false);
      expect(
        urlHostMatches("#youtu.be", "youtu.be", { allowSchemeless: true }),
      ).to.equal(false);
    });

    it("ignores empty domains and bad input", () => {
      expect(urlHostMatches("https://example.com", ["", null])).to.equal(false);
      expect(urlHostMatches("", "example.com")).to.equal(false);
      expect(urlHostMatches(null, "example.com")).to.equal(false);
      expect(urlHostMatches("http://[bad", "example.com")).to.equal(false);
    });
  });
});

describe("linear safe-html replacements", () => {
  const regexTrimLineEdges = (text) => text.replace(/^\s+|\s+$/gm, "");
  // the regex findClosingCustomTags replaced
  const regexClosingTags = (html) => {
    const tags = {};
    const found = html.match(/<\/[a-z,0-9]*-[^\s>]*>/g) || [];
    found.forEach((t) => {
      const tag = t.slice(2, -1);
      tags[tag] = tag;
    });
    return tags;
  };

  describe("trimLineEdges", () => {
    it("trims whitespace at the start and end of every line", () => {
      expect(trimLineEdges("  a  \n\t b \n")).to.equal("a\nb");
      expect(trimLineEdges("<p>\n    <b>x</b>\n</p>")).to.equal(
        "<p>\n<b>x</b>\n</p>",
      );
      expect(trimLineEdges("")).to.equal("");
      expect(trimLineEdges("   ")).to.equal("");
      expect(trimLineEdges("a  b")).to.equal("a  b");
    });

    it("matches the regex it replaced on random input", () => {
      const rand = rng(20261106);
      const alphabet = [" ", "\t", "\n", "\r", "\r\n", " ", "a", "b", "<", ">"];
      for (let run = 0; run < 500; run++) {
        let text = "";
        const len = Math.floor(rand() * 40);
        for (let i = 0; i < len; i++) {
          text += alphabet[Math.floor(rand() * alphabet.length)];
        }
        expect(trimLineEdges(text), JSON.stringify(text)).to.equal(
          regexTrimLineEdges(text),
        );
      }
    });

    it("stays linear on long whitespace runs", () => {
      const text = `x${" ".repeat(200000)}y`;
      const start = performance.now();
      expect(trimLineEdges(text)).to.equal(text);
      expect(performance.now() - start).to.be.lessThan(500);
    });
  });

  describe("findClosingCustomTags", () => {
    it("collects closing custom element tags", () => {
      expect(
        findClosingCustomTags(
          "<my-el></my-el><p></p><x-y a></x-y><my-el></my-el></video-player >",
        ),
      ).to.deep.equal({ "my-el": "my-el", "x-y": "x-y" });
      expect(findClosingCustomTags("<p>no custom tags</p>")).to.deep.equal({});
    });

    it("matches the regex it replaced on random input", () => {
      const rand = rng(424242);
      const pieces = ["</", "a", "b-", "-", "1", ",", ">", " ", "x", "<", "\n"];
      for (let run = 0; run < 500; run++) {
        let html = "";
        const len = Math.floor(rand() * 30);
        for (let i = 0; i < len; i++) {
          html += pieces[Math.floor(rand() * pieces.length)];
        }
        expect(findClosingCustomTags(html), JSON.stringify(html)).to.deep.equal(
          regexClosingTags(html),
        );
      }
    });

    it("stays linear on many unterminated candidates", () => {
      const html = "</a-".repeat(50000);
      const start = performance.now();
      expect(findClosingCustomTags(html)).to.deep.equal({});
      expect(performance.now() - start).to.be.lessThan(500);
    });
  });
});
