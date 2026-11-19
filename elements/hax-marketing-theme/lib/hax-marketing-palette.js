/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Turns the site's palette into the roles the marketing theme and its blocks
 * draw with, so one palette pick recolors bands, buttons, edges and shadows.
 * A palette's slots follow no light or dark order, so the text color for each
 * role is worked out here: black or white, whichever reads better. One of the
 * two always clears 4.5:1 on any color.
 */
const BLACK = "#000000";
const WHITE = "#ffffff";

function channel(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function luminance(rgb) {
  return (
    0.2126 * channel(rgb[0]) +
    0.7152 * channel(rgb[1]) +
    0.0722 * channel(rgb[2])
  );
}
function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
// A computed color can come back in any notation a design system used
// (rgb, oklch, color-mix), so it is painted and read back as plain sRGB.
let pixel = null;
function parse(color) {
  if (!color) {
    return null;
  }
  if (!pixel) {
    const canvas = globalThis.document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    pixel = canvas.getContext("2d", { willReadFrequently: true });
  }
  if (!pixel) {
    return null;
  }
  pixel.clearRect(0, 0, 1, 1);
  pixel.fillStyle = "#000000";
  pixel.fillStyle = color;
  pixel.fillRect(0, 0, 1, 1);
  const data = pixel.getImageData(0, 0, 1, 1).data;
  // nothing painted means the color did not resolve
  return data[3] === 0 ? null : [data[0], data[1], data[2]];
}
function on(rgb) {
  return contrast(rgb, [255, 255, 255]) >= contrast(rgb, [0, 0, 0])
    ? WHITE
    : BLACK;
}

/**
 * Read the palette where `host` sits and set the role tokens on it.
 * @param {HTMLElement} host the theme element
 */
export function applyMarketingPalette(host) {
  if (!host || !host.isConnected) {
    return;
  }
  const probe = globalThis.document.createElement("span");
  // no transition: a page that shortens transitions for reduced motion still
  // runs one, and a color read mid-transition is not the color
  probe.style.cssText =
    "position:absolute;width:0;height:0;visibility:hidden;transition:none!important;animation:none!important";
  (host.shadowRoot || host).appendChild(probe);
  const read = (value) => {
    probe.style.backgroundColor = "";
    probe.style.backgroundColor = value;
    return parse(globalThis.getComputedStyle(probe).backgroundColor);
  };
  const surface = read(
    "light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray))",
  ) || [255, 255, 255];
  const ink = on(surface);
  const brand = read("var(--ddd-palette-color-1)");
  const accent = read("var(--ddd-palette-color-4)");
  const second = read("var(--ddd-palette-color-6)");
  probe.remove();
  const set = (name, value) => host.style.setProperty(name, value);
  if (brand) {
    set("--hm-brand", "var(--ddd-palette-color-1)");
    set("--hm-on-brand", on(brand));
    // an edge has to show against the page; when the brand color cannot, ink does
    set(
      "--hm-edge",
      contrast(brand, surface) >= 3 ? "var(--ddd-palette-color-1)" : ink,
    );
  }
  if (accent && brand) {
    // the accent is drawn on the brand band and on the page
    const shows = contrast(accent, brand) >= 3;
    set("--hm-accent", shows ? "var(--ddd-palette-color-4)" : on(brand));
    set("--hm-on-accent", shows ? on(accent) : "var(--ddd-palette-color-1)");
    set("--hm-shade", "var(--ddd-palette-color-4)");
  }
  if (second) {
    set("--hm-shade-2", "var(--ddd-palette-color-6)");
  }
}
