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
    this.value = {};
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
    this.updateButton();
  }

  /**
   * overriden from RichTextEditorPromptButtonBehaviors:
   * to determin if gizmo will be inserted
   * @memberof HaxTextEditorButton
   */
  get promptCommandVal() {
    return this.value;
  }

  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * to get custom gizmo property and slot values
   *
   * @param {object} node selected node
   * @memberof HaxTextEditorButton
   */
  getValue(node) {
    let el = node || this.rangeElement(),
      val = super.getValue();
    if (el) {
      this.fields.forEach((field) => {
        if (field.property && field.property !== "innerHTML")
          val[field.property] = el[field.property];
        if (field.slot && field.slot !== "") {
          let slot = el.querySelector(`[slot=${field.slot}]`);
          val[field.slot] = !slot ? undefined : slot.innerHTML;
        }
      });
    }
    return !el ? undefined : val;
  }
  setToggled() {
    this.toggled = !!this.value;
  }
  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * to perform a custom gizmo insert
   *
   * @param {string} [command=this.operationCommand]
   * @param {string} [commandVal=this.operationCommandVal]
   * @param {object} [range=this.range]
   * @memberof HaxTextEditorButton
   */
  sendCommand(
    command = this.operationCommand,
    commandVal = this.operationCommandVal,
    range = this.range
  ) {
    let node = document.createElement(this.tagsList);
    this.fields.forEach((field) => {
      if (!!field.property) node[field.property] = this.value[field.property];
      node.innerHTML = this.value.innerHTML;
      if (!!field.slot && field.slot !== "") {
        let div = document.createElement("div");
        div.slot = field.slot;
        div.innerHTML = this.value[field.slot];
        node.append(div);
      }
    });
    if (!!this.selectedNode) {
      //make sure old inline widgets are clear
      this.selectedNode.remove();
    } else {
      //empties inline text nodes
      super.sendCommand(command, "", range);
    }
    //inserts new updated widget
    range.insertNode(node);
  }
}

window.customElements.define(HaxTextEditorButton.tag, HaxTextEditorButton);
export { HaxTextEditorButton };
