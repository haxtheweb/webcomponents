/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "lit";
import { PromiseProgressLite } from "./lib/promise-progress-lite.js";
import { SimpleColorsSuper } from "@haxtheweb/simple-colors/simple-colors.js";
/**
 * `promise-progress`
 * `An element to display the progress visually of forfilling an array of JS Promise objects`
 * @demo demo/basic.html Basic
 * @demo demo/index.html Fancy
 * @demo demo/wc-preload.html WC-Preloader
 * @element promise-progress
 */
export class PromiseProgress extends SimpleColorsSuper(PromiseProgressLite) {
  constructor() {
    super();
  }
  static get tag() {
    return "promise-progress";
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
customElements.define(PromiseProgress.tag, PromiseProgress);
