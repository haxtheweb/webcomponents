import { expect } from "@open-wc/testing";
import {
  a11yMediaFallbackHTML,
  removeA11yMediaFallback,
} from "../lib/a11y-media-fallback.js";

describe("a11y-media-fallback", () => {
  it("links the media and its tracks, escaped, in a slot nothing defines", () => {
    const html = a11yMediaFallbackHTML({
      source: "https://example.com/v.mp4?a=1&b=2",
      mediaTitle: "A <b> title",
      tracks: [
        {
          src: "https://example.com/en.vtt",
          label: "English",
          kind: "captions",
        },
      ],
    });
    expect(html).to.contain('slot="prog-fallback"');
    expect(html).to.contain("data-prog-fallback");
    expect(html).to.contain('href="https://example.com/v.mp4?a=1&amp;b=2"');
    expect(html).to.contain("A &lt;b&gt; title");
    expect(html).to.contain("Captions (English)");
  });

  it("falls back to sources, a youtube id, a single track and JSON tracks", () => {
    expect(
      a11yMediaFallbackHTML({ sources: [{ src: "files/v.mp4" }] }),
    ).to.contain('href="files/v.mp4"');
    expect(a11yMediaFallbackHTML({ youtubeId: "abc" })).to.contain(
      "https://www.youtube.com/watch?v=abc",
    );
    expect(
      a11yMediaFallbackHTML({ source: "a.mp4", track: "t.vtt" }),
    ).to.contain('href="t.vtt"');
    expect(
      a11yMediaFallbackHTML({
        source: "a.mp4",
        tracks: '[{"src":"x.vtt","srclang":"es"}]',
      }),
    ).to.contain("Subtitles (es)");
  });

  it("returns nothing without a usable link and drops unsafe URLs", () => {
    expect(a11yMediaFallbackHTML({})).to.equal("");
    expect(a11yMediaFallbackHTML({ source: "javascript:alert(1)" })).to.equal(
      "",
    );
    expect(
      a11yMediaFallbackHTML({
        source: "a.mp4",
        tracks: [{ src: "javascript:alert(1)" }],
      }),
    ).to.not.contain("<li>");
  });

  it("removes the fallback from an element", () => {
    const el = document.createElement("div");
    el.innerHTML = "<p>keep</p><div data-prog-fallback>drop</div>";
    removeA11yMediaFallback(el);
    expect(el.innerHTML).to.equal("<p>keep</p>");
  });
});
