import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../hax-body.js";
import { HAXStore } from "../lib/hax-store.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";

// `/` in an empty line, then either a single emoji / symbol or Escape: the
// empty-line hint goes away as soon as the line has text, and the caret
// lands after what was put there so typing just carries on
describe("Merlin inline insert and cancel in an empty line", () => {
  const setup = async () => {
    const el = await fixture(
      html`<hax-body
        ><p contenteditable="true" data-hax-ray="p"><br /></p
      ></hax-body>`,
    );
    await aTimeout(50);
    HAXStore.activeHaxBody = el;
    const p = el.querySelector("p");
    el.__syncDataHaxEmpty(p);
    HAXStore.activeNode = p;
    p.focus();
    const sel = globalThis.getSelection();
    const rng = globalThis.document.createRange();
    rng.setStart(p, 0);
    rng.collapse(true);
    sel.removeAllRanges();
    sel.addRange(rng);
    return { p, sel, rng };
  };
  const caretAtEndOf = (p) => {
    const s = globalThis.getSelection();
    return s.anchorNode === p && s.anchorOffset === p.childNodes.length;
  };
  afterEach(() => {
    SuperDaemonInstance.close();
  });

  it("a single emoji clears the hint and leaves the caret after it", async () => {
    const { p, sel, rng } = await setup();
    expect(p.hasAttribute("data-hax-empty")).to.equal(true);
    SuperDaemonInstance.activeRange = rng;
    SuperDaemonInstance.activeSelection = sel;
    SuperDaemonInstance.inlineTextInsert = false;
    p.innerHTML = "";
    await HAXStore._insertTextResult("\u{1F601}");
    await aTimeout(50);
    expect(p.textContent).to.equal("\u{1F601}");
    expect(p.hasAttribute("data-hax-empty")).to.equal(false);
    expect(caretAtEndOf(p)).to.equal(true);
  });

  it("Escape puts typed text back with no hint and the caret after it", async () => {
    const { p, sel, rng } = await setup();
    SuperDaemonInstance.mini = true;
    SuperDaemonInstance.wand = false;
    SuperDaemonInstance.activeNode = p;
    SuperDaemonInstance.activeRange = rng;
    SuperDaemonInstance.activeSelection = sel;
    SuperDaemonInstance.opened = true;
    SuperDaemonInstance.value = "stuff";
    SuperDaemonInstance.miniCancel();
    await aTimeout(50);
    expect(p.textContent).to.equal("stuff");
    expect(p.hasAttribute("data-hax-empty")).to.equal(false);
    expect(caretAtEndOf(p)).to.equal(true);
  });

  it("Escape with nothing typed keeps the line and a caret in it", async () => {
    const { p, sel, rng } = await setup();
    SuperDaemonInstance.mini = true;
    SuperDaemonInstance.wand = false;
    SuperDaemonInstance.activeNode = p;
    SuperDaemonInstance.activeRange = rng;
    SuperDaemonInstance.activeSelection = sel;
    SuperDaemonInstance.opened = true;
    SuperDaemonInstance.value = "";
    SuperDaemonInstance.miniCancel();
    await aTimeout(50);
    // the <br> that gives an empty line somewhere to put the caret stays
    expect(p.querySelector("br")).to.exist;
    expect(globalThis.document.activeElement).to.equal(p);
    expect(globalThis.getSelection().anchorNode).to.equal(p);
  });
});
