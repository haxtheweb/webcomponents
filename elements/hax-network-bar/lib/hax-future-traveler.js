/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, svg, css } from "lit";

/**
 * The Future Traveler across time. He has been to every era and carries its
 * best ideas in his pack, so the same icon can be drawn the way each era
 * would have drawn it. Every era here follows one of the styles HAX's
 * posters tell the story of the pillars in (haxtheweb/art, haxtheweb/posters);
 * `from` names the poster. `now` is the icon as it ships (hax:future-traveler).
 *
 * The network bar loads this file the first time its traveler is hovered,
 * focused or clicked, so a page that never touches him never downloads it.
 */
export const HAX_TRAVELER_ERAS = [
  { id: "now", label: "Today", from: "hax:future-traveler" },
  { id: "steam", label: "1880s steam age", from: "hax_1880s_poster" },
  { id: "nouveau", label: "1900s modern marvel", from: "hax_1900s_poster" },
  { id: "deco", label: "1920s roaring twenties", from: "hax_1920s_poster" },
  {
    id: "tomorrow",
    label: "1960s world of tomorrow",
    from: "hax_tomorrow_all_poster",
  },
  { id: "rainbow", label: "1970s rainbow", from: "hax_1970s_poster" },
  { id: "stripes", label: "1980s corporate", from: "hax_1980s_poster" },
  { id: "neon", label: "1980s cyberpunk", from: "hax_1980s_cyberpunk_poster" },
  {
    id: "handheld",
    label: "Handheld, four greens",
    from: "hax_gameboy_poster",
  },
  { id: "web", label: "1990s early web", from: "hax_1990s_poster" },
  { id: "polygon", label: "32-bit polygons", from: "hax_ps_poster" },
  { id: "terminal", label: "Terminal", from: "hax_hacker_poster" },
];

/**
 * The World of Tomorrow posters come one to a pillar, each in its pillar's
 * color; the tomorrow era takes any of them as its tint.
 */
export const HAX_TRAVELER_PILLAR_TINTS = {
  ubiquity: "#2a7f86",
  accessible: "#1e407c",
  efficient: "#e98300",
  extensible: "#3ea39e",
  open: "#ffd100",
  agnostic: "#009cde",
  remixable: "#bc204b",
  sustainable: "#99cc00",
};

/** pillar colors light enough that the word on them is drawn in ink */
const LIGHT_TINTS = ["#e98300", "#ffd100", "#99cc00", "#3ea39e", "#009cde"];
const HELMET = "M3.2 15.4C3.2 9.6 7 6.6 12 6.6s8.8 3 8.8 8.8Z";
let made = 0;

/** the icon's parts, each colored by the era */
const parts = (o) => svg`
  ${o.back || ``}
  <path d="M12 6.6v-.8" fill="none" stroke="${o.stalk}" stroke-width="1.4" stroke-linecap="round"></path>
  <circle class="ft-bulb" cx="12" cy="4" r="1.8" fill="${o.bulb}" stroke="${o.bulbLine || "none"}" stroke-width=".6"></circle>
  <path d="${HELMET}" fill="${o.helmet}" stroke="${o.line || "none"}" stroke-width="${o.lineWidth || 0}" stroke-linejoin="round"></path>
  ${o.over || ``}
  ${
    o.word === false
      ? ``
      : svg`<text x="12" y="12.8" font-size="4.6" font-weight="900" fill="${o.word}" text-anchor="middle" font-family="${o.font || "Roboto, Arial, sans-serif"}">HAX</text>`
  }
  <rect x="3" y="14.4" width="18" height="2.4" rx="1.2" fill="${o.band}" stroke="${o.line || "none"}" stroke-width="${o.lineWidth || 0}"></rect>
  <g fill="${o.band}" stroke="${o.line || "none"}" stroke-width="${o.lineWidth || 0}">
    <circle cx="8.2" cy="16.6" r="3.4"></circle>
    <circle cx="15.8" cy="16.6" r="3.4"></circle>
  </g>
  <g class="ft-lens" fill="${o.lens}" stroke="${o.lensLine || "none"}" stroke-width=".5">
    <circle cx="8.2" cy="16.6" r="2.2"></circle>
    <circle cx="15.8" cy="16.6" r="2.2"></circle>
  </g>
  ${o.front || ``}`;

/**
 * A glow, drawn: the same outline again, wider and faint, under the real
 * one. A CSS filter on the svg would do it too, but leaves torn copies behind
 * when something inside it moves.
 */
