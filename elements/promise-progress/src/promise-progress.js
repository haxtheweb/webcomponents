/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
/**
 * `promise-progress`
 * `An element to display the progress visually of forfilling an array of JS Promise objects`
 * @demo demo/index.html
 * @element promise-progress
 */
class PromiseProgress extends SimpleColors {
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.value = 0;
    this.max = 1;
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
      ...styles,
      css`
        :host {
          display: block;
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
    };
  }
  /**
   * LitElement render callback
   */
  render() {
    return html`
      <progress max="${this.max}" value="${this.value}"></progress> ${this.list
        ? html`${this.value} / ${this.max}`
        : ``}
    `;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "promise-progress";
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
      if (propName === "value" && this.shadowRoot) {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            },
          })
        );
      }
      // only run this when we get a new list of things to process
      // but also that our value != max possible
      if (
        propName == "list" &&
        this[propName] &&
        this[propName].length > 0 &&
        this.max !== this.value
      ) {
        this.processList(this[propName]);
      }
      // list dictates max size
      if (propName == "list" && this[propName] && this[propName].length > 0) {
        this.max = this.list.length;
      }
    });
  }
  processList(list) {
    (async () => {
      const promises = list.map((item) =>
        item().then(() => {
          this.value = this.value + 1;
          this.loadingBar.textContent = `Loading ${this.value} of ${this.max}`;
        })
      );
      await Promise.all(promises);
      this.loadingBar.textContent = `Loading Finished`;
    })();
  }
}
customElements.define(PromiseProgress.tag, PromiseProgress);
export { PromiseProgress };
