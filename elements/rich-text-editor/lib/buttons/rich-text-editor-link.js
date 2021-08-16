/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorPromptButtonBehaviors } from "./rich-text-editor-prompt-button.js";
/**
 * `rich-text-editor-link`
 * a link button for rich text editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPromptButtonBehaviors
 * @extends LitElement
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
    return {
      ...super.properties,
      /**
       * allow user to set a target attribute for link
       */
      allowTarget: {
        type: Boolean,
      },
    };
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
    this.command = "createLink";
    this.icon = "link";
    this.label = "Link";
    this.toggledCommand = "unlink";
    this.toggledLabel = "Edit link";
    this.toggles = "true";
    this.tagsList = "a";
    this.value = {
      ...super.value,
      href: null,
    };
    this.shortcutKeys = "ctrl+k";
  }

  get defaultFields() {
    return [
      ...super.fields,
      {
        property: "href",
        title: "Link",
        inputMethod: "url",
        autoValidate: true,
      },
    ];
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "allowTarget") {
        this.fields = !this.allowTarget
          ? [...this.defaultFields]
          : [
              ...this.defaultFields,
              {
                property: "target",
                title: "Target",
                inputMethod: "textfield",
              },
            ];
      }
    });
  }

  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * so that href property determines
   * whether or not to link or unlink
   *
   * @readonly
   * @memberof RichTextEditorLink
   */
  get promptCommandVal() {
    return this.getPropValue("href") || undefined;
  }

  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * so that isToggled is based on toggled property
   *
   * @readonly
   * @memberof RichTextEditorLink
   */
  get isToggled() {
    return this.toggled;
  }

  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * to customize for getting link innerHTML & href properties
   *
   * @param {object} node selected node
   * @memberof RichTextEditorLink
   */
  getValue() {
    return {
      ...super.getValue(),
      target:
        !!this.allowTarget &&
        !!this.targetedNode &&
        this.targetedNode.getAttribute
          ? this.targetedNode.getAttribute("target")
          : undefined,
      href:
        !!this.targetedNode && this.targetedNode.getAttribute
          ? this.targetedNode.getAttribute("href")
          : undefined,
    };
  }
  /**
   * overrides RichTextEditorPromptButtonBehaviors
   * sets toggle based on whether the selected node has a href
   *
   * @memberof RichTextEditorLink
   */
  setToggled() {
    this.toggled = !!this.getPropValue("href");
  }
  updateSelection() {
    let range = this.range,
      target =
        !this.value || !this.value.target || !this.value.href
          ? undefined
          : this.value.target;
    super.updateSelection();
    if (!target) return;
    range.commonAncestorContainer.children[0].setAttribute("target", target);
  }
}
window.customElements.define(RichTextEditorLink.tag, RichTextEditorLink);
export { RichTextEditorLink };
