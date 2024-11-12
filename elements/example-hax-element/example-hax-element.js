/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
/**
 * `example-hax-element`
 * @element example-hax-element
 * `Provide an example to pick apart of a working HAX element`
 * @demo demo/index.html
 */
export class ExampleHaxElement extends LitElement {
  // convention our team enjoys
  static get tag() {
    return "example-hax-element";
  }

  constructor() {
    super();
    this.title = null;
    this.shiny = false;
  }

  static get properties() {
    return {
      title: {
        type: String,
      },
      shiny: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        :host([shiny]) h2 {
          background-color: var(--ddd-theme-accent);
        }
      `,
    ];
  }

  render() {
    return html`<h2>${this.title}</h2>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}
globalThis.customElements.define(ExampleHaxElement.tag, ExampleHaxElement);
