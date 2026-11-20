/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, svg, css } from "lit";

/**
 * The HAX network: one record per property, read by the network bar and by
 * anything else that names, draws or describes a property, so they all say
 * the same thing. PRAW keeps the record of why (ecosystem/network.json in
 * https://github.com/haxtheweb/praw); this is the copy the elements ship.
 *
 * `order` is the order the bar lists them. A tool that lives within a property
 * names it in `within` and is not in the bar: RPG me is one of HAX Art's
 * tools, a stand-alone service at its own address (rpg.art.hax.cloud) that
 * the Art site's menu links to; on RPG me the bar lights up Art. `color` and
 * `on` are DDD
 * color names (the fill, and the ink that reads on it). `icon` is the plain
 * simple-icon to use where the property's own glyph cannot be drawn (Merlin,
 * for one). `label` and `purpose` are the English the bar's own strings
 * start from; the bar translates them through its `t`.
 */
export const HAX_NETWORK = {
  order: ["web", "cloud", "try", "learn", "elements", "art"],
  properties: {
    web: {
      url: "https://haxtheweb.org",
      color: "keystoneYellow",
      on: "coalyGray",
      icon: "hax:hax2022",
      label: "HAXTheWeb",
      purpose: "Why HAX is for you, and every way to get it.",
      relation: "The front door. It sends people to try, learn and install.",
    },
    try: {
      url: "https://browser.hax.cloud",
      color: "futureLime",
      on: "coalyGray",
      icon: "av:play-circle-filled",
      label: "Build now",
      purpose: "Use HAX right now in this browser tab. Nothing to install.",
      relation:
        "The platform itself, live. Install HAX is how you take it with you.",
    },
    learn: {
      url: "https://learn.hax.cloud",
      color: "skyBlue",
      on: "coalyGray",
      icon: "hardware:tv",
      label: "Learn",
      purpose: "Tutorials that teach HAX one flow at a time.",
      relation:
        "Where people go after trying it, as users and as contributors.",
    },
    elements: {
      url: "https://webcomponents.hax.cloud",
      color: "inventOrange",
      on: "coalyGray",
      icon: "icons:extension",
      label: "Web components",
      purpose: "Every HAX element, with live demos and walkthroughs.",
      relation: "The parts every HAX site and editor is built from.",
    },
    cloud: {
      url: "https://hax.cloud",
      color: "original87Pink",
      on: "white",
      icon: "lrn:network",
      label: "PRAW",
      purpose:
        "The brain of the HAX ecosystem: every person, pillar and project, and how they connect.",
      relation:
        "PRAW drawn as a web. Every other property takes its stories from here.",
    },
    art: {
      url: "https://haxtheweb.github.io/art/",
      color: "discoveryCoral",
      on: "coalyGray",
      icon: "image:palette",
      label: "Art",
      purpose:
        "The HAX art movement: posters, the Future Traveler across time, and playful tools like RPG me.",
      relation:
        "Where HAX's creative side lives. RPG me is one of the tools in it.",
    },
    rpg: {
      url: "https://rpg.art.hax.cloud",
      color: "athertonViolet",
      on: "coalyGray",
      icon: "face",
      label: "RPG me",
      purpose: "Make the character that is you across HAX.",
      within: "art",
      relation:
        "One of HAX Art's tools, linked from the Art site's menu rather than the bar. On RPG me the bar lights up Art.",
    },
  },
  install: { details: "https://haxtheweb.org/installation" },
};

/**
 * The network's own icons, one per property, on a 24 grid. Two tones: the
 * main strokes (class m) carry the shape and take the text color; the accent
 * (class a) is quiet at rest and takes the property's color, and moves, when
 * its host is hovered or focused.
 */
