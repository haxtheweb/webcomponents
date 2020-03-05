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
        .end-point="${this.endPoint}"
        app-store-connection="${this.appStoreConnection}"
        offset-margin="${this.offsetMargin}"
        ?open-default="${this.openDefault}"
        ?sync-body="${this.syncBody}"
        ?hide-panel-ops="${this.hidePanelOps}"
        ?hide-preferences-button="${this.hidePreferencesButton}"
        element-align="${this.elementAlign}"
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
    this.elementAlign = "right";
    this.fieldId = "textarea-input-field";
    this.fieldName = "data[content]";
    this.endPoint = null;
    this.__imported = false;
    this.redirectLocation = "";
    this.updatePageData = "";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeHaxBody") {
        this._activeHaxBodyUpdated(this[propName]);
      }
      if (propName == "saveButtonSelector" && this[propName].tagName) {
        this.saveButtonSelector.addEventListener('click', this.__saveClicked.bind(this));
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
      elementAlign: {
        type: String,
        attribute: 'element-align'
      },
      offsetMargin: {
        type: String,
        attribute: "offset-margin"
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
       * Object reference that will get clicked on
       */
      saveButtonSelector: {
        type: Object
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
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("hax-save", this._bodyContentUpdated.bind(this));
    window.addEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    window.addEventListener("cms-hax-saved", this._contentSaved.bind(this));
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    window.removeEventListener("hax-save", this._bodyContentUpdated.bind(this));
    window.removeEventListener(
      "hax-store-property-updated",
      this._haxStorePropertyUpdated.bind(this)
    );
    window.removeEventListener("cms-hax-saved", this._contentSaved.bind(this));
    if (this.saveButtonSelector && this.saveButtonSelector.tagName) {
      this.saveButtonSelector.removeEventListener('click', this.__saveClicked.bind(this));
    }
    super.disconnectedCallback();
  }
  /**
   * Content was "saved" / updated in context. Now we can save
   */
  _contentSaved(e) {
    if (this.saveButtonSelector) {
      this.saveButtonSelector.click();
    }
  }
  __saveClicked(e) {
    // will attempt to set this right before save goes out the door
    this.bodyValue = window.HaxStore.instance.activeHaxBody.haxToContent();
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
    if (this.saveButtonSelector) {
      this.saveButtonSelector.click();
    }
  }
}
window.customElements.define(WysiwygHax.tag, WysiwygHax);
export { WysiwygHax };
