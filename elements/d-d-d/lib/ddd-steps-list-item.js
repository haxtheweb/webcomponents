/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

/**
 * `ddd-steps-list-item`
 *
 * @demo index.html
 * @element ddd-steps-list-item
 */
export class DddStepsListItem extends DDDSuper(LitElement) {
  static get tag() {
    return "ddd-steps-list-item";
  }

  constructor() {
    super();
    this.step = 0;
    this.title = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      step: { type: Number },
      title: { type: String },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          border-left: 2px dashed var(--ddd-theme-primary, #1e407c);
          padding-left: 36px;
        }

        .circle {
          width: var(--ddd-icon-size-xl, 40px);
          height: var(--ddd-icon-size-xl, 40px);
          border-radius: 50%;
          background-color: var(--ddd-theme-primary, #1e407c);
          color: var(
            --lowContrast-override,
            var(--ddd-theme-default-white, #ffffff)
          );
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-left: -56px;
          position: absolute;
          padding: 0px;
        }

        .step-content div ::slotted(p) {
          padding: 0;
          margin: 0;
        }

        .step-content div {
          min-height: 36px;
          padding: 0;
          margin: 0;
        }

        h3 {
          margin: 4px 0 0 0;
          color: var(--lowContrast-override, var(--ddd-theme-primary, #1e407c));
        }

        :host(:last-of-type) {
          border-left: unset;
        }

        @media (max-width: 768px) {
          :host {
            border-left: unset;
            padding-left: unset;
            display: block;
          }
          .circle {
            position: relative;
            margin-left: unset;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="circle">${this.step}</div>
      <div class="step-content">
        ${this.title ? html`<h3>${this.title}</h3>` : ""}
        <div><slot></slot></div>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(DddStepsListItem.tag, DddStepsListItem);
