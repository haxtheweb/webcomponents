/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `promise-progress`
 * `An element to display the progress visually of forfilling an array of JS Promise objects`
 * @demo demo/basic.html Basic
 * @demo demo/index.html Fancy
 * @demo demo/wc-preload.html WC-Preloader
 * @element promise-progress
 */
export class PromiseProgressLite extends LitElement {
  /**
   * Convention we use
   */
  static get tag() {
    return "promise-progress-lite";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.list = [];
    this.value = 0;
    this.max = 100;
    this.showCount = false;
    this.canLoad = false;
  }
  /**
   * LitElement style callback
   */
  static get styles() {
    // support for using in other classes
    let styles = [];
    if (super.styles) {
      styles = super.styles;
    }
    return [
      styles,
      css`
        :host {
          display: block;
          position: relative;
        }
      `,
    ];
  }
  static get properties() {
    return {
      ...super.properties,
      max: { type: Number },
      value: { type: Number, reflect: true },
      list: { type: Array },
      showCount: { type: Boolean, attribute: "show-count" },
      canLoad: { type: Boolean },
    };
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
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.loadingBar = this.shadowRoot.querySelector("progress");
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // notify but only after we actually render
      if (["value", "max"].includes(propName) && this.shadowRoot) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      // ensure we are allowed to load things
      if (
        propName == "list" &&
        this[propName] &&
        this[propName].length > 0 &&
        this.max !== this.value
      ) {
        this.canLoad = true;
      }
    });
  }
  // process the array of functions returning Promises
  async process() {
    const list = this.list;
    if (this.canLoad) {
      var count = 0;
      const promises = await list.map(async (item) => {
        return await item()
          .then((res) => {
            count = count + 1;
            this.value = Math.round((count / this.list.length) * 100);
            this.loadingBar.textContent = `Loading ${this.value} of ${this.max}`;
            resolve(res);
          })
          .catch((err) => {
            // an error occured
            reject(err);
          });
      });
      await Promise.allSettled(promises).then(() => {
        this.loadingBar.textContent = `Loading Finished`;
        this.value = this.max;
        setTimeout(() => {
          this.dispatchEvent(
            new CustomEvent("promise-progress-finished", {
              detail: {
                value: true,
              },
            }),
          );
        }, 100);
      });
    }
  }
}
customElements.define(PromiseProgressLite.tag, PromiseProgressLite);
