/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPromptButtonBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-prompt-button.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";

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
  LitElement
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
  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "element" && this.element) this.updateElement();
    });
  }

  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * to set custom gizmo property and slot values
   *
   * @memberof HaxTextEditorButton
   */
  updateElement() {
    let el = this.element || {},
      settings = el.settings || {},
      gizmo = el.gizmo || {};
    this.fields = [
      ...super.fields,
      ...(settings.configure || [])
        .map((f) => {
          if (f.inputMethod === "code-editor") f.inputMethod = "textfield";
          return f;
        })
        .filter((f) => f.slot !== ""),
    ];
    this.tagsList = gizmo.tag || "span";
    this.icon = gizmo.icon || "add";
    this.label = gizmo.title || `Add ${gizmo.tag}`;
    this.value = this.getValue(undefined);
    this.updateButton();
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
   * this overrides nthe default button behavior so that the gizmo's content doen't get doubled
   */
  updateSelection() {
    let tag = document.createElement(this.tagsList),
      html = "";
    this.fields.forEach((field) => {
      if (!!field.property && field.property !== "innerHTML")
        tag[field.property] = this.value[field.property];
      if (!!field.slot && !!this.value[field.slot])
        html += `<${field.slotWrapper || "span"}${Object.keys(
          field.slotAttributes || {}
        ).map((attr) => ` ${attr}="${field.slotAttributes[attr]}"`)}>
            ${this.value[slot]}
          </${field.slotWrapper || "span"}>`;
    });
    html += this.value.innerHTML || "";

    this.__highlight.innerHTML = "";
    this.__highlight.parentNode.insertBefore(tag, this.__highlight);
    this.__highlight.unwrap();
    tag.innerHTML = html;
  }
}

window.customElements.define(HaxTextEditorButton.tag, HaxTextEditorButton);
export { HaxTextEditorButton };
