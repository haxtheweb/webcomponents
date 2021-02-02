/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { RichTextEditorToolbarBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js";
import { HaxTextEditorButton } from "./hax-text-editor-button.js";
import { HAXStore } from "./hax-store.js";

/**
 * `hax-text-editor-toolbar`
 * `A customized toolbar (with buttons) for HAX`
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class HaxTextEditorToolbar extends RichTextEditorToolbarBehaviors(LitElement) {
  //styles function
  static get styles() {
    return [super.baseStyles, super.miniStyles];
  }

  // render function
  render() {
    return super.miniTemplate;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      __registeredElements: {
        type: Object,
      },
      __updated: {
        type: Boolean,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "hax-text-editor-toolbar";
  }

  // life cycle
  constructor() {
    super();
    this.tag = HaxTextEditorToolbar.tag;
    this.sticky = false;
    this.config = this.defaultConfig;
    this.__registeredElements = [];
    this.__updated = false;
  }
  get defaultConfig() {
    return [
      this.basicInlineButtonGroup,
      this.linkButtonGroup,
      this.scriptButtonGroup,
      this.listIndentButtonGroup,
    ];
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.config = this.updateToolbarElements();
    window.addEventListener(
      "hax-store-ready",
      this._handleHaxStoreReady.bind(this)
    );
    window.addEventListener(
      "hax-register-properties",
      this._handleElementRegister.bind(this)
    );
  }
  _handleElementRegister(e) {
    let detail = e.detail || {},
      tag = detail.tag || {},
      props = detail.properties || {};
    this._setInlineElement(tag, props);
  }
  _handleHaxStoreReady(e) {
    let elements = HAXStore.elementList || {},
      keys = Object.keys(elements);
    keys.forEach((key) => this._setInlineElement(key, elemets[key]));
  }
  _setInlineElement(tag, props) {
    if (
      !tag ||
      !props ||
      !!this.__registeredElements[tag] ||
      tag.indexOf("-") < 0
    )
      return;
    let gizmo = props.gizmo || {},
      handles = gizmo.handles || [],
      inline = handles.filter((handle) => handle.type === "inline");
    if (inline.length > 0) {
      this.__registeredElements[tag] = {
        element: props,
        type: "hax-text-editor-button",
      };
      this.__updated = false;
      setTimeout(this.updateToolbarElements.bind(this), 500);
    }
  }
  updateToolbarElements() {
    if (this.__updated) return;
    this.__updated = true;
    let buttons = Object.keys(this.__registeredElements || {}).map(
      (key) => this.__registeredElements[key]
    );
    this.config = [
      ...this.defaultConfig,
      {
        type: "button-group",
        buttons: buttons,
      },
      this.sourceButtonGroup,
    ];
    this.updateToolbar();
  }
}
customElements.define("hax-text-editor-toolbar", HaxTextEditorToolbar);
export { HaxTextEditorToolbar };
