/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { DDDBlockStyles } from "@haxtheweb/d-d-d/lib/DDDBlock.js";

/**
 * `lrndesign-sidenote`
 * A note set apart from the surrounding content: an optional icon and label
 * in a tinted header bar above the slotted content.
 *
 * Content written for the original element keeps working: `label`, `icon`
 * (with or without the `icons:` iconset prefix), `accent-color`, `dark`, and
 * the `--lrndesign-sidenote-container-padding`,
 * `--lrndesign-sidenote-container-margin-left` and
 * `--simple-colors-default-theme-accent-1` overrides.
 *
 * Accessibility: when there is a label the note is exposed as a `note` named
 * by that label; the icon is decorative and hidden from assistive technology. The label is text, not a heading, because the
 * right heading level depends on where the note is placed.
 *
 * Server rendering: the first render only depends on the properties and the
 * slotted content, so the label, icon and content are all in the server HTML.
 *
 * @demo demo/index.html
 * @element lrndesign-sidenote
 * @slot - Content of the note
 * @csspart container - The box around the header and content
 * @cssprop --lrndesign-sidenote-container-padding - Padding inside the box
 * @cssprop --lrndesign-sidenote-container-margin-left - Left margin of the box
 * @cssprop --lrndesign-sidenote-label-font-size - Font size of the label
 */
export class LrndesignSidenote extends DDD {
  static get tag() {
    return "lrndesign-sidenote";
  }

  constructor() {
    super();
    this.typeof = "oer:SupportingMaterial";
    /**
     * Label shown above the content
     */
    this.label = "";
    /**
     * Icon shown beside the label, such as `icons:bookmark`. A name without
     * an iconset is looked up in the `icons` iconset.
     */
    this.icon = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected so it is also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      label: { type: String },
      icon: { type: String },
    };
  }

  /**
   * The icon with an iconset, since content from the original element often
   * has the bare name (`bookmark`).
   * @returns {String}
   */
  get iconName() {
    const icon = (this.icon || "").trim();
    if (!icon) {
      return "";
    }
    return icon.includes(":") ? icon : `icons:${icon}`;
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
        }

        #container {
          display: block;
          /* the note sits on white in light mode; dark mode stays on the
             page colour */
          --ddd-block-background: light-dark(
            var(--ddd-theme-default-white),
            transparent
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          /* an authored padding still pads the whole box as it always did */
          padding: var(--lrndesign-sidenote-container-padding, 0);
          margin-inline-start: var(
            --lrndesign-sidenote-container-margin-left,
            0px
          );
        }
        /* an authored accent colour still colours the icon chip */
        :host([accent-color]:not([accent-color="grey"])) #container {
          --ddd-block-chip-background: var(
            --simple-colors-default-theme-accent-7
          );
          --ddd-block-chip-color: var(--simple-colors-default-theme-accent-1);
        }
        #header {
          /* a slim bar: a note has no header actions to size for */
          min-height: 0;
          padding-inline: var(--ddd-spacing-4);
          /* the header bar tees up the note in light blue; dark mode
             keeps a dark bar so the label stays legible */
          background-color: light-dark(
            var(--ddd-theme-default-skyMaxLight),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        /* an authored tint (bg-color writes the accent-1 override inline,
           or an accent-color) colours the header bar instead. SimpleColors
           always defines accent-1, so only an authored one is used. */
        :host([style*="--simple-colors-default-theme-accent-1"]) #header,
        :host([accent-color]:not([accent-color="grey"])) #header {
          background-color: light-dark(
            var(--simple-colors-default-theme-accent-1),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        #label {
          flex: 1 1 auto;
          min-width: 0;
          font-size: var(
            --lrndesign-sidenote-label-font-size,
            var(--ddd-font-size-4xs)
          );
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        #content {
          display: block;
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-spacing-4);
        }
        #content ::slotted(*:first-child) {
          margin-top: 0;
        }
        #content ::slotted(*:last-child) {
          margin-bottom: 0;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    const hasLabel = Boolean(this.label);
    const icon = this.iconName;
    return html`
      <div
        id="container"
        class="ddd-block"
        part="container"
        role="${ifDefined(hasLabel ? "note" : undefined)}"
        aria-labelledby="${ifDefined(hasLabel ? "label" : undefined)}"
      >
        ${
          hasLabel || icon
            ? html`<div id="header" class="ddd-block-header">
                ${
                  icon
                    ? html`<span
                        id="icon"
                        class="ddd-block-chip"
                        aria-hidden="true"
                        ><simple-icon
                          icon="${icon}"
                          aria-hidden="true"
                        ></simple-icon
                      ></span>`
                    : ""
                }
                ${
                  hasLabel
                    ? html`<div
                        id="label"
                        class="ddd-block-label"
                        property="oer:name"
                      >
                        ${this.label}
                      </div>`
                    : ""
                }
              </div>`
            : ""
        }
        <div id="content" class="ddd-block-body"><slot></slot></div>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LrndesignSidenote.tag, LrndesignSidenote);
