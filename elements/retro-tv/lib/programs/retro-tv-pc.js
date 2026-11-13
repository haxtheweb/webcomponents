/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { RetroTvLocalizedProgram } from "../retro-tv-program.js";

const BAR = 16;

/**
 * `retro-tv-pc`
 * A DOS-style prompt from the early 90s. While `loading`, a block progress
 * bar fills under `message`; `command` is what was typed at the prompt.
 *
 * @element retro-tv-pc
 */
export class RetroTvPc extends RetroTvLocalizedProgram {
  static get tag() {
    return "retro-tv-pc";
  }

  static get faces() {
    return ["VT323"];
  }

  static get properties() {
    return {
      ...super.properties,
      command: { type: String },
      message: { type: String },
      _filled: { type: Number, state: true },
    };
  }

  constructor() {
    super();
    this.command = "INSTALL";
    this.message = "";
    this._filled = BAR;
    this.__timer = null;
  }

  defaultLabel() {
    return this.t.pcLabel;
  }

  defaultName() {
    return this.t.pcName;
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    if (
      changedProperties.has("loading") &&
      !changedProperties.has("onAir") &&
      this.onAir
    ) {
      this.restart();
    }
  }

  restart() {
    super.restart();
    clearTimeout(this.__timer);
    if (!this.moving || !this.loading) {
      this._filled = BAR;
      return;
    }
    this._filled = 0;
    const step = () => {
      if (this._filled < BAR && this.onAir) {
        this._filled = this._filled + 1;
        this.__timer = setTimeout(step, 110);
      }
    };
    step();
  }

  disconnectedCallback() {
    clearTimeout(this.__timer);
    super.disconnectedCallback();
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          background: #000;
        }
        pre {
          margin: 0;
          position: absolute;
          inset: 10% 8%;
          color: #c0c0c0;
          font-family: "VT323", monospace;
          font-size: var(--retro-tv-program-text, clamp(10px, 2vw, 22px));
          line-height: 1.15;
          white-space: pre-wrap;
          overflow: hidden;
        }
      `,
    ];
  }

  render() {
    const prompt = `C:\\HAXCMS>${this.command}`;
    if (!this.loading) {
      return html`<pre>
${prompt}

C:\\HAXCMS>_</pre>`;
    }
    const n = Math.min(this._filled, BAR);
    const bar = `[${"█".repeat(n)}${"░".repeat(BAR - n)}] ${Math.round(
      (n / BAR) * 100,
    )}%`;
    return html`<pre>
${prompt}

${this.message || this.t.pcMessage}

${bar}</pre>`;
  }
}

globalThis.customElements.define(RetroTvPc.tag, RetroTvPc);
