/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, svg } from "lit";

/**
 * Merlin's own pieces. The HAX UI admin layer it is styled with (tokens,
 * controls, proposed values, admin icons) comes from
 * @haxtheweb/d-d-d/lib/HaxUiAdminStyles.js, the one source every admin
 * surface shares.
 */

/**
 * True when this browser can both listen (SpeechRecognition) and speak
 * (speechSynthesis), the two things Merlin's voice mode needs, and
 * listening has not proven unusable in this session (some browsers, like
 * Brave, have the API but no speech service). The voice control is hidden
 * everywhere else rather than shown and failing.
 * @returns {boolean}
 */
export const merlinVoiceSupported = () => {
  if (
    typeof globalThis.speechSynthesis === "undefined" ||
    !(globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition)
  ) {
    return false;
  }
  const hal =
    globalThis.Hal9000 && globalThis.Hal9000.instance
      ? globalThis.Hal9000.instance
      : null;
  return !(hal && hal.canListen === false);
};

/**
 * Icon names that mean the palette in its short form: the Future Traveler's
 * goggles. A Merlin control given one of these draws the goggles inline so
 * the lenses can light. hax:wand and hax:wizard-hat were the palette's marks
 * before the goggles and are kept so hosts that still set them get the
 * goggles.
 */
export const GOGGLES_ICONS = [
  "hax:future-goggles",
  "hax:wand",
  "hax:wizard-hat",
];

/**
 * Icon names that mean Merlin wearing the Future Traveler: the HAX helmet,
 * goggles and idea bulb, in one ink (currentColor) with see-through
 * lenses. A Merlin control given one of these draws him inline so his bulb
 * and goggles can light: off at rest, on with hover or focus, glowing
 * while Merlin listens or works. Same shapes as hax:future-traveler-plain.
 * hax:world-traveler-plain is the icon's old name, kept so a Merlin set up
 * with it still draws him.
 */
export const TRAVELER_ICONS = [
  "hax:future-traveler-plain",
  "hax:world-traveler-plain",
];

// each inline Traveler needs its own mask and blur ids
let travelerCount = 0;

/**
 * Merlin's Future Traveler mark, drawn inline. The ink is one mask so the
 * lenses, the helmet shine and the gaps between parts stay see-through on
 * any surface; the lit parts (halos, bulb, lenses, glints) sit in .lit and
 * fade in by state (MerlinWandStyles).
 * @param {string} className extra class names for the svg
 */
export const merlinTraveler = (className = "") => {
  travelerCount++;
  const mask = `merlin-traveler-ink-${travelerCount}`;
  const blur = `merlin-traveler-blur-${travelerCount}`;
  return html`<svg
    class="merlin-traveler ${className}"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    ${svg`<defs>
        <filter id="${blur}" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="0.9"></feGaussianBlur>
        </filter>
        <mask id="${mask}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
          <rect width="24" height="24" fill="#000"></rect>
          <path d="M12 6.6V5.8" stroke="#fff" stroke-width="1.4" stroke-linecap="round"></path>
          <circle cx="12" cy="4" r="1.5" fill="none" stroke="#fff" stroke-width="1"></circle>
          <path d="M3.2 15.4C3.2 9.6 7 6.6 12 6.6S20.8 9.6 20.8 15.4Z" fill="#fff"></path>
          <path d="M6.6 11.2C7.8 9.4 9.6 8.4 11.6 8.2" fill="none" stroke="#000" stroke-width="1" stroke-linecap="round"></path>
          <rect x="3" y="14.4" width="18" height="2.4" rx="1.2" fill="#fff" stroke="#000" stroke-width=".8"></rect>
          <g fill="#fff" stroke="#000" stroke-width=".8">
            <circle cx="8.2" cy="16.6" r="3.4"></circle>
            <circle cx="15.8" cy="16.6" r="3.4"></circle>
          </g>
          <g fill="#000">
            <circle cx="8.2" cy="16.6" r="2.2"></circle>
            <circle cx="15.8" cy="16.6" r="2.2"></circle>
          </g>
        </mask>
      </defs>
      <g class="lit halo" filter="url(#${blur})">
        <circle class="halo-bulb" cx="12" cy="4" r="3.4"></circle>
        <circle class="halo-lens" cx="8.2" cy="16.6" r="4.4"></circle>
        <circle class="halo-lens" cx="15.8" cy="16.6" r="4.4"></circle>
      </g>
      <rect class="ink" width="24" height="24" mask="url(#${mask})"></rect>
      <g class="lit">
        <path
          class="rays"
          d="M12 .4v.6M8.9 1.6l.5.5M15.1 1.6l-.5.5M8 4h.8M15.2 4h.8"
        ></path>
        <circle class="bulb" cx="12" cy="4" r="1.9"></circle>
        <circle class="lens" cx="8.2" cy="16.6" r="2.2"></circle>
        <circle class="lens" cx="15.8" cy="16.6" r="2.2"></circle>
        <circle class="glint" cx="7.4" cy="15.8" r=".6"></circle>
        <circle class="glint" cx="15" cy="15.8" r=".6"></circle>
      </g>`}
  </svg>`;
};

/**
 * The palette's short mark: the Future Traveler's goggles on their own, in
 * one ink (currentColor) with see-through lenses. Same paths as
 * hax:future-goggles in hax-iconset. It carries the merlin-traveler class as well so the
 * lenses light, glow and size by the same rules as the lenses he wears
 * (MerlinWandStyles, and any host that styles .merlin-traveler).
 * @param {string} className extra class names for the svg
 */
