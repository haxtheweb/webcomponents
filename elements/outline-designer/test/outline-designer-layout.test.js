import { fixture, expect, html } from "@open-wc/testing";
import "../outline-designer.js";

// layout inside a host that gives the designer a height (the HAXcms outline
// dialog): the designer is the one scroller, its toolbar and its status and
// hints footer stay in view, a host's own controls slot into the toolbar,
// and dragging scrolls from the edges of the visible tree, not from under
// the toolbar or footer.
function makeItems(count) {
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: "p" + i,
      title: "Page " + i,
      slug: "page-" + i,
      location: "pages/page-" + i + "/index.html",
      order: i,
      parent: null,
      indent: 0,
      contents: "<p>Page " + i + "</p>",
      metadata: {},
    });
  }
  return items;
}

async function settle(el) {
  await el.updateComplete;
  await new Promise((r) => setTimeout(r, 30));
  await el.updateComplete;
}

async function scrollingDesigner() {
  const wrap = await fixture(html`
    <div style="height: 700px; display: flex; flex-direction: column">
      <outline-designer
        style="flex: 1 1 auto; min-height: 0; overflow: auto"
        .items="${makeItems(60)}"
      >
        <button slot="controls" id="hostcontrol" type="button">Import</button>
      </outline-designer>
    </div>
  `);
  const el = wrap.querySelector("outline-designer");
  await settle(el);
  return el;
}

