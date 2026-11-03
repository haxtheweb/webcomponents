/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDD accent map: turns the SimpleColors names authors have used for years
 * in `accent-color="…"` into the nearest DDD palette colour, so existing
 * content keeps its intent and every element lands on the same colour for
 * the same name. Elements keep the `accent-color` attribute (no API change);
 * only what it paints changes.
 *
 * Standalone on purpose, like DDDBlock.js: it adds no exports to d-d-d.js or
 * DDDStyles.js. Import it directly:
 *
 *   import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
 *   static get styles() { return [super.styles, DDDAccentStyles, css`...`]; }
 *
 * DDDAccentStyles sets these on :host from its accent-color attribute:
 *   --ddd-accent-color       the colour (lighter partner in dark mode so it
 *                            keeps contrast on a midnight surface)
 *   --ddd-accent-color-tint  a soft background tint of it (light / dark)
 *   --ddd-accent-color-ink   readable text / icon colour on top of
 *                            --ddd-accent-color
 *   --ddd-block-accent       same as --ddd-accent-color, so a DDDBlock
 *                            frame with data-block-accent picks it up
 * Without an accent-color attribute nothing is set; use a fallback, e.g.
 * var(--ddd-accent-color, var(--ddd-theme-default-beaverBlue)).
 */
import { css, unsafeCSS } from "lit";

/**
 * SimpleColors name -> [DDD colour, DDD colour in dark mode, ink on colour]
 * Ink: "light" = white text on the colour, "dark" = navy text on it.
 */
export const DDDAccentMap = {
  red: ["original87Pink", "discoveryCoral", "light"],
  pink: ["discoveryCoral", "discoveryCoral", "dark"],
  purple: ["wonderPurple", "athertonViolet", "light"],
  "deep-purple": ["wonderPurple", "athertonViolet", "light"],
  indigo: ["beaverBlue", "pughBlue", "light"],
  blue: ["beaverBlue", "pughBlue", "light"],
  "light-blue": ["skyBlue", "skyBlue", "dark"],
  cyan: ["skyBlue", "skyBlue", "dark"],
  teal: ["creekTeal", "creekTeal", "dark"],
  green: ["opportunityGreen", "futureLime", "light"],
  "light-green": ["forestGreen", "futureLime", "light"],
  lime: ["futureLime", "futureLime", "dark"],
  yellow: ["keystoneYellow", "keystoneYellow", "dark"],
  amber: ["roarGolden", "roarGolden", "dark"],
  orange: ["inventOrange", "inventOrange", "dark"],
  "deep-orange": ["discoveryCoral", "discoveryCoral", "dark"],
  brown: ["landgrantBrown", "shrineTan", "light"],
  grey: ["limestoneGray", "limestoneGray", "dark"],
  "blue-grey": ["slateGray", "slateLight", "light"],
};

/**
 * The DDD token name for a SimpleColors name (light scheme), or "" when the
 * name isn't in the map. For JS that needs the colour outside CSS.
 * @param {String} name e.g. "blue"
 * @returns {String} e.g. "beaverBlue"
 */
export function dddAccentName(name) {
  const entry = DDDAccentMap[name];
  return entry ? entry[0] : "";
}

const t = (n) => `var(--ddd-theme-default-${n})`;
const rules = Object.keys(DDDAccentMap)
  .map((name) => {
    const [light, dark, ink] = DDDAccentMap[name];
    const color = `light-dark(${t(light)}, ${t(dark)})`;
    const inkColor =
      ink === "light"
        ? `light-dark(${t("white")}, ${t("potentialMidnight")})`
        : t("nittanyNavy");
    return `:host([accent-color="${name}"]) {
  --ddd-accent-color: ${color};
  --ddd-accent-color-tint: light-dark(color-mix(in srgb, ${t(light)} 14%, ${t("white")}), color-mix(in srgb, ${t(dark)} 22%, ${t("potentialMidnight")}));
  --ddd-accent-color-ink: ${inkColor};
  --ddd-block-accent: var(--ddd-accent-color);
}`;
  })
  .join("\n");

export const DDDAccentStyles = css`
  ${unsafeCSS(rules)}
`;
