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
