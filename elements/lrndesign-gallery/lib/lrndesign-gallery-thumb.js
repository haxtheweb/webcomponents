import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
/**
`lrndesign-gallery-thumb`
A LRN element that renders a thumbnail button for the gallery.

@demo demo/index.html

@microcopy - the mental model for this element
  <lrndesign-gallery-thumb
    alt = "ALT TEXT HERE"                 //required
    controls = "GALLERY-OR-DIALOG-ID"     //required
    item = "ITEM-ID"                      //required
    roundedEdges = "FALSE"                //optional, default is rounded
    src = "PATH/TO/THUMBNAIL_IMG.JPG"     //required
    target = "GALLERY OR DIALOG OBJECT">   //required
  </lrndesign-gallery-thumb>
*/
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

  listeners: {
    tap: "_tapped"
  },

  properties: {
    /**
     * gallery item's alt text
     */
    alt: {
      type: String,
      value: null
    },
    /**
     * thumbnail button
     */
    button: {
      type: Object,
      value: null
    },
    /**
     * id of the thumbnail button target
     */
    controls: {
      type: String,
      value: null
    },
    /**
     * aspect ratio of media
     */
    imageStyle: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /**
     * gallery item's id
     */
    item: {
      type: String,
      value: null
    },
    /**
     * round the edges of the thumbnail?
     */
    roundedEdges: {
      type: Boolean,
      value: true
    },
    /**
     * target for the thumbnail button
     */
    target: {
      type: Object,
      value: null
    },
    /**
     * path for the thumbnail image
     */
    thumbnail: {
      type: String,
      value: null
    }
  },

  /**
   * set iron-a11y-keys target to this
   */
  ready: function() {
    this.button = this.$.lrnsysbutton;
  },

  /**
   * fire navigation tapped event
   */
  _tapped: function(e) {
    e.preventDefault();
    this.fire("navTap", { item: this.item, type: "thumbnail" });
  }
});
