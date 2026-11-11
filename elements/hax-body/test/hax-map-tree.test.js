import { fixture, expect, html } from "@open-wc/testing";
import {
  buildRows,
  containerSlots,
  isItem,
  sectionOf,
  nodesToMove,
  dropProblem,
  moveNodes,
  keyboardTarget,
} from "../lib/hax-map-tree.js";

// a stand-in for HAXStore.haxSchemaFromTag
const SCHEMA = {
  "image-gallery": {
    type: "grid",
    settings: {
      developer: [
        { slot: "", hidden: true, allowedSlotWrappers: ["media-image", "img"] },
      ],
    },
  },
  "media-playlist": {
    type: "grid",
    settings: {
      developer: [
        {
          slot: "",
          hidden: true,
          allowedSlotWrappers: ["video-player", "audio-player"],
        },
      ],
    },
  },
  "a11y-collapse-group": {
    type: "grid",
    settings: {
      configure: [{ slot: "", slotWrapper: "a11y-collapse" }],
    },
  },
  "play-list": {
    type: "grid",
    settings: { configure: [{ slot: "", slotWrapper: "template" }] },
  },
  "stop-note": {
    type: "grid",
    settings: { configure: [{ slot: "message", inputMethod: "textfield" }] },
  },
};
const schemaFor = (tag) => SCHEMA[tag] || {};

async function page() {
  return fixture(html`
    <div id="body">
      <page-break title="Home"></page-break>
      <p id="intro">Intro</p>
      <h2 id="a">Why</h2>
      <p id="a1">Waves</p>
      <h3 id="a2">Parts</h3>
      <ul id="a3">
        <li>Crest</li>
        <li>Trough</li>
      </ul>
      <h2 id="b">Try</h2>
      <p id="b1" data-hax-lock="data-hax-lock">Drop</p>
      <grid-plate id="grid" layout="1-1">
        <p id="g1" slot="col-1">Left</p>
        <p id="g2" slot="col-2">Right</p>
      </grid-plate>
      <image-gallery id="gallery">
        <media-image id="img1"></media-image>
      </image-gallery>
      <media-image id="img2"></media-image>
      <video-player id="vid"></video-player>
    </div>
  `);
}

