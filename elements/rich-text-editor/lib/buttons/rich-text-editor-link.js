/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorPromptButtonBehaviors } from "./rich-text-editor-prompt-button.js";
/**
 * `rich-text-editor-link`
 * a button for rich text editor (custom buttons can extend this)
 *
 * @element rich-text-editor-link
 * @demo ./demo/buttons.html
 */
class RichTextEditorLink extends RichTextEditorPromptButtonBehaviors(
  LitElement
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-link";
  }

  // render function for template
  render() {
    return super.render();
  }

  // properties available to the custom element for data binding
  static get properties() {
    return { ...super.properties };
  }
  constructor() {
    super();
    this.fields = [
      {
        property: "text",
        title: "Text",
        inputMethod: "textfield",
      },
      {
        property: "href",
        title: "Link",
        inputMethod: "url",
        autoValidate: true,
      },
    ];
    this.command = "CreateLink";
    this.icon = "link";
    this.label = "Link";
    this.toggledCommand = "unlink";
    this.toggledIcon = "mdextra:unlink";
    this.toggledLabel = "Unlink";
    (this.toggles = "true"), (this.tag = "a");
    this.value = {
      link: null,
    };
    this.shortcutKeys = "ctrl+k";
  }
  /**
   * overrides default block selectors
   *
   * @readonly
   * @memberof RichTextEditorLink
   */
  get blockSelectors() {
    return "a";
  }

  /**
   * whether button is toggled
   *
   * @readonly
   * @memberof RichTextEditorButton
   */
  get isToggled() {
    return this.toggled;
  }

  /**
   * updates prompt fields with selected range data
   */
  getSelectionValue() {
    let target = this.targetNode();
    console.log("LINK getSelectionValue", target, this.range);
    return {
      ...super.getSelectionValue(),
      href:
        target && target.getAttribute ? target.getAttribute("href") : undefined,
    };
  }

  updateCommandVal() {
    console.log("LINK updateCommandVal", this.getPropValue("href"));
    this.commandVal = this.getPropValue("href") || undefined;
  }

  /**
   * updates the insertion based on fields
   */
  updateSelection() {
    console.log("LINK updateSelection", this.value);
    super.updateSelection();
  }
  updateToggled() {
    console.log("LINK toggled", this.getPropValue("href"));
    this.toggled = !this.getPropValue("href");
  }
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
