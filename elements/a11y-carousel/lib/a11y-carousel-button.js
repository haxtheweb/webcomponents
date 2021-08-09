import { LitElement, html, css } from "lit";
/**
 * `a11y-carousel-button`
 * button that controls a carousel
 * @demo demo/index.html
 * @element a11y-carousel-button
 */
class a11yCarouselButton extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: inline;
          background-color: transparent;
          border: 1px solid black;
          padding: 2px 5px;
          margin: 15px 2px;
          text-align: center;
        }
        :host([hidden]) {
          display: none !important;
        }
        :host([disabled]) {
          opacity: 0.5;
        }
        @media print {
          :host {
            display: none !important;
          }
        }
      `,
    ];
  }
  render() {
    return html` <slot></slot> `;
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      active: {
        type: Boolean,
        attribute: "active",
        reflect: true,
      },
      buttonType: {
        type: String,
        attribute: "button-type",
        reflect: true,
      },
      controls: {
        type: String,
        attribute: "controls",
        reflect: true,
      },
      disabled: {
        type: Boolean,
        attribute: "disabled",
        reflect: true,
      },
      hidden: {
        type: Boolean,
        attribute: "hidden",
        reflect: true,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-carousel-button";
  }
  constructor() {
    super();
    this.tabindex = 0;
    this.setAttribute("role", "button");
    this.setAttribute("tabindex", 0);
    this.addEventListener("click", this._handleClick);
    this.addEventListener("keydown", this._handleClick);
    this.active = false;
    this.hidden = false;
    this.disabled = false;
  }
  disconnectedCallback() {
    this.removeEventListener("click", this._handleClick);
    this.removeEventListener("keydown", this._handleClick);
    if (super.disconnectedCallback) super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (["controls", "active"].includes(propName))
        this.disabled = !this.controls || this.active;
    });
  }

  /**
   * Fires when clicked.
   *
   * @event select-carousel-item
   */
  _handleClick(e) {
    if (
      e.type !== "keydown" ||
      e.key === " " ||
      e.key === "Enter" ||
      e.key === "Spacebar"
    ) {
      if (!this.disabled) {
        e.preventDefault();
        this.dispatchEvent(
          new CustomEvent("select-carousel-item", {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: this,
          })
        );
      }
    }
  }
}
window.customElements.define(a11yCarouselButton.tag, a11yCarouselButton);
export { a11yCarouselButton };
