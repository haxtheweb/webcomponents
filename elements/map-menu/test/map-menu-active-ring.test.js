import { fixture, expect, html } from "@open-wc/testing";
import "../map-menu.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const item = (id, title, parent = null, icon = "") => ({
  id,
  title,
  slug: id,
  parent,
  indent: parent ? 1 : 0,
  order: 0,
  metadata: icon ? { icon } : {},
});
const MANIFEST = {
  items: [
    item("a", "Introduction"),
    item("b", "Lesson 1", null, "icons:description"),
    item("c", "Unit 1"),
    item("c1", "Lesson 2", "c"),
  ],
};

async function menuWith(selected, activeProgress) {
  const mm = await fixture(
    html`<map-menu
      .manifest="${MANIFEST}"
      selected="${selected}"
      .activeProgress="${activeProgress}"
    ></map-menu>`,
  );
  await flush(80);
  return mm;
}
// every item and header, by id, through the shadow roots
async function nodes(mm) {
  const out = {};
  const walk = async (root) => {
    const els = root.querySelectorAll(
      "map-menu-item, map-menu-header, map-menu-submenu, map-menu-builder",
    );
    for (const el of els) {
      if (el.updateComplete) {
        await el.updateComplete;
      }
      if (
        el.tagName !== "MAP-MENU-BUILDER" &&
        el.tagName !== "MAP-MENU-SUBMENU"
      ) {
        out[el.id] = el;
      }
      if (el.shadowRoot) {
        await walk(el.shadowRoot);
      }
    }
  };
  await walk(mm.shadowRoot);
  return out;
}
const spoken = (el) =>
  el.shadowRoot.querySelector("button").textContent.replace(/\s+/g, " ").trim();

