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
    this.config = this.HaxEditConfig;
  }

  get HaxEditConfig() {
    return [
      this.basicInlineButtonGroup,
      this.linkButtonGroup,
      this.scriptButtonGroup,
      this.listIndentButtonGroup,
      this.widgetButtonGroup,
      this.sourceButtonGroup,
    ];
  }

  get lrnVocabButton() {
    return {
      element: LrnVocab,
      type: "hax-text-editor-button",
    };
  }

  get LrnMathButton() {
    return {
      element: LrnMath,
      type: "hax-text-editor-button",
    };
  }

  get OerSchemaElementButton() {
    return {
      element: OerSchemaElement,
      type: "hax-text-editor-button",
    };
  }

  get widgetButtonGroup() {
    return {
      type: "button-group",
      buttons: [
        this.lrnVocabButton,
        this.LrnMathButton,
        this.OerSchemaElementButton,
      ],
    };
  }
}
customElements.define("hax-text-editor-toolbar", HaxTextEditorToolbar);
export { HaxTextEditorToolbar };
