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
        property: "linktext",
        title: "Text",
        description: "The link text",
        inputMethod: "textfield"
      },
      {
        property: "href",
        title: "Link",
        description: "The link URL. (Leave blank to remove.)",
        inputMethod: "url",
        autoValidate: true
      }
    ];
    this.command = "createLink";
    this.icon = "link";
    this.label = "Link";
    this.toggledCommand = "unlink";
    this.toggledIcon = "mdextra:unlink";
    this.toggledLabel = "Unlink";
    (this.toggles = "true"), (this.tag = "a");
    this.value = {
      link: null
    };
    this.shortcutKeys = "ctrl+k";
  }

  /**
   * updates prompt fields with selected range data
   */
  updatePrompt() {
    super.updatePrompt();
    this.value = {
      linktext: this.__selectionContents.innerHTML,
      href: this.__selectionContents.getAttribute("href")
    };
  }

  /**
   * updates the insertion based on fields
   */
  updateSelection() {
    let link = this.__prompt.getPromptValue("href"),
      text = this.__prompt.getPromptValue("linktext");
    this.__selection.range.selectNode(this.__selectionContents);
    this.__selectionContents.innerHTML = text ? text : "";
    link && text
      ? document.execCommand("CreateLink", false, link)
      : document.execCommand("unlink", false);
  }
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