export const merlinGoggles = (className = "") => {
  travelerCount++;
  const blur = `merlin-goggles-blur-${travelerCount}`;
  return html`<svg
    class="merlin-traveler merlin-goggles ${className}"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    ${svg`<defs>
        <filter id="${blur}" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1"></feGaussianBlur>
        </filter>
      </defs>
      <g class="lit halo" filter="url(#${blur})">
        <circle class="halo-lens" cx="7.8" cy="12" r="4.6"></circle>
        <circle class="halo-lens" cx="16.2" cy="12" r="4.6"></circle>
      </g>
      <g class="ink">
        <path d="M.4 10.6h2v2.8h-2ZM21.6 10.6h2v2.8h-2Z"></path>
        <path fill-rule="evenodd" d="M7.8 6.2h8.4a5.8 5.8 0 0 1 0 11.6h-2.8L12 15.4l-1.4 2.4H7.8a5.8 5.8 0 0 1 0-11.6ZM4.2 12a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0-7.2 0ZM12.6 12a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0-7.2 0Z"></path>
      </g>
      <g class="lit">
        <circle class="lens" cx="7.8" cy="12" r="3.6"></circle>
        <circle class="lens" cx="16.2" cy="12" r="3.6"></circle>
        <circle class="glint" cx="6.6" cy="10.8" r=".8"></circle>
        <circle class="glint" cx="15" cy="10.8" r=".8"></circle>
      </g>`}
  </svg>`;
};

/**
 * The palette's mark for an icon name: the Future Traveler for
 * TRAVELER_ICONS, his goggles for GOGGLES_ICONS, nothing otherwise.
 * @param {string} icon the control's icon
 * @param {string} className extra class names for the svg
 */
export const merlinMark = (icon, className = "") => {
  if (TRAVELER_ICONS.includes(icon)) {
    return merlinTraveler(className);
  }
  if (GOGGLES_ICONS.includes(icon)) {
    return merlinGoggles(className);
  }
  return ``;
};

/**
 * The mark's light. Put the class merlin-wand-host on the control (a field
 * or a button) that holds the mark: the class name is from when the mark
 * was a wand and stays so hosts keep working. On hover or focus the lit
 * parts come on; while the palette listens or works they glow. With reduced
 * motion they stay lit and still.
 */
export const MerlinWandStyles = css`
  /* the Future Traveler: one ink, lit parts in color. His bulb and goggles
     light with hover or focus and glow while Merlin listens or works */
  .merlin-traveler {
    display: inline-block;
    flex: none;
    width: var(
      --merlin-traveler-size,
      var(--merlin-wand-size, var(--hax-ui-icon, 16px))
    );
    height: var(
      --merlin-traveler-size,
      var(--merlin-wand-size, var(--hax-ui-icon, 16px))
    );
    overflow: visible;
  }
  .merlin-traveler .ink {
    fill: currentColor;
  }
  .merlin-traveler .lit {
    opacity: 0;
    transition: opacity var(--hax-ui-duration, 150ms) var(--hax-ui-easing, ease);
  }
  .merlin-traveler .halo-bulb {
    fill: var(--ddd-theme-default-keystoneYellow, #ffd100);
    opacity: 0.45;
  }
  .merlin-traveler .halo-lens {
    fill: #2fd3e0;
    opacity: 0.4;
  }
  .merlin-traveler .rays {
    fill: none;
    stroke: var(--ddd-theme-default-keystoneYellow, #ffd100);
    stroke-width: 1;
    stroke-linecap: round;
  }
  .merlin-traveler .bulb {
    fill: var(--ddd-theme-default-keystoneYellow, #ffd100);
  }
  .merlin-traveler .lens {
    fill: #7ff0f8;
  }
  .merlin-traveler .glint {
    fill: var(--ddd-theme-default-white, #ffffff);
  }
  .merlin-wand-host:hover .merlin-traveler .lit,
  .merlin-wand-host:focus-within .merlin-traveler .lit,
  :host([focused]) .merlin-traveler .lit,
  :host([listening-for-input]) .merlin-traveler .lit,
  :host([loading]) .merlin-traveler .lit {
    opacity: 1;
  }
  @media (prefers-reduced-motion: no-preference) {
    :host([listening-for-input]) .merlin-traveler .halo,
    :host([loading]) .merlin-traveler .halo {
      animation: merlin-traveler-glow 2.4s ease-in-out infinite;
    }
    :host([listening-for-input]) .merlin-traveler .bulb,
    :host([listening-for-input]) .merlin-traveler .lens,
    :host([loading]) .merlin-traveler .bulb,
    :host([loading]) .merlin-traveler .lens {
      animation: merlin-traveler-pulse 2.4s ease-in-out infinite;
    }
  }
  @keyframes merlin-traveler-glow {
    0%,
    100% {
      opacity: 0.25;
    }
    50% {
      opacity: 0.75;
    }
  }
  @keyframes merlin-traveler-pulse {
    0%,
    100% {
      filter: brightness(1);
    }
    50% {
      filter: brightness(1.35);
    }
  }
`;

/**
 * Merlin's dark property forces dark, as it always has; otherwise the
 * HAX UI theme decides (HaxUiAdminScheme).
 */
export const MerlinDarkScheme = css`
  :host([dark]) {
    color-scheme: dark;
  }
`;
