import { DDDSuper } from "../d-d-d.js";
import { DDDDataAttributes } from "./DDDStyles.js";

import { html, css, LitElement } from "lit";

// REFACTOR TO NOT COME FROM HERE
import { learningComponentTypes } from "@lrnwebcomponents/course-design/lib/learning-component.js";

export class DDDSample extends DDDSuper(LitElement) {
  constructor() {
    super();
    this.type = null;
    this.option = 0;
    this.display = "both";
  }

  static get styles() {
    return [
      DDDDataAttributes,
      super.styles,
      css`
        :host {
          display: inline-block;
          min-height: 30px;
        }

        .label {
          margin: 2px;
          padding: 2px;
        }

        :host([type="accent"]) .sample,
        :host([type="primary"]) .sample {
          height: 24px;
          width: 24px;
          display: inline-block;
          margin-right: var(--ddd-spacing-2);
        }
        :host([type="accent"]) .sample {
          background-color: var(--ddd-theme-accent);
        }
        :host([type="primary"]) .sample {
          background-color: var(--ddd-theme-primary);
        }

        :host([type="spacing"]) .sample {
          
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
      if (['accent','primary', 'spacing'].includes(this.type)) {
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
      <span class="sample" style="${this.type === "spacing" ? 'width: var(--ddd-spacing-${this.option});' : ''}"></span><span class="label">${DDDAttributeData[this.type][this.option]}<slot></slot></span>
    `;
  }

  static get properties() {
    return {
      type: { type: String, reflect: true },
      option: { type: String },
      display: { type: String, reflect: true },
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