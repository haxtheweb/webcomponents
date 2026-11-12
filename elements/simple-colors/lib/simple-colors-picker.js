/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, css } from "lit";
import { SimpleColorsSuper } from "../simple-colors.js";
import { SimplePickerBehaviors } from "@haxtheweb/simple-picker/simple-picker.js";

/**
 * `simple-colors-picker`
 * a select element for changing `simple-colors` attributes in demos
 *
### Styling
See demo of "all of the colors" (`demo/colors.html`) for styling.
* 
 * @extends SimpleColors
 * @demo ./demo/picker.html demo
 * @see "../simple-colors.js"
 * @see "./demo/simple-colors-picker-demo.js"
 * @element simple-colors-picker
 */
class SimpleColorsPicker extends SimplePickerBehaviors(
  SimpleColorsSuper(LitElement),
) {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          --simple-picker-options-background-color: var(
            --simple-fields-select-option-background-color,
            light-dark(
              var(--ddd-theme-default-white, #ffffff),
              var(--ddd-theme-default-coalyGray, #262626)
            )
          );
          --simple-picker-option-selected-background-color: var(
            --simple-fields-select-option-selected-background-color,
            light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.2))
          );
          --simple-picker-option-active-background-color: var(
            --simple-fields-select-option-selected-background-color,
            light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.2))
          );
          --simple-picker-option-active-color: var(
            --simple-fields-color,
            currentColor
          );
        }
        :host([hidden]) {
          display: none;
        }
        .row {
          width: 100%;
        }
        /* Ubuntu-style color swatches (issue #2996, Phase 4): options and
           the sample render as small circular swatches instead of the
           oversized default. Scoped to simple-colors-picker only so other
           simple-picker consumers (icon/emoji pickers) are unaffected.
           Circular clipping is scoped to [hide-option-labels] (shades
           mode, where each option is a solid color swatch with no
           visible text) so accent-name rows -- which show text labels
           and no per-option background -- are not clipped into an oval/
           circle outline when the menu is expanded. */
        :host {
          --simple-picker-option-size: var(
            --simple-fields-color-swatch-size,
            20px
          );
          --simple-picker-sample-padding: 2px;
        }
        simple-picker-option[hide-option-labels],
        #sample simple-picker-option[hide-option-labels] {
          border-radius: 50%;
          overflow: hidden;
        }
        /* HAX UI field: the same 40px bordered control, list and focus
           ring as every other HAX dropdown. Named accents (the default,
           not shades) also draw a swatch of each color before its name.
           Each value falls back to DDD so the picker reads the same
           outside the admin (the HAX editor's property fields). */
        :host(:not([shades])) {
          display: inline-flex;
          min-width: var(--simple-colors-picker-min-width, 200px);
          --simple-picker-option-size: 30px;
          --simple-picker-sample-padding: 4px;
          --simple-picker-border-width: 1px;
          --simple-picker-border-radius: var(
            --hax-ui-radius,
            var(--ddd-radius-sm, 4px)
          );
          --simple-picker-border-color: var(
            --hax-ui-line-strong,
            light-dark(
              var(--ddd-theme-default-limestoneGray, #a2aaad),
              rgba(255, 255, 255, 0.28)
            )
          );
          --simple-picker-focus-border-color: var(--simple-picker-border-color);
          --simple-picker-background-color: var(
            --hax-ui-surface,
            light-dark(
              var(--ddd-theme-default-white, #ffffff),
              var(--ddd-theme-default-coalyGray, #262626)
            )
          );
          --simple-picker-options-background-color: var(
            --simple-picker-background-color
          );
          --simple-picker-color: var(
            --hax-ui-text,
            light-dark(
              var(--ddd-theme-default-coalyGray, #262626),
              var(--ddd-theme-default-limestoneLight, #e4e5e7)
            )
          );
          --simple-picker-color-active: var(--simple-picker-color);
          --simple-picker-sample-color: var(--simple-picker-color);
          --simple-picker-option-active-color: var(--simple-picker-color);
          --simple-picker-option-active-background-color: var(
            --hax-ui-hover,
            light-dark(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0.08))
          );
          --simple-picker-option-selected-background-color: var(
            --hax-ui-selected,
            light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.16))
          );
          --simple-picker-option-padding: 0 var(--ddd-spacing-2, 8px);
          --simple-picker-options-max-height: 280px;
          font-family: var(
            --hax-ui-admin-font-family,
            var(--ddd-font-navigation, sans-serif)
          );
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        :host(:not([shades])) #listbox {
          flex: 1 1 auto;
          border: 0;
          border-radius: var(--simple-picker-border-radius);
        }
        :host(:not([shades])) #sample {
          padding-inline: var(--ddd-spacing-2, 8px);
        }
        :host(:not([shades])) #listbox:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid
            var(
              --hax-ui-focus,
              var(--ddd-theme-default-keystoneYellow, #ffd100)
            );
          outline-offset: 2px;
        }
        :host(:not([shades])) #collapse {
          left: 0;
          right: 0;
          top: calc(100% + 4px);
        }
        :host(:not([shades])) .rows {
          padding: 4px;
          border: 1px solid var(--simple-picker-border-color);
          border-radius: var(--simple-picker-border-radius);
          box-shadow: var(
            --hax-ui-shadow,
            0 4px 12px light-dark(rgba(0, 0, 0, 0.16), rgba(0, 0, 0, 0.5))
          );
        }
        /* the virtual scroller is sized to the closed control by default;
           give the named list (always 15+ colors) its own scrolling
           height */
        :host(:not([shades])) .rows lit-virtualizer {
          height: var(--simple-colors-picker-list-height, 272px);
          min-height: 0;
          max-height: none;
        }
        :host(:not([shades])) .rows simple-picker-option {
          border-radius: calc(var(--simple-picker-border-radius) - 1px);
        }
        :host(:not([shades])) simple-picker-option::before {
          content: "";
          flex: none;
          box-sizing: border-box;
          width: 18px;
          height: 18px;
          margin-inline-start: var(--ddd-spacing-1, 4px);
          border-radius: 50%;
          border: 1px solid var(--simple-picker-border-color);
          background: var(--simple-colors-picker-swatch, transparent);
        }
        :host(:not([shades])) #sample simple-picker-option::before {
          margin-inline-start: 0;
        }
        :host(:not([shades])) #sample simple-picker-option {
          --simple-picker-option-label-padding: 0 0 0 var(--ddd-spacing-2, 8px);
        }
        :host(:not([shades])) #icon {
          color: var(--hax-ui-text-muted, currentColor);
        }
      `,
    ];
  }
  constructor() {
    super();
    this.allowNull = true;
    this.shades = false;
    this.options = this._getOptions(this.colors, this.shades, this.dark);
  }

  willUpdate(changedProperties) {
    // Derive options/hideOptionLabels in willUpdate so reactive sets batch
    // into the current update cycle. Setting them in updated() scheduled a
    // redundant second update (Lit change-in-update warning).
    // This runs BEFORE super.willUpdate so simple-picker sees the new
    // options in this cycle's changes and builds its option list from them;
    // after it, the list stayed empty (blank dropdown, "false" label).
    if (
      changedProperties.has("colors") ||
      changedProperties.has("shades") ||
      changedProperties.has("dark")
    ) {
      this.options = this._getOptions(this.colors, this.shades, this.dark);
    }
    if (changedProperties.has("shades")) {
      this.hideOptionLabels = this.shades;
    }
    if (super.willUpdate) super.willUpdate(changedProperties);
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (this.__ready !== undefined) this._fireChangeEvent();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Show all shades instead of just main accent-colors
       */
      shades: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-colors-picker";
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.__ready = true;
  }

  /**
   * gets options for the selectors
   *
   * @param {object} the options object to convert
   */
  _getOptions(colors, shades, dark) {
    let options = [],
      theme = dark !== false ? "dark" : "default";
    if (shades === false) {
      // value stays the accent name; the label reads as words ("Deep
      // purple") and a swatch of the color is drawn before it
      options = Object.keys(this.colors).map((key) => {
        return [
          {
            alt: this._readableName(key),
            value: key,
            style: `--simple-colors-picker-swatch: var(--simple-colors-default-theme-${key}-7)`,
          },
        ];
      });
      options.unshift([
        {
          alt: this._readableName("none"),
          value: null,
          style:
            // the slash is the text color unless a theme sets
            // --simple-colors-picker-none-color
            "--simple-colors-picker-swatch: linear-gradient(135deg, transparent calc(50% - 1px), var(--simple-colors-picker-none-color, currentColor) calc(50% - 1px), var(--simple-colors-picker-none-color, currentColor) calc(50% + 1px), transparent calc(50% + 1px))",
        },
      ]);
    } else {
      let colorNames = Object.keys(colors);
      for (let i = 0; i < colors[colorNames[0]].length; i++) {
        let shade = Object.keys(colors).map((key) => {
          let name = key + "-" + (i + 1),
            cssvar = "--simple-colors-" + theme + "-theme-" + name;
          return {
            alt: name,
            style: "background-color: var(" + cssvar + ")",
            value: cssvar,
          };
        });
        options.push(shade);
      }
    }
    return options;
  }

  /** "deep-purple" reads as "Deep purple" */
  _readableName(key) {
    const words = String(key).split("-").join(" ");
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  /**
   * Fires with any property change.
   *
   * @event change
   */
  _fireChangeEvent() {
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, detail: this }),
    );
  }
}

export { SimpleColorsPicker };

globalThis.customElements.define(SimpleColorsPicker.tag, SimpleColorsPicker);
