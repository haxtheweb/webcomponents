/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { RichTextEditorToolbarBehaviors } from "@lrnwebcomponents/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js";
import { HaxTextEditorButton } from "./hax-text-editor-button.js";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";
import { HaxContextBehaviors } from "./hax-context-behaviors.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

/**
 * `hax-text-editor-toolbar`
 * a customized toolbar (with buttons) for HAX
 *
 * @extends RichTextEditorToolbarBehaviors
 * @extends LitElement
 * @customElement
 * @demo demo/index.html
 */
class HaxTextEditorToolbar extends RichTextEditorToolbarBehaviors(
  I18NMixin(HaxContextBehaviors(LitElement))
) {
  //styles function
  static get styles() {
    return [
      //...super.styles,
      ...super.baseStyles,
      ...super.stickyStyles,
      css`
        :host {
          --rich-text-editor-button-color: var(--hax-ui-color);
          --rich-text-editor-button-bg: var(--hax-ui-background-color);
          --rich-text-editor-button-border-color: transparent;
          --rich-text-editor-button-hover-color: var(--hax-ui-color);
          --rich-text-editor-button-hover-bg: var(
            --hax-ui-background-color-secondary
          );
          --rich-text-editor-button-toggled-color: var(--hax-ui-color-accent);
          --rich-text-editor-button-toggled-bg: var(--hax-ui-background-color);
          --rich-text-editor-button-toggled-border-color: var(
            --hax-ui-color-accent
          );
          --rich-text-editor-button-disabled-opacity: 0.5;
          --rich-text-editor-button-disabled-color: var(--hax-ui-color);
          --rich-text-editor-button-disabled-bg: var(--hax-ui-background-color);
          --rich-text-editor-button-disabled-border-color: transparent;
        }
        ::slotted([icon-position]:hover) {
          --rich-text-editor-button-toggled-bg: var(
            --hax-ui-background-color-accent
          );
        }
        ::slotted(.group) {
          flex: 1 0 auto;
          justify-content: center;
          border-width: 1px;
          margin: -1px;
          padding: 0px;
        }
        ::slotted(.group),
        ::slotted([icon-position]) {
          z-index: 1;
        }
        ::slotted([icon-position]),
        :host([collapsed]) ::slotted(.group) {
          flex: 0 0 auto;
        }
        :host .group:focus,
        :host .group:focus-within,
        :host .group > *:focus,
        :host .group > *:focus-within {
          z-index: 2;
        }
        :host .group:hover,
        :host .group > *:hover {
          z-index: 3;
        }
      `,
    ];
  }

  get tourTemplate() {
    return html` <div slot="tour" data-stop-content>
      ${this.t.textEditorToolbarTour}
    </div>`;
  }

  // render function
  render() {
    return super.toolbarTemplate;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      activeNode: {
        type: Object,
      },
      parentSchema: {
        type: Object,
      },
      realSelectedValue: {
        type: String,
      },
      sourceView: {
        type: Boolean,
      },
      __updated: {
        type: Boolean,
      },
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
    this.t = {
      undoButton: "Undo",
      redoButton: "Redo",
      formatButton: "Format",
      blockP: "Paragraph",
      blockH1: "Heading 1",
      blockH2: "Heading 2",
      blockH3: "Heading 3",
      blockH4: "Heading 4",
      blockH5: "Heading 5",
      blockH6: "Heading 6",
      blockPre: "Preformatted",
      italicButton: "Italic",
      boldButton: "Bold",
      underlineButton: "Underline",
      strikethroughButton: "Cross out",
      removeFormatButton: "Remove format",
      linkButton: "Link",
      cutButton: "Cut",
      copyButton: "Copy",
      pasteButton: "Paste",
      subscriptButton: "Subscript",
      superscriptButton: "Superscript",
      symbolButton: "Insert Symbol",
      emojiButton: "Insert Emoticon",
      imageButton: "Insert Image",
      orderedListButton: "Bulleted list",
      unorderedListButton: "Numbered list",
      blockquoteButton: "Blockquote",
      indentButton: "Indent",
      outdentButton: "Outdent",
      textEditorToolbarTour:
        "Change how the text is structured and visualized in the page.",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    this.sourceView = false;
    this.haxUIElement = true;
    this.tourName = "hax";
    window.HaxTextEditorToolbarConfig = window.HaxTextEditorToolbarConfig || {};
    window.HaxTextEditorToolbarConfig.inlineGizmos =
      window.HaxTextEditorToolbarConfig.inlineGizmos || {};
    window.HaxTextEditorToolbarConfig.default = window
      .HaxTextEditorToolbarConfig.default || [
      ...this.defaultConfig,
      this.sourceButtonGroup,
    ];
    this.config = window.HaxTextEditorToolbarConfig.default;
    this.sticky = false;
    this.__updated = false;
    this.setTarget(undefined);
    autorun(() => {
      this.hasSelectedText = toJS(HAXStore.haxSelectedText).length > 0;
    });
    autorun(() => {
      // this just forces this block to run when editMode is modified
      const editMode = toJS(HAXStore.editMode);
      const activeNode = toJS(HAXStore.activeNode);
      //this.viewSource = false;
      if (activeNode && activeNode.tagName) {
        let schema = HAXStore.haxSchemaFromTag(activeNode.tagName);
        this.parentSchema =
          activeNode && activeNode.parentNode
            ? HAXStore.haxSchemaFromTag(activeNode.parentNode.tagName)
            : undefined;
        //this.sourceView = schema.canEditSource;
      }
    });
  }

  get slotSchema() {
    let schema;
    if (this.activeNode && this.parentSchema) {
      let slot = this.activeNode.slot || "";
      Object.keys(this.parentSchema.settings || {}).forEach((type) => {
        (this.parentSchema.settings[type] || []).forEach((setting) => {
          if (setting.slot && setting.slot === slot) schema = setting;
        });
      });
    }
    return schema;
  }
  /**
   * default config for a format button
   *
   * @readonly
   */
  get undoButton() {
    return {
      ...super.undoButton,
      label: this.t.undoButton,
    };
  }
  /**
   * default config for a format button
   *
   * @readonly
   */
  get redoButton() {
    return {
      ...super.redoButton,
      label: this.t.redoButton,
    };
  }
  /**
   * default config for a format button
   *
   * @readonly
   */
  get formatButton() {
    return {
      ...super.formatButton,
      label: this.t.formatButton,
      blocks: this.formatBlocks,
    };
  }

  get formatBlocks() {
    return [
      { label: this.t.blockP, tag: "p" },
      { label: this.t.blockH1, tag: "h1" },
      { label: this.t.blockH2, tag: "h2" },
      { label: this.t.blockH3, tag: "h3" },
      { label: this.t.blockH4, tag: "h4" },
      { label: this.t.blockH5, tag: "h5" },
      { label: this.t.blockH6, tag: "h6" },
      { label: this.t.blockPre, tag: "pre" },
    ];
  }
  /**
   * default config for a bold button
   *
   * @readonly
   */
  get boldButton() {
    return {
      ...super.boldButton,
      label: this.t.boldButton,
    };
  }
  /**
   * default config for an italic button
   *
   * @readonly
   */
  get italicButton() {
    return {
      ...super.italicButton,
      label: this.t.italicButton,
    };
  }
  /**
   * default config for an underline button
   *
   * @readonly
   */
  get underlineButton() {
    return {
      ...super.underlineButton,
      label: this.t.underlineButton,
    };
  }
  /**
   * default config for an underline button
   *
   * @readonly
   */
  get strikethroughButton() {
    return {
      ...super.strikethroughButton,
      label: this.t.strikethroughButton,
    };
  }
  /**
   * default config for a remove format button
   *
   * @readonly
   */
  get removeFormatButton() {
    return {
      ...super.removeFormatButton,
      label: this.t.removeFormatButton,
    };
  }
  /**
   * default config for a style button group: format, bold, italic, and remove format
   *
   * @readonly
   */
  get advancedInlineButtonGroup() {
    return {
      type: "button-group",
      subtype: "advanced-inline-button-group",
      buttons: [this.underlineButton, this.strikethroughButton],
    };
  }
  /**
   * default config for a link button
   *
   * @readonly
   */
  get linkButton() {
    return {
      ...super.linkButton,
      label: this.t.linkButton,
    };
  }
  /**
   * default config for a cut button
   *
   * @readonly
   */
  get cutButton() {
    return {
      ...super.cutButton,
      label: this.t.cutButton,
    };
  }
  /**
   * default config for a copy button
   *
   * @readonly
   */
  get copyButton() {
    return {
      ...super.copyButton,
      label: this.t.copyButton,
    };
  }
  /**
   * default config for a paste button
   *
   * @readonly
   */
  get pasteButton() {
    return {
      ...super.pasteButton,
      label: this.t.pasteButton,
    };
  }
  /**
   * default config for a subscript button
   *
   * @readonly
   */
  get subscriptButton() {
    return {
      ...super.subscriptButton,
      label: this.t.subscriptButton,
    };
  }
  /**
   * default config for a superscript button
   *
   * @readonly
   */
  get superscriptButton() {
    return {
      ...super.superscriptButton,
      label: this.t.superscriptButton,
    };
  }
  /**
   * default config for a symbol button
   *
   * @readonly
   */
  get symbolButton() {
    return {
      ...super.symbolButton,
      label: this.t.symbolButton,
    };
  }
  /**
   * default config for an emoji button
   *
   * @readonly
   */
  get emojiButton() {
    return {
      ...super.emojiButton,
      label: this.t.emojiButton,
    };
  }
  /**
   * default config for an image button
   *
   * @readonly
   */
  get imageButton() {
    return {
      ...super.imageButton,
      label: this.t.imageButton,
    };
  }
  /**
   * default config for an ordered list button
   *
   * @readonly
   */
  get orderedListButton() {
    return {
      ...super.orderedListButton,
      label: this.t.orderedListButton,
    };
  }
  /**
   * default config for an unordered list button
   *
   * @readonly
   */
  get unorderedListButton() {
    return {
      ...super.unorderedListButton,
      label: this.t.unorderedListButton,
    };
  }
  /**
   * default config for a blockquote button
   *
   * @readonly
   */
  get blockquoteButton() {
    return {
      ...super.blockquoteButton,
      label: this.t.blockquoteButton,
    };
  }
  /**
   * default config for an indent button
   *
   * @readonly
   */
  get indentButton() {
    return {
      ...super.indentButton,
      label: this.t.indentButton,
    };
  }
  /**
   * default config for an outdent button
   *
   * @readonly
   */
  get outdentButton() {
    return {
      ...super.outdentButton,
      label: this.t.outdentButton,
    };
  }
  /**
   * default config for a view source button
   *
   * @readonly
   */
  get sourceButton() {
    return {
      ...super.sourceButton,
    };
  }
  get haxInsertButtonGroup() {
    return {
      type: "button-group",
      subtype: "hax-insert-button-group",
      blocks: [this.symbolButton, this.emojiButton],
    };
  }

  get iconButton() {
    return {};
  }

  get defaultConfig() {
    return [
      this.basicInlineButtonGroup,
      this.linkButtonGroup,
      this.listIndentButtonGroup,
      this.haxInsertButtonGroup,
      this.scriptButtonGroup,
      this.advancedInlineButtonGroup,
    ];
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "parentSchema" && this.parentSchema !== oldValue)
        console.log("updated parent schema");
      if (propName === "activeNode" && this.activeNode !== oldValue)
        this.setTarget(this.activeNode);
      if (propName === "t" && this.t !== oldValue) this.updateToolbarElements();
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.config = this.updateToolbarElements();
    window.addEventListener(
      "hax-store-ready",
      this._handleHaxStoreReady.bind(this)
    );
    window.addEventListener(
      "hax-register-properties",
      this._handleElementRegister.bind(this)
    );
  }

  getRange() {
    return HAXStore.getRange();
  }

  getSelection() {
    return HAXStore.getSelection();
  }
  /**
   * moves toolbar into position before the target
   * (can be overriden for custom positioning)
   * @param {object} target
   */
  positionByTarget(target) {
    return;
  }

  get filteredBlocks() {
    return this.formatBlocks.filter((block) => {
      let tag = block.tag || "",
        excluded =
          this.slotSchema &&
          this.slotSchema.excludedSlotWrappers &&
          this.slotSchema.excludedSlotWrappers.includes(tag),
        included =
          this.slotSchema &&
          this.slotSchema.allowedSlotWrappers &&
          this.slotSchema.allowedSlotWrappers.includes(tag),
        specified =
          this.slotSchema &&
          this.slotSchema.slotWrapper &&
          this.slotSchema.slotWrapper === tag;
      console.log(tag, this.slotSchema, specified, !!included, !!excluded);
      return specified || !!included || !excluded;
    });
  }

  setTarget(node = this.activeNode) {
    super.setTarget(node);
    this.parentSchema =
      node && node.parentNode
        ? HAXStore.haxSchemaFromTag(node.parentNode.tagName)
        : undefined;
    console.log(this.formatButton, this.filteredBlocks);
    if (
      this.shadowRoot &&
      this.formatButton.type &&
      this.shadowRoot.querySelector(this.formatButton.type)
    )
      this.shadowRoot.querySelector(
        this.formatButton.type
      ).blocks = this.filteredBlocks;
  }
  /**
   * when an element is registered,
   * check its properties
   *
   * @param {event} e
   * @memberof HaxTextEditorToolbar
   */
  _handleElementRegister(e) {
    let detail = e.detail || {},
      tag = detail.tag || {},
      props = detail.properties || {};
    this._setInlineElement(tag, props);
  }
  /**
   * when hax-store is ready,
   * check its registered elements
   *
   * @param {event} e
   * @memberof HaxTextEditorToolbar
   */
  _handleHaxStoreReady(e) {
    let elements = HAXStore.elementList || {},
      keys = Object.keys(elements);
    keys.forEach((key) => this._setInlineElement(key, elemets[key]));
  }
  /**
   * if an an element is inline,
   * adds it to list of inline elements
   *
   * @param {*} tag
   * @param {*} props
   * @returns
   * @memberof HaxTextEditorToolbar
   */
  _setInlineElement(tag, props) {
    //skip if tag is already registered
    if (
      !tag ||
      !props ||
      !!window.HaxTextEditorToolbarConfig.inlineGizmos[tag] ||
      tag.indexOf("-") < 0
    )
      return;
    let element = props,
      gizmo = props.gizmo || {},
      handles = gizmo.handles || [],
      title =
        gizmo.title || gizmo.tag.replace(/-./g, (x) => x.toUpperCase()[1]),
      inline = handles.filter((handle) => handle.type === "inline");
    element.gizmo = element.gizmo || {};
    element.gizmo.title = `Add ${title}`;
    if (inline.length > 0) {
      window.HaxTextEditorToolbarConfig.inlineGizmos[tag] = {
        element: element,
        type: "hax-text-editor-button",
      };
      this.__updated = false;
      setTimeout(this.updateToolbarElements.bind(this), 500);
    }
  }
  /**
   * updates the toolbar buttons
   * to include custom inline element buttons
   *
   * @returns
   * @memberof HaxTextEditorToolbar
   */
  updateToolbarElements() {
    if (this.__updated) return;
    this.__updated = true;
    let buttons = Object.keys(
      window.HaxTextEditorToolbarConfig.inlineGizmos || {}
    ).map((key) => window.HaxTextEditorToolbarConfig.inlineGizmos[key]);
    this.config = [
      ...this.defaultConfig,
      {
        type: "button-group",
        buttons: buttons,
      },
      this.sourceButtonGroup,
    ];
    this.updateToolbar();
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * allow HAX to toggle edit state when activated
   */
  haxactiveElementChanged(el, val) {
    // overwrite the HAX dom w/ what our editor is supplying
    if (!val && el) {
      el.innerHTML = this.getValue();
    }
    return el;
  }
}
customElements.define("hax-text-editor-toolbar", HaxTextEditorToolbar);
export { HaxTextEditorToolbar };
