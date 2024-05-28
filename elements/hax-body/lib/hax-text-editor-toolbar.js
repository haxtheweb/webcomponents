/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorToolbarBehaviors } from "@haxtheweb/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js";
import { HaxTextEditorButton } from "./hax-text-editor-button.js";
import { HAXStore } from "./hax-store.js";
import { HaxContextBehaviors } from "./hax-context-behaviors.js";
import "./hax-text-editor-paste-button.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

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
  I18NMixin(HaxContextBehaviors(LitElement)),
) {
  //styles function
  static get styles() {
    return [
      //super.styles,
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
          --rich-text-editor-button-disabled-opacity: 1;
          --rich-text-editor-button-disabled-color: var(
            --hax-ui-disabled-color
          );
          --rich-text-editor-button-disabled-bg: var(--hax-ui-background-color);
          --rich-text-editor-button-disabled-border-color: transparent;
        }
        #morebutton {
          align-self: flex-end;
        }
        ::slotted([icon-position]:hover) {
          --rich-text-editor-button-toggled-bg: var(
            --hax-ui-background-color-accent
          );
        }
        ::slotted(.group) {
          flex: 0 0 auto;
          justify-content: center;
          border-width: 1px;
          margin: -1px;
          padding: 0px;
          --simple-toolbar-button-width: 26px;
          --simple-toolbar-button-height: 26px;
        }
        ::slotted(.list-indent-button-group) {
          line-height: 20px;
        }
        ::slotted(.group),
        ::slotted([icon-position]) {
          z-index: 1;
        }
        ::slotted([icon-position]),
        :host([collapsed]) ::slotted(.group) {
          flex: 0 0 auto;
        }
        :host ::slotted(*:focus),
        :host ::slotted(*:focus-within) {
          z-index: 2 !important;
        }
        :host ::slotted(*:hover) {
          z-index: 3 !important;
        }
        div {
          --simple-toolbar-button-width: 26px;
          --simple-toolbar-button-height: 26px;
          line-height: 30px;
          height: 30px;
        }
        rich-text-editor-button {
          height: 32px;
          --simple-toolbar-button-width: 26px;
          --simple-toolbar-button-height: 26px;
          line-height: 32px;
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
      __updated: {
        type: Boolean,
      },
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
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
      codeButton: "Code",
      markButton: "Highlight",
      abbrButton: "Abbreviation",
      removeFormatButton: "Remove format",
      linkButton: "Link",
      unlinkButton: "Remove Link",
      cutButton: "Cut",
      copyButton: "Copy",
      pasteButton: "Paste Clipboard",
      subscriptButton: "Subscript",
      superscriptButton: "Superscript",
      symbolButton: "Insert Symbol",
      emojiButton: "Insert Emoticon",
      imageButton: "Insert Image",
      orderedListButton: "Numbered list",
      unorderedListButton: "Bulleted list",
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
    globalThis.HaxTextEditorToolbarConfig =
      globalThis.HaxTextEditorToolbarConfig || {};
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos =
      globalThis.HaxTextEditorToolbarConfig.inlineGizmos || {};
    globalThis.HaxTextEditorToolbarConfig.default = window
      .HaxTextEditorToolbarConfig.default || [...this.defaultConfig];
    this.config = globalThis.HaxTextEditorToolbarConfig.default;
    this.sticky = false;
    this.__updated = false;
    this.setTarget(undefined);
    globalThis.addEventListener(
      "hax-store-ready",
      this._handleHaxStoreReady.bind(this),
    );
    globalThis.addEventListener(
      "hax-register-properties",
      this._handleElementRegister.bind(this),
    );
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
      { label: this.t.blockquoteButton, tag: "blockquote" },
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
   * default config for a <code></code> button
   *
   * @readonly
   */
  get codeButton() {
    return {
      ...super.codeButton,
      icon: "hax:html-code",
      label: this.t.codeButton,
    };
  }
  /**
   * default config for a <code></code> button
   *
   * @readonly
   */
  get markButton() {
    return {
      ...super.markButton,
      icon: "editor:highlight",
      label: this.t.markButton,
    };
  }
  /**
   * default config for a <code></code> button
   *
   * @readonly
   */
  get abbrButton() {
    return {
      ...super.abbrButton,
      icon: "hax:abbr",
      label: this.t.abbrButton,
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
      buttons: [
        this.strikethroughButton,
        this.markButton,
        this.abbrButton,
        this.codeButton,
        this.underlineButton,
      ],
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
      allowTarget: true,
    };
  }
  /**
   * default config for a link button
   *
   * @readonly
   */
  get unlinkButton() {
    return {
      ...super.unlinkButton,
      label: this.t.unlinkButton,
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
      shortcutKeys: undefined,
      type: "hax-text-editor-paste-button",
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
    return {};
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
  get haxSymbolInsertButtonGroup() {
    return {
      type: "button-group",
      subtype: "hax-symbol-insert-button-group",
      buttons: [this.symbolButton, this.emojiButton],
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
      this.scriptButtonGroup,
      this.haxSymbolInsertButtonGroup,
      this.advancedInlineButtonGroup,
    ];
  }

  get filteredBlocks() {
    return this.getFilteredBlocks(this.formatBlocks);
  }

  get formatButtonElement() {
    return this.formatButton.type
      ? this.querySelector(this.formatButton.type)
      : undefined;
  }

  /**
   * determines if current range is in scope of the target
   * overrides default behavior so that the entire target can be selected
   *
   * @readonly
   */
  get isRangeInScope() {
    return (
      this.range &&
      this.target &&
      this.rangeNodeOrParentNode(this.range) &&
      (this.range.commonAncestorContainer === this.target ||
        this.target.contains(this.range.commonAncestorContainer))
    );
  }

  /**
   * list of event handlers for a given target
   *
   * @param {*} target
   * @returns
   */
  targetHandlers(target) {
    let handlers = super.targetHandlers(target);
    delete handlers.paste;
    return handlers;
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    if (this.__ready) {
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "parentSchema" || propName === "target")
          this.updateBlocks();
        if (propName === "activeNode" && this.activeNode !== oldValue)
          this.setTarget(this.activeNode);
        if (propName === "t" && this.t !== oldValue)
          this.updateToolbarElements();
      });
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.config = this.updateToolbarElements();
    this.__prompt.haxUIElement = true;
    this.__prompt.classList.add("ignore-activation");
    this.addEventListener("keypress", this.trapKeys.bind(this));
    this.__prompt.addEventListener("keypress", this.trapKeys.bind(this));
    this.__prompt.addEventListener("paste", this._handlePaste.bind(this));
  }
  /**
   * keeps keys from HAX
   *
   * @param {*} e
   * @memberof HaxTextEditorToolbar
   */
  _handlePaste(e) {
    e.stopPropagation();
  }
  /**
   * keeps keys from HAX
   *
   * @param {*} e
   * @memberof HaxTextEditorToolbar
   */
  trapKeys(e) {
    e.stopPropagation();
  }

  updateBlocks() {
    let filter = this.filteredBlocks;
    if (
      this.formatButtonElement &&
      this.formatButtonElement.blocks !== filter
    ) {
      this.formatButtonElement.blocks = filter;
      if (filter.length < 2) {
        this.formatButtonElement.setAttribute("disabled", "disabled");
      } else {
        this.formatButtonElement.removeAttribute("disabled");
      }
    }
  }

  getRange() {
    let range = HAXStore.getRange();
    return !range || range.rangeCount < 1 ? undefined : HAXStore.getRange();
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
    this.__ready = true;
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
  async _setInlineElement(tag, props) {
    //skip if tag is already registered
    if (
      !tag ||
      !props ||
      !!globalThis.HaxTextEditorToolbarConfig.inlineGizmos[tag] ||
      tag.indexOf("-") < 0
    )
      return;
    let element = { ...props },
      gizmo = props.gizmo || {},
      title = tag.replace(/-./g, (x) => x.toUpperCase()[1]),
      custom = tag.split("-").length > 1,
      meta = gizmo.meta || {},
      inlineOnly = meta.inlineOnly,
      handles = gizmo.handles || [],
      handlesInline =
        handles.filter((handle) => handle.type === "inline").length > 1,
      inline = custom && (inlineOnly || handlesInline);
    if (!element.gizmo.title) element.gizmo.title = title;
    if (inline) {
      globalThis.HaxTextEditorToolbarConfig.inlineGizmos[tag] = {
        element: element,
        type: "hax-text-editor-button",
      };
      this.__updated = false;
      setTimeout((e) => (this.config = this.updateToolbarElements()), 500);
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
      globalThis.HaxTextEditorToolbarConfig.inlineGizmos || {},
    ).map((key) => globalThis.HaxTextEditorToolbarConfig.inlineGizmos[key]);
    return buttons.length === 0
      ? [...(this.defaultConfig || [])]
      : [
          ...(this.defaultConfig || []),
          {
            type: "button-group",
            subtype: "hax-insert-button-group",
            buttons: buttons,
          },
        ];
  }
}
customElements.define("hax-text-editor-toolbar", HaxTextEditorToolbar);
export { HaxTextEditorToolbar };
