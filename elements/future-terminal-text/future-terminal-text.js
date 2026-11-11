/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { FutureTerminalTextLite } from "./lib/future-terminal-text-lite.js";
import { SimpleColorsSuper } from "@haxtheweb/simple-colors/simple-colors.js";

/**
 * `future-terminal-text`
 * `this is to provide a futuristic terminal text type of environment`
 * @demo demo/index.html
 * @element future-terminal-text
 */
class FutureTerminalText extends SimpleColorsSuper(FutureTerminalTextLite) {
  static get tag() {
    return "future-terminal-text";
  }
  static get styles() {
    return [
      super.styles,
      css`
        /* the accent's dark shade on light pages, its light shade on dark
           pages; with the dark attribute SimpleColors already flips the
           shades, so it keeps accent-9 */
        span {
          color: var(
            --future-terminal-text-color,
            light-dark(
              var(--simple-colors-default-theme-accent-9),
              var(--simple-colors-default-theme-accent-3)
            )
          );
        }
        :host([dark]:not([red])) span {
          color: var(
            --future-terminal-text-color,
            var(--simple-colors-default-theme-accent-9, inherit)
          );
        }
      `,
    ];
  }
  constructor() {
    super();
    this.accentColor = "green";
  }
  // render function
  render() {
    return html`<span><slot></slot></span>`;
  }
}
globalThis.customElements.define(FutureTerminalText.tag, FutureTerminalText);
export { FutureTerminalText };
