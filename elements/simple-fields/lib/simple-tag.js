import { css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { SimpleTagLiteSuper } from "./simple-tag-lite.js";
import {
  SimpleFieldsButtonStyles,
  SimpleFieldsTooltipStyles,
} from "./simple-fields-ui.js";

export class SimpleTag extends SimpleTagLiteSuper(DDD) {
  constructor() {
    super();
    this.autoAccentColor = false;
  }
  updated(changedProperties) {
    super.updated(changedProperties);
    // updates to the value or autoAccentColor should trigger a color change
    // but we MUST have values in both
    if (
      this.shadowRoot &&
      (changedProperties.has("autoAccentColor") ||
        changedProperties.has("value")) &&
      this.value &&
      this.autoAccentColor
    ) {
      this.accentColor = this.calculateAccentColor(this.value);
    }
  }

  calculateAccentColor(value) {
    // use the seed to generate a random number
    let seed = 54;
    for (let i = 0; i < value.length; i++) {
      // hard limit of 32 to be safe bc of calculation since seed is supposed to be like a word
      if (i < 32) {
        seed *= value.charCodeAt(i);
      }
    }
    // make seed into string
    seed = seed + "";
    if (seed.length > 8) {
      seed = seed.substring(5, 7);
    }
    let colorName = Array.from(Object.keys(this.colors))[seed[0]];
    // shade is whatever the 2nd value is here
    let shade = parseInt(seed[1]) !== 0 ? parseInt(seed[1]) : 1;
    // avoid nuetral middle shades for higher contrasting text
    if ([5, 6, 7].includes(shade)) {
      shade = shade - 3;
    } else if ([8, 9].includes(shade)) {
      shade = shade + 2;
    }
    // set accent shade by figuring out which contrastic colors will be valid
    const contrast = this.getContrastingColors(colorName, shade, false);
    let contrastLevel = contrast.grey[0];
    // highest contrast if a dark starting tone
    if (shade < 5) {
      contrastLevel = contrast.grey.pop();
    }
    this.style.setProperty(
      "--simple-fields-button-background-color",
      `var(--simple-colors-default-theme-accent-${shade}, orange)`,
    );
    this.style.setProperty(
      "--simple-fields-button-color",
      `var(--simple-colors-fixed-theme-grey-${contrastLevel}, black)`,
    );
    // set accent color
    return colorName;
  }

  static get properties() {
    return {
      ...super.properties,
      autoAccentColor: {
        type: Boolean,
        attribute: "auto-accent-color",
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      SimpleFieldsButtonStyles,
      SimpleFieldsTooltipStyles,
      css`
        :host {
          --simple-fields-button-color: var(
            --simple-colors-default-theme-accent-12,
            #222222
          );
          --simple-fields-fieldset-border-color: var(
            --simple-colors-default-theme-accent-3,
            #eeeeee
          );
          --simple-fields-button-background-color: var(
            --simple-colors-default-theme-accent-3,
            #eeeeee
          );
          --simple-fields-tag-margin-left: var(--ddd-spacing-2);
          --simple-fields-tag-border-width: var(--ddd-border-xs);
          font-size: var(--ddd-font-size-4xs);
        }
      `,
    ];
  }
  static get tag() {
    return "simple-tag";
  }
}
customElements.define(SimpleTag.tag, SimpleTag);
