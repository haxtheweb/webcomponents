import { expect } from "@open-wc/testing";
import {
  a11yFindings,
  contentMark,
  contrastRatio,
  elementPath,
  findByMark,
  findByPath,
  markText,
  parseMark,
  replayLink,
  issueUrl,
  openIssuesUrl,
  packBundle,
  pathText,
  placeholderAssets,
  replayBundle,
  reportTitle,
  translateUrl,
  unpackBundle,
  URL_BUDGET,
} from "../lib/core/ui/haxcms-goggles-report.js";

const issue = (more) =>
  Object.assign(
    {
      kind: "bug",
      title: "Captions overlap",
      notes: "The captions cover the controls.",
      tag: "video-player",
      file: "video-player/video-player.js",
      path: [
        { tag: "haxcms-site-builder", n: 0 },
        { tag: "video-player", n: 1 },
      ],
      page: "Intro (/intro)",
      theme: "clean-one",
      designSystem: "ddd",
      build: "master at abc123",
      lang: "es",
      viewport: "1280 x 720 @1x",
      scheme: "dark",
      edit: false,
      agent: "test",
      errors: ["boom"],
      makers: ["btopro"],
      markup: "<video-player></video-player>",
    },
    more || {},
  );

describe("haxcms-goggles reports", () => {
  it("puts the tag first, in backticks, with a word for each kind", () => {
    expect(reportTitle("bug", "video-player", "Captions overlap")).to.equal(
      "`video-player` bug: Captions overlap",
    );
    expect(reportTitle("wish", "video-player", "Chapters")).to.equal(
      "`video-player` idea: Chapters",
    );
    expect(reportTitle("docs", "video-player", "Which source?")).to.equal(
      "`video-player` docs: Which source?",
    );
    expect(reportTitle("a11y", "video-player", "")).to.equal(
      "`video-player` a11y: needs a look",
    );
  });

  it("opens the kind's issue form, prefilled, with no labels parameter", () => {
    const { url, left } = issueUrl(issue(), { markup: "```html\n<x>\n```" });
    const u = new URL(url);
    expect(u.origin + u.pathname).to.equal(
      "https://github.com/haxtheweb/issues/issues/new",
    );
    expect(u.searchParams.get("template")).to.equal("goggles-bug.yml");
    expect(u.searchParams.get("labels")).to.equal(null);
    expect(u.searchParams.get("title")).to.equal(
      "`video-player` bug: Captions overlap",
    );
    expect(u.searchParams.get("description")).to.contain("captions cover");
    expect(u.searchParams.get("element")).to.contain(
      "haxcms-site-builder > video-player",
    );
    expect(u.searchParams.get("context")).to.contain("`boom`");
    expect(u.searchParams.get("markup")).to.contain("<x>");
    expect(left).to.deep.equal([]);
  });

  it("sends the Translate lens's report to the translation form as written", () => {
    const u = new URL(
      translateUrl(
        { title: "[translate] es: 1 suggestion", body: "### Spanish" },
        "es",
      ),
    );
    expect(u.searchParams.get("template")).to.equal("goggles-translation.yml");
    expect(u.searchParams.get("title")).to.equal(
      "[translate] es: 1 suggestion",
    );
    expect(u.searchParams.get("description")).to.equal("### Spanish");
    expect(u.searchParams.get("locale")).to.equal("es");
    expect(u.searchParams.get("labels")).to.equal(null);
  });

  it("leaves out the replay, then the markup, when the link gets too long", () => {
    const big = "x".repeat(URL_BUDGET);
    const r = issueUrl(issue(), { markup: "small", replay: big });
    expect(r.url.length).to.be.at.most(URL_BUDGET);
    expect(r.left).to.deep.equal(["replay"]);
    expect(new URL(r.url).searchParams.get("markup")).to.equal("small");
  });

  it("searches open issues by the tag in titles", () => {
    const u = new URL(openIssuesUrl("video-player"));
    expect(u.pathname).to.equal("/haxtheweb/issues/issues");
    expect(u.searchParams.get("q")).to.equal(
      "is:issue is:open in:title video-player",
    );
  });

  it("points at one element through shadow roots and finds it again", () => {
    const host = globalThis.document.createElement("goggles-path-host");
    globalThis.document.body.appendChild(host);
    const root = host.attachShadow({ mode: "open" });
    root.appendChild(globalThis.document.createElement("goggles-path-leaf"));
    const second = globalThis.document.createElement("goggles-path-leaf");
    root.appendChild(second);
    const steps = elementPath(second);
    expect(steps[steps.length - 1]).to.deep.equal({
      tag: "goggles-path-leaf",
      n: 1,
    });
    expect(steps[steps.length - 2].tag).to.equal("goggles-path-host");
    expect(findByPath(steps)).to.equal(second);
    expect(pathText(steps)).to.contain("goggles-path-host > goggles-path-leaf");
    host.remove();
    expect(findByPath(steps)).to.equal(null);
  });

  it("marks a piece by its place in the page content, through shadow roots", () => {
    const host = globalThis.document.createElement("div");
    host.innerHTML =
      "<p>one</p><section><p>two</p><goggles-mark-box></goggles-mark-box></section>";
    globalThis.document.body.appendChild(host);
    const box = host.querySelector("goggles-mark-box");
    const inner = globalThis.document.createElement("span");
    box.attachShadow({ mode: "open" }).appendChild(inner);
    expect(contentMark(box, host)).to.deep.equal([1, 1]);
    // drawn inside the box's shadow root: the box is what the content holds
    expect(contentMark(inner, host)).to.deep.equal([1, 1]);
    expect(contentMark(globalThis.document.body, host)).to.equal(null);
    expect(findByMark(host, [1, 1])).to.equal(box);
    expect(findByMark(host, [5])).to.equal(null);
    expect(markText([1, 1])).to.equal("1.1");
    expect(parseMark("1.1")).to.deep.equal([1, 1]);
    expect(parseMark("1;alert(1)")).to.equal(null);
    expect(parseMark("")).to.equal(null);
    expect(replayLink("z.abc")).to.equal(
      "https://browser.hax.cloud/#replay=z.abc",
    );
    host.remove();
  });

  it("swaps the site's own files for placeholders and drops scripts", () => {
    const out = placeholderAssets(
      '<img src="files/secret.png" width="40"><img src="https://example.org/a.png"><a href="files/doc.pdf">doc</a><script>alert(1)</script>',
      "https://my.site",
    );
    expect(out.html).to.not.contain("secret.png");
    expect(out.html).to.contain('width="40"');
    expect(out.html).to.contain("https://example.org/a.png");
    expect(out.html).to.not.contain("doc.pdf");
    expect(out.html).to.not.contain("<script");
    expect(out.html).to.not.contain("secret");
    expect(out.swapped).to.deep.equal(["png", "pdf"]);
  });

  it("packs a replay bundle into one URL-safe string and back", async () => {
    const bundle = replayBundle({
      scope: "block",
      tag: "video-player",
      path: [{ tag: "video-player", n: 0 }],
      html: "<video-player source='files/a.mp4'></video-player>",
      theme: "clean-one",
      origin: "https://my.site",
    });
    expect(bundle.html).to.contain("about:blank");
    const packed = await packBundle(bundle);
    expect(packed).to.match(/^[zj]\.[A-Za-z0-9_-]+$/);
    const back = await unpackBundle(packed);
    expect(back).to.deep.equal(bundle);
  });

  it("measures contrast the WCAG way", () => {
    expect(contrastRatio([0, 0, 0, 1], [255, 255, 255, 1]).toFixed(0)).to.equal(
      "21",
    );
    expect(contrastRatio([119, 119, 119, 1], [255, 255, 255, 1])).to.be.below(
      4.5,
    );
  });

  it("finds missing alt text, unnamed controls, unlabeled fields and low contrast", () => {
    const box = globalThis.document.createElement("div");
    box.style.cssText = "background:#fff;color:#000";
    box.innerHTML = `<img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="10" height="10">
      <img alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" width="10" height="10">
      <button style="width:20px;height:20px"></button>
      <button>Named</button>
      <input type="text">
      <label>Name <input type="text"></label>
      <p style="color:#bbb">faint</p>`;
    globalThis.document.body.appendChild(box);
    const checks = a11yFindings(box).map((f) => f.check);
    expect(checks.filter((c) => c === "image-alt").length).to.equal(1);
    expect(checks.filter((c) => c === "control-name").length).to.equal(1);
    expect(checks.filter((c) => c === "field-label").length).to.equal(1);
    expect(checks).to.include("contrast");
    box.remove();
  });
});
