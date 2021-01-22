/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { RichTextEditorToolbarBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js";
import { LrnVocab } from "@lrnwebcomponents/lrn-vocab/lrn-vocab.js";
import { LrnMath } from "@lrnwebcomponents/lrn-math/lrn-math.js";
import { OerSchemaElement } from "@lrnwebcomponents/oer-schema/oer-schema.js";
import { HaxTextEditorButton } from "./hax-text-editor-button.js";

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
    this.config = [
      {
        label: "Basic Inline Operations",
        type: "button-group",
        buttons: [
          {
            command: "bold",
            icon: "editor:format-bold",
            label: "Bold",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "italic",
            icon: "editor:format-italic",
            label: "Italics",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "removeFormat",
            icon: "editor:format-clear",
            label: "Erase Format",
            type: "rich-text-editor-button",
          },
        ],
      },
      {
        label: "Links",
        type: "button-group",
        buttons: [
          {
            command: "link",
            icon: "link",
            label: "Link",
            toggledCommand: "unlink",
            toggledIcon: "mdextra:unlink",
            toggledLabel: "Unink",
            toggles: true,
            type: "rich-text-editor-link",
          },
        ],
      } /*
      {
        label: "Subscript and Superscript",
        type: "button-group",
        buttons: [
          {
            command: "subscript",
            icon: "mdextra:subscript",
            label: "Subscript",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "superscript",
            icon: "mdextra:superscript",
            label: "Superscript",
            toggles: true,
            type: "rich-text-editor-button",
          },
        ],
      },*/,
      {
        label: "Hax Widgets",
        type: "button-group",
        buttons: [
          {
            element: LrnVocab,
            type: "hax-text-editor-button",
          },
          {
            element: LrnMath,
            type: "hax-text-editor-button",
          },
          {
            element: OerSchemaElement,
            type: "hax-text-editor-button",
          },
        ],
      },
      {
        label: "Lists and Indents",
        type: "button-group",
        buttons: [
          {
            command: "insertOrderedList",
            icon: "editor:format-list-numbered",
            label: "Ordered List",
            toggles: true,
            type: "rich-text-editor-button",
          },
          {
            command: "insertUnorderedList",
            icon: "editor:format-list-bulleted",
            label: "Unordered List",
            toggles: true,
            type: "rich-text-editor-button",
          },
        ],
      },
    ];
  }
}
customElements.define("hax-text-editor-toolbar", HaxTextEditorToolbar);
export { HaxTextEditorToolbar };