describe("hax-map-tree", () => {
  let body;
  beforeEach(async () => {
    body = await page();
  });

  it("nests blocks under the heading above them", () => {
    const rows = buildRows(body, schemaFor);
    const depth = (id) =>
      rows.find((r) => r.node.id === id && r.kind !== "column").depth;
    expect(depth("intro")).to.equal(0);
    expect(depth("a")).to.equal(0);
    expect(depth("a1")).to.equal(1);
    expect(depth("a2")).to.equal(1);
    expect(depth("a3")).to.equal(2);
    expect(depth("b")).to.equal(0);
    expect(depth("b1")).to.equal(1);
  });

  it("shows list items as rows that are checked and moved on their own", () => {
    const rows = buildRows(body, schemaFor);
    const items = rows.filter((r) => r.tag === "li");
    expect(items.length).to.equal(2);
    items.forEach((r) => {
      expect(r.kind).to.equal("item");
      expect(r.movable).to.be.true;
      expect(r.selectable).to.be.true;
      expect(r.depth).to.equal(3);
    });
    expect(isItem(items[0].node)).to.be.true;
    expect(isItem(body.querySelector("#a1"))).to.be.false;
  });

  it("shows nested lists and their items", async () => {
    const list = body.querySelector("#a3");
    list.firstElementChild.innerHTML = `Crest<ul id="sub"><li id="s1">Top</li></ul>`;
    const rows = buildRows(body, schemaFor);
    const sub = rows.find((r) => r.node.id === "sub");
    const s1 = rows.find((r) => r.node.id === "s1");
    expect(sub.kind).to.equal("child");
    expect(s1.kind).to.equal("item");
    expect(s1.depth).to.equal(sub.depth + 1);
  });

  it("page breaks are rows that cannot be selected or moved", () => {
    const row = buildRows(body, schemaFor)[0];
    expect(row.kind).to.equal("page");
    expect(row.movable).to.be.false;
    expect(row.selectable).to.be.false;
  });

  it("locked blocks can be selected but not moved", () => {
    const row = buildRows(body, schemaFor).find((r) => r.node.id === "b1");
    expect(row.selectable).to.be.true;
    expect(row.movable).to.be.false;
  });

  it("grid-plate shows a row per column with its blocks under it", () => {
    const rows = buildRows(body, schemaFor);
    const cols = rows.filter((r) => r.kind === "column");
    expect(cols.map((c) => c.slot)).to.deep.equal(["col-1", "col-2"]);
    const g1 = rows.find((r) => r.node.id === "g1");
    expect(g1.kind).to.equal("block");
    expect(g1.container.id).to.equal("grid");
    expect(rows.indexOf(g1)).to.equal(rows.indexOf(cols[0]) + 1);
  });

  it("knows which containers take which blocks", () => {
    expect(containerSlots(body.querySelector("#gallery"), schemaFor)[0])
      .to.have.property("allowed")
      .that.deep.equals(["media-image", "img"]);
    expect(
      containerSlots(
        document.createElement("a11y-collapse-group"),
        schemaFor,
      )[0].allowed,
    ).to.deep.equal(["a11y-collapse"]);
    // template wrapped and text slots are not drop targets
    expect(containerSlots(document.createElement("play-list"), schemaFor)).to.be
      .null;
    expect(containerSlots(document.createElement("stop-note"), schemaFor)).to.be
      .null;
    expect(containerSlots(body.querySelector("#a1"), schemaFor)).to.be.null;
  });

  it("a heading's section runs to the next heading at its level", () => {
    const ids = (nodes) => nodes.map((n) => n.id);
    expect(ids(sectionOf(body.querySelector("#a"), body))).to.deep.equal([
      "a",
      "a1",
      "a2",
      "a3",
    ]);
    expect(ids(sectionOf(body.querySelector("#a2"), body))).to.deep.equal([
      "a2",
      "a3",
    ]);
    expect(ids(sectionOf(body.querySelector("#a1"), body))).to.deep.equal([
      "a1",
    ]);
  });

  it("moving a heading carries its section, locked blocks included", () => {
    const moving = nodesToMove([body.querySelector("#b")], body);
    expect(moving.map((n) => n.id)).to.deep.equal([
      "b",
      "b1",
      "grid",
      "gallery",
      "img2",
      "vid",
    ]);
  });

  it("drags a heading's section above another heading", () => {
    const moving = nodesToMove([body.querySelector("#a2")], body);
    const ok = moveNodes(
      moving,
      { parent: body, slot: "", before: body.querySelector("#a") },
      body,
      schemaFor,
    );
    expect(ok).to.be.true;
    const order = [...body.children].map((n) => n.id || n.tagName);
    expect(order.slice(0, 5)).to.deep.equal([
      "PAGE-BREAK",
      "intro",
      "a2",
      "a3",
      "a",
    ]);
  });

  it("drops an image into a gallery but not a video", () => {
    const gallery = body.querySelector("#gallery");
    const target = { parent: gallery, slot: "", before: null };
    expect(
      dropProblem([body.querySelector("#vid")], target, body, schemaFor),
    ).to.equal("slot");
    expect(moveNodes([body.querySelector("#img2")], target, body, schemaFor)).to
      .be.true;
    expect(body.querySelector("#img2").parentElement).to.equal(gallery);
    expect(body.querySelector("#img2").hasAttribute("slot")).to.be.false;
  });

  it("moves blocks between grid columns and out to the page", () => {
    const grid = body.querySelector("#grid");
    const g1 = body.querySelector("#g1");
    expect(
      moveNodes(
        [g1],
        { parent: grid, slot: "col-2", before: null },
        body,
        schemaFor,
      ),
    ).to.be.true;
    expect(g1.getAttribute("slot")).to.equal("col-2");
    expect(
      moveNodes(
        [g1],
        { parent: body, slot: "", before: grid },
        body,
        schemaFor,
      ),
    ).to.be.true;
    expect(g1.parentElement).to.equal(body);
    expect(g1.hasAttribute("slot")).to.be.false;
  });

  it("refuses drops into itself, above the page break, or into a locked block", () => {
    const grid = body.querySelector("#grid");
    expect(
      dropProblem([grid], { parent: grid, slot: "col-1" }, body, schemaFor),
    ).to.equal("self");
    expect(
      dropProblem(
        [body.querySelector("#intro")],
        { parent: body, slot: "", before: body.firstElementChild },
        body,
        schemaFor,
      ),
    ).to.equal("page");
    grid.setAttribute("data-hax-lock", "data-hax-lock");
    expect(
      dropProblem(
        [body.querySelector("#intro")],
        { parent: grid, slot: "col-1" },
        body,
        schemaFor,
      ),
    ).to.equal("locked");
    // a grid-plate does not go inside another grid-plate
    const other = document.createElement("grid-plate");
    body.appendChild(other);
    grid.removeAttribute("data-hax-lock");
    expect(
      dropProblem([other], { parent: grid, slot: "col-1" }, body, schemaFor),
    ).to.equal("slot");
  });

  it("a locked block or a page break does not move on its own", () => {
    expect(nodesToMove([body.querySelector("#b1")], body)).to.deep.equal([]);
    expect(nodesToMove([body.firstElementChild], body)).to.deep.equal([]);
  });

  it("Alt+Up and Alt+Down move a block past its neighbor", () => {
    const a1 = body.querySelector("#a1");
    const up = keyboardTarget(a1, -1, body);
    expect(up.before.id).to.equal("a");
    const down = keyboardTarget(a1, 1, body);
    expect(down.before.id).to.equal("a3");
    // nothing goes above the page break
    expect(keyboardTarget(body.querySelector("#intro"), -1, body)).to.be.null;
  });

  it("Alt+Down moves a heading past the next section at its level", () => {
    const a = body.querySelector("#a");
    const down = keyboardTarget(a, 1, body);
    // after the whole "Try" section, which is followed by nothing else
    expect(down.before).to.be.null;
    const up = keyboardTarget(body.querySelector("#b"), -1, body);
    expect(up.before.id).to.equal("a");
    expect(keyboardTarget(a, -1, body).before.id).to.equal("intro");
  });

  it("list items move between lists but never out of one", () => {
    const li = body.querySelector("#a3").lastElementChild;
    const other = document.createElement("ol");
    other.id = "other";
    other.innerHTML = "<li>One</li>";
    body.appendChild(other);
    // a block does not take an item, a list does not take a block
    expect(
      dropProblem(
        [li],
        { parent: body, slot: "", before: null },
        body,
        schemaFor,
      ),
    ).to.equal("item");
    expect(
      dropProblem(
        [body.querySelector("#a1")],
        { parent: other, slot: "", before: null },
        body,
        schemaFor,
      ),
    ).to.equal("item");
    // items and blocks do not move together
    expect(
      dropProblem(
        [li, body.querySelector("#a1")],
        { parent: other, slot: "", before: null },
        body,
        schemaFor,
      ),
    ).to.equal("item");
    expect(
      moveNodes(
        [li],
        { parent: other, slot: "", before: other.firstElementChild },
        body,
        schemaFor,
      ),
    ).to.be.true;
    expect(other.firstElementChild).to.equal(li);
  });

  it("Alt+Up and Alt+Down reorder list items inside their list", () => {
    const [crest, trough] = body.querySelector("#a3").children;
    expect(keyboardTarget(trough, -1, body, schemaFor).before).to.equal(crest);
    expect(keyboardTarget(crest, -1, body, schemaFor)).to.be.null;
    expect(keyboardTarget(trough, 1, body, schemaFor)).to.be.null;
    // items do not go in or out of layouts
    expect(keyboardTarget(crest, "out", body, schemaFor)).to.be.null;
  });

  it("Alt+Right moves a block into the layout above when it takes it", () => {
    const img2 = body.querySelector("#img2");
    const into = keyboardTarget(img2, "in", body, schemaFor);
    expect(into.parent.id).to.equal("gallery");
    expect(into.before).to.be.null;
    // the gallery does not take a video, and the image is not a layout
    expect(keyboardTarget(body.querySelector("#vid"), "in", body, schemaFor)).to
      .be.null;
    // without the store, no layouts
    expect(keyboardTarget(img2, "in", body)).to.be.null;
  });

  it("Alt+Left moves a block out of its layout, to just after it", () => {
    const out = keyboardTarget(
      body.querySelector("#img1"),
      "out",
      body,
      schemaFor,
    );
    expect(out.parent).to.equal(body);
    expect(out.before.id).to.equal("img2");
    expect(keyboardTarget(body.querySelector("#a1"), "out", body, schemaFor)).to
      .be.null;
  });

  it("Alt+Down at the end of a grid column goes on to the next column", () => {
    const grid = body.querySelector("#grid");
    const g1 = body.querySelector("#g1");
    const down = keyboardTarget(g1, 1, body, schemaFor);
    expect(down.parent).to.equal(grid);
    expect(down.slot).to.equal("col-2");
    expect(down.before.id).to.equal("g2");
    const up = keyboardTarget(body.querySelector("#g2"), -1, body, schemaFor);
    expect(up.slot).to.equal("col-1");
    expect(up.before).to.be.null;
    // the last column is the end of the layout
    expect(keyboardTarget(body.querySelector("#g2"), 1, body, schemaFor)).to.be
      .null;
  });

  it("checked blocks move by keyboard as one group", () => {
    const intro = body.querySelector("#intro");
    const a1 = body.querySelector("#a1");
    const target = keyboardTarget([intro, a1], 1, body, schemaFor);
    expect(moveNodes(nodesToMove([intro, a1], body), target, body, schemaFor))
      .to.be.true;
    const order = [...body.children].map((n) => n.id || n.tagName);
    // gathered after the next block past the last one
    expect(order.slice(0, 6)).to.deep.equal([
      "PAGE-BREAK",
      "a",
      "a2",
      "intro",
      "a1",
      "a3",
    ]);
  });

  it("a keyboard move inside a grid column stays in that column", () => {
    const grid = body.querySelector("#grid");
    const extra = document.createElement("p");
    extra.id = "g3";
    extra.setAttribute("slot", "col-1");
    grid.appendChild(extra);
    const up = keyboardTarget(extra, -1, body);
    expect(up.before.id).to.equal("g1");
    expect(up.slot).to.equal("col-1");
  });
});
