/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * `d-d-d-sample`: a small swatch + label used to preview a DDD option
 * (a color, spacing, border, font...) in pickers and docs. It is not part
 * of the d-d-d.js entry point so elements that only use DDDSuper do not
 * load it or simple-tooltip. Import it where samples are rendered: the
 * HAX style guide authoring integration (DDDStyleGuideAuthoring.js) and
 * d-d-docs do.
 */
import { LitElement, css, html } from "lit";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { DDDSuper } from "../d-d-d.js";
import { ApplicationAttributeData, DDDDataAttributes } from "./DDDStyles.js";
import { getDDDStyleGuidePresetByKey } from "./DDDStyleGuidePresets.js";

export class DDDSample extends DDDSuper(LitElement) {
  constructor() {
    super();
    this.type = null;
    this.option = 0;
    this.tooltip = false;
  }

  static get styles() {
    return [
      super.styles,
      ...DDDDataAttributes,
      css`
        :host {
          display: flex;
          padding: 0;
          margin: 0;
          font-size: var(--ddd-font-size-4xs);
        }

        .sample {
          transition:
            background-color var(--ddd-duration-normal, 0.3s) ease-in-out,
            color var(--ddd-duration-normal, 0.3s) ease-in-out,
            border-color var(--ddd-duration-normal, 0.3s) ease-in-out;
        }

        :host([type="accent"]) .sample,
        :host([type="primary"]) .sample {
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-xs);
          height: var(--ddd-spacing-6);
          width: var(--ddd-spacing-6);
          display: inline-block;
        }

        :host([type="border"]) .sample,
        :host([type="border-radius"]) .sample,
        :host([type="box-shadow"]) .sample {
          --ddd-theme-primary: var(
            --ddd-sample-theme-primary,
            light-dark(black, white)
          );
          --ddd-theme-accent: var(
            --ddd-sample-theme-accent,
            var(--ddd-accent-3)
          );
          background-color: var(--ddd-theme-accent);
          border-color: var(--ddd-theme-primary);
          height: var(--ddd-spacing-4);
          width: var(--ddd-spacing-8);
          display: inline-block;
        }
        :host([type="border"]) .sample {
          height: calc(var(--ddd-spacing-4) - var(--ddd-theme-border-size));
          width: calc(var(--ddd-spacing-8) - var(--ddd-theme-border-size));
        }
        :host([type="border-radius"]) .sample {
          border: var(--ddd-border-lg);
          height: var(--ddd-spacing-2);
          width: var(--ddd-spacing-2);
          border-color: var(--ddd-theme-primary);
          clip-path: polygon(50% 0, 0 50%, 0 0, 0 0);
          transform: scale(2);
          padding: 0;
          margin-left: 6px;
          margin-top: 6px;
        }
        :host([type="box-shadow"]) .sample {
          border: var(--ddd-border-sm);
          border-color: var(--ddd-theme-primary);
          margin: 0 12px 12px 12px;
        }

        :host([type="accent"]:hover) .sample,
        :host([type="primary"]:hover) .sample {
          border-color: black;
        }
        :host([type="border"]) .label,
        :host([type="box-shadow"]) .label,
        :host([type="accent"]) .label,
        :host([type="primary"]) .label,
        :host([type="margin"]) .label,
        :host([type="padding"]) .label {
          font-size: var(--ddd-font-size-4xs);
          margin-left: var(--ddd-spacing-3);
          display: inline-block;
          vertical-align: top;
        }
        :host([type="border-radius"]) .label {
          margin-left: calc(-1 * var(--ddd-spacing-2));
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

        :host([type="margin"]) .sample[data-margin],
        :host([type="padding"]) .sample {
          --ddd-theme-primary: var(
            --ddd-sample-theme-primary,
            light-dark(black, white)
          );
          display: inline-block;
          height: var(--ddd-spacing-4);
          padding-top: 0;
          padding-bottom: 0;
          padding-left: 0;
          background-color: var(--ddd-theme-primary);
          margin: 0;
        }

        /* style guide presets: the label is a small live sample */
        :host([type="style-guide"]) {
          display: block;
          width: 100%;
        }
        :host([type="style-guide"]) .wrapper {
          width: 100%;
        }
        :host([type="style-guide"]) .sample {
          display: none;
        }
        :host([type="style-guide"]) .label {
          display: block;
          font-weight: var(--ddd-font-weight-medium);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        /* accent blocks style p / ul / div in content; the sample is a span */
        :host([type="style-guide"]) .label[data-accent] {
          background-color: var(--ddd-theme-accent);
          color: light-dark(currentcolor, var(--ddd-theme-colorContrast));
          border: var(--ddd-border-sm);
          border-color: var(--ddd-theme-primary);
        }
        :host([type="style-guide"]) .label[data-accent]:not([data-padding]) {
          padding: var(--ddd-spacing-2);
        }

        /* design treatments may require display block */
        :host([type="design-treatment"]) .label {
          display: block;
          font-weight: bold;
          --ddd-theme-primary: var(
            --ddd-sample-theme-primary,
            var(--ddd-primary-0)
          );
          min-height: calc(
            (var(--initialLetter) / 4 * var(--ddd-theme-body-font-size) * 1.5) +
              4px
          );
        }

        :host([type="design-treatment"][option="bg"]) .label {
          color: var(
            --ddd-theme-bgContrast,
            var(--lowContrast-override, black)
          );
        }

        :host([type="font-weight"]) .label,
        :host([type="font-family"]) .label {
          font-size: var(--ddd-font-size-xxs);
        }

        /* @hack just for the docs bc we can't visualize margins */
        [data-margin="center"] {
          margin-left: auto;
          margin-right: auto;
        }
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

        /* @hack from normal presentation so that it renders nicely here */
        [data-instructional-action]::before {
          padding: 6px 0 0;
          margin: 8px 16px 0 0;
        }

        /* @hack so that we reduce the size of the drop cap or it'll be ridiculous */
        :host([type="design-treatment"])
          .label[data-design-treatment^="dropCap"]::first-letter {
          -webkit-initial-letter: calc(var(--initialLetter) / 3);
          initial-letter: calc(var(--initialLetter) / 3);
        }
        /* @hack so we can see fonts relative to each other, not exact size */
        :host([type="font-size"]) span ::slotted(*) {
          font-size: var(--ddd-font-size-xs);
        }
        :host([type="font-size"]) .label {
          font-size: 0.8em;
        }
        :host([option^="type"]) .label {
          font-size: 0.5em;
        }
        :host([option^="type"]) .label::after {
          content: " (50% scale)";
          font-size: var(--ddd-font-size-4xs);
        }

        /* when tooltip is active, keep the label available to assistive
           tech but visually hide it since the name is presented on hover
           via simple-tooltip instead */
        :host([tooltip]) .label {
          position: absolute;
          left: -10000px;
          inset-inline-start: -10000px;
          inset-inline-end: initial;
          top: auto;
          width: 1px;
          height: 1px;
          margin: 0;
          overflow: hidden;
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // a style guide preset previews every attribute it sets on the label
    if (this.type === "style-guide") {
      if (
        this.shadowRoot &&
        (changedProperties.has("type") || changedProperties.has("option"))
      ) {
        this._applyStyleGuidePreset();
      }
      return;
    }
    if (changedProperties.has("type") && this.shadowRoot) {
      let span;
      // accent, primary, spacing
      if (
        [
          "accent",
          "primary",
          "padding",
          "margin",
          "border-radius",
          "box-shadow",
          "border",
        ].includes(this.type)
      ) {
        span = this.shadowRoot.querySelector("span.sample");
      } else if (this.type === "font-size") {
        span = this.shadowRoot.querySelector("div.wrapper");
      } else {
        span = this.shadowRoot.querySelector("span.label");
      }
      for (let i in ApplicationAttributeData) {
        span.removeAttribute(`data-${i}`);
      }
      // delay to ensure prev executes in order
      setTimeout(() => {
        span.setAttribute(`data-${this.type}`, this.option);
      }, 0);
    }
    if (changedProperties.has("option") && this.shadowRoot && this.type) {
      let span = this.shadowRoot.querySelector(`span[data-${this.type}]`);
      if (span) {
        span.setAttribute(`data-${this.type}`, this.option);
      }
    }
  }

  _applyStyleGuidePreset() {
    const label = this.shadowRoot.querySelector("span.label");
    if (!label) {
      return;
    }
    Array.from(label.attributes).forEach((attr) => {
      if (attr.name.indexOf("data-") === 0) {
        label.removeAttribute(attr.name);
      }
    });
    const preset = getDDDStyleGuidePresetByKey(this.option);
    if (preset && preset.properties) {
      Object.keys(preset.properties).forEach((attribute) => {
        const value = preset.properties[attribute];
        // a drop cap does not fit a one-line sample, so leave it off
        if (
          attribute === "data-design-treatment" &&
          String(value).indexOf("dropCap") === 0
        ) {
          return;
        }
        label.setAttribute(attribute, value);
      });
    }
  }

  // label for the current type / option; empty when either is unset or
  // unknown (a bare <d-d-d-sample> has no type yet)
  get sampleLabel() {
    if (this.type === "style-guide") {
      const preset = getDDDStyleGuidePresetByKey(this.option);
      return preset ? preset.name : "";
    }
    const options = this.type ? ApplicationAttributeData[this.type] : null;
    if (!options || options[this.option] == null) {
      return "";
    }
    return options[this.option];
  }

  render() {
    return html`
      <div class="wrapper">
        <span class="sample" id="sample"></span
        ><span class="label">${this.sampleLabel}<slot></slot></span>
      </div>
      ${
        this.tooltip
          ? html`<simple-tooltip
              for="sample"
              fit-to-visible-bounds
              position="top"
              >${this.sampleLabel}</simple-tooltip
            >`
          : ``
      }
    `;
  }

  static get properties() {
    return {
      type: { type: String, reflect: true },
      option: { type: String },
      /**
       * present the label as a tooltip on hover/focus instead of
       * displaying it visibly next to the sample swatch
       */
      tooltip: { type: Boolean, reflect: true },
    };
  }

  static get tag() {
    return "d-d-d-sample";
  }
}

globalThis.customElements.define(DDDSample.tag, DDDSample);
