import { DDDSuper } from "../d-d-d.js";
import { DDDDataAttributes, ApplicationAttributeData } from "./DDDStyles.js";

import { html, css, LitElement } from "lit";

export class DDDSample extends DDDSuper(LitElement) {
  constructor() {
    super();
    this.type = null;
    this.option = 0;
  }

  static get styles() {
    return [
      super.styles,
      ...DDDDataAttributes,
      css`
        :host {
          display: inline-block;
          min-height: 30px;
        }
        :host([type="accent"]:hover) .label,
        :host([type="primary"]:hover) .label {
          text-decoration: underline;
        }

        :host([type="accent"]) .sample,
        :host([type="primary"]) .sample {
          height: var(--ddd-font-size-s);
          width: var(--ddd-font-size-s);
          display: inline-block;
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-xs);
          box-shadow: var(--ddd-boxShadow-xs);
        }

        :host([type="accent"]:hover) .sample,
        :host([type="primary"]:hover) .sample {
          box-shadow: var(--ddd-boxShadow-sm);
          border-color: black;
        }

        :host([type="accent"]) .label,
        :host([type="primary"]) .label,
        :host([type="margin"]) .label,
        :host([type="padding"]) .label {
          font-size: var(--ddd-font-size-s);
          margin-left: var(--ddd-spacing-3);
          display: inline-block;
          vertical-align: top;
        }
        :host([type="margin"]) .label,
        :host([type="padding"]) .label {
          font-weight: var(--ddd-font-weight-bold);
        }
        :host([type="accent"]) .sample {
          background-color: var(--ddd-theme-accent);
        }
        :host([type="primary"]) .sample {
          background-color: var(--ddd-theme-primary);
        }
        /* hack just for the docs bc we can't visualize margins */
        [data-margin="xs"] {
          padding: var(--ddd-spacing-2);
        }
        [data-margin="s"] {
          padding: var(--ddd-spacing-4);
        }
        [data-margin="m"] {
          padding: var(--ddd-spacing-8);
        }
        [data-margin="l"] {
          padding: var(--ddd-spacing-12);
        }
        [data-margin="xl"] {
          padding: var(--ddd-spacing-16);
        }

        :host([type="margin"]) .sample[data-margin],
        :host([type="padding"]) .sample {
          display: inline-block;
          height: var(--ddd-font-size-s);
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          background-color: var(--ddd-primary-2);
          margin: 0;
        }

        /* some treatments require block */
        :host([type="design-treatment"]) .label {
          display: block;
          --ddd-theme-primary: var(--ddd-primary-7);
          min-height: calc(
          (var(--initialLetter) / 2 * var(--ddd-theme-body-font-size) * 1.5) + 20px
        );
        }
        /** hack so that we reduce the size of the drop cap or it'll be ridiculous */
        :host([type="design-treatment"]) .label[data-design-treatment^="dropCap"]::first-letter {
          -webkit-initial-letter: calc(var(--initialLetter)/2);
          initial-letter: calc(var(--initialLetter)/2);
        }
      `
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has('type') && this.shadowRoot) {
      let span;
      // accent, primary, spacing
      if (['accent','primary', 'padding', 'margin'].includes(this.type)) {
        span = this.shadowRoot.querySelector('span.sample');
      }
      else {
        span = this.shadowRoot.querySelector('span.label');
      }
      for (let i in ApplicationAttributeData) {
        span.removeAttribute(`data-${i}`);
      }
      // delay to ensure prev executes in order
      setTimeout(() => {
        span.setAttribute(`data-${this.type}`, this.option);
      }, 0);
    }
    if (changedProperties.has('option') && this.shadowRoot && this.type) {
      let span = this.shadowRoot.querySelector(`span[data-${this.type}]`);
      if (span) {
        span.setAttribute(`data-${this.type}`, this.option);
      }
    }
  }

  render() {
    return html`
      <span class="sample"></span><span class="label">${ApplicationAttributeData[this.type][this.option]}<slot></slot></span>
    `;
  }

  static get properties() {
    return {
      type: { type: String, reflect: true },
      option: { type: String },
    }
  }

  static get tag() {
    return "d-d-d-sample";
  }
}

globalThis.customElements.define(DDDSample.tag, DDDSample);