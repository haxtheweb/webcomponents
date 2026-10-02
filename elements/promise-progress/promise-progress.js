/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { PromiseProgressLite } from "./lib/promise-progress-lite.js";
/**
 * `promise-progress`
 * `An element to display the progress visually of forfilling an array of JS Promise objects`
 * @demo demo/basic.html Basic
 * @demo demo/index.html Fancy
 * @demo demo/wc-preload.html WC-Preloader
 * @element promise-progress
 */
export class PromiseProgress extends PromiseProgressLite {
  constructor() {
    super();
  }
  static get tag() {
    return "promise-progress";
  }
  /**
   * The native progress element follows the CSS accent-color property.
   * The DDD primary token feeds the default; light DOM CSS (or the
   * data-primary attribute with DDD styles in scope) can still override.
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          accent-color: var(
            --ddd-theme-primary,
            var(--ddd-theme-default-link)
          );
        }
      `,
    ];
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <progress
        part="progress"
        max="${this.max}"
        value="${this.value}"
      ></progress>
      ${this.list && this.showCount ? html`${this.value} / ${this.max}` : ``}
      <slot></slot>
    `;
  }
}
globalThis.customElements.define(PromiseProgress.tag, PromiseProgress);
