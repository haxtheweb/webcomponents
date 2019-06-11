/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorToolbar } from "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
import "@lrnwebcomponents/responsive-utility/responsive-utility.js";
import "@lrnwebcomponents/rich-text-editor/rich-text-editor.js";
import "@lrnwebcomponents/rich-text-editor/lib/rich-text-editor-styles.js";
import "@lrnwebcomponents/rich-text-editor/lib/singletons/rich-text-editor-selection.js";
import "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-button.js";
import "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-more-button.js";
import "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-heading-picker.js";
import "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-symbol-picker.js";
import "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-underline.js";
import "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-link.js";
import "@lrnwebcomponents/rich-text-editor/lib/buttons/rich-text-editor-button-styles.js";
import "@lrnwebcomponents/md-extra-icons/md-extra-icons.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/editor-icons.js";
import "@polymer/iron-icons/image-icons.js";
/**
 * `hax-text-editor-toolbar`
 * `a basic toolbar for the HAX text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/config.html custom configuration
 */
class HaxTextEditorToolbar extends RichTextEditorToolbar {
  constructor() {
    super();
    /**
     * Custom configuration of toolbar groups and buttons.
     * (See default value for example using default configuration.)
     */
    this.set("config", [
      {
        label: "Basic Inline Operations",
        type: "button-group",
        buttons: [
          {
            label: "Heading",
            type: "rich-text-editor-heading-picker",
            blocks: [
              { label: "Paragraph", tag: "p" },
              { label: "Title", tag: "h2" },
              { label: "Content Heading", tag: "h3" },
              { label: "Subheading", tag: "h4" },
              { label: "Deeper Subheading", tag: "h5" },
              { label: "Deepest Subheading", tag: "h6" },
              { label: "Preformatted", tag: "pre" },
              { label: "Code Block", tag: "code" },
              { label: "Quote", tag: "blockquote" }
            ]
          },
          {
            command: "bold",
            icon: "editor:format-bold",
            label: "Bold",
            toggles: "true",
            type: "rich-text-editor-button"
          },
          {
            command: "italic",
            icon: "editor:format-italic",
            label: "Italics",
            toggles: "true",
            type: "rich-text-editor-button"
          },
          {
            collapsedUntil: "xs",
            command: "underline",
            icon: "editor:format-underlined",
            label: "Underline (not recommended)",
            toggles: "true",
            type: "rich-text-editor-underline"
          },
          {
            collapsedUntil: "sm",
            command: "strikethrough",
            icon: "editor:format-strikethrough",
            label: "Cross Out",
            toggles: "true",
            type: "rich-text-editor-button"
          },
          {
            command: "removeFormat",
            icon: "editor:format-clear",
            label: "Erase Format",
            type: "rich-text-editor-button"
          }
        ]
      },
      {
        label: "Links",
        type: "button-group",
        buttons: [
          {
            icon: "link",
            label: "Link",
            type: "rich-text-editor-link"
          }
        ]
      },
      {
        collapsedUntil: "md",
        label: "Subscript and Superscript",
        type: "button-group",
        buttons: [
          {
            command: "subscript",
            icon: "mdextra:subscript",
            label: "Subscript",
            toggles: "true",
            type: "rich-text-editor-button"
          },
          {
            command: "superscript",
            icon: "mdextra:superscript",
            label: "Superscript",
            toggles: "true",
            type: "rich-text-editor-button"
          }
        ]
      },
      {
        collapsedUntil: "md",
        icon: "editor:functions",
        label: "Insert Symbol",
        symbolTypes: ["symbols"],
        type: "rich-text-editor-symbol-picker"
      },
      {
        collapsedUntil: "md",
        label: "HAX-specific",
        type: "button-group",
        buttons: [
          {
            icon: "hax:vocab",
            label: "Term/Definition",
            toggles: "true",
            type: "rich-text-editor-prompt-button"
          },
          {
            icon: "hax:pi",
            label: "Math",
            toggles: "true",
            type: "rich-text-editor-prompt-button"
          },
          {
            icon: "hax:oerschema",
            label: "OER Schema",
            toggles: "true",
            type: "rich-text-editor-prompt-button"
          }
        ]
      },
      {
        label: "Lists and Indents",
        type: "button-group",
        buttons: [
          {
            command: "insertOrderedList",
            icon: "editor:format-list-numbered",
            label: "Ordered List",
            toggles: "true",
            type: "rich-text-editor-button"
          },
          {
            command: "insertUnorderedList",
            icon: "editor:format-list-bulleted",
            label: "Unordered List",
            toggles: "true",
            type: "rich-text-editor-button"
          },
          {
            collapsedUntil: "sm",
            label: "Increase Indent",
            icon: "editor:format-indent-increase",
            event: "text-indent",
            command: "indent",
            type: "rich-text-editor-button"
          },
          {
            collapsedUntil: "sm",
            label: "Decrease Indent",
            icon: "editor:format-indent-decrease",
            event: "text-outdent",
            command: "outdent",
            type: "rich-text-editor-button"
          }
        ]
      }
    ]);
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "hax-text-editor-toolbar";
  }
}

export { HaxTextEditorToolbar };

window.customElements.define(HaxTextEditorToolbar.tag, HaxTextEditorToolbar);
