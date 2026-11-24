import { expect } from "@open-wc/testing";
import { emulateMedia } from "@web/test-runner-commands";
import {
  demoSlug,
  docsUrl,
  gogglesDemo,
  loadDemo,
  placeDemo,
} from "../lib/core/ui/haxcms-goggles-demo.js";
import { GogglesState } from "../lib/core/ui/haxcms-goggles.js";
import { store } from "../lib/core/haxcms-site-store.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

describe("haxcms-goggles review demo (?goggles-demo=)", () => {
  before(async () => {
    await emulateMedia({ reducedMotion: "reduce" });
  });
  after(async () => {
    await emulateMedia({ reducedMotion: "no-preference" });
  });

  it("reads only an element folder name from the link", () => {
    expect(demoSlug("?goggles-demo=video-player")).to.equal("video-player");
    expect(demoSlug("?goggles=code&goggles-demo=a11y-tabs")).to.equal(
      "a11y-tabs",
    );
    expect(demoSlug("?goggles-demo=../../secret")).to.equal("");
    expect(demoSlug("?goggles-demo=Video Player")).to.equal("");
    expect(demoSlug("?goggles=code")).to.equal("");
  });

  it("finds the docs data beside the element's package", () => {
    expect(
      docsUrl("video-player", "https://site.example/node_modules/"),
    ).to.equal(
      "https://site.example/node_modules/@haxtheweb/video-player/lib/video-player.docs.json",
    );
  });

  it("loads a block's demo markup, and none for a piece that is not a block", async () => {
    const demo = await loadDemo("video-player", "/node_modules/");
    expect(demo.tag).to.equal("video-player");
    expect(demo.html).to.contain("<video-player");
    expect(await loadDemo("hax-network-bar", "/node_modules/")).to.equal(null);
    expect(await loadDemo("not-an-element", "/node_modules/")).to.equal(null);
  });

  it("swaps the page content for the demo, sanitized, and says where the element is", () => {
    const host = globalThis.document.createElement("div");
    host.innerHTML = "<p>old page</p>";
    const mark = placeDemo(host, {
      tag: "goggles-demo-piece",
      html: '<p>intro</p><goggles-demo-piece onclick="alert(1)">x</goggles-demo-piece><script>alert(1)</script>',
    });
    expect(host.textContent).to.not.contain("old page");
    expect(mark).to.deep.equal([1]);
    expect(
      host.querySelector("goggles-demo-piece").hasAttribute("onclick"),
    ).to.equal(false);
    expect(host.querySelector("script")).to.equal(null);
  });

  it("shows the element on the page with the goggles held still on it", async () => {
    const before = store.themeElement;
    const theme = globalThis.document.createElement("div");
    theme.innerHTML = "<p>the demo site's home page</p>";
    globalThis.document.body.appendChild(theme);
    const realFetch = globalThis.fetch;
    globalThis.fetch = (url) =>
      String(url).indexOf("goggles-demo-block.docs.json") !== -1
        ? Promise.resolve(
            new Response(
              JSON.stringify({
                tag: "goggles-demo-block",
                demoHtml:
                  "<p>before</p><goggles-demo-block>the block</goggles-demo-block>",
              }),
            ),
          )
        : realFetch(url);
    store.themeElement = theme;
    const ran = await gogglesDemo(
      "?goggles=code&goggles-demo=goggles-demo-block",
    );
    globalThis.fetch = realFetch;
    expect(ran).to.equal(true);
    let g = null;
    for (let i = 0; i < 60 && !(g && g.pinned); i++) {
      await wait(100);
      g = globalThis.document.querySelector("haxcms-goggles");
      if (g && g.phase !== "") {
        g.phase = "";
      }
    }
    expect(theme.textContent).to.not.contain("home page");
    expect(GogglesState.on).to.equal(true);
    expect(g.lens).to.equal("code");
    expect(g.pinned).to.equal(true);
    expect(g._target.comp.localName).to.equal("goggles-demo-block");
    // the site builder writes the page again (a theme change): the demo comes back
    theme.innerHTML = "<p>the home page again</p>";
    await wait(50);
    expect(theme.querySelector("goggles-demo-block")).to.not.equal(null);
    // going to another page leaves the demo behind
    const activeBefore = store.activeId;
    store.activeId = "another-page";
    theme.innerHTML = "<p>another page</p>";
    await wait(50);
    expect(theme.querySelector("goggles-demo-block")).to.equal(null);
    expect(theme.textContent).to.contain("another page");
    store.activeId = activeBefore;
    GogglesState.set({ on: false, lensOn: true, lens: "code", person: null });
    await wait(50);
    store.themeElement = before;
    theme.remove();
  });

  it("does nothing for a link that names no demo", async () => {
    expect(await gogglesDemo("?goggles=code")).to.equal(false);
  });
});
