/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * site-menu: the site navigation for a 300 page site rendered from the site
 * store, then a deep page made active (highlight and expand its parents),
 * as happens on every page navigation.
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js";
import { run, settle } from "./lib/bench.js";
import { bigOutline } from "./lib/outline.js";

run({
  setup() {
    store.manifest = {
      id: "bench-site",
      title: "Benchmark site",
      metadata: {
        site: { name: "bench-site", lang: "en" },
        platform: {},
        theme: { variables: {}, regions: {} },
      },
      items: bigOutline(),
    };
    store.activeId = "u0";
    return { host: document.getElementById("host") };
  },
  async firstRender(ctx) {
    const el = document.createElement("site-menu");
    ctx.host.appendChild(el);
    await settle(el);
    const menu = el.shadowRoot.querySelector("map-menu");
    if (!menu || !menu.items || menu.items.length < 12) {
      throw new Error("site-menu did not render the outline");
    }
    ctx.el = el;
  },
  async update({ el }) {
    store.activeId = "u9l5s1";
    // the store hands the new id to site-menu in a microtask
    await Promise.resolve();
    await settle(el);
  },
});
