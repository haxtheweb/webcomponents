/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

/**
 * `lrndesign-sidenote`
 * A note set apart from the surrounding content: an optional icon and label
 * above the slotted content, tinted by the accent color.
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
      css`
        :host {
          display: block;
        }

        #container {
          display: block;
          box-sizing: border-box;
          background-color: var(
            --simple-colors-default-theme-accent-1,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-coalyGray)
            )
          );
          color: var(
            --simple-colors-default-theme-accent-12,
            light-dark(
              var(--ddd-theme-default-coalyGray),
              var(--ddd-theme-default-white)
            )
          );
          border-inline-start: var(--ddd-border-size-lg) solid
            var(--simple-colors-default-theme-accent-7, currentColor);
          border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-primary);
          padding: var(
            --lrndesign-sidenote-container-padding,
            var(--ddd-spacing-4)
          );
          margin-left: var(--lrndesign-sidenote-container-margin-left, 0px);
        }

        #header {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin-bottom: var(--ddd-spacing-2);
        }

        #icon {
          flex: 0 0 auto;
          --simple-icon-height: var(--ddd-icon-xs);
          --simple-icon-width: var(--ddd-icon-xs);
        }

        #label {
          flex: 1 1 auto;
          font-size: var(
            --lrndesign-sidenote-label-font-size,
            var(--ddd-font-size-ms)
          );
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
        }

        #content {
          display: block;
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
        part="container"
        role="${ifDefined(hasLabel ? "note" : undefined)}"
        aria-labelledby="${ifDefined(hasLabel ? "label" : undefined)}"
      >
        ${hasLabel || icon
          ? html`<div id="header">
              ${icon
                ? html`<simple-icon
                    id="icon"
                    icon="${icon}"
                    aria-hidden="true"
                  ></simple-icon>`
                : ""}
              ${hasLabel ? html`<div id="label">${this.label}</div>` : ""}
            </div>`
          : ""}
        <div id="content"><slot></slot></div>
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
