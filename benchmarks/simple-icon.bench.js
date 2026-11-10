/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE.md for full text.
 *
 * simple-icon: 500 icons rendered at once (icon-heavy menus and pickers),
 * then every icon switched to a different icon and color.
 */
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { run, settle } from "./lib/bench.js";

const COUNT = 500;
const ICONS = [
  "icons:check",
  "icons:add",
  "icons:delete",
  "icons:search",
  "editor:format-bold",
  "editor:format-italic",
  "av:play-arrow",
  "social:person",
  "image:image",
  "maps:place",
];
const COLORS = ["blue", "red", "green", "orange", "purple"];

run({
  setup() {
    return { host: document.getElementById("host") };
  },
  async firstRender({ host }) {
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const icon = document.createElement("simple-icon");
      icon.setAttribute("icon", ICONS[i % ICONS.length]);
      icon.setAttribute("accent-color", COLORS[i % COLORS.length]);
      frag.appendChild(icon);
    }
    host.appendChild(frag);
    await settle(host);
  },
  async update({ host }) {
    const icons = host.querySelectorAll("simple-icon");
    for (let i = 0; i < icons.length; i++) {
      icons[i].icon = ICONS[(i + 1) % ICONS.length];
      icons[i].accentColor = COLORS[(i + 2) % COLORS.length];
    }
    await settle(host);
  },
});
