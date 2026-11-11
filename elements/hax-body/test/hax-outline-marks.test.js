import { fixture, expect, html } from "@open-wc/testing";
import { HaxOutlineMarks } from "../lib/hax-outline-marks.js";

describe("hax-outline-marks", () => {
  let host;
  let layer;
  let marks;
  beforeEach(async () => {
    host = await fixture(html`
      <div style="position: relative; width: 400px">
        <h2 id="a" style="margin: 0; height: 40px">Why</h2>
        <p id="a1" style="margin: 0; height: 40px">Waves</p>
        <p id="b1" style="margin: 0; height: 40px">Drop</p>
        <div
          id="layer"
          style="position: absolute; inset: 0; pointer-events: none"
        ></div>
      </div>
    `);
    layer = host.querySelector("#layer");
    marks = new HaxOutlineMarks(host, layer);
  });
  const boxes = (kind) => [...layer.querySelectorAll(`.mark.${kind}`)];

  it("draws a scrim over each checked block", () => {
    marks.set({ selected: [host.querySelector("#a1")] });
    const [box] = boxes("selected");
    expect(box).to.exist;
    // just past the block, like the active block's outline
    expect(box.style.top).to.equal("36px");
    expect(box.style.height).to.equal("48px");
  });

  it("lights a branch with a bar down its left edge", () => {
    marks.set({ tree: [host.querySelector("#a"), host.querySelector("#a1")] });
    expect(boxes("tree").length).to.equal(2);
    const [bar] = boxes("tree-bar");
    expect(parseInt(bar.style.height, 10)).to.equal(88);
  });

  it("draws the drop spot above a block, or the end of the body", () => {
    marks.set({ drop: { parent: host, before: host.querySelector("#a1") } });
    const [line] = boxes("drop");
    expect(parseInt(line.style.top, 10)).to.be.lessThan(40);
    marks.set({ drop: { parent: host, before: null } });
    expect(parseInt(boxes("drop")[0].style.top, 10)).to.be.greaterThan(110);
  });

  it("an empty container is a drop zone of its own", () => {
    const box = globalThis.document.createElement("div");
    box.style.height = "30px";
    host.insertBefore(box, layer);
    marks.set({ drop: { parent: box, slot: "", before: null } });
    expect(boxes("drop-into").length).to.equal(1);
  });

  it("clears", () => {
    marks.set({ selected: [host.querySelector("#a1")] });
    marks.clear();
    expect(layer.children.length).to.equal(0);
  });

  it("moves slide, light up and leave deleted blocks a fading hatch", async () => {
    const a = host.querySelector("#a");
    const b1 = host.querySelector("#b1");
    const a1 = host.querySelector("#a1");
    const moved = marks.animate(
      [a, a1, b1],
      () => {
        host.insertBefore(b1, a);
        a1.remove();
        return true;
      },
      { flash: [b1], gone: [a1] },
    );
    expect(moved).to.be.true;
    expect(b1.getAnimations().length).to.equal(1);
    expect(boxes("flash").length).to.equal(1);
    expect(boxes("ghost").length).to.equal(1);
    // a redraw keeps the fading marks until they finish
    marks.set({ selected: [] });
    expect(boxes("ghost").length).to.equal(1);
    await new Promise((r) => setTimeout(r, 800));
    expect(boxes("ghost").length).to.equal(0);
    expect(boxes("flash").length).to.equal(0);
  });
});