const glow = (
  helmet,
  goggles,
  bulb,
) => svg`<g class="ft-glow" fill="none" stroke-linejoin="round" opacity=".3">
    <path d="${HELMET}" stroke="${helmet}" stroke-width="3"></path>
    <rect x="3" y="14.4" width="18" height="2.4" rx="1.2" stroke="${helmet}" stroke-width="2.6"></rect>
    <circle cx="8.2" cy="16.6" r="2.8" stroke="${goggles}" stroke-width="3"></circle>
    <circle cx="15.8" cy="16.6" r="2.8" stroke="${goggles}" stroke-width="3"></circle>
    <circle cx="12" cy="4" r="1.8" stroke="${bulb}" stroke-width="2.4"></circle>
  </g>`;

/** the icon on a 12 by 12 grid of pixels, for the handheld era */
const PIXELS = [
  ".....BB.....",
  ".....BB.....",
  ".....SS.....",
  "...HHHHHH...",
  "..HHHHHHHH..",
  ".HHHHHHHHHH.",
  ".HVLVLLVLVH.",
  ".HVVVLLVVVH.",
  "GGGGGGGGGGGG",
  ".GEEG..GEEG.",
  ".GEEG..GEEG.",
  "..GG....GG..",
];
const pixels = (ink, only) => {
  const out = [];
  PIXELS.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      let w = 1;
      while (x + w < row.length && row[x + w] === c) w++;
      if (ink[c] && (only ? only === c : c !== "E")) {
        out.push(
          svg`<rect x="${x * 2}" y="${y * 2}" width="${w * 2}" height="2" fill="${ink[c]}"></rect>`,
        );
      }
      x += w;
    }
  });
  return out;
};

