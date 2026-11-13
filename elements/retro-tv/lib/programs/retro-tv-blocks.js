/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";
import "@haxtheweb/rpg-character/rpg-character.js";

const BLOCKS = ["paragraph", "image", "video", "quiz", "gallery"];
const ICON = {
  paragraph: "M9 10v5h2V4h2v11h2V4h2V2H9C6.79 2 5 3.79 5 6s1.79 4 4 4z",
  image:
    "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  video: "M8 5v14l11-7z",
  quiz: "M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z",
  gallery:
    "M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z",
};
const NAMES = {
  paragraph: "blockParagraph",
  image: "blockImage",
  video: "blockVideo",
  quiz: "blockQuiz",
  gallery: "blockGallery",
};

/**
 * `retro-tv-blocks`
 * HAX Blocks, the game on the HAX 64 cartridge. You and three rival
 * rpg-characters race for the HAX blocks (paragraph, image, video, quiz,
 * gallery) floating overhead. Call `press(button)` with a controller
 * button: arrows move, A (or up) grabs the block above you or bonks a
 * rival next to you, B (or down) takes one back, Select remixes your
 * fighter, Start publishes your page. The rivals take a turn after each
 * press, so nothing moves on its own. `reset()` starts over.
 *
 * @element retro-tv-blocks
 */
