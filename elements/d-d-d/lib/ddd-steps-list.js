/**
 * Copyright 2025 luckyshearer
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "./ddd-steps-list-item.js";

/**
 * `ddd-steps-list`
 *
 * @demo index.html
 * @element ddd-steps-list
 */
export class DddStepsList extends DDDSuper(LitElement) {
  static get tag() {
    return "ddd-steps-list";
  }

  constructor() {
    super();
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      dddPrimary: { type: String, attribute: "ddd-primary" },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          position: relative;
          padding: var(--ddd-spacing-4, 16px);
          font-family: var(--ddd-font-primary, sans-serif);
        }

        .steps-container {
          position: relative;
          padding-left: calc(
            var(--ddd-icon-size-xl, 50px) + var(--ddd-spacing-4, 16px)
          );
        }

        @media (max-width: 768px) {
          :host {
            padding: 0px;
          }
          .steps-container {
            padding-left: 0px;
          }
        }
      `,
    ];
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.updateNumbers();
  }

  updateNumbers() {
    const children = Array.from(this.children);
    let step = 0;
    children.forEach((child) => {
      const tag = child.tagName.toLowerCase();
      if (tag === "ddd-steps-list-item") {
        step++;
        child.step = step;
      }
    });
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="steps-container">
        <slot @slotchange="${this.updateNumbers}"></slot>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(DddStepsList.tag, DddStepsList);
