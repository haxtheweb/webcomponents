/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { SimpleTagLiteSuper } from "./simple-tag-lite.js";
import { DDDVocabulary } from "@haxtheweb/d-d-d/lib/DDDVocabulary.js";
import {
  SimpleFieldsButtonStyles,
  SimpleFieldsTooltipStyles,
} from "./simple-fields-ui.js";

export class SimpleTag extends DDDVocabulary(SimpleTagLiteSuper(DDD)) {
  constructor() {
    super();
    this.autoAccentColor = false;
    // toggled is not reflected, so expose it to CSS as a custom state
    // (:state(toggled)) without adding attributes to saved content
    // (DDDVocabulary attaches the internals; this is the fallback)
    if (!this.__internals) {
      try {
        this.__internals = this.attachInternals();
      } catch {
        this.__internals = null;
      }
    }
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (
      (changedProperties.has("toggled") || changedProperties.has("toggles")) &&
      this.__internals &&
      this.__internals.states
    ) {
      try {
        if (this.toggles && this.toggled) {
          this.__internals.states.add("toggled");
        } else {
          this.__internals.states.delete("toggled");
        }
      } catch {
        // older engines without CustomStateSet keep the default look
      }
    }
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive accentColor from value/autoAccentColor in willUpdate so it
    // batches into the current update cycle. Setting accentColor in
    // updated() scheduled a redundant second update (Lit change-in-update
    // warning). The style.setProperty calls inside calculateAccentColor
    // are DOM side-effects that are safe pre-render (they set CSS custom
    // properties on this, which don't need shadowRoot).
    if (
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
    if (this.style) {
      this.style.setProperty(
        "--simple-fields-button-background-color",
        `var(--simple-colors-default-theme-accent-${shade}, orange)`,
      );
      this.style.setProperty(
        "--simple-fields-button-color",
        `var(--simple-colors-fixed-theme-grey-${contrastLevel}, black)`,
      );
    }
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
        /* one pill style: 28px tall, fully rounded, 1px border; the
           accent colour tints the fill and border */
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
            --simple-colors-default-theme-accent-1,
            #ffffff
          );
          --simple-fields-tag-margin-left: var(--ddd-spacing-1);
          --simple-fields-tag-border-width: 1px;
          box-sizing: border-box;
          gap: var(--ddd-spacing-1);
          min-height: 28px;
          padding: var(--simple-fields-button-padding, 0px)
            calc(2 * var(--simple-fields-button-padding, 6px));
          border-radius: var(
            --simple-fields-tag-border-radius,
            var(--ddd-tag-radius, var(--ddd-radius-rounded))
          );
          font-family: var(
            --simple-fields-font-family,
            var(--ddd-font-primary)
          );
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--simple-fields-line-height, 20px);
          vertical-align: middle;
        }
        simple-icon-button-lite {
          flex: none;
          width: 20px;
          height: 20px;
          margin-inline-start: var(--simple-fields-tag-margin-left);
          /* sits snug inside the end of the pill */
          margin-inline-end: calc(-1 * var(--ddd-spacing-2));
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          --simple-icon-button-border-radius: var(--ddd-radius-circle);
          /* a soft disc of the pill text colour, so it fits any accent */
          --simple-icon-button-background-color: color-mix(
            in srgb,
            currentColor 12%,
            transparent
          );
          --simple-icon-button-focus-background-color: color-mix(
            in srgb,
            currentColor 24%,
            transparent
          );
          --simple-icon-button-focus-opacity: 1;
        }
        simple-icon-button-lite:focus-within {
          outline: var(--ddd-focus-ring);
          outline-offset: 1px;
        }
        :host(:focus-visible) {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
      `,
      css`
        /* shared vocabulary (DDDVocabulary): a variant gives the tag a
           meaning color; neutral is the tag as it always was. Meaning wins
           over an accent color. */
        :host(:state(variant-brand)) {
          --simple-fields-button-background-color: light-dark(
            var(--ddd-theme-default-infoLight),
            var(--ddd-theme-default-info)
          );
          --simple-fields-button-color: light-dark(
            var(--ddd-theme-default-info),
            var(--ddd-theme-default-infoLight)
          );
          --simple-fields-fieldset-border-color: transparent;
        }
        :host(:state(variant-success)) {
          --simple-fields-button-background-color: light-dark(
            var(--ddd-theme-default-successLight),
            var(--ddd-theme-default-success)
          );
          --simple-fields-button-color: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-successLight)
          );
          --simple-fields-fieldset-border-color: transparent;
        }
        :host(:state(variant-warning)) {
          --simple-fields-button-background-color: light-dark(
            var(--ddd-theme-default-warningLight),
            var(--ddd-theme-default-warning)
          );
          --simple-fields-button-color: light-dark(
            var(--ddd-theme-default-warning),
            var(--ddd-theme-default-warningLight)
          );
          --simple-fields-fieldset-border-color: transparent;
        }
        :host(:state(variant-danger)) {
          --simple-fields-button-background-color: light-dark(
            var(--ddd-theme-default-errorLight),
            var(--ddd-theme-default-error)
          );
          --simple-fields-button-color: light-dark(
            var(--ddd-theme-default-error),
            var(--ddd-theme-default-errorLight)
          );
          --simple-fields-fieldset-border-color: transparent;
        }
        :host(:state(toggled)) {
          --simple-fields-button-background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          --simple-fields-button-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-nittanyNavy)
          );
          --simple-fields-fieldset-border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        :host(:state(toggled)) span::before {
          content: "✓";
          content: "✓" / "";
          margin-inline-end: var(--ddd-spacing-1);
          font-weight: var(--ddd-font-weight-bold);
        }
      `,
    ];
  }
  static get tag() {
    return "simple-tag";
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}
globalThis.customElements.define(SimpleTag.tag, SimpleTag);