describe("map-menu active page ring", () => {
  it("only the item of the page open now shows a ring, filled to its percent", async () => {
    const mm = await menuWith("a", 0.49);
    const n = await nodes(mm);
    expect(n.a.activeProgress).to.equal(0.49);
    const ring = n.a.shadowRoot.querySelector(".active-ring .ddd-ring");
    expect(ring).to.exist;
    expect(ring.getAttribute("data-state")).to.equal("progress");
    expect(
      ring.querySelector(".ddd-ring-fill").getAttribute("stroke-dasharray"),
    ).to.equal("49 100");
    // hover text and accessible name carry the percent
    expect(n.a.shadowRoot.querySelector("a").getAttribute("title")).to.equal(
      "Introduction, 49% complete",
    );
    expect(spoken(n.a)).to.equal("Introduction, 49% complete");
    // no other item has a ring or a status mark
    ["b", "c", "c1"].forEach((id) => {
      expect(n[id].activeProgress).to.equal(null);
      expect(n[id].shadowRoot.querySelector(".active-ring")).to.equal(null);
      expect(n[id].shadowRoot.querySelector(".progress-mark")).to.equal(null);
    });
    expect(n.b.shadowRoot.querySelector("a").getAttribute("title")).to.equal(
      "Lesson 1",
    );
    await expect(n.a).shadowDom.to.be.accessible();
  });

  it("keeps the page icon inside the ring and finishes as a disc with a check", async () => {
    const mm = await menuWith("b", 1);
    const n = await nodes(mm);
    const ring = n.b.shadowRoot.querySelector(".active-ring .ddd-ring");
    expect(ring.getAttribute("data-state")).to.equal("done");
    expect(
      ring.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:check");
    expect(spoken(n.b)).to.equal("Lesson 1, Complete");
    mm.activeProgress = 0.3;
    await flush(60);
    const again = (await nodes(mm)).b.shadowRoot.querySelector(".ddd-ring");
    expect(
      again.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:description");
  });

  it("a parent page (header) shows the ring while it is open", async () => {
    const mm = await menuWith("c", 0);
    const n = await nodes(mm);
    const ring = n.c.shadowRoot.querySelector(".active-ring .ddd-ring");
    expect(ring).to.exist;
    expect(ring.getAttribute("data-state")).to.equal("none");
    expect(spoken(n.c)).to.equal("Unit 1, 0% complete");
  });

  it("no ring without activeProgress", async () => {
    const mm = await menuWith("a", null);
    const n = await nodes(mm);
    Object.values(n).forEach((el) => {
      expect(el.shadowRoot.querySelector(".active-ring")).to.equal(null);
    });
  });

  it("bursts once when the open page completes, not when it was already done", async () => {
    const mm = await menuWith("c1", 0.5);
    let n = await nodes(mm);
    const played = [];
    const watch = (el) => {
      const mo = new MutationObserver(() => {
        if (el.shadowRoot.querySelector("[data-ddd-celebrate]")) {
          played.push(el.id);
        }
      });
      mo.observe(el.shadowRoot, {
        subtree: true,
        attributes: true,
        attributeFilter: ["data-ddd-celebrate"],
      });
      return mo;
    };
    const mo = watch(n.c1);
    mm.activeProgress = 1;
    await flush(80);
    expect(played).to.deep.equal(["c1"]);
    // dropping back and finishing again does not play it again
    mm.activeProgress = 0.9;
    await flush(60);
    mm.activeProgress = 1;
    await flush(60);
    expect(played).to.deep.equal(["c1"]);
    mo.disconnect();
    // a page already done when opened shows done without a burst
    const other = await menuWith("a", 1);
    n = await nodes(other);
    expect(n.a.shadowRoot.querySelector("[data-ddd-celebrate]")).to.equal(null);
  });
});

// WCAG relative luminance contrast of two computed rgb() colours
const rgb = (c) =>
  String(c)
    .match(/[\d.]+/g)
    .slice(0, 3)
    .map(Number);
const lum = (c) => {
  const [r, g, b] = rgb(c).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// the active row colours themes give the menu (clean-one light / dark,
// clean-two light / dark)
const ROWS = [
  ["clean-one light", "#262626", "#bbbbbb"],
  ["clean-one dark", "#dddddd", "#000000"],
  ["clean-two light", "#001e44", "#ffffff"],
  ["clean-two dark", "#ffffff", "#001e44"],
];

describe("map-menu active ring contrast (WCAG 1.4.11, 3:1)", () => {
  ROWS.forEach(([name, bg, fg]) => {
    it(`${name}: track, fill, done disc and its check`, async () => {
      const mm = await fixture(
        html`<map-menu
          style="--map-menu-item-a-active-background-color: ${bg}; --map-menu-item-a-active-color: ${fg};"
          .manifest="${MANIFEST}"
          selected="b"
          .activeProgress="${0.4}"
        ></map-menu>`,
      );
      await flush(80);
      let n = await nodes(mm);
      expect(n.b.hasAttribute("active")).to.equal(true);
      const row = getComputedStyle(
        n.b.shadowRoot.querySelector("button"),
      ).backgroundColor;
      const ring = () => n.b.shadowRoot.querySelector(".active-ring .ddd-ring");
      const fill = getComputedStyle(
        ring().querySelector(".ddd-ring-fill"),
      ).stroke;
      const track = getComputedStyle(
        ring().querySelector(".ddd-ring-track"),
      ).stroke;
      expect(contrast(fill, row)).to.be.at.least(3);
      expect(contrast(track, row)).to.be.at.least(3);
      // progress is not colour alone: a thick arc over a thin track
      expect(
        parseFloat(
          getComputedStyle(ring().querySelector(".ddd-ring-fill")).strokeWidth,
        ),
      ).to.be.greaterThan(
        parseFloat(
          getComputedStyle(ring().querySelector(".ddd-ring-track")).strokeWidth,
        ) * 2,
      );
      mm.activeProgress = 1;
      await flush(80);
      n = await nodes(mm);
      const disc = getComputedStyle(ring()).backgroundColor;
      const check = getComputedStyle(
        ring().querySelector(".ddd-ring-glyph simple-icon-lite"),
      ).color;
      expect(contrast(disc, row)).to.be.at.least(3);
      expect(contrast(check, disc)).to.be.at.least(3);
    });
  });

  it("an item with children: the ring traces its expand control", async () => {
    const mm = await fixture(
      html`<map-menu
        style="--map-menu-item-a-active-background-color: #262626; --map-menu-item-a-active-color: #bbbbbb;"
        .manifest="${MANIFEST}"
        selected="c"
        .activeProgress="${0.5}"
      ></map-menu>`,
    );
    await flush(120);
    const n = await nodes(mm);
    const ringEl = n.c.shadowRoot.querySelector(".active-ring");
    expect(ringEl.classList.contains("on-expand")).to.equal(true);
    let sub = null;
    mm.shadowRoot
      .querySelector("map-menu-builder")
      .querySelectorAll("map-menu-submenu")
      .forEach((s) => {
        if (s.id === "c") {
          sub = s;
        }
      });
    const expand = sub.shadowRoot
      .querySelector("a11y-collapse")
      .shadowRoot.querySelector("#expand");
    const r = ringEl.getBoundingClientRect();
    const e = expand.getBoundingClientRect();
    // same centre (within a pixel), ring around it
    expect(Math.abs(r.x + r.width / 2 - (e.x + e.width / 2))).to.be.below(1.5);
    expect(Math.abs(r.y + r.height / 2 - (e.y + e.height / 2))).to.be.below(
      1.5,
    );
    expect(r.width).to.be.greaterThan(e.width);
    // in progress: the chevron sits on the row (no disc of its own) in the
    // row's text colour, the ring around it
    expect(sub.hasAttribute("data-active-ring")).to.equal(true);
    expect(getComputedStyle(expand).backgroundColor).to.equal(
      "rgba(0, 0, 0, 0)",
    );
    expect(
      contrast(getComputedStyle(expand).color, "rgb(38, 38, 38)"),
    ).to.be.at.least(3);
    // the title is not pushed aside by a second control
    expect(ringEl.querySelector(".ddd-ring-glyph").offsetWidth).to.equal(0);
    // done: a filled disc with the chevron on it in the row colour
    mm.activeProgress = 1;
    await flush(120);
    expect(sub.hasAttribute("data-active-done")).to.equal(true);
    const disc = getComputedStyle(expand).backgroundColor;
    const chevron = getComputedStyle(expand).color;
    expect(contrast(chevron, disc)).to.be.at.least(3);
    expect(contrast(disc, "rgb(38, 38, 38)")).to.be.at.least(3);
    // the chevron stays the control on the disc
    expect(
      n.c.shadowRoot.querySelector(".ddd-ring").getAttribute("data-state"),
    ).to.equal("done");
  });
});
