import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/cms-hax/cms-hax.js";
/*
`wysiwyg-hax`
Integration of wysiwyg edit form for a page with HAX.

*/
let WysiwygHax = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <textarea id\$="[[fieldId]]" name="[[fieldName]]" hidden="">
[[bodyValue]]</textarea
    >
    <cms-hax
      open-default="[[openDefault]]"
      hide-message=""
      body-offset-left="[[bodyOffsetLeft]]"
      update-page-data="[[updatePageData]]"
      end-point="[[endPoint]]"
      app-store-connection="[[appStoreConnection]]"
      hide-export-button="[[hideExportButton]]"
      align="[[align]]"
    ></cms-hax>
  `,

  is: "wysiwyg-hax",

  properties: {
    /**
     * Default the panel to open
     */
    openDefault: {
      type: Boolean,
      value: false
    },
    /**
     * Hide the export button, not a common thing to show
     * in this mode but it's possible for debugging
     */
    hideExportButton: {
      type: Boolean,
      value: true
    },
    /**
     * Direction to align the hax edit panel
     */
    align: {
      type: String,
      value: "right"
    },
    /**
     * Data binding of a hidden text area with the value from the hax-body tag
     */
    bodyValue: {
      type: String
    },
    /**
     * Connection object for talking to an app store.
     */
    appStoreConnection: {
      type: Object
    },
    /**
     * fieldId, id value on the input field.
     */
    fieldId: {
      type: String,
      value: "textarea-input-field"
    },
    /**
     * fieldName, internal to the form in whatever system it's in.
     */
    fieldName: {
      type: String,
      value: "data[content]"
    },
    /**
     * Offset from the left of the body field
     */
    bodyOffsetLeft: {
      type: Number,
      value: -22
    },
    /**
     * State of the panel
     */
    editMode: {
      type: Boolean,
      reflectToAttribute: true
    },
    /**
     * Location to save content to.
     */
    endPoint: {
      type: String
    },
    /**
     * Page data, body of text as a string.
     */
    updatePageData: {
      type: String
    },
    /**
     * Reference to activeBody.
     */
    activeHaxBody: {
      type: Object,
      observer: "_activeHaxBodyUpdated"
    },
    __imported: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Ensure we've imported our content on initial setup
   */
  _activeHaxBodyUpdated: function(newValue, oldValue) {
    // ensure we import our content once we get an initial registration of active body
    if (newValue != null && !this.__imported) {
      this.__imported = true;
      // see what's inside of this, in a template tag
      let children = this.queryEffectiveChildren("template");
      // convert this template content into the real thing
      // this helps with correctly preserving everything on the way down
      if (typeof children !== typeof undefined) {
        newValue.importContent(children.innerHTML);
        // need to dot his because of juggling unfortunately
        this.editMode = false;
        window.HaxStore.write("editMode", this.editMode, this);
        setTimeout(() => {
          this.editMode = true;
          window.HaxStore.write("editMode", this.editMode, this);
        }, 200);
      }
    }
  },
  /**
   * Created life cycle
   */
  created: function() {
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  },

  /**
   * Attached to the DOM; now we can fire event to the store that
   * we exist and are the thing being edited.
   */
  attached: function() {
    document.body.addEventListener(
      "hax-save",
      this._bodyContentUpdated.bind(this)
    );
    document.body.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    // import the text area down into the active hax body, which cms-hax is providing
  },

  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated: function(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (typeof e.detail.value === "object") {
        this.set(e.detail.property, null);
      }
      this.set(e.detail.property, e.detail.value);
    }
  },

  /**
   * Set the bubbled up event to the body value that just got changed
   */
  _bodyContentUpdated: function(e) {
    this.bodyValue = window.HaxStore.instance.activeHaxBody.haxToContent();
  }
});
export { WysiwygHax };