export const HAX_NETWORK_GLYPHS = {
  // HAXTheWeb: an H between the brackets of a tag
  web: svg`<path class="m g-l" d="M8 6 3 12l5 6"/><path class="m g-r" d="m16 6 5 6-5 6"/><path class="a g-h" d="M10 9.2v5.6M14 9.2v5.6M10 12h4"/>`,
  // PRAW (hax.cloud): the brain that is also a cloud, its web inside it and
  // neurons reaching out to everything around it
  cloud: svg`<path class="m" d="M12 5.9c-.88-1.67-4.05-1.67-4.58.88-1.94.35-2.64 2.38-1.76 3.87-1.14 1.41-.62 3.78 1.41 4.31.35 2.29 3.52 3.17 4.93 1.5"/><path class="m" d="M12 5.9c.88-1.67 4.05-1.67 4.58.88 1.94.35 2.64 2.38 1.76 3.87 1.14 1.41.62 3.78-1.41 4.31-.35 2.29-3.52 3.17-4.93 1.5"/><path class="m" d="M12 5.9v10.6"/><path class="a t g-link" d="M9.9 9.6H12M14.1 11.9H12M10.2 14.1H12"/><circle class="a f g-n1" cx="9" cy="9.6" r=".95"/><circle class="a f g-n2" cx="15" cy="11.9" r=".95"/><circle class="a f g-n3" cx="9.3" cy="14.1" r=".95"/><path class="a t g-link" d="M3.2 3.8 5.5 6.1M20.8 3.8l-2.3 2.3M21.2 12.3l-1.5-.3M19.1 20.3l-1.7-2.5M4.9 20.3l1.7-2.5M2.8 12.3l1.5-.3"/><circle class="a f g-o g-o1" cx="2.5" cy="3.1" r="1"/><circle class="a f g-o g-o2" cx="21.5" cy="3.1" r="1"/><circle class="a f g-o g-o3" cx="22.1" cy="12.5" r="1"/><circle class="a f g-o g-o4" cx="19.6" cy="21" r="1"/><circle class="a f g-o g-o5" cx="4.4" cy="21" r="1"/><circle class="a f g-o g-o6" cx="1.9" cy="12.5" r="1"/>`,
  // Build now: a browser window with play in it and a live light
  try: svg`<rect class="m" x="3" y="4" width="18" height="16" rx="2"/><path class="m" d="M3 8.6h18"/><circle class="a f g-dot" cx="6" cy="6.3" r="1"/><path class="a f g-play" d="M10.2 11.2v6l5.2-3z"/>`,
  // Learn: the TV tutorials play on
  learn: svg`<path class="m g-ant" d="m8.5 3 3.5 5 3.5-5"/><rect class="m" x="3" y="8" width="18" height="12" rx="2"/><path class="a g-scan" d="M6.5 12h8"/><path class="a g-scan g-scan2" d="M6.5 16h5"/><circle class="a f" cx="17.7" cy="12" r="1"/><circle class="a f" cx="17.7" cy="16" r="1"/>`,
  // Web components: parts, and the one that snaps in
  elements: svg`<rect class="m" x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2"/><rect class="m" x="3.5" y="13" width="7.5" height="7.5" rx="1.2"/><rect class="m" x="13" y="13" width="7.5" height="7.5" rx="1.2"/><rect class="a g-piece" x="13" y="3.5" width="7.5" height="7.5" rx="1.2"/>`,
  // Art: a palette, its paints lighting up one after another, and the brush
  art: svg`<path class="m" d="M12 3.5c-4.9 0-8.5 3.6-8.5 8.2 0 4.4 3.5 7.8 7.9 7.8 1.4 0 2-.8 2-1.7 0-1.3-1.4-1.6-1.4-2.9 0-1 .8-1.6 1.8-1.6h2.4c2.4 0 3.8-1.6 3.8-3.6 0-3.4-3.6-6.2-8-6.2z"/><circle class="a f g-n1" cx="8" cy="10.6" r="1.1"/><circle class="a f g-n2" cx="10.9" cy="7.3" r="1.1"/><circle class="a f g-n3" cx="15" cy="8.2" r="1.1"/><path class="a g-ant" d="m21 14.2-3.4 6.1"/>`,
  // RPG me: the rpg-character, standing still (not in the bar; for content
  // that names RPG me, such as a story link)
  rpg: svg`<path class="a" d="M6 5h12M8.4 5V2.6h7.2V5"/><rect class="m" x="7.5" y="5" width="9" height="7" rx="1.6"/><circle class="a f" cx="10.3" cy="8.6" r=".95"/><circle class="a f" cx="13.7" cy="8.6" r=".95"/><path class="m" d="M8.6 12.6h6.8v5.6H8.6zM8.6 13.8 6.2 16.4M15.4 13.8l2.4 2.6M10.4 18.2v3.2M13.6 18.2v3.2"/>`,
};

