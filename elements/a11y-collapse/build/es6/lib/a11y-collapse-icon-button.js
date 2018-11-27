import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "../node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "../node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "../node_modules/@polymer/iron-icons/iron-icons.js";
import "./a11y-collapse-button-styles.js";
import "../node_modules/@polymer/paper-tooltip/paper-tooltip.js";
Polymer({
  _template: html`
    <style include="a11y-collapse-button-styles">
      :host #expand:focus,
      :host #expand:hover {
        @apply --a11y-collapse-icon-focus;
      }
    </style>
    <div id="heading">
      <div id="text"><slot></slot></div>
      <paper-icon-button id="expand" alt\$="[[label]]" aria-controls="content" aria-expanded\$="[[exanded]]" disabled\$="[[disabled]]" label\$="[[label]]" icon\$="[[icon]]" rotated\$="[[rotated]]">
      </paper-icon-button>
      <paper-tooltip for="expand">[[tooltip]]</paper-tooltip>
    </div>
`,
  is: "a11y-collapse-icon-button",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
    disabled: { type: Boolean, value: !1, reflectToAttribute: !0 },
    expanded: { type: Boolean, value: !1, reflectToAttribute: !0 },
    icon: { type: String, value: "icons:expand-more" },
    label: { type: String, value: "expand/collapse" },
    tooltip: { type: String, value: "toggle expand/collapse" },
    rotated: { type: Boolean, value: !1 }
  },
  ready: function() {
    let root = this;
    this.$.expand.addEventListener("tap", function(e) {
      root._onTap(e);
    });
  },
  detached: function() {
    this.$.expand.removeEventListener("tap");
  },
  _onTap: function(e) {
    if (!this.disabled) {
      this.fire("a11y-collapse-tap", this);
    }
  }
});