const ERA = {
  now: () =>
    parts({
      stalk: "#1d5e3c",
      bulb: "#e4e5e7",
      bulbLine: "#5b5b5b",
      helmet: "#bc204b",
      word: "#fff",
      band: "#1d5e3c",
      lens: "#2fd3e0",
    }),
  // an engraving: sepia paper, ink lines, brass goggles with gear teeth
  steam: () =>
    parts({
      stalk: "#3d2b1f",
      bulb: "#f1e3c2",
      bulbLine: "#3d2b1f",
      helmet: "#d9c39a",
      line: "#3d2b1f",
      lineWidth: 0.6,
      over: svg`<path d="M5.6 13.6c.4-2.6 2-4.6 4.4-5.6M18.4 13.6c-.4-2.6-2-4.6-4.4-5.6M7.6 13.8c.3-1.8 1.2-3.2 2.6-4.2M16.4 13.8c-.3-1.8-1.2-3.2-2.6-4.2" fill="none" stroke="#3d2b1f" stroke-width=".35" stroke-linecap="round"></path>`,
      word: "#3d2b1f",
      font: "Georgia, 'Times New Roman', serif",
      band: "#8a6a3a",
      lens: "#e9d8b4",
      lensLine: "#3d2b1f",
      front: svg`<g class="ft-spin" fill="none" stroke="#b8862f" stroke-width="1" stroke-dasharray=".9 1.03">
        <circle cx="8.2" cy="16.6" r="3.9"></circle>
        <circle cx="15.8" cy="16.6" r="3.9"></circle>
      </g>`,
    }),
  // art nouveau: cream, teal and gold, with whiplash curves
  nouveau: () =>
    parts({
      back: svg`<path class="ft-sway" d="M2.2 20.4c-1.4-4.6.2-9 3.4-11.6M21.8 20.4c1.4-4.6-.2-9-3.4-11.6M1.6 12.2c.2-1.6 1.2-2.6 2.6-2.6M22.4 12.2c-.2-1.6-1.2-2.6-2.6-2.6" fill="none" stroke="#c9a94e" stroke-width=".7" stroke-linecap="round"></path>`,
      stalk: "#6b6a2f",
      bulb: "#f3ecd6",
      bulbLine: "#6b6a2f",
      helmet: "#2f6f6a",
      line: "#f3ecd6",
      lineWidth: 0.5,
      word: "#f3ecd6",
      font: "Georgia, 'Times New Roman', serif",
      band: "#6b6a2f",
      lens: "#e0bf5a",
    }),
  // art deco: black and gold, a sunburst behind him
  deco: () =>
    parts({
      back: svg`<g class="ft-rays" stroke="#d4af37" stroke-width=".5" stroke-linecap="round">
        <path d="M12 15V.6M12 15 5.2 2.2M12 15l6.8-12.8M12 15 .8 6.4M12 15l11.2-8.6M12 15 .4 11.6M12 15l11.6-3.4"></path>
      </g>`,
      stalk: "#d4af37",
      bulb: "#d4af37",
      helmet: "#101010",
      line: "#d4af37",
      lineWidth: 0.7,
      over: svg`<path d="M5.4 13.9c.5-3.2 3-5.6 6.6-5.6s6.1 2.4 6.6 5.6" fill="none" stroke="#d4af37" stroke-width=".35"></path>`,
      word: "#d4af37",
      band: "#101010",
      lens: "#d4af37",
    }),
  // a 1960s travel poster, in the color of one pillar
  tomorrow: (tint) =>
    parts({
      back: svg`<circle cx="12" cy="12" r="11.4" fill="#f3e6c4"></circle>
        <ellipse class="ft-orbit" cx="12" cy="11.4" rx="11" ry="3.4" fill="none" stroke="${tint}" stroke-width=".7" transform="rotate(-18 12 11.4)"></ellipse>
        <path d="M19.6 3.4l.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4z" fill="#e8742c"></path>`,
      stalk: "#1a2a44",
      bulb: "#fff7df",
      bulbLine: "#1a2a44",
      helmet: tint,
      line: "#1a2a44",
      lineWidth: 0.5,
      word: LIGHT_TINTS.includes(tint) ? "#1a2a44" : "#fff7df",
      band: "#1a2a44",
      lens: "#fff7df",
    }),
  // the 1970s: one rainbow arch inside another
  rainbow: () => {
    const arch = (s, fill) =>
      svg`<path d="${HELMET}" fill="${fill}" transform="translate(12 15.4) scale(${s}) translate(-12 -15.4)"></path>`;
    return parts({
      stalk: "#6b3a1e",
      bulb: "#f6e7c1",
      bulbLine: "#6b3a1e",
      helmet: "#6b3a1e",
      over: svg`${arch(0.86, "#c8402a")}${arch(0.72, "#e8742c")}${arch(0.58, "#f2b632")}${arch(0.44, "#f6e7c1")}`,
      word: false,
      band: "#6b3a1e",
      lens: "#f2b632",
    });
  },
  // 1980s corporate: built from stripes
  stripes: () => {
    const id = `ft-stripes-${++made}`;
    return parts({
      back: svg`<defs><clipPath id="${id}"><path d="${HELMET}"></path></clipPath></defs>`,
      stalk: "#fff",
      bulb: "#fff",
      helmet: "none",
      over: svg`<g clip-path="url(#${id})" stroke="#fff" stroke-width=".8">
        <path d="M0 7.4h24M0 9h24M0 10.6h24M0 12.2h24M0 13.8h24M0 15.4h24"></path>
      </g>`,
      word: false,
      band: "#fff",
      lens: "#262626",
      front: svg`<path d="M6.6 16.6h3.2M14.2 16.6h3.2" stroke="#fff" stroke-width=".8"></path>`,
    });
  },
  // cyberpunk: nothing but neon tube
  neon: () =>
    parts({
      back: glow("#ff4fb0", "#2fe6ff", "#ffe14a"),
      stalk: "#2fe6ff",
      bulb: "none",
      bulbLine: "#ffe14a",
      helmet: "none",
      line: "#ff4fb0",
      lineWidth: 0.9,
      word: "#ff4fb0",
      band: "none",
      lens: "none",
      lensLine: "#2fe6ff",
    }),
  // a handheld screen: twelve pixels square, four greens; his goggle eyes
  // blink
  handheld: () => {
    const ink = {
      B: "#8bac0f",
      S: "#306230",
      H: "#306230",
      V: "#0f380f",
      L: "#9bbc0f",
      G: "#0f380f",
      E: "#9bbc0f",
    };
    return svg`<g shape-rendering="crispEdges">
      <rect width="24" height="24" fill="#9bbc0f"></rect>
      ${pixels(ink)}
      <path d="M9.5 0h5v4.5h-5z" fill="none" stroke="#0f380f" stroke-width="1"></path>
      <g class="ft-eyes">${pixels(ink, "E")}</g>
    </g>`;
  },
  // the early web: a rainbow fill and a hard drop shadow
  web: () => {
    const id = `ft-web-${++made}`;
    return svg`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ff3b7f"></stop><stop offset=".35" stop-color="#ffd23f"></stop>
        <stop offset=".7" stop-color="#3fe08a"></stop><stop offset="1" stop-color="#3fa9ff"></stop>
      </linearGradient></defs>
      <g transform="translate(.9 .9)" opacity=".9">${parts({ stalk: "#1b1b8f", bulb: "#1b1b8f", helmet: "#1b1b8f", word: false, band: "#1b1b8f", lens: "#1b1b8f" })}</g>
      ${parts({
        stalk: "#c0c0c0",
        bulb: "#ffff66",
        bulbLine: "#1b1b8f",
        helmet: `url(#${id})`,
        line: "#1b1b8f",
        lineWidth: 0.4,
        word: "#fff",
        font: "'Comic Sans MS', 'Comic Neue', cursive",
        band: "#c0c0c0",
        lens: "#0000ee",
      })}`;
  },
  // 32-bit: every surface a flat-shaded polygon
  polygon: () => svg`
    <path d="M12 6.6v-.8" fill="none" stroke="#7d8790" stroke-width="1.4"></path>
    <path class="ft-bulb" d="M12 2 13.8 3.1v1.9L12 6l-1.8-1V3.1z" fill="#ffe14a"></path>
    <path d="M12 2 13.8 3.1 12 4.1 10.2 3.1z" fill="#fff3a6"></path>
    <path d="M3.2 15.4 4.6 10.4 8 7.6 12 6.6V15.4z" fill="#a51a3f"></path>
    <path d="M12 6.6 16 7.6 19.4 10.4 20.8 15.4H12z" fill="#d42a57"></path>
    <path d="M4.6 10.4 8 7.6 12 6.6 16 7.6 19.4 10.4 12 11.8z" fill="#ef5b82"></path>
    <path d="M2.8 14.4h18.4l-.8 2.4H3.6z" fill="#17694a"></path>
    <g class="ft-lens">
      <path d="M8.2 13.4 10.6 14.6 11.4 16.8 10.4 19 8.2 19.8 6 19 5 16.8 5.8 14.6z" fill="#1aa7a0"></path>
      <path d="M8.2 13.4 10.6 14.6 8.2 16.6 5.8 14.6z" fill="#7be3dc"></path>
      <path d="M15.8 13.4 18.2 14.6 19 16.8 18 19 15.8 19.8 13.6 19 12.6 16.8 13.4 14.6z" fill="#1aa7a0"></path>
      <path d="M15.8 13.4 18.2 14.6 15.8 16.6 13.4 14.6z" fill="#7be3dc"></path>
    </g>`,
  // a terminal: green phosphor, drawn in dashes, with a cursor
  terminal: () =>
    svg`${parts({
      back: glow("#33ff66", "#33ff66", "#33ff66"),
      stalk: "#33ff66",
      bulb: "none",
      bulbLine: "#33ff66",
      helmet: "none",
      line: "#33ff66",
      lineWidth: 0.6,
      over: svg`<path d="${HELMET}" fill="none" stroke="#33ff66" stroke-width=".5" stroke-dasharray=".5 .7" transform="translate(12 15.4) scale(.8) translate(-12 -15.4)"></path>`,
      word: "#33ff66",
      font: "'Courier New', ui-monospace, monospace",
      band: "none",
      lens: "none",
      lensLine: "#33ff66",
    })}<rect class="ft-cursor" x="20" y="19.6" width="2.4" height="3" fill="#33ff66"></rect>`,
};

/**
 * The Future Traveler as one era drew him.
 * @param {string} era an id from HAX_TRAVELER_ERAS; anything else is today
 * @param {string} tint the tomorrow era's color: a pillar from
 *   HAX_TRAVELER_PILLAR_TINTS, or any color
 */
export function futureTraveler(era = "now", tint = "ubiquity") {
  const draw = ERA[era] || ERA.now;
  return html`<svg
    class="future-traveler"
    data-era="${ERA[era] ? era : "now"}"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    ${draw(HAX_TRAVELER_PILLAR_TINTS[tint] || tint)}
  </svg>`;
}

/**
 * Styles. The svg takes --future-traveler-size. Put the class ft-glitch on
 * its host for a moment to tear between two eras (the host swaps the era
 * halfway through); hover or focus on a host with class ft-host runs each
 * era's own small motion. Nothing moves for a visitor who asks for less.
 */
export const HaxFutureTravelerStyles = css`
  svg.future-traveler {
    display: block;
    flex: none;
    width: var(--future-traveler-size, 36px);
    height: var(--future-traveler-size, 36px);
    overflow: visible;
  }
  .ft-bulb,
  .ft-eyes,
  .ft-glow,
  .ft-spin,
  .ft-rays,
  .ft-orbit,
  .ft-sway,
  .ft-cursor {
    transform-box: fill-box;
    transform-origin: center;
  }
  .ft-orbit {
    transform: rotate(-18deg);
  }
  svg.future-traveler[data-era="handheld"] {
    image-rendering: pixelated;
  }
  @media (prefers-reduced-motion: no-preference) {
    .ft-glitch svg.future-traveler {
      animation: ft-glitch 0.32s steps(1, end);
    }
    .ft-host:hover .ft-bulb,
    .ft-host:focus-visible .ft-bulb {
      animation: ft-blink 1.1s ease-in-out infinite;
    }
    .ft-host:hover .ft-spin,
    .ft-host:focus-visible .ft-spin {
      animation: ft-turn 0.5s steps(4, end) infinite;
    }
    .ft-host:hover .ft-rays,
    .ft-host:focus-visible .ft-rays {
      transform-origin: 50% 100%;
      animation: ft-fan 1.1s ease-in-out infinite;
    }
    .ft-host:hover .ft-orbit,
    .ft-host:focus-visible .ft-orbit {
      animation: ft-tilt 1.1s ease-in-out infinite;
    }
    .ft-host:hover .ft-sway,
    .ft-host:focus-visible .ft-sway {
      animation: ft-fan 1.1s ease-in-out infinite;
    }
    .ft-host:hover .ft-cursor,
    .ft-host:focus-visible .ft-cursor {
      animation: ft-cursor 0.7s steps(1, end) infinite;
    }
    .ft-host:hover .ft-eyes,
    .ft-host:focus-visible .ft-eyes {
      animation: ft-wink 1.6s steps(1, end) infinite;
    }
    .ft-host:hover .ft-glow,
    .ft-host:focus-visible .ft-glow {
      animation: ft-hum 1.3s ease-in-out infinite;
    }
  }
  @keyframes ft-glitch {
    0% {
      transform: translate(0, 0);
      clip-path: inset(0 0 0 0);
    }
    12% {
      transform: translate(-3px, 1px) skewX(18deg);
      clip-path: inset(12% 0 55% 0);
      filter: drop-shadow(2px 0 #2fe6ff) drop-shadow(-2px 0 #ff4fb0);
    }
    25% {
      transform: translate(3px, -1px) skewX(-14deg);
      clip-path: inset(58% 0 8% 0);
      filter: drop-shadow(-2px 0 #2fe6ff) drop-shadow(2px 0 #ffe14a);
    }
    38% {
      transform: translate(-2px, 0) scaleY(0.2);
      clip-path: inset(0 0 0 0);
      filter: hue-rotate(120deg) saturate(2.5);
    }
    50% {
      transform: translate(2px, 2px) scaleX(1.25);
      clip-path: inset(30% 0 30% 0);
      filter: invert(1);
    }
    62% {
      transform: translate(-3px, -1px) skewX(22deg);
      clip-path: inset(5% 0 68% 0);
      filter: drop-shadow(3px 0 #ff4fb0) drop-shadow(-3px 0 #33ff66);
    }
    75% {
      transform: translate(2px, 1px);
      clip-path: inset(62% 0 4% 0);
      filter: hue-rotate(-90deg);
    }
    88% {
      transform: translate(-1px, 0) skewX(-6deg);
      clip-path: inset(0 0 0 0);
      filter: drop-shadow(1px 0 #2fe6ff) drop-shadow(-1px 0 #ff4fb0);
    }
    100% {
      transform: translate(0, 0);
      clip-path: inset(0 0 0 0);
    }
  }
  @keyframes ft-blink {
    50% {
      opacity: 0.45;
    }
  }
  @keyframes ft-turn {
    100% {
      transform: rotate(90deg);
    }
  }
  @keyframes ft-fan {
    50% {
      transform: scale(1.08);
    }
  }
  @keyframes ft-tilt {
    50% {
      transform: rotate(-32deg);
    }
  }
  @keyframes ft-wink {
    0%,
    100% {
      opacity: 1;
    }
    42%,
    50% {
      opacity: 0;
    }
    58% {
      opacity: 1;
    }
    64%,
    70% {
      opacity: 0;
    }
  }
  @keyframes ft-hum {
    50% {
      opacity: 0.55;
    }
  }
  @keyframes ft-cursor {
    50% {
      opacity: 0;
    }
  }
`;