/**
 * A property's glyph as an svg element; nothing for a property without one.
 * @param {string} id web, cloud, try, learn, elements, art or rpg
 */
export function haxNetworkGlyph(id) {
  return HAX_NETWORK_GLYPHS[id]
    ? html`<svg
        class="glyph"
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
      >
        ${HAX_NETWORK_GLYPHS[id]}
      </svg>`
    : html``;
}

/**
 * Styles for the glyphs. A host (class glyph-host) sets --glyph-accent for
 * the rest state and --prop for the property color (--glyph-lit to light the
 * accent with something else); hover or focus on the host colors the accent
 * and runs the motion. Nothing moves when the visitor asks for less motion.
 */
export const HaxNetworkGlyphStyles = css`
  svg.glyph {
    display: block;
    flex: none;
    width: var(--glyph-size, 24px);
    height: var(--glyph-size, 24px);
    fill: none;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    overflow: visible;
  }
  svg.glyph .m {
    stroke: currentColor;
  }
  svg.glyph .a {
    stroke: var(--glyph-accent, currentColor);
    transition:
      stroke 0.2s,
      fill 0.2s;
  }
  svg.glyph .a.f {
    fill: var(--glyph-accent, currentColor);
    stroke: none;
  }
  svg.glyph .t {
    stroke-width: 1.2;
  }
  svg.glyph * {
    transform-box: fill-box;
    transform-origin: center;
  }
  svg.glyph .g-piece {
    transform: translate(1.2px, -1.2px) rotate(10deg);
    transition: transform 0.25s;
  }
  .glyph-host:hover svg.glyph .a,
  .glyph-host:focus-visible svg.glyph .a,
  .glyph-host:focus-within svg.glyph .a {
    stroke: var(--glyph-lit, var(--prop, currentColor));
  }
  .glyph-host:hover svg.glyph .a.f,
  .glyph-host:focus-visible svg.glyph .a.f,
  .glyph-host:focus-within svg.glyph .a.f {
    fill: var(--glyph-lit, var(--prop, currentColor));
    stroke: none;
  }
  .glyph-host:hover svg.glyph .g-piece,
  .glyph-host:focus-visible svg.glyph .g-piece,
  .glyph-host:focus-within svg.glyph .g-piece {
    transform: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    .glyph-host:hover svg.glyph .g-l,
    .glyph-host:focus-visible svg.glyph .g-l {
      animation: g-left 0.9s ease-in-out infinite;
    }
    .glyph-host:hover svg.glyph .g-r,
    .glyph-host:focus-visible svg.glyph .g-r {
      animation: g-right 0.9s ease-in-out infinite;
    }
    .glyph-host:hover svg.glyph .g-h,
    .glyph-host:focus-visible svg.glyph .g-h {
      animation: g-pop 0.9s ease-in-out infinite;
    }
    .glyph-host:hover svg.glyph .g-play,
    .glyph-host:focus-visible svg.glyph .g-play {
      animation: g-nudge 0.8s ease-in-out infinite;
    }
    .glyph-host:hover svg.glyph .g-dot,
    .glyph-host:focus-visible svg.glyph .g-dot {
      animation: g-blink 0.8s steps(2, jump-none) infinite;
    }
    .glyph-host:hover svg.glyph .g-ant,
    .glyph-host:focus-visible svg.glyph .g-ant {
      transform-origin: 50% 100%;
      animation: g-wiggle 0.6s ease-in-out infinite;
    }
    .glyph-host:hover svg.glyph .g-scan,
    .glyph-host:focus-visible svg.glyph .g-scan {
      animation: g-scan 0.7s linear infinite;
    }
    .glyph-host:hover svg.glyph .g-scan2,
    .glyph-host:focus-visible svg.glyph .g-scan2 {
      animation-delay: -0.35s;
    }
    .glyph-host:hover svg.glyph .g-piece,
    .glyph-host:focus-visible svg.glyph .g-piece {
      animation: g-snap 1.1s ease-out infinite;
    }
    .glyph-host:hover svg.glyph .g-o,
    .glyph-host:focus-visible svg.glyph .g-o {
      animation: g-float 1.6s ease-in-out infinite;
    }
    .glyph-host:hover svg.glyph .g-o2,
    .glyph-host:focus-visible svg.glyph .g-o2 {
      animation-delay: -0.3s;
    }
    .glyph-host:hover svg.glyph .g-o3,
    .glyph-host:focus-visible svg.glyph .g-o3 {
      animation-delay: -0.6s;
    }
    .glyph-host:hover svg.glyph .g-o4,
    .glyph-host:focus-visible svg.glyph .g-o4 {
      animation-delay: -0.9s;
    }
    .glyph-host:hover svg.glyph .g-o5,
    .glyph-host:focus-visible svg.glyph .g-o5 {
      animation-delay: -1.2s;
    }
    .glyph-host:hover svg.glyph .g-o6,
    .glyph-host:focus-visible svg.glyph .g-o6 {
      animation-delay: -1.45s;
    }
    .glyph-host:hover svg.glyph .g-link,
    .glyph-host:focus-visible svg.glyph .g-link {
      animation: g-signal 0.8s ease-in-out infinite;
    }
    .glyph-host:hover svg.glyph .g-n1,
    .glyph-host:focus-visible svg.glyph .g-n1 {
      animation: g-fire 1.2s ease-in-out infinite;
    }
    .glyph-host:hover svg.glyph .g-n2,
    .glyph-host:focus-visible svg.glyph .g-n2 {
      animation: g-fire 1.2s ease-in-out 0.4s infinite;
    }
    .glyph-host:hover svg.glyph .g-n3,
    .glyph-host:focus-visible svg.glyph .g-n3 {
      animation: g-fire 1.2s ease-in-out 0.8s infinite;
    }
  }
  @keyframes g-left {
    50% {
      transform: translateX(-1.6px);
    }
  }
  @keyframes g-right {
    50% {
      transform: translateX(1.6px);
    }
  }
  @keyframes g-pop {
    50% {
      transform: scale(1.18);
    }
  }
  @keyframes g-nudge {
    50% {
      transform: translateX(1.4px) scale(1.12);
    }
  }
  @keyframes g-blink {
    50% {
      opacity: 0.25;
    }
  }
  @keyframes g-wiggle {
    25% {
      transform: rotate(-9deg);
    }
    75% {
      transform: rotate(9deg);
    }
  }
  @keyframes g-scan {
    0% {
      transform: translateY(-1.6px);
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateY(1.6px);
      opacity: 0.4;
    }
  }
  @keyframes g-snap {
    0% {
      transform: translate(2.4px, -3px) rotate(16deg);
    }
    35%,
    100% {
      transform: none;
    }
    45% {
      transform: scale(1.1);
    }
  }
  @keyframes g-float {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    30% {
      transform: translate(0.5px, -0.7px) scale(1.35);
    }
    65% {
      transform: translate(-0.4px, 0.5px) scale(1);
    }
  }
  @keyframes g-signal {
    50% {
      opacity: 0.35;
    }
  }
  @keyframes g-fire {
    0%,
    60%,
    100% {
      transform: scale(1);
    }
    30% {
      transform: scale(1.6);
    }
  }
`;
