import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "./lrndesign-gallery-zoom.js";
Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        width: 100%;
      }
      :host #gallery-item {
        width: 100%;
        color: var(--lrndesign-gallery-color);
        background-color: var(--lrndesign-gallery-background-color);
        border: 1px solid var(--lrndesign-gallery-border-color);
      }
      :host(:not([responsive-size="xs"]):not([extra-wide])) #gallery-item {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        border-top: 4px solid var(--lrndesign-gallery-focus-color);
      }
      :host #gallery-image {
        position: relative;
      }
      :host #gallery-image iron-image {
        width: 100%;
        height: 100%;
      }
      :host #prevnext {
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
      }
      :host([responsive-size="sm"]:not([extra-wide]))  #gallery-item, 
      :host([responsive-size="sm"]:not([extra-wide])) #prevnext,
      :host([responsive-size="md"]:not([extra-wide])) #gallery-item, 
      :host([responsive-size="md"]:not([extra-wide])) #prevnext{
        height: 200px;
        max-height: 200px;
      }
      :host([responsive-size="lg"]:not([extra-wide])) #gallery-item, 
      :host([responsive-size="lg"]:not([extra-wide])) #prevnext{
        height: 300px;
        max-height: 300px;
      }
      :host([responsive-size="xl"]:not([extra-wide])) #gallery-item, 
      :host([responsive-size="xl"]:not([extra-wide])) #prevnext{
        height: 400px;
        max-height: 400px;
      }
      :host lrndesign-gallery-zoom {
        left: 0;
        bottom: 0px;
        z-index: 2; 
        position: absolute;
      }
      :host #details {
        flex-grow: 1;
        flex-shrink: 1;
        overflow-y: scroll;
      }
      :host([responsive-size="xs"]) #details,
      :host([extra-wide]) #details {
        margin-top: -4px;
        border-top: 4px solid var(--lrndesign-gallery-focus-color);
      }
      :host #details-inner {
        height: 100%;
        display: flex;
        position: relative;
        justify-content: space-between;
        flex-wrap: wrap;
        align-items: stretch;
        align-content: stretch;
      }
      :host #itemdetails, 
      :host #thumbnails {
        padding: 20px;
        flex-basis: 100%;
      }
      :host #itemdetails {
        align-self: flex-start;
        flex-grow: 1;
        flex-shrink: 1;
        overflow: scroll;
      }
      :host #itemtitle {
        margin-top: 0;
      }
      :host #thumbnails {
        align-self: flex-end;
      }
    </style>
    <div id="gallery-item">
      <slot name="xy-start"></slot>
      <div id="gallery-image">
        <iron-image alt\$="[[item.alt]]" fade="" id\$="[[item.id]]" placeholder\$="[[item.thumbnail]]" sizing\$="[[item.sizing]]" src\$="[[item.src]]" style\$="[[imageStyle]]">
        </iron-image>
        <lrndesign-gallery-zoom dark\$="[[dark]]" details\$="[[item.details]]" heading\$="[[item.heading]]" hidden\$="[[!item.zoom]]" icon="zoom-in" id="gallery-zoom" item-id="[[item.id]]" src\$="[[item.large]]" tooltip\$="[[item.tooltip]]" zoom-alt\$="[[item.alt]]">
        </lrndesign-gallery-zoom>
        <div id="prevnext">
          <slot name="prevnextnav"></slot>
        </div>
      </div>
      <div id="details" class="item-info">
        <div id="details-inner">
          <div id="itemdetails">
            <h2 id="itemtitle" hidden="[[!_isAttrSet(item.title)]]">[[item.title]]</h2>
            <div id="itembody"></div>
          </div>
          <slot id="xyend" name="xy-end"></slot>
          <div id="thumbnails" class="item-info">
            <div id="thumbnails-inner">
              <slot name="thumbnails"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
`,
  is: "lrndesign-gallery-carousel-item",
  properties: {
    dark: { type: Boolean, value: !1 },
    imageStyle: { type: String, value: null },
    item: {
      type: Object,
      value: {},
      notify: !0,
      reflectToAttribute: !0,
      observer: "_updateDetails"
    },
    responsiveSize: { type: String, value: "xs", reflectToAttribute: !0 },
    theme: { type: String, value: "default" }
  },
  _updateDetails: function() {
    this.$.itembody.innerHTML = this.item.details;
  },
  _getIndex: function(index, step) {
    return index + step;
  },
  _isAttrSet: function(attr) {
    return null !== attr && attr !== void 0;
  }
});
