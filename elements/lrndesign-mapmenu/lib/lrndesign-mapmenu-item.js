import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icon/iron-icon.js";
Polymer({
  _template: `
    <style>
      :host {
        display: block;
        --lrndesign-mapmenu-item-height: 16px;
      }
      iron-icon {
        --iron-icon-height: var(--lrndesign-mapmenu-item-height);
      }
    </style>
    <template is="dom-if" if="[[icon]]">
      <iron-icon icon="[[icon]]"></iron-icon>
    </template>
    <span id="title">[[title]]</span>
`,

  is: "lrndesign-mapmenu-item",

  properties: {
    icon: {
      type: String,
      value: ""
    },
    title: {
      type: String,
      value: ""
    },
    url: {
      type: String,
      value: ""
    },
    icon: {
      type: String,
      value: ""
    }
  }
});