describe("outline-designer layout in a scrolling host", () => {
  it("puts a host's slotted controls in the toolbar", async () => {
    const el = await scrollingDesigner();
    const slot = el.shadowRoot.querySelector('.controls slot[name="controls"]');
    expect(slot).to.exist;
    const assigned = slot.assignedElements();
    expect(assigned.length).to.equal(1);
    expect(assigned[0].id).to.equal("hostcontrol");
    // it sits on the toolbar row, before the page count
    const control = assigned[0].getBoundingClientRect();
    const bar = el.shadowRoot
      .querySelector(".controls")
      .getBoundingClientRect();
    expect(control.top).to.be.at.least(bar.top);
    expect(control.bottom).to.be.at.most(bar.bottom);
  });

  it("is the one scroller and keeps its toolbar and footer in view", async () => {
    const el = await scrollingDesigner();
    expect(el.scrollHeight).to.be.greaterThan(el.clientHeight);
    expect(el.parentNode.scrollHeight).to.equal(el.parentNode.clientHeight);
    el.scrollTop = 600;
    await new Promise((r) => requestAnimationFrame(r));
    const box = el.getBoundingClientRect();
    const bar = el.shadowRoot
      .querySelector(".controls")
      .getBoundingClientRect();
    const footer = el.shadowRoot
      .querySelector(".footer")
      .getBoundingClientRect();
    // the toolbar is not clipped at the top
    expect(Math.round(bar.top)).to.equal(Math.round(box.top));
    // the drag status and hints are on screen at the bottom
    expect(Math.round(footer.bottom)).to.equal(Math.round(box.bottom));
    expect(el.shadowRoot.querySelector(".footer .drag-status")).to.exist;
    expect(el.shadowRoot.querySelector(".footer .hints")).to.exist;
  });

  it("draws rows under the toolbar and footer, not over them", async () => {
    const el = await scrollingDesigner();
    el.scrollTop = 600;
    await new Promise((r) => requestAnimationFrame(r));
    const bar = el.shadowRoot
      .querySelector(".controls")
      .getBoundingClientRect();
    // a point in the toolbar's top padding, where a row's toggle sits
    // underneath once scrolled
    const toggle = el.shadowRoot.querySelector("li.item .toggle");
    const x = toggle.getBoundingClientRect().left + 4;
    const hit = el.shadowRoot.elementFromPoint(x, bar.top + 2);
    expect(hit.closest(".controls")).to.exist;
  });

  it("measures drag auto-scroll from the visible tree area", async () => {
    const el = await scrollingDesigner();
    el.scrollTop = 300;
    await new Promise((r) => requestAnimationFrame(r));
    const outer = el.getBoundingClientRect();
    const box = el._visibleTreeBox({ top: outer.top, bottom: outer.bottom });
    const bar = el.shadowRoot
      .querySelector(".controls")
      .getBoundingClientRect();
    const footer = el.shadowRoot
      .querySelector(".footer")
      .getBoundingClientRect();
    expect(Math.round(box.top)).to.equal(Math.round(bar.bottom));
    expect(Math.round(box.bottom)).to.equal(Math.round(footer.top));
    expect(el._scrollParent()).to.equal(el);
  });

  // where a row sits against the sticky toolbar and footer
  function clearance(el, id) {
    const li = el.shadowRoot.querySelector(`li.item[data-item-id="${id}"]`);
    const r = li.getBoundingClientRect();
    const bar = el.shadowRoot
      .querySelector(".controls")
      .getBoundingClientRect();
    const footer = el.shadowRoot
      .querySelector(".footer")
      .getBoundingClientRect();
    return { belowBar: r.top - bar.bottom, aboveFooter: footer.top - r.bottom };
  }

  it("keeps a page moved down by keyboard clear of the footer", async () => {
    const el = await scrollingDesigner();
    el.reducedMotion = "reduce";
    // a page in the lower part of the view, then moved down past the edge
    el.scrollTop = 200;
    await new Promise((r) => requestAnimationFrame(r));
    const box = el.getBoundingClientRect();
    const footer = el.shadowRoot
      .querySelector(".footer")
      .getBoundingClientRect();
    const li = [...el.shadowRoot.querySelectorAll("li.item")].find(
      (l) => l.getBoundingClientRect().bottom > footer.top - 80,
    );
    expect(box.bottom).to.be.greaterThan(footer.top);
    const id = li.getAttribute("data-item-id");
    for (let n = 0; n < 6; n++) {
      const index = el.items.findIndex((i) => i.id === id);
      await el._moveByKeyboard(index, "down");
      await settle(el);
      const c = clearance(el, id);
      expect(c.aboveFooter, "move " + (n + 1)).to.be.at.least(7);
      expect(c.belowBar, "move " + (n + 1)).to.be.at.least(7);
    }
  });

  it("keeps a page moved up by keyboard clear of the toolbar", async () => {
    const el = await scrollingDesigner();
    el.reducedMotion = "reduce";
    el.scrollTop = 900;
    await new Promise((r) => requestAnimationFrame(r));
    const bar = el.shadowRoot
      .querySelector(".controls")
      .getBoundingClientRect();
    const li = [...el.shadowRoot.querySelectorAll("li.item")].find(
      (l) => l.getBoundingClientRect().top > bar.bottom + 4,
    );
    const id = li.getAttribute("data-item-id");
    for (let n = 0; n < 6; n++) {
      const index = el.items.findIndex((i) => i.id === id);
      await el._moveByKeyboard(index, "up");
      await settle(el);
      const c = clearance(el, id);
      expect(c.belowBar, "move " + (n + 1)).to.be.at.least(7);
      expect(c.aboveFooter, "move " + (n + 1)).to.be.at.least(7);
    }
  });

  it("keeps arrow-key focus clear of the toolbar and footer", async () => {
    const el = await scrollingDesigner();
    el.scrollTop = 400;
    await new Promise((r) => requestAnimationFrame(r));
    const bar = el.shadowRoot
      .querySelector(".controls")
      .getBoundingClientRect();
    const li = [...el.shadowRoot.querySelectorAll("li.item")].find(
      (l) => l.getBoundingClientRect().top > bar.bottom + 4,
    );
    // walk focus up past the toolbar, then down past the footer
    let id = li.getAttribute("data-item-id");
    for (let n = 0; n < 8; n++) {
      const index = el.items.findIndex((i) => i.id === id);
      el.focusItem(el.items[index - 1].id);
      id = el.items[index - 1].id;
      expect(clearance(el, id).belowBar).to.be.at.least(7);
    }
    for (let n = 0; n < 25; n++) {
      const index = el.items.findIndex((i) => i.id === id);
      el.focusItem(el.items[index + 1].id);
      id = el.items[index + 1].id;
      expect(clearance(el, id).aboveFooter).to.be.at.least(7);
    }
  });

  it("pads native scrolling by the toolbar and footer", async () => {
    const el = await scrollingDesigner();
    await new Promise((r) => requestAnimationFrame(r));
    const style = getComputedStyle(el);
    const bar = el.shadowRoot.querySelector(".controls").offsetHeight;
    const footer = el.shadowRoot.querySelector(".footer").offsetHeight;
    expect(parseFloat(style.scrollPaddingTop)).to.equal(bar + 8);
    expect(parseFloat(style.scrollPaddingBottom)).to.equal(footer + 8);
  });
});
