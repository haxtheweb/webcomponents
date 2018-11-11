import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./a11y-collapse-button-styles.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
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
    <div id="heading" aria-controls="content" aria-expanded\$="[[expanded]]" disabled\$="[[disabled]]" label\$="[[label]]" role="button">
      <div id="text"><slot></slot></div>
      <iron-icon id="expand" aria-hidden="true" icon\$="[[icon]]" rotated\$="[[rotated]]">
      </iron-icon>
    </div>
    <paper-tooltip for="heading">[[tooltip]]</paper-tooltip>
`,
  is: "a11y-collapse-accordion-button",
  listeners: { tap: "_onTap" },
  properties: {
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    expanded: { type: Boolean, value: !1, reflectToAttribute: !0 },
    icon: { type: String, value: "icons:expand-more" },
    label: { type: String, value: "expand/collapse" },
    tooltip: { type: String, value: "toggle expand/collapse" },
    rotated: { type: Boolean, value: !1 }
  },
  _onTap: function() {
    if (!this.disabled) {
      console.log(this);
      this.fire("a11y-collapse-tap", this);
    }
  }
});
