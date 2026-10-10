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
          /* default primary when no data-primary is set: Beaver blue in light,
             Pugh blue in dark so the line and title stay readable on dark surfaces */
          --ddd-steps-list-item-primary: var(
            --ddd-theme-primary,
            light-dark(
              var(--ddd-theme-default-beaverBlue, #1e407c),
              var(--ddd-theme-default-pughBlue, #96bee6)
            )
          );
          display: flex;
          border-left: 2px dashed var(--ddd-steps-list-item-primary);
          padding-left: 36px;
        }

        .circle {
          width: var(--ddd-icon-sm);
          height: var(--ddd-icon-sm);
          border-radius: 50%;
          background-color: var(--ddd-steps-list-item-primary);
          /* data-primary always sets bgContrast or lowContrast-override; without it
             the number is white on Beaver blue, or coaly gray on Pugh blue in dark */
          color: var(
            --lowContrast-override,
            var(
              --ddd-theme-bgContrast,
              light-dark(
                var(--ddd-theme-default-white, #ffffff),
                var(--ddd-theme-default-coalyGray, #262626)
              )
            )
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
          color: var(
            --lowContrast-override,
            var(--ddd-steps-list-item-primary)
          );
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
