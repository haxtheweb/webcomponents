import { LitElement, html } from "lit-element/lit-element.js";
import { A11yCollapseButtonStyles } from "./a11y-collapse-button-styles.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
 * `a11y-collapse-icon-button`
 * An accessible expand collapse.
 *
 * @customElement
 * @see ../a11y-collapse.js
 * @see ./a11y-collapse-button-styles.js
 */
class A11yCollapseIconButton extends LitElement {
  static get tag() {
    return "a11y-collapse-icon-button";
  }
  static get styles() {
    return [A11yCollapseButtonStyles];
  }
  render() {
    return html`
      <div id="heading">
        <div id="text"><slot></slot></div>
        <paper-icon-button
          id="expand"
          @click="${this._onTap}"
          ?disabled="${this.disabled}"
          ?rotated="${this.rotated}"
          .label="${this.label}"
          .icon="${this.icon}"
          alt="${this.label}"
          aria-controls="content"
          aria-expanded="${this.expanded ? "true" : "false"}"
        >
        </paper-icon-button>
        <paper-tooltip for="expand">${this.tooltip}</paper-tooltip>
      </div>
    `;
  }
  constructor() {
    super();
    this.disabled = false;
    this.expanded = false;
    this.icon = "icons:expand-more";
    this.label = "expand/collapse";
    this.tooltip = "toggle expand/collapse";
    this.rotated = false;
  }

  static get properties() {
    return {
      /**
       * is disabled?
       */
      disabled: {
        type: Boolean,
        reflect: true
      },
      /**
       * icon when expanded
       */
      expanded: {
        type: Boolean,
        reflect: true
      },
      /**
       * icon for the button
       */
      icon: {
        type: String
      },
      /**
       * label for the button
       */
      label: {
        type: String
      },
      /**
       * tooltip for the button
       */
      tooltip: {
        type: String
      },
      /**
       * If no expanded icon is set, the default icon will rotate when expanded
       */
      rotated: {
        type: Boolean
      }
    };
  }
  /**
   * Handle tap
   */
  _onTap(e) {
    if (!this.disabled) {
      this.dispatchEvent(
        new CustomEvent("a11y-collapse-tap", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: this
        })
      );
    }
  }
}
window.customElements.define(
  A11yCollapseIconButton.tag,
  A11yCollapseIconButton
);
export { A11yCollapseIconButton };
