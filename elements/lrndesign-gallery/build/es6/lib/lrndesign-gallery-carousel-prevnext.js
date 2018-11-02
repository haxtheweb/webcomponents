import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: inline-block;
        --lrndesign-gallery-rgba: var(--lrndesign-gallery-rgba-none) 0%, var(--lrndesign-gallery-rgba-mid) 50%, var(--lrndesign-gallery-rgba-high) 70%, var(--lrndesign-gallery-rgba-high) 100%
      }
      :host([item="-1"]) {
        display: none;
      }
      :host #lrnsysbutton {
        height: 100%;
      }
      :host #lrnsysbutton ::slotted(a) {
        width: 100%;
        height: 100%;
        top: 0;
        position: absolute;
      }
      :host #lrnsysbutton ::slotted(a > paper-button) {
        width: 100%;
        height: 100%;  
        opacity: 0;
        transition: opacity 1s;   
        color: var(--lrndesign-gallery-color);
        background-color: var(--lrndesign-gallery-background-color);
        background: linear-gradient(to left, var(--lrndesign-gallery-rgba)); 
      }
      :host([type="next"]) #lrnsysbutton ::slotted(a > paper-button) {
        background: linear-gradient(to right, var(--lrndesign-gallery-rgba));
      }
      :host #lrnsysbutton ::slotted(a > paper-button):focus, 
      :host #lrnsysbutton ::slotted(a > paper-button):hover {
        opacity: 1;
      }
      :host #lrnsysbutton ::slotted(a > paper-button > div.inner) {
        width: 100%;
        height: 100%;
        padding: 0;
      }
      :host #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {
        top: 45%;
        position: absolute;
      }
      :host([type="previous"]) #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {
        left: 10%;
      }
      :host([type="next"]) #lrnsysbutton ::slotted(a > paper-button > div.inner > iron-icon) {
        right: 10%;
      }
    </style>
    <lrnsys-button icon\$="[[chevron]]" id="lrnsysbutton" item\$="[[item]]" aria-controls\$="[[controls]]" target\$="[[target]]" title\$="[[type]]" tabindex="-1">
    </lrnsys-button>
    <iron-a11y-keys id="a11y" keys="enter" target\$="[[__button]]" on-keys-pressed="_tapped">
    </iron-a11y-keys>
`,
  is: "lrndesign-gallery-carousel-prevnext",
  hostAttributes: { tabindex: "-1" },
  listeners: { tap: "_tapped" },
  properties: {
    chevron: { type: String, computed: "_getIcon(type)" },
    theme: { type: String, value: null },
    controls: { type: String, value: null },
    item: { type: Number, value: null, reflectToAttribute: !0 },
    target: { type: Object, value: null },
    type: { type: String, value: null }
  },
  attached: function() {
    this;
  },
  ready: function() {
    this.__button = this.$.lrnsysbutton;
  },
  _getIcon: function(type) {
    return "next" == type ? "chevron-right" : "chevron-left";
  },
  _tapped: function(e) {
    e.preventDefault();
    this.fire("navTap", { item: parseInt(this.item), type: "prevnext" });
  }
});
