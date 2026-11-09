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
 * Merlin's mark is hax:wand. It is drawn inline, split into the stick and
 * its three sparkles, so the sparkles can twinkle once when the Merlin
 * control is hovered or focused. Same paths as hax:wand in hax-iconset.
 * @param {string} className extra class names for the svg
 */
export const merlinWand = (className = "") =>
  html`<svg
    class="merlin-wand ${className}"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    ${svg`<path
        class="stick"
        d="M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z"
      ></path>
      <path
        class="sparkle s1"
        d="M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6Z"
      ></path>
      <path
        class="sparkle s2"
        d="M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2Z"
      ></path>
      <path
        class="sparkle s3"
        d="M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4Z"
      ></path>`}
  </svg>`;

/**
 * Icon names that mean Merlin. A Merlin control given one of these draws
 * the animated wand instead of a plain icon. hax:wizard-hat is kept so
 * hosts that still set it get the new mark.
 */
export const MERLIN_ICONS = ["hax:wand", "hax:wizard-hat"];

/**
 * Icon names that mean Merlin wearing the World Traveler: the HAX helmet,
 * goggles and idea bulb, in one ink (currentColor) with see-through
 * lenses. A Merlin control given one of these draws him inline so his bulb
 * and goggles can light: off at rest, on with hover or focus, glowing
 * while Merlin listens or works. Same shapes as hax:world-traveler-plain.
 */
export const TRAVELER_ICONS = ["hax:world-traveler-plain"];

// each inline Traveler needs its own mask and blur ids
let travelerCount = 0;

/**
 * Merlin's World Traveler mark, drawn inline. The ink is one mask so the
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
 * Merlin's mark for an icon name: the World Traveler for TRAVELER_ICONS,
 * the wand for MERLIN_ICONS, nothing otherwise.
 * @param {string} icon the control's icon
 * @param {string} className extra class names for the svg
 */
export const merlinMark = (icon, className = "") => {
  if (TRAVELER_ICONS.includes(icon)) {
    return merlinTraveler(className);
  }
  if (MERLIN_ICONS.includes(icon)) {
    return merlinWand(className);
  }
  return ``;
};

/**
 * Wand motion. Put the class merlin-wand-host on the control (a field or a
 * button) that holds the wand. On hover or focus the sparkles glow and each
 * twinkles once, in turn, and the stick flicks once. With reduced motion
 * only the glow shows.
 */
export const MerlinWandStyles = css`
  .merlin-wand {
    display: inline-block;
    flex: none;
    width: var(--merlin-wand-size, var(--hax-ui-icon, 16px));
    height: var(--merlin-wand-size, var(--hax-ui-icon, 16px));
    fill: currentColor;
    overflow: visible;
  }
  .merlin-wand .sparkle {
    transform-box: fill-box;
    transform-origin: center;
    transition: filter var(--hax-ui-duration, 150ms) var(--hax-ui-easing, ease);
  }
  .merlin-wand .stick {
    transform-box: view-box;
    transform-origin: 3px 21px;
  }
  .merlin-wand .s2 {
    --merlin-wand-delay: 250ms;
  }
  .merlin-wand .s3 {
    --merlin-wand-delay: 500ms;
  }
  .merlin-wand-host:hover .merlin-wand .sparkle,
  .merlin-wand-host:focus-within .merlin-wand .sparkle {
    filter: drop-shadow(0 0 2px currentColor);
  }
  @media (prefers-reduced-motion: no-preference) {
    .merlin-wand-host:hover .merlin-wand .sparkle,
    .merlin-wand-host:focus-within .merlin-wand .sparkle {
      animation: merlin-wand-twinkle var(--ddd-duration-slow, 600ms)
        var(--ddd-timing-ease, cubic-bezier(0.4, 0, 0.2, 1))
        var(--merlin-wand-delay, 0ms) 1 both;
    }
    .merlin-wand-host:hover .merlin-wand .stick,
    .merlin-wand-host:focus-within .merlin-wand .stick {
      animation: merlin-wand-flick var(--ddd-duration-slow, 600ms)
        var(--hax-ui-easing-move, cubic-bezier(0.2, 0, 0, 1)) 1;
    }
  }
  @keyframes merlin-wand-twinkle {
    0% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    35% {
      transform: scale(0.55) rotate(40deg);
      opacity: 0.6;
    }
    65% {
      transform: scale(1.15) rotate(70deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(90deg);
      opacity: 1;
    }
  }
  /* the World Traveler: one ink, lit parts in color. His bulb and goggles
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
  @keyframes merlin-wand-flick {
    0% {
      transform: rotate(0deg);
    }
    40% {
      transform: rotate(-10deg);
    }
    75% {
      transform: rotate(4deg);
    }
    100% {
      transform: rotate(0deg);
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
