import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "./a11y-collapse-button-styles.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
`a11y-collapse-accordion-button`
An accessible expand collapse.

* @demo demo/index.html

@microcopy - the mental model for this element

  <a11y-collapse-accordion-button 
    disabled
    icon=""                         //The expand/collapse icon. Default is "icons:expand-more"
    label=""                        //The expand/collapse label. Default is "expand/collapse"
    tooltip=""                      //The expand/collapse tooltip. Default is "toggle expand/collapse"
    <p slot="heading">...</p>       //Named slot for a heading.
    ...                             //Unnamed slot for a collapsible content.
  </a11y-collapse-accordion-button>

  CSS Variables: 
  --a11y-collapse-accordion-button-horizontal-padding               //sets the horizontal padding (left and right) inside the a11y-collapse-accordion-button
  --a11y-collapse-accordion-button-vertical-padding                 //sets the horizontal padding (top and bottom) inside the a11y-collapse-accordion-button
  --a11y-collapse-accordion-button-border                           //sets the border style. Default is 0px solid black

  CSS Mixins: 
  --a11y-collapse-icon-button-icon-focus: { ... };             //sets CSS for the a11y-collapse-icon-button icon when button is focused or hovered
  --a11y-collapse-heading-focus: { ... };                      //sets CSS for the a11y-collapse heading when focused or hovered
  --a11y-collapse-heading-text-focus: { ... };                 //sets CSS for the a11y-collapse heading text when focused or hovered


*/
Polymer({
  _template: html`
    <style include="a11y-collapse-button-styles">
      :host #heading:focus,
      :host #heading:hover {
        @apply --a11y-collapse-heading-focus;
      }
      :host #heading:focus #text,
      :host #heading:hover #text {
        @apply --a11y-collapse-heading-text-focus;
      }
      :host #heading:focus #expand,
      :host #heading:hover #expand {
        @apply --a11y-collapse-icon-focus;
      }
    </style>
    <div
      id="heading"
      aria-controls="content"
      aria-expanded\$="[[expanded]]"
      disabled\$="[[disabled]]"
      label\$="[[label]]"
      role="button"
    >
      <div id="text"><slot></slot></div>
      <iron-icon
        id="expand"
        aria-hidden="true"
        icon\$="[[icon]]"
        rotated\$="[[rotated]]"
      >
      </iron-icon>
    </div>
    <paper-tooltip for="heading">[[tooltip]]</paper-tooltip>
  `,

  is: "a11y-collapse-accordion-button",
  listeners: {
    tap: "_onTap"
  },
  properties: {
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
  },

  /**
   * Handle tap
   */
  _onTap: function(e) {
    if (!this.disabled) {
      this.fire("a11y-collapse-tap", this);
    }
  }
});
