import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "./a11y-collapse-button-styles.js";
/**
 * `a11y-collapse-icon-button`
 * An accessible expand collapse.
 * @microcopy - the mental model for this element```
  <ally-collapse-icon-button id="iconbutton" 
    expanded$="[[_setAriaExpanded(expanded)]]"
    label=""                        //The expand/collapse label. Default is "expand/collapse"
    icon=""                         //The expand/collapse icon. Default is "icons:expand-more"
    tooltip=""                      //The expand/collapse tooltip. Default is "toggle expand/collapse"
    rotated$="[[__rotateIcon]]">
  </ally-collapse-icon-button>

  <a11y-collapse-icon-button 
    accordion 
    disabled
    icon=""                         //The expand/collapse icon. Default is "icons:expand-more"
    icon-expanded=""                //The expand/collapse icon when expanded. Default is the same as when collapsed.
    label=""                        //The expand/collapse label. Default is "expand/collapse"
    label-expanded=""               //The expand/collapse label when expanded. Default is the same as when collapsed.
    tooltip=""                      //The expand/collapse tooltip. Default is "toggle expand/collapse"
    tooltip-expanded=""             //The expand/collapse tooltip when expanded. Default is the same as when collapsed.
    <p slot="heading">...</p>       //Named slot for a heading.
    ...                             //Unnamed slot for a collapsible content.
  </a11y-collapse-icon-button>

  CSS Variables: 
  --a11y-collapse-icon-button-horizontal-padding               //sets the horizontal padding (left and right) inside the a11y-collapse-icon-button
  --a11y-collapse-icon-button-vertical-padding                 //sets the horizontal padding (top and bottom) inside the a11y-collapse-icon-button
  --a11y-collapse-icon-button-border                           //sets the border style. Default is 0px solid black

  CSS Mixins: 
  --a11y-collapse-icon-button-icon-focus: { ... };             //sets CSS for the a11y-collapse-icon-button icon when button is focused or hovered
```
 * @customElement
 * @polymer
 * @see ../a11y-collapse.js
 * @see ./a11y-collapse-button-styles.js
 */
class A11yCollapseIconButton extends PolymerElement {
  static get tag() {
    return "a11y-collapse-icon-button";
  }
  static get template() {
    return html`
      <style include="a11y-collapse-button-styles">
        :host #expand:focus,
        :host #expand:hover {
          @apply --a11y-collapse-icon-focus;
        }
      </style>
      <div id="heading">
        <div id="text"><slot></slot></div>
        <paper-icon-button
          id="expand"
          alt\$="[[label]]"
          aria-controls="content"
          aria-expanded\$="[[exanded]]"
          disabled\$="[[disabled]]"
          label\$="[[label]]"
          icon\$="[[icon]]"
          rotated\$="[[rotated]]"
        >
        </paper-icon-button>
        <paper-tooltip for="expand">[[tooltip]]</paper-tooltip>
      </div>
    `;
  }
  static get properties() {
    return {
      /**
       * is disabled?
       */
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * icon when expanded
       */
      expanded: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /**
       * icon for the button
       */
      icon: {
        type: String,
        value: "icons:expand-more"
      },
      /**
       * label for the button
       */
      label: {
        type: String,
        value: "expand/collapse"
      },
      /**
       * tooltip for the button
       */
      tooltip: {
        type: String,
        value: "toggle expand/collapse"
      },
      /**
       * If no expanded icon is set, the default icon will rotate when expanded
       */
      rotated: {
        type: Boolean,
        value: false
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function() {
      this.$.expand.addEventListener("tap", this._onTap.bind(this));
    });
  }
  disconnectedCallback() {
    this.$.expand.removeEventListener("tap", this._onTap.bind(this));
    super.disconnectedCallback();
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
