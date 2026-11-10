/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * outline-designer: a 300 page outline rendered from scratch, then one page
 * moved down among its siblings (the same itemOp the move menu uses).
 */
import "@haxtheweb/outline-designer/outline-designer.js";
import { run, settle } from "./lib/bench.js";
import { bigOutline } from "./lib/outline.js";

run({
  setup() {
    return { host: document.getElementById("host"), items: bigOutline() };
  },
  async firstRender(ctx) {
    const el = document.createElement("outline-designer");
    el.style.cssText = "flex: 1 1 auto; min-height: 0; overflow: auto";
    el.items = ctx.items;
    ctx.host.appendChild(el);
    await settle(el);
    if (el.shadowRoot.querySelectorAll("li.item").length < 300) {
      throw new Error("outline-designer did not render the outline");
    }
    ctx.el = el;
  },
  async update({ el }) {
    // a lesson in the middle of the outline, moved below its next sibling
    const index = el.items.findIndex((i) => i.id === "u6l3");
    el.itemOp(index, "down");
    await settle(el);
  },
});
