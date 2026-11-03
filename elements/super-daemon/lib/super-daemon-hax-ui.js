import { html, css, svg } from "lit";

/**
 * Merlin's own pieces. The HAX UI admin layer it is styled with (tokens,
 * controls, proposed values, admin icons) comes from
 * @haxtheweb/d-d-d/lib/HaxUiAdminStyles.js, the one source every admin
 * surface shares.
 */

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
