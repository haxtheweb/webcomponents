import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@polymer/iron-meta/iron-meta.js";
import "./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js";
import "./node_modules/@lrnwebcomponents/lrn-shared-styles/lrn-shared-styles.js";
let LrnIcon = Polymer({
  _template: html`
    <style include="lrn-shared-styles">
      :host {
        position: relative;

        vertical-align: middle;

        fill: var(--lrn-icon-fill-color, currentcolor);
        stroke: var(--lrn-icon-stroke-color, none);

        width: var(--lrn-icon-width, 24px);
        height: var(--lrn-icon-height, 24px);
        @apply --layout-inline;
        @apply --layout-center-center;
        @apply --lrn-icon;
      }
    </style>
    <iron-icon icon$="[[icon]]"></iron-icon>
`,
  is: "lrn-icon",
  properties: {
    icon: { type: String },
    theme: { type: String },
    src: { type: String },
    _meta: { value: document.createElement("iron-meta", { type: "iconset" }) }
  },
  observers: [
    "_updateIcon(_meta, isAttached)",
    "_updateIcon(theme, isAttached)",
    "_srcChanged(src, isAttached)",
    "_iconChanged(icon, isAttached)"
  ],
  _DEFAULT_ICONSET: "lrn",
  _iconChanged: function(icon) {
    this._iconName = icon;
    this._iconsetName = this._DEFAULT_ICONSET;
    this._updateIcon();
  },
  _srcChanged: function(src) {
    this._updateIcon();
  },
  _usesIconset: function() {
    return this.icon || !this.src;
  },
  _updateIcon: function() {
    if (this._usesIconset()) {
      if (this._img && this._img.parentNode) {
        dom(this.root).removeChild(this._img);
      }
      if ("" === this._iconName) {
        if (this._iconset) {
          this._iconset.removeIcon(this);
        }
      } else if (this._iconsetName && this._meta) {
        this._iconset = this._meta.byKey(this._iconsetName);
        if (this._iconset) {
          this._iconset.applyIcon(this, this._iconName, this.theme);
          this.unlisten(window, "lrn-iconset-added", "_updateIcon");
        } else {
          this.listen(window, "lrn-iconset-added", "_updateIcon");
        }
      }
    } else {
      if (this._iconset) {
        this._iconset.removeIcon(this);
      }
      if (!this._img) {
        this._img = document.createElement("img");
        this._img.style.width = "100%";
        this._img.style.height = "100%";
        this._img.draggable = !1;
      }
      this._img.src = this.src;
      dom(this.root).appendChild(this._img);
    }
  }
});
export { LrnIcon };