export class RetroTvBlocks extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-blocks";
  }

  static get properties() {
    return {
      ...super.properties,
      /** rpg-character seeds you cycle through with Select */
      heroes: { type: Array },
      /** seeds for the three rivals */
      rivals: { type: Array },
      _g: { type: Object, state: true },
    };
  }

  static get faces() {
    return ["Press Start 2P"];
  }

  constructor() {
    super();
    this.heroes = ["haxtheweb", "btopro", "future", "traveler", "remix"];
    this.rivals = ["rival-one", "rival-two", "rival-three"];
    this.reset(true);
  }

  /** start the game over */
  reset(quiet) {
    this._g = {
      x: 20,
      hero: 0,
      page: [],
      blocks: [
        { k: 0, x: 22 },
        { k: 1, x: 50 },
        { k: 2, x: 78 },
      ],
      n: 3,
      published: 0,
      rivals: [
        { x: 40, got: 0 },
        { x: 64, got: 0 },
        { x: 88, got: 0 },
      ],
      msg: quiet === true ? "" : this.t.blocksReset,
    };
    if (quiet !== true) {
      this._changed();
    }
  }

  defaultLabel() {
    const g = this._g;
    if (!g) {
      return this.t.blocksLabel;
    }
    const words = g.page.map((k) => this.t[NAMES[BLOCKS[k]]]);
    return [
      this.t.blocksLabel,
      words.length
        ? this.t.blocksYourPage.replace("{blocks}", words.join(", "))
        : this.t.blocksEmpty,
      this.t.blocksRivals.replace(
        "{scores}",
        g.rivals.map((r) => r.got).join(", "),
      ),
      g.msg ? `${g.msg.toLowerCase()}.` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  defaultName() {
    return this.t.blocksName;
  }

  /** how many blocks are on your page */
  get score() {
    return this._g.page.length;
  }

  _changed() {
    this._g = { ...this._g };
    this.dispatchEvent(
      new CustomEvent("retro-tv-program-updated", { bubbles: true }),
    );
  }

  _rivalsTurn() {
    const g = this._g;
    g.rivals.forEach((r) => {
      const t = g.blocks.reduce((a, b) =>
        Math.abs(b.x - r.x) < Math.abs(a.x - r.x) ? b : a,
      );
      if (Math.abs(t.x - r.x) <= 4) {
        r.got++;
        t.k = g.n++ % BLOCKS.length;
        t.x = 10 + ((g.n * 29) % 80);
      } else {
        r.x += Math.sign(t.x - r.x) * Math.min(5, Math.abs(t.x - r.x));
      }
    });
  }

  /**
   * Play a controller button.
   * @param {String} btn u, d, l, r, select, start, b or a
   */
  press(btn) {
    const g = this._g;
    const name = (k) => this.t[NAMES[BLOCKS[k]]].toUpperCase();
    g.msg = "";
    if (btn === "l") {
      g.x = Math.max(8, g.x - 7);
    } else if (btn === "r") {
      g.x = Math.min(92, g.x + 7);
    } else if (btn === "select") {
      g.hero = (g.hero + 1) % (this.heroes.length || 1);
      g.msg = this.t.blocksRemixed;
      return this._changed();
    } else if (btn === "start") {
      if (!g.page.length) {
        g.msg = this.t.blocksGrabFirst;
      } else {
        g.published++;
        g.page = [];
        g.msg = this.t.blocksPublished.replace("{n}", g.published);
      }
      return this._changed();
    } else if (btn === "b" || btn === "d") {
      const k = g.page.pop();
      g.msg =
        k === undefined
          ? this.t.blocksNothing
          : this.t.blocksTookBack.replace("{block}", name(k));
      return this._changed();
    }
    this._rivalsTurn();
    if (btn === "a" || btn === "u") {
      this._jump = (this._jump || 0) + 1;
      const hit = g.blocks.find((b) => Math.abs(b.x - g.x) <= 7);
      const foe = g.rivals.findIndex((r) => Math.abs(r.x - g.x) <= 6);
      if (hit) {
        g.page.push(hit.k);
        if (g.page.length > 10) {
          g.page.shift();
        }
        g.msg = this.t.blocksGot.replace("{block}", name(hit.k));
        hit.k = g.n++ % BLOCKS.length;
        hit.x = 10 + ((g.n * 29) % 80);
      } else if (foe > -1) {
        const r = g.rivals[foe];
        r.x = Math.max(4, Math.min(96, r.x + (r.x >= g.x ? 22 : -22)));
        g.msg = this.t.blocksBonk.replace("{n}", foe + 2);
      } else {
        g.msg = this.t.blocksMissed;
      }
    }
    this._changed();
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          container-type: inline-size;
          font-family: "Press Start 2P", "VT323", monospace;
          background: linear-gradient(
            180deg,
            #5c94fc 0 70%,
            #2f9e44 70% 74%,
            #8b5a2b 74%
          );
        }
        .page {
          position: absolute;
          left: 6%;
          right: 30%;
          top: 26%;
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
        }
        .page i,
        .blk {
          display: inline-grid;
          place-items: center;
          background: #f5f1e8;
          border: 2px solid #262626;
          border-radius: 2px;
        }
        .page i {
          width: 14px;
          height: 14px;
        }
        svg {
          width: 60%;
          height: 60%;
          fill: #1e407c;
        }
        .msg {
          position: absolute;
          left: 0;
          right: 0;
          top: 37%;
          text-align: center;
          font-size: clamp(6px, 3cqi, 14px);
          color: #ffd100;
          text-shadow: 1px 1px 0 #000;
        }
        .blk {
          position: absolute;
          top: 52%;
          width: 9%;
          aspect-ratio: 1;
          transform: translateX(-50%);
          box-shadow: 0 3px 0 rgba(0, 0, 0, 0.35);
        }
        .fighter {
          position: absolute;
          bottom: 26%;
          transform: translateX(-50%);
          line-height: 0;
        }
        .rival {
          transform: translateX(-50%) scaleX(-1);
        }
        @container (max-width: 520px) {
          .fighter rpg-character {
            zoom: 0.6;
          }
        }
        @container (max-width: 300px) {
          .fighter rpg-character {
            zoom: 0.42;
          }
        }
        .score,
        .help {
          position: absolute;
          left: 6%;
          right: 6%;
          white-space: nowrap;
          overflow: hidden;
          color: #ffffff;
          text-shadow: 1px 1px 0 #000;
        }
        .score {
          bottom: 14%;
          font-size: clamp(5px, 2.4cqi, 12px);
        }
        .help {
          bottom: 6%;
          text-align: center;
          font-size: clamp(4px, 1.8cqi, 9px);
        }
        @media (prefers-reduced-motion: no-preference) {
          :host(:not([still])) .fighter {
            transition: left 0.2s steps(3);
          }
          :host(:not([still])) .blk {
            animation: bob 1.6s ease-in-out infinite alternate;
          }
          :host(:not([still])) .jump-a {
            animation: jump-a 0.45s ease-out;
          }
          :host(:not([still])) .jump-b {
            animation: jump-b 0.45s ease-out;
          }
        }
        @keyframes bob {
          to {
            margin-top: -4px;
          }
        }
        @keyframes jump-a {
          40% {
            bottom: 36%;
          }
        }
        @keyframes jump-b {
          40% {
            bottom: 36%;
          }
        }
      `,
    ];
  }

  render() {
    const g = this._g;
    const icon = (k) =>
      html`<svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="${ICON[BLOCKS[k]]}"></path>
      </svg>`;
    const hero = this.heroes[g.hero % (this.heroes.length || 1)];
    return html`
      <div class="page" aria-hidden="true">
        ${g.page.map((k) => html`<i>${icon(k)}</i>`)}
      </div>
      <div class="msg" aria-hidden="true">${g.msg || this.t.blocksPressA}</div>
      ${g.blocks.map(
        (b) =>
          html`<span class="blk" style="left:${b.x}%" aria-hidden="true"
            >${icon(b.k)}</span
          >`,
      )}
      ${g.rivals.map(
        (r, i) =>
          html`<span
            class="fighter rival"
            style="left:${r.x}%"
            aria-hidden="true"
            ><rpg-character
              seed="${this.rivals[i] || i}"
              height="60"
              width="48"
            ></rpg-character
          ></span>`,
      )}
      <span
        class="fighter ${this._jump ? `jump-${this._jump % 2 ? "a" : "b"}` : ""}"
        style="left:${g.x}%"
        aria-hidden="true"
        ><rpg-character seed="${hero}" height="60" width="48"></rpg-character
      ></span>
      <div class="score" aria-hidden="true">
        P1 ${g.page.length}
        ${g.rivals.map((r, i) => `P${i + 2} ${r.got}`).join(" ")}
      </div>
      <div class="help" aria-hidden="true">${this.t.blocksHelp}</div>
    `;
  }
}

globalThis.customElements.define(RetroTvBlocks.tag, RetroTvBlocks);
