/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, svg } from "lit";

/** the numbers on the dial's ring: ten channels, one for each year HAX
    took to lift off */
const DIAL = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
/** degrees between two numbers on the ring */
const STEP = 360 / DIAL.length;
const POWER_ICON = svg`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42A6.92 6.92 0 0 1 19 12c0 3.87-3.13 7-7 7A6.995 6.995 0 0 1 7.58 6.58L6.17 5.17A8.932 8.932 0 0 0 3 12a9 9 0 0 0 18 0c0-2.74-1.23-5.18-3.17-6.83z"></path></svg>`;

/**
 * The set's controls, shared by every TV in the HAX TV family (retro-tv,
 * the VHS Blog console): a channel dial with 1 to 10 printed on its ring
 * and a line that points at the channel on air, and a power button that
 * glows green while the set is on. Sizes come from --retro-tv-dial-size,
 * --retro-tv-knob-size, --retro-tv-power-size, --retro-tv-dial-number-size
 * and --retro-tv-side-label-size.
 */
export const RetroTvControlStyles = css`
  /* channel dial: numbers 1 to 10 on the ring, the knob's line
           points at the channel on air */
  .dial {
    position: relative;
    flex: none;
    width: var(--retro-tv-dial-size, 86px);
    height: var(--retro-tv-dial-size, 86px);
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(circle, #1d1d21 0 62%, #0c0c0e 63% 100%);
    box-shadow:
      inset 0 0 0 1px #45454c,
      0 1px 0 rgba(255, 255, 255, 0.14);
  }
  .ring {
    position: absolute;
    inset: 0;
  }
  .ring span {
    position: absolute;
    left: 50%;
    top: 50%;
    font:
      700 var(--retro-tv-dial-number-size, 9px) / 1 "Roboto Condensed",
      sans-serif;
    color: #c9ccd2;
    transform: translate(-50%, -50%) rotate(var(--a))
      translateY(calc(var(--retro-tv-dial-size, 86px) * -0.4))
      rotate(calc(-1 * var(--a)));
  }
  .ring span.cur {
    color: #ffd100;
  }
  .knob {
    all: unset;
    box-sizing: border-box;
    position: relative;
    width: var(--retro-tv-knob-size, 46px);
    height: var(--retro-tv-knob-size, 46px);
    border-radius: 50%;
    background: radial-gradient(
      circle at 35% 30%,
      #c9ccd2,
      #6b6f77 55%,
      #2f3236 80%
    );
    box-shadow:
      0 3px 0 #111,
      inset 0 0 0 3px rgba(0, 0, 0, 0.25);
  }
  .knob::before {
    content: "";
    position: absolute;
    inset: 15%;
    border-radius: 50%;
    background: repeating-conic-gradient(
      rgba(0, 0, 0, 0.18) 0 6deg,
      transparent 6deg 12deg
    );
  }
  .knob::after {
    content: "";
    position: absolute;
    left: 50%;
    top: -10%;
    width: var(--retro-tv-knob-mark-width, 4px);
    height: 45%;
    margin-left: calc(var(--retro-tv-knob-mark-width, 4px) / -2);
    background: #ffd100;
    box-shadow: 0 0 0 1px #111;
    border-radius: 2px;
    transform-origin: 50% 133%;
    transform: rotate(var(--retro-tv-knob-rotate));
  }
  button.knob,
  .pwr {
    cursor: pointer;
  }
  button.knob:focus-visible,
  .pwr:focus-visible {
    outline: 3px solid #ffd100;
    outline-offset: 3px;
  }
  .slbl {
    margin-top: calc(var(--retro-tv-gap, 18px) / -2);
    font:
      700 var(--retro-tv-side-label-size, 10px) / 1 "Roboto Condensed",
      sans-serif;
    letter-spacing: 0.12em;
    color: #f3e7d3;
  }
  /* power: a push button that glows green while the set is on */
  .pwr {
    all: unset;
    box-sizing: border-box;
    width: var(--retro-tv-power-size, 42px);
    height: var(--retro-tv-power-size, 42px);
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: radial-gradient(circle at 35% 30%, #4a4a50, #18181b 75%);
    box-shadow:
      0 0 0 2px #9aa0aa,
      0 3px 0 #0a0a0a;
  }
  .pwr svg {
    width: 55%;
    height: 55%;
    fill: #59625b;
  }
  .pwr.on {
    box-shadow:
      0 0 0 2px #5dff8a,
      0 3px 0 #0a0a0a,
      0 0 12px rgba(93, 255, 138, 0.6);
  }
  .pwr.on svg {
    fill: #5dff8a;
    filter: drop-shadow(0 0 3px rgba(93, 255, 138, 0.9));
  }
  @media (prefers-reduced-motion: no-preference) {
    .knob::after {
      transition: transform 0.3s ease-in-out;
    }
    .pwr:active {
      transform: translateY(1px);
    }
  }
  @media (forced-colors: active) {
    button.knob,
    button.pwr {
      forced-color-adjust: none;
      border: 2px solid ButtonText;
    }
  }
`;

/**
 * The channel dial. With `onClick` the knob is a button (named `label`);
 * without it the dial is decoration.
 * @param {{channel: Number, label: String, onClick: Function|null}} opts
 */
export function retroTvDial({ channel, label, onClick }) {
  const ch = parseInt(channel, 10) || 0;
  const at = DIAL.indexOf(ch);
  const style = `--retro-tv-knob-rotate: ${(at === -1 ? 0 : at) * STEP}deg`;
  return html`<span class="dial">
    <span class="ring" aria-hidden="true"
      >${DIAL.map(
        (n, i) =>
          html`<span
            class="${n === ch ? "cur" : ""}"
            style="--a: ${i * STEP}deg"
            >${n}</span
          >`,
      )}</span
    >${
      onClick
        ? html`<button
            class="knob"
            type="button"
            style="${style}"
            aria-label="${label}"
            title="${label}"
            @click="${onClick}"
          ></button>`
        : html`<span class="knob" style="${style}" aria-hidden="true"></span>`
    }
  </span>`;
}

/**
 * The power button, lit while `power` is on. With `onClick` it is a button
 * named `label`; without it, decoration.
 * @param {{power: Boolean, label: String, onClick: Function|null}} opts
 */
export function retroTvPower({ power, label, onClick }) {
  return onClick
    ? html`<button
        class="pwr ${power ? "on" : ""}"
        type="button"
        aria-label="${label}"
        title="${label}"
        @click="${onClick}"
      >
        ${POWER_ICON}
      </button>`
    : html`<span class="pwr ${power ? "on" : ""}" aria-hidden="true"
        >${POWER_ICON}</span
      >`;
}
