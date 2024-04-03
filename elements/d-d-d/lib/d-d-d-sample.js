import { DDDSuper } from "../d-d-d.js";
import { DDDDataAttributes, learningComponentTypes } from "./DDDStyles.js";

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
      for (let i in DDDAttributeData) {
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
      <span class="sample"></span><span class="label">${DDDAttributeData[this.type][this.option]}<slot></slot></span>
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

export const DDDAttributeData = {
  "font-family": {
    primary: "Primary",
    secondary: "Secondary",
    navigation: "Navigation",
  },
  "font-weight": {
    light: "Light",
    regular: "Regular",
    medium: "Medium",
    bold: "Bold",
    black: "Black",
  },
  "font-size": {
    "4xs": "4XS",
    "3xs": "3XS",
    xxs: "2XS",
    xs: "XS",
    s: "S",
    ms: "MS",
    m: "M",
    ml: "ML",
    l: "L",
    xl: "XL",
    xxl: "2XL",
    "3xl": "3XL",
    "4xl": "4XL",
    "type1-s": "TypeS",
    "type1-m": "TypeM",
    "type1-l": "TypeL",
  },
  primary: {
    0: "Pugh blue",
    1: "Beaver blue",
    2: "Nittany navy",
    3: "Potential midnight",
    4: "Coaly gray",
    5: "Limestone gray",
    6: "Slate gray",
    7: "Creek teal",
    8: "Sky blue",
    9: "Shrine tan",
    10: "Roar golden",
    11: "Original 87 pink",
    12: "Discovery coral",
    13: "Wonder purple",
    14: "Artherton violet",
    15: "Invent orange",
    16: "Keystone yellow",
    17: "Opportunity green",
    18: "Future lime",
    19: "Forest green",
    20: "Landgrant brown",
    21: "Global Neon",
  },
  accent: {
    0: "Sky Max",
    1: "Slate Max",
    2: "Limestone Max",
    3: "Shrine Max",
    4: "Roar Max",
    5: "Creek Max",
    6: "White",
  },
  margin: {
    xs: "XS",
    s: "S",
    m: "M",
    l: "L",
    xl: "XL",
  },
  padding: {
    xs: "XS",
    s: "S",
    m: "M",
    l: "L",
    xl: "XL",
  },
  "design-treatment": {
    // heading treatments
    "vert": "Vertical line",
    "horz-10p": "Horizontal line 10%",
    "horz-25p": "Horizontal line 25%",
    "horz-50p": "Horizontal line 50%",
    "horz-full": "Horizontal line 100%",
    "horz-md": "Horizontal line Medium",
    "horz-lg": "Horizontal line Large",
    "horz": "Horizontal line",
    "bg": "Background color",
    // text treatment
    "dropCap-xs": "Drop Cap - xs",
    "dropCap-sm": "Drop Cap - sm",
    "dropCap-md": "Drop Cap - md",
    "dropCap-lg": "Drop Cap - lg",
    "dropCap-xl": "Drop Cap - xl",
  },
  "instructional-action": learningComponentTypes
};