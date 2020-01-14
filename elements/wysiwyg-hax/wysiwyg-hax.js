import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/cms-hax/cms-hax.js";
/**
 * `wysiwyg-hax`
 * `Integration of wysiwyg edit form for a page with HAX.`
 * @demo demo/index.html
 * @customElement wysiwyg-hax
 */
class WysiwygHax extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `
    ];
  }
  render() {
    return html`
      <textarea
        class="${this.fieldClass}"
        id="${this.fieldId}"
        name="${this.fieldName}"
        hidden=""
      >
      ${this.bodyValue}
      </textarea
      >
      <cms-hax
        hide-message=""
        redirect-location="${this.redirectLocation}"
        update-page-data="${this.updatePageData}"
        end-point="${this.endPoint}"
        app-store-connection="${this.appStoreConnection}"
        ?open-default="${this.openDefault}"
        ?sync-body="${this.syncBody}"
        ?hide-export-button="${this.hideExportButton}"
        ?hide-panel-ops="${this.hidePanelOps}"
        ?hide-preferences-button="${this.hidePreferencesButton}"
        align="${this.align}"
      >
      </cms-hax>
    `;
  }

  static get tag() {
    return "wysiwyg-hax";
  }
  constructor() {
    super();
    // import child nodes before things start deleting whats in there
    let children = this.querySelector("template");
    if (children) {
      this.__importContent = children.innerHTML;
    }
    this.openDefault = false;
    this.hideExportButton = false;
    this.align = "right";
    this.fieldId = "textarea-input-field";
    this.fieldName = "data[content]";
    this.__imported = false;
    this.redirectLocation = "";
    this.updatePageData = "";
    window.addEventListener("hax-save", this._bodyContentUpdated.bind(this));
    window.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeHaxBody") {
        this._activeHaxBodyUpdated(this[propName]);
      }
    });
  }
  static get properties() {
    return {
      /**
       * Default the panel to open
       */
      openDefault: {
        type: Boolean,
        attribute: "open-default"
      },
      redirectLocation: {
        type: String,
        attribute: "redirect-location"
      },
      hideExportButton: {
        type: Boolean,
        attribute: "hide-export-button"
      },
      /**
       * Hide the panel operations (save and cancel),
       */
      hidePanelOps: {
        type: Boolean,
        attribute: "hide-panel-ops"
      },
      /**
       * Hide preferences button
       */
      hidePreferencesButton: {
        type: Boolean,
        attribute: "hide-preferences-button"
      },
      /**
       * Direction to align the hax edit panel
       */
      align: {
        type: String
      },
      /**
       * Data binding of a hidden text area with the value from the hax-body tag
       */
      bodyValue: {
        type: String,
        attribute: "body-value"
      },
      /**
       * Connection object for talking to an app store.
       */
      appStoreConnection: {
        type: String,
        attribute: "app-store-connection"
      },
      /**
       * class on the field
       */
      fieldClass: {
        type: String,
        attribute: "field-class"
      },
      /**
       * fieldId, id value on the input field.
       */
      fieldId: {
        type: String,
        attribute: "field-id"
      },
      /**
       * fieldName, internal to the form in whatever system it's in.
       */
      fieldName: {
        type: String,
        attribute: "field-name"
      },
      syncBody: {
        type: Boolean,
        attribute: "sync-body",
        reflect: true
      },
      /**
       * State of the panel
       */
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode"
      },
      /**
       * Location to save content to.
       */
      endPoint: {
        type: String,
        attribute: "end-point"
      },
      /**
       * Page data, body of text as a string.
       */
      updatePageData: {
        type: String,
        attribute: "update-page-data"
      },
      /**
       * Reference to activeBody.
       */
      activeHaxBody: {
        type: Object
      },
      __imported: {
        type: Boolean
      }
    };
  }
  createRenderRoot() {
    return this;
  }
  /**
   * Ensure we've imported our content on initial setup
   */
  _activeHaxBodyUpdated(newValue) {
    // ensure we import our content once we get an initial registration of active body
    if (newValue != null && !this.__imported) {
      this.__imported = true;
      if (this.__importContent) {
        newValue.importContent(this.__importContent);
      }
    }
  }
  disconnectedCallback() {
    window.removeEventListener("hax-save", this._bodyContentUpdated.bind(this));
    window.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      if (typeof e.detail.value === "object") {
        this[e.detail.property] = null;
      }
      this[e.detail.property] = e.detail.value;
    }
  }

  /**
   * Set the bubbled up event to the body value that just got changed
   */
  _bodyContentUpdated(e) {
    this.bodyValue = window.HaxStore.instance.activeHaxBody.haxToContent();
  }
}
window.customElements.define(WysiwygHax.tag, WysiwygHax);
export { WysiwygHax };
