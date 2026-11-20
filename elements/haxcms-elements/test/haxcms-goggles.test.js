import { expect } from "@open-wc/testing";
import { emulateMedia } from "@web/test-runner-commands";
import {
  GogglesState,
  GOGGLES_LENS_KEY,
  loadMakers,
} from "../lib/core/ui/haxcms-goggles.js";

const overlay = () => globalThis.document.querySelector("haxcms-goggles");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
// with reduced motion there is no put-on or take-off animation, so the
// overlay goes away on the next tick; this also keeps the file light when
// the runner has other test pages open beside it
const takeOff = async () => {
  GogglesState.set({ on: false, lensOn: true, lens: "code", person: null });
  await wait(50);
};

describe("haxcms-goggles (developer mode)", () => {
  before(async () => {
    await emulateMedia({ reducedMotion: "reduce" });
  });
  after(async () => {
    await emulateMedia({ reducedMotion: "no-preference" });
    globalThis.localStorage.removeItem(GOGGLES_LENS_KEY);
  });
  afterEach(async () => {
    if (GogglesState.on) {
      await takeOff();
    }
  });

  it("draws nothing and listens to nothing until the goggles go on", () => {
    expect(overlay()).to.equal(null);
    expect(GogglesState.on).to.equal(false);
  });

  it("puts the overlay on the body and watches the page only while worn", async () => {
    GogglesState.set({ on: true, lensOn: true, lens: "code" });
    const g = overlay();
    expect(g).to.not.equal(null);
    expect(g.parentNode).to.equal(globalThis.document.body);
    expect(g._watching).to.equal(true);
    await takeOff();
    expect(g._watching).to.equal(false);
    expect(overlay()).to.equal(null);
  });

  it("holds clicks while the lenses are on and lets them through when off", async () => {
    const button = globalThis.document.createElement("button");
    button.textContent = "page button";
    globalThis.document.body.appendChild(button);
    let clicks = 0;
    button.addEventListener("click", () => {
      clicks++;
    });
    GogglesState.set({ on: true, lensOn: true, lens: "code" });
    const g = overlay();
    // the put-on animation is over before the lenses hold anything
    g.phase = "";
    await g.updateComplete;
    button.click();
    expect(clicks).to.equal(0);
    GogglesState.set({ lensOn: false });
    button.click();
    expect(clicks).to.equal(1);
    button.remove();
  });

  it("loads who made what and finds one person's work", async () => {
    const makers = await loadMakers();
    expect(Object.keys(makers.tags).length).to.be.greaterThan(100);
    expect(makers.tags["haxcms-site-editor-ui"].f).to.equal(
      "haxcms-elements/lib/core/haxcms-site-editor-ui.js",
    );
    GogglesState.set({ on: true, lensOn: true, lens: "makers" });
    const g = overlay();
    const work = g._personWork("btopro");
    expect(work.pieces.length).to.be.greaterThan(0);
    expect(work.commits).to.be.greaterThan(0);
    const piece = work.pieces[0];
    expect(piece.share).to.be.within(0, 1);
  });

  it("links to the gallery only where the element really is alone", async () => {
    await loadMakers();
    GogglesState.set({ on: true, lensOn: true, lens: "code" });
    const g = overlay();
    // a package's own element
    expect(g._alone("simple-icon")).to.contain(
      "https://webcomponents.hax.cloud/?element=simple-icon",
    );
    // another tag with a demo page named for it
    const lecture = g._alone("lecture-player");
    expect(lecture).to.contain("element=video-player");
    expect(lecture).to.contain("demo=lecture-player");
    // a tag inside a bigger package with no demo of its own has no alone link
    expect(g._alone("haxcms-site-editor-ui")).to.equal("");
    expect(g._alone("my-learning-button")).to.equal("");
  });

  it("says who owns a tag: HAX, a package outside HAX, or the HTML standard", async () => {
    await loadMakers();
    GogglesState.set({ on: true, lensOn: true, lens: "code" });
    const g = overlay();
    expect(g._owner("li").kind).to.equal("native");
    expect(g._owner("li").text).to.contain("W3C");
    const hax = g._owner("video-player");
    expect(hax.kind).to.equal("hax");
    expect(hax.text).to.contain("From HAX, by");
    expect(g._owner("monaco-element").wraps).to.contain("Microsoft");
    const third = g._owner("model-viewer");
    expect(third.kind).to.equal("third");
    expect(third.text).to.contain("@google/model-viewer");
    expect(third.text).to.contain("Google");
    expect(g._owner("not-a-known-thing").kind).to.equal("outside");
  });

  it("moves only between custom elements, across shadow roots", async () => {
    GogglesState.set({ on: true, lensOn: true, lens: "code" });
    const g = overlay();
    const outer = globalThis.document.createElement("goggles-test-outer");
    const box = globalThis.document.createElement("div");
    const inner = globalThis.document.createElement("goggles-test-inner");
    const deeper = globalThis.document.createElement("goggles-test-inner");
    const p = globalThis.document.createElement("p");
    inner.appendChild(deeper);
    box.appendChild(inner);
    box.appendChild(p);
    outer.attachShadow({ mode: "open" }).appendChild(box);
    const shadowed = globalThis.document.createElement("goggles-test-leaf");
    const light = globalThis.document.createElement("section");
    light.appendChild(shadowed);
    outer.appendChild(light);
    globalThis.document.body.appendChild(outer);
    // below: the nearest custom elements only, walking through the div and section
    const below = g._below(outer).map((el) => el.localName);
    expect(below).to.deep.equal(["goggles-test-inner", "goggles-test-leaf"]);
    // above, from a plain tag deep inside: out through the shadow root
    const above = g._above(p).map((el) => el.localName);
    expect(above[0]).to.equal("goggles-test-outer");
    expect(above.every((t) => t.indexOf("-") > 0)).to.equal(true);
    expect(g._above(deeper)[0]).to.equal(inner);
    // two of the same tag are one entry with a count
    const grouped = g._byTag([inner, deeper]);
    expect(grouped.length).to.equal(1);
    expect(grouped[0].count).to.equal(2);
    outer.remove();
  });

  it("holds still on an element moved to, with a close button", async () => {
    GogglesState.set({ on: true, lensOn: true, lens: "code" });
    const g = overlay();
    g.phase = "";
    const el = globalThis.document.createElement("goggles-test-move");
    el.textContent = "move here";
    globalThis.document.body.appendChild(el);
    g._go(el);
    await g.updateComplete;
    expect(g.pinned).to.equal(true);
    expect(g._target.comp).to.equal(el);
    const close = g.shadowRoot.querySelector(".card .close");
    expect(close).to.not.equal(null);
    expect(close.getAttribute("aria-label")).to.equal("Close");
    close.click();
    await g.updateComplete;
    expect(g.pinned).to.equal(false);
    el.remove();
  });

  it("puts the goggles back on with the lens chosen last, not always the x-ray", async () => {
    GogglesState.set({ on: true, lensOn: true, lens: "makers" });
    expect(overlay().lens).to.equal("makers");
    // off, then on again the way the top bar button does it
    GogglesState.set({ on: false });
    await wait(50);
    GogglesState.set({ on: true, lensOn: true });
    expect(overlay().lens).to.equal("makers");
    expect(overlay()._status).to.contain("Makers lens");
    // lenses off and on again keeps it too
    GogglesState.set({ lensOn: false });
    GogglesState.set({ lensOn: true });
    expect(overlay().lens).to.equal("makers");
    // kept for the next visit, with the person when following someone
    expect(
      JSON.parse(globalThis.localStorage.getItem(GOGGLES_LENS_KEY)).lens,
    ).to.equal("makers");
    GogglesState.set({ lens: "person", person: "btopro" });
    expect(
      JSON.parse(globalThis.localStorage.getItem(GOGGLES_LENS_KEY)),
    ).to.deep.equal({ lens: "person", person: "btopro" });
    await takeOff();
  });
});
