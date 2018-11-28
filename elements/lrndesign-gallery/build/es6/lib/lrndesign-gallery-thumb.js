import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
        transform: none !important;
        position: static !important;
        margin: 0px 2px 2px 0px;
        padding: 2px;
      }
      :host > paper-button {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
        min-width: unset;
      }
      :host iron-image {
        width: 100%;
        height: 100%;
      }
      :host > paper-button:focus iron-image,
      :host > paper-button:hover iron-image{
        opacity: 0.7;
        outline: 2px solid var(--lrndesign-gallery-focus-color);
      }
    </style>
    <paper-button id="lrnsysbutton" item\$="[[item]]" aria-controls\$="[[controls]]" target\$="[[target]]" title\$="[[alt]]" tabindex="-1">
      <iron-image alt\$="[[alt]]" class="lrndesign-gallery-thumb-image" fade="" sizing="cover" src\$="[[thumbnail]]" style\$="[[imageStyle]]">
      </iron-image>
    </paper-button>
    <iron-a11y-keys id="a11y" keys="enter" target\$="[[button]]" on-keys-pressed="_tapped">
    </iron-a11y-keys>
`,
  is: "lrndesign-gallery-thumb",
  listeners: { tap: "_tapped" },
  properties: {
    alt: { type: String, value: null },
    button: { type: Object, value: null },
    controls: { type: String, value: null },
    imageStyle: { type: String, value: null, reflectToAttribute: !0 },
    item: { type: String, value: null },
    roundedEdges: { type: Boolean, value: !0 },
    target: { type: Object, value: null },
    thumbnail: { type: String, value: null }
  },
  ready: function() {
    this.button = this.$.lrnsysbutton;
  },
  _tapped: function(e) {
    e.preventDefault();
    this.fire("navTap", { item: this.item, type: "thumbnail" });
  }
});
