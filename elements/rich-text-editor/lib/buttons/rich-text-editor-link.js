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
      ...super.fields,
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
    this.toggles = "true";
    this.tagsList = "a";
    this.value = {
      ...super.value,
      href: null,
    };
    this.shortcutKeys = "ctrl+k";
  }

  /**
   * determaines commandVal based on values passed from prompt
   */
  get promptCommandVal() {
    return this.getPropValue("href") || undefined;
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
  getValue(node) {
    let target = node || this.rangeElement();
    return {
      ...super.getValue(),
      href:
        target && target.getAttribute ? target.getAttribute("href") : undefined,
    };
  }
  setToggled() {
    this.toggled = !!this.getPropValue("href");
  }
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
