import { expect } from "@open-wc/testing";
import { emulateMedia } from "@web/test-runner-commands";
import { GogglesState, loadMakers } from "../lib/core/ui/haxcms-goggles.js";

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

  it("links a registered element to the gallery on its own", async () => {
    await loadMakers();
    GogglesState.set({ on: true, lensOn: true, lens: "code" });
    const url = overlay()._alone("haxcms-site-editor-ui");
    expect(url).to.contain(
      "https://webcomponents.hax.cloud/?element=haxcms-elements",
    );
  });
});
