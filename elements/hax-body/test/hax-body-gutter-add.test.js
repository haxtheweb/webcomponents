// The gutter +: hovering the gap between two blocks shows the drop line
// with a + in the left gutter, hovering an empty block shows the + beside
// it, and pressing it opens Merlin there the same as typing /
import { fixture, expect, html } from "@open-wc/testing";
import "../hax-body.js";
import { HAXStore } from "../lib/hax-store.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";

const settle = async (ms = 50) => {
  await new Promise((r) => setTimeout(r, ms));
  await new Promise((r) => requestAnimationFrame(r));
};

describe("hax-body gutter +", () => {
  let body, first, second, empty, savedRecent, savedTray;
  before(() => {
    // edit mode asks the tray which panel is open; no tray in this fixture
    savedTray = HAXStore.haxTray;
    if (!HAXStore.haxTray) HAXStore.haxTray = { trayDetail: "" };
    ["p", "h2"].forEach((tag) => {
      if (!HAXStore.validGridTagList.includes(tag)) {
        HAXStore.validGridTagList.push(tag);
      }
    });
  });
  after(() => {
    HAXStore.haxTray = savedTray;
  });
  beforeEach(async () => {
    savedRecent = HAXStore.recentGizmoList;
    body = await fixture(html`
      <hax-body style="margin-left: 80px; width: 480px">
        <p style="margin: 0 0 24px">First block</p>
        <h2 style="margin: 0 0 24px">Second block</h2>
        <p style="margin: 0; min-height: 24px"><br /></p>
      </hax-body>
    `);
    body.editMode = true;
    await settle();
    [first, second, empty] = [...body.children];
  });
  afterEach(() => {
    SuperDaemonInstance.close();
    HAXStore.recentGizmoList = savedRecent;
    body.editMode = false;
  });
  const btn = () => body.shadowRoot.querySelector("#gutteradd");
  const pointAt = (x, y) => {
    body.__gutterXY = [x, y];
    body._gutterFind();
  };

  it("shows the drop line and the + in the gap between two blocks", () => {
    const a = first.getBoundingClientRect();
    const b = second.getBoundingClientRect();
    pointAt(a.left + 20, (a.bottom + b.top) / 2);
    expect(body.__gutterSpot.mode).to.equal("gap");
    expect(body.__gutterSpot.after).to.equal(first);
    expect(btn().hidden).to.equal(false);
    expect(body.__gutterLine.hidden).to.equal(false);
    expect(body.__gutterLine.classList.contains("drop-line")).to.equal(true);
    // the + sits in the gutter, left of the blocks
    expect(btn().getBoundingClientRect().right).to.be.at.most(a.left);
  });

  it("shows nothing over the text of a block that has content", () => {
    const a = first.getBoundingClientRect();
    pointAt(a.left + 20, a.top + a.height / 2);
    expect(body.__gutterSpot).to.equal(null);
    expect(btn().hidden).to.equal(true);
  });

  it("shows the + beside an empty block, without a drop line", () => {
    const r = empty.getBoundingClientRect();
    pointAt(r.left + 20, r.top + r.height / 2);
    expect(body.__gutterSpot.mode).to.equal("block");
    expect(body.__gutterSpot.node).to.equal(empty);
    expect(btn().hidden).to.equal(false);
    expect(!body.__gutterLine || body.__gutterLine.hidden).to.equal(true);
  });

  it("the + in a gap adds a paragraph there and opens Merlin inline", async () => {
    const a = first.getBoundingClientRect();
    const b = second.getBoundingClientRect();
    pointAt(a.left + 20, (a.bottom + b.top) / 2);
    await body._gutterAdd();
    const added = first.nextElementSibling;
    expect(added.tagName).to.equal("P");
    expect(added).to.not.equal(second);
    expect(SuperDaemonInstance.mini).to.equal(true);
    expect(SuperDaemonInstance.inlineMode).to.equal(true);
    expect(SuperDaemonInstance.activeNode).to.equal(added);
    expect(btn().hidden).to.equal(true);
  });

  it("closing Merlin with nothing chosen takes the added paragraph back", async () => {
    const a = first.getBoundingClientRect();
    const b = second.getBoundingClientRect();
    pointAt(a.left + 20, (a.bottom + b.top) / 2);
    await body._gutterAdd();
    expect(first.nextElementSibling).to.not.equal(second);
    SuperDaemonInstance.close();
    await settle();
    expect(first.nextElementSibling).to.equal(second);
  });

  it("opening inline puts recently used blocks first", () => {
    HAXStore.recentGizmoList = [
      { tag: "video-player" },
      { tag: "media-image" },
      { tag: "video-player" },
    ];
    const rng = globalThis.document.createRange();
    rng.selectNodeContents(empty);
    rng.collapse(true);
    body._openInlineMerlin(rng);
    expect(SuperDaemonInstance.priorityPaths).to.deep.equal([
      "HAX/insert/block/video-player",
      "HAX/insert/block/media-image",
    ]);
  });
});
