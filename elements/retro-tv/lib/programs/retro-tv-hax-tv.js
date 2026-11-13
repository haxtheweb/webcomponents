/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

const STICKERS = [
  "future-traveler-invent-orange.svg",
  "future-traveler-creek-teal.svg",
  "future-traveler-wonder-purple.svg",
  "future-traveler-opportunity-green.svg",
];

/**
 * `retro-tv-hax-tv`
 * HAX TV: Future Traveler stickers (art from haxtheweb/art) bounce around
 * the screen like an old screensaver. With reduced motion, or when the
 * program is not on air, they sit still.
 *
 * @element retro-tv-hax-tv
 */
export class RetroTvHaxTv extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-hax-tv";
  }

  static get faces() {
    return ["Press Start 2P"];
  }

  constructor() {
    super();
    this.__frame = null;
    this.__bouncers = [];
    this.__tick = this.__tick.bind(this);
  }

  defaultLabel() {
    return this.t.haxTvLabel;
  }

  defaultName() {
    return this.t.haxTvName;
  }

  disconnectedCallback() {
    this.__stop();
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("onAir") || changedProperties.has("still")) {
      this.__place();
      if (this.moving) {
        this.__start();
      } else {
        this.__stop();
      }
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    const imgs = this.shadowRoot.querySelectorAll("img");
    // fixed starting spots and speeds: the same show every time
    this.__bouncers = Array.from(imgs).map((img, k) => ({
      img,
      x: 0.06 + k * 0.2,
      y: 0.08 + (k % 2) * 0.35,
      vx: (k % 2 ? -1 : 1) * (0.0018 + k * 0.0004),
      vy: (k % 3 ? 1 : -1) * (0.0022 + k * 0.0003),
    }));
    this.__place();
  }

  /** lay the stickers out in a row (still frame) */
  __place() {
    this.__bouncers.forEach((b, k) => {
      if (!this.moving) {
        b.img.style.left = `${8 + k * 22}%`;
        b.img.style.top = `${k % 2 ? 22 : 46}%`;
        b.img.style.transform = "";
      }
    });
  }

  __start() {
    if (!this.__frame) {
      this.__last = 0;
      this.__frame = globalThis.requestAnimationFrame(this.__tick);
    }
  }

  __stop() {
    if (this.__frame) {
      globalThis.cancelAnimationFrame(this.__frame);
      this.__frame = null;
    }
  }

  __tick(now) {
    this.__frame = null;
    if (!this.moving || !this.isConnected) {
      this.__place();
      return;
    }
    const dt = this.__last ? Math.min(now - this.__last, 50) / 16 : 1;
    this.__last = now;
    const w = this.offsetWidth || 1;
    const h = this.offsetHeight || 1;
    this.__bouncers.forEach((b) => {
      const size = b.img.offsetWidth / w;
      const sizeY = b.img.offsetHeight / h;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      if (b.x <= 0 || b.x >= 1 - size) {
        b.vx = -b.vx;
        b.x = Math.max(0, Math.min(b.x, 1 - size));
      }
      if (b.y <= 0 || b.y >= 1 - sizeY) {
        b.vy = -b.vy;
        b.y = Math.max(0, Math.min(b.y, 1 - sizeY));
      }
      b.img.style.left = "0";
      b.img.style.top = "0";
      b.img.style.transform = `translate(${b.x * w}px, ${b.y * h}px)`;
    });
    this.__frame = globalThis.requestAnimationFrame(this.__tick);
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: radial-gradient(
            ellipse at 50% 120%,
            #1e407c 0,
            #001e44 55%,
            #000321 100%
          );
        }
        .stars {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
                circle,
                rgba(255, 255, 255, 0.8) 1px,
                transparent 1.5px
              )
              0 0 / 47px 37px,
            radial-gradient(
                circle,
                rgba(255, 255, 255, 0.5) 1px,
                transparent 1.5px
              )
              13px 19px / 61px 53px;
        }
        img {
          position: absolute;
          width: 22%;
          height: auto;
          will-change: transform;
          filter: drop-shadow(0 3px 0 rgba(0, 0, 0, 0.4));
        }
        .logo {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 8%;
          text-align: center;
          font-family: "Press Start 2P", "VT323", monospace;
          font-size: var(--retro-tv-program-small, clamp(8px, 1.4vw, 14px));
          color: #fff;
          opacity: 0.8;
          letter-spacing: 0.1em;
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="stars"></div>
      ${STICKERS.map(
        (file) =>
          html`<img
            src="${new URL(`../art/${file}`, import.meta.url).href}"
            alt=""
            width="64"
            height="64"
          />`,
      )}
      <div class="logo">${this.t.haxTvLogo}</div>
    `;
  }
}

globalThis.customElements.define(RetroTvHaxTv.tag, RetroTvHaxTv);
