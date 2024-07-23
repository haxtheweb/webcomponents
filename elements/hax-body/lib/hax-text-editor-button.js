/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorPromptButtonBehaviors } from "@haxtheweb/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * `hax-text-editor-button`
 * a custom-element button for hax text editor (custom buttons can extend this)
 *
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
 * @customElement
 * @demo demo/index.html
 */
class HaxTextEditorButton extends RichTextEditorPromptButtonBehaviors(
  LitElement,
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hax-text-editor-button";
  }

  // properties available to the custom element for data binding

  static get properties() {
    return {
      ...super.properties,
      element: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.tag = HaxTextEditorButton.tag;
    this.toggles = true;
    this.command = "insertHTML";
  }

  get targetedNode() {
    let firstMatch = this.__highlight.querySelectorAll(this.tagsList);
    return firstMatch.length === 1 ? firstMatch[0] : this.__highlight;
  }

  firstUpdated(changedProperties) {
    this.updateElement();
    if (super.firstUpdated) super.firstUpdated(changedProperties);
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "element" && this.element) this.updateElement();
    });
  }

  /**
   * updates element based on hax properties of element
   */
  updateElement() {
    this.dispatchEvent(
      new CustomEvent("deregister-button", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
    let el = this.element || {},
      settings = el.settings || {},
      gizmo = el.gizmo || {};
    // support inline, fallback to configure, then nothing
    this.fields = [
      ...(settings.inline || settings.configure || []).map((f) => {
        if (f.slot === "") f.property = "innerHTML";
        return f;
      }),
    ].filter((field) => {
      // we don't allow collapsed fieldsets in the quick form
      return field.inputMethod !== "collapse";
    });
    this.tagsList = gizmo.tag || "span";
    this.icon = gizmo.icon || "add";
    this.label = gizmo.title || gizmo.tag;
    this.value = this.getValue(undefined);
    this.dispatchEvent(
      new CustomEvent("register-button", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this,
      }),
    );
  }

  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * to get custom gizmo property and slot values
   *
   * @param {object} node selected node
   * @memberof HaxTextEditorButton
   */
  getValue() {
    let val = super.getValue();
    this.fields.forEach((field) => {
      if (field.property && field.property !== "innerHTML")
        val[field.property] =
          this.targetedNode && this.targetedNode.getAttribute
            ? this.targetedNode.getAttribute(field.property)
            : undefined;
      if (field.slot && field.slot !== "")
        this.targetedNode &&
        this.targetedNode.querySelector &&
        this.targetedNode.querySelector(`[slot=${field.slot}]`)
          ? this.targetedNode.querySelector(`[slot=${field.slot}]`).innerHTML
          : undefined;
      if (field.slot && field.slot === "")
        this.targetedNode &&
        [...(this.targetedNode.children || [])].filter(`:not([slot])`) &&
        [...(this.targetedNode.children || [])].filter(`:not([slot])`).length >
          0
          ? `${[...(this.targetedNode.children || [])]
              .filter(`:not([slot])`)
              .join("\n")}`
          : undefined;
    });
    return val;
  }

  setToggled() {
    this.toggled = !!this.value;
  }
  /**
   * override this custom function to perform a
   * custom operation when an element that matches the tags list is clicked
   *
   * @param {event} e click event
   */
  tagClickCallback(e = {}) {
    if (e.detail) this.open(e.detail);
    let tag = this.__highlight.innerHTML;
    this.__highlight.innerHTML = "";
    this.__highlight.innerHTML = tag;
  }
  /**
   * updates selection based on values passed from prompt
   * this overrides the default button behavior so that the gizmo's content doen't get doubled
   */
  updateSelection() {
    let tag = globalThis.document.createElement(this.tagsList),
      html = "";
    this.fields.forEach((field) => {
      if (
        !!field.property &&
        field.property !== "innerHTML" &&
        field.property !== "innerText"
      )
        tag[field.property] = this.value[field.property];
      if (!!field.slot && !!this.value[field.slot])
        html += `<${this.getSlotWrapper(field)}${Object.keys(
          field.slotAttributes || {},
        ).map((attr) => ` ${attr}="${field.slotAttributes[attr]}"`)}>
            ${this.value[slot]}
          </${this.getSlotWrapper(field)}>`;
    });
    if (!this.value || Object.keys(this.value).length === 0) {
      this.value = {
        innerHTML: this.__highlight.innerHTML,
      };
    }
    html += this.value.innerHTML || "";
    this.__highlight.innerHTML = "";
    this.__highlight.parentNode.insertBefore(tag, this.__highlight);
    this.__highlight.unwrap();
    tag.innerHTML = html;
  }
  /**
   * gets a slot wrapper tag that meets field requirements
   * @param {object} field
   * @returns {string}
   */
  getSlotWrapper(field) {
    let fallback = field.slotWrapper,
      allowed = field.allowedSlotWrappers,
      excluded = field.excludedSlotWrappers || [],
      filter = ["span", "div", "p"].filter(
        (wrapper) => !excluded.includes(wrapper),
      );
    return fallback ? fallback : allowed && allowed[0] ? allowed[0] : filter;
  }
}

customElements.define(HaxTextEditorButton.tag, HaxTextEditorButton);
export { HaxTextEditorButton };
