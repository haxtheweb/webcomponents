/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { navigator } from "lit-element-router";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";

/**
 * `elmsln-studio-link`
 * Navigation Link for ELMS:LN Studio
 *
 * @customElement elmsln-studio-link
 * @lit-html
 * @lit-element
 */
class ElmslnStudioLink extends navigator(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-link";
  }

  static get properties() {
    return {
      disabled: { type: Boolean, reflect: true },
      href: { type: String },
      icon: { type: String, reflect: true },
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      :host([hidden]) {
        display: none;
      }
      :host([disabled]) {
        opacity: 0.5;
        cursor: not-allowed;
      }
      :host([icon]) a {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      :host([icon]) ::slotted(*) {
        flex: 1 0 auto;
      }
      :host([icon]) simple-icon-lite {
        flex: 0 0 auto;
      }
      a,
      a:link {
        transition: var(--elmsln-studio-link-Transition);
        background: transparent;
        color: var(--elmsln-studio-link-Color);
        text-decoration: var(--elmsln-studio-link-TextDecoration);
        text-decoration-style: var(--elmsln-studio-link-TextDecorationStyle);
        text-decoration-skip: var(--elmsln-studio-link-TextDecorationSkip);
        text-decoration-skip-ink: var(
          --elmsln-studio-link-TextDecorationSkipInk
        );
        text-decoration-line: var(--elmsln-studio-link-TextDecorationLine);
        text-decoration-color: var(--elmsln-studio-link-TextDecorationColor);
        text-decoration: var(--elmsln-studio-link-TextDecoration);
        text-decoration-thickness: var(
          --elmsln-studio-link-TextDecorationThickness
        );
      }
      a:hover,
      a:focus {
        background: transparent;
        color: var(
          --elmsln-studio-link-focus-Color,
          var(--elmsln-studio-link-Color)
        );
        text-decoration: var(
          --elmsln-studio-link-focus-TextDecoration,
          var(--elmsln-studio-link-TextDecoration)
        );
        text-decoration-style: var(
          --elmsln-studio-link-focus-TextDecorationStyle,
          var(--elmsln-studio-link-TextDecorationStyle)
        );
        text-decoration-skip: var(
          --elmsln-studio-link-focus-TextDecorationSkip,
          var(--elmsln-studio-link-TextDecorationSkip)
        );
        text-decoration-skip-ink: var(
          --elmsln-studio-link-focus-TextDecorationSkipInk,
          var(--elmsln-studio-link-TextDecorationSkipInk)
        );
        text-decoration-line: var(
          --elmsln-studio-link-focus-TextDecorationLine,
          var(--elmsln-studio-link-TextDecorationLine)
        );
        text-decoration-color: var(
          --elmsln-studio-link-focus-TextDecorationColor,
          ar(--elmsln-studio-link-TextDecorationColor)
        );
        text-decoration: var(
          --elmsln-studio-link-focus-TextDecoration,
          var(--elmsln-studio-link-TextDecoration)
        );
        text-decoration-thickness: var(
          --elmsln-studio-link-focus-TextDecorationThickness,
          var(--elmsln-studio-link-TextDecorationThickness)
        );
      }
    `;
  }
  constructor() {
    super();
    this.href = "";
    this.addEventListener("click", this.linkClick);
  }
  disconnectedCallback() {
    if (super.disconnectedCallback) super.disconnectedCallback();
    this.removeEventListener("click", this.linkClick);
  }
  render() {
    return html`
      <a href="${this.href}" @click="${this.linkClick}">
        <slot name="before"></slot>
        ${!this.icon
          ? ""
          : html`
              <simple-icon-lite
                aria-hidden="true"
                icon="${this.icon}"
              ></simple-icon-lite>
            `}
        <slot></slot>
      </a>
    `;
  }
  linkClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("ElmslnStudioPath", this.href);
    if (!this.disabled) this.navigate(this.href);
  }
}
customElements.define("elmsln-studio-link", ElmslnStudioLink);
export { ElmslnStudioLink };
