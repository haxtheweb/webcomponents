/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, css } from "lit";
import { RichTextEditorToolbarBehaviors } from "@haxtheweb/rich-text-editor/lib/toolbars/rich-text-editor-toolbar.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "./hax-text-editor-button.js";
import { HAXStore } from "./hax-store.js";
import { HaxContextBehaviors } from "./hax-context-behaviors.js";
import "./hax-text-editor-paste-button.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "./buttons/hax-text-editor-alignment-picker.js";
import "./buttons/hax-text-editor-heading-picker.js";
import "./buttons/hax-text-editor-tag-toggle.js";

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
          width: fit-content;
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
        rich-text-editor-button,
        ::slotted(rich-text-editor-button) {
          height: 30px;
          --simple-toolbar-button-width: 26px;
          --simple-toolbar-button-height: 26px;
          line-height: 30px;
        }
      `,
    ];
  }

  _platformAllowsTag(tag) {
    if (!tag) {
      return true;
    }
    if (HAXStore.requiredPrimitives && HAXStore.requiredPrimitives.has(tag)) {
      return true;
    }
    return HAXStore.platformAllows(tag);
  }
  _buttonTag(button) {
    if (!button) {
      return null;
    }
    if (button.tag) {
      return button.tag;
    }
    if (button.element && button.element.gizmo && button.element.gizmo.tag) {
      return button.element.gizmo.tag;
    }
    return null;
  }

  _filterButtonsByTag(buttons = []) {
    return buttons.filter((button) => {
      const tag = this._buttonTag(button);
      return tag ? this._platformAllowsTag(tag) : true;
    });
  }

  // render function
  render() {
    return super.toolbarTemplate;
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
      h1Button: "Header 1",
      h2Button: "Header 2",
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
      alignmentPicker: "Text alignment",
      moreFormats: "More formats",
      fewerFormats: "Fewer formats",
      addLink: "Add link",
      editLink: "Edit link",
      applyLink: "Apply link",
      updateLink: "Update link",
      linkAddress: "Link address",
      linkPlaceholder: "Paste or type a link",
      cancel: "Cancel",
    };
    this.registerLocalization({
      context: this,
      namespace: "hax",
    });
    this.sourceView = false;
    this.haxUIElement = true;
    globalThis.HaxTextEditorToolbarConfig =
      globalThis.HaxTextEditorToolbarConfig || {};
    globalThis.HaxTextEditorToolbarConfig.inlineGizmos =
      globalThis.HaxTextEditorToolbarConfig.inlineGizmos || {};
    globalThis.HaxTextEditorToolbarConfig.default = globalThis
      .HaxTextEditorToolbarConfig.default || [...this.defaultConfig];
    this.config = globalThis.HaxTextEditorToolbarConfig.default;
    this.sticky = false;
    this.barSize = "full";
    this._positionSelectionBubble = this._positionSelectionBubble.bind(this);
    this._handleBubbleToggle = this._handleBubbleToggle.bind(this);
    this.addEventListener("button-toggled", this._handleBubbleToggle);
    this.__updated = false;
    this.__inList = false;
    this.__hasSelection = false;
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
      // Use HAX-specific heading picker so we can convert
      // blocks via haxChangeTagName instead of relying on
      // execCommand('formatBlock'), which drops HAX wiring.
      type: "hax-text-editor-heading-picker",
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
   * default config for a heading 1 button
   *
   * @readonly
   */
  get h1Button() {
    return {
      ...super.h1Button,
      label: this.t.h1Button,
      type: "hax-text-editor-tag-toggle",
    };
  }
  /**
   * default config for a heading 2 button
   *
   * @readonly
   */
  get h2Button() {
    return {
      ...super.h2Button,
      label: this.t.h2Button,
      type: "hax-text-editor-tag-toggle",
    };
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
      tag: "u",
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
      tag: "code",
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
      tag: "mark",
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
    let buttons = [
      this.strikethroughButton,
      this.markButton,
      this.abbrButton,
      this.codeButton,
      this.underlineButton,
    ];

    if (HAXStore.isPlatformAudience("novice")) {
      buttons = [this.linkButton, this.unlinkButton, this.strikethroughButton];
    }
    buttons = this._filterButtonsByTag(buttons);

    return {
      type: "button-group",
      subtype: "advanced-inline-button-group",
      buttons: buttons,
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
      command: "ol",
      tag: "ol",
      label: this.t.orderedListButton,
      type: "hax-text-editor-tag-toggle",
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
      command: "ul",
      tag: "ul",
      label: this.t.unorderedListButton,
      type: "hax-text-editor-tag-toggle",
    };
  }
  /**
   * default config for a blockquote button
   * Note: Blockquote is available in the format dropdown, not as a toolbar button
   *
   * @readonly
   */
  get blockquoteButton() {
    return {
      ...super.blockquoteButton,
      tag: "blockquote",
      label: "Blockquote",
      type: "hax-text-editor-tag-toggle",
    };
  }
  /**
   * Override parent's listIndentButtonGroup to exclude blockquote button
   * since blockquote is in the format dropdown
   *
   * @readonly
   */
  get listIndentButtonGroup() {
    return {
      type: "button-group",
      subtype: "list-indent-button-group",
      buttons: [this.listButtonGroup, this.indentButton, this.outdentButton],
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
      type: "hax-text-editor-tag-toggle",
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
      type: "hax-text-editor-tag-toggle",
    };
  }
  /**
   * default config for alignment picker
   *
   * @readonly
   */
  get alignmentPicker() {
    return {
      label: "",
      type: "hax-text-editor-alignment-picker",
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
      buttons: [this.symbolButton, this.emojiButton, this.iconButton],
    };
  }

  get iconButton() {
    return {
      ...super.iconButton,
      label: "Insert Icon",
    };
  }

  // Button group for basic formatting: bold, italic, superscript, subscript, remove formatting
  get basicFormattingGroup() {
    // Default to expert mode if no platformConfig
    let buttons = [
      this.boldButton,
      this.italicButton,
      this.subscriptButton,
      this.superscriptButton,
      this.removeFormatButton,
    ];

    if (HAXStore.isPlatformAudience("novice")) {
      buttons = [
        this.h1Button,
        this.h2Button,
        this.blockquoteButton,
        this.boldButton,
        this.italicButton,
      ];
    }
    buttons = this._filterButtonsByTag(buttons);

    return {
      type: "button-group",
      subtype: "basic-formatting-group",
      buttons: buttons,
    };
  }

  get defaultConfig() {
    let buttonGroups = [
      this.formatButton,
      this.listIndentButtonGroup,
      this.alignmentPicker,
      this.basicFormattingGroup,
      this.linkButtonGroup,
      this.haxSymbolInsertButtonGroup,
      this.advancedInlineButtonGroup,
    ];

    if (HAXStore.isPlatformAudience("novice")) {
      buttonGroups = [
        this.listIndentButtonGroup,
        this.basicFormattingGroup,
        this.advancedInlineButtonGroup,
      ];
    }

    return buttonGroups;
  }

  /**
   * the block bar's text part: block format, lists and alignment live in
   * hax-plate-context's format menu, so this toolbar keeps the
   * insert-at-cursor tools (shown with More tools) and the inline
   * formatting bubble that appears only while text is selected
   */
  get compactConfig() {
    if (HAXStore.isPlatformAudience("novice")) {
      return this.defaultConfig;
    }
    return [this.haxSymbolInsertButtonGroup, this.selectionBubbleGroup];
  }
  /**
   * the bubble layout applies (not for the novice audience)
   */
  get usesBubble() {
    return this.barSize === "compact" && !HAXStore.isPlatformAudience("novice");
  }
  /**
   * config for the active bar size
   */
  get activeConfig() {
    return this.usesBubble ? this.compactConfig : this.defaultConfig;
  }
  /**
   * compact bar: inline elements that wrap selected text join the bubble's
   * More formats; ones that insert at the cursor stay in the bar
   */
  _compactConfigWithInlineElements(buttons = []) {
    const needsSelection = (button) => {
      const element = button.element || {};
      const gizmo = element.gizmo || {};
      const meta = gizmo.meta || {};
      return meta.selectionRequired !== false;
    };
    const atCursor = buttons.filter((button) => !needsSelection(button));
    const onSelection = buttons.filter(needsSelection);
    const config = [...this.compactConfig];
    const bubble = config.find(
      (item) => item && item.subtype === "hax-selection-bubble",
    );
    if (bubble && onSelection.length > 0) {
      const more = bubble.buttons.find(
        (item) => item && item.subtype === "hax-selection-more",
      );
      if (more) more.buttons = [...more.buttons, ...onSelection];
    }
    if (atCursor.length > 0) {
      config.splice(config.indexOf(bubble), 0, {
        type: "button-group",
        subtype: "hax-insert-button-group",
        buttons: atCursor,
      });
    }
    return config;
  }
  /**
   * Bold, Italic, Link and Remove Link up front; the rest of the inline
   * formats behind More formats
   */
  get selectionBubbleGroup() {
    return {
      type: "button-group",
      subtype: "hax-selection-bubble",
      buttons: [
        ...this._filterButtonsByTag([this.boldButton, this.italicButton]),
        ...(this._platformAllowsTag("a")
          ? [this.bubbleLinkButton, this.unlinkButton]
          : []),
        this.selectionMoreToggle,
        {
          type: "button-group",
          subtype: "hax-selection-more",
          buttons: this._filterButtonsByTag([
            this.underlineButton,
            this.strikethroughButton,
            this.markButton,
            this.abbrButton,
            this.codeButton,
            this.subscriptButton,
            this.superscriptButton,
            this.removeFormatButton,
          ]),
        },
      ],
    };
  }
  /**
   * Link in the bubble edits the link in place (see _startLinkEdit)
   */
  get bubbleLinkButton() {
    return {
      type: "simple-toolbar-button",
      className: "hax-selection-link",
      icon: "link",
      label: this.t.linkButton,
    };
  }
  get selectionMoreToggle() {
    return {
      type: "simple-toolbar-button",
      className: "hax-selection-more-toggle",
      icon: "icons:expand-more",
      label: this.t.moreFormats,
      toggles: true,
    };
  }

  get filteredBlocks() {
    const blocks = this.formatBlocks.filter((block) =>
      this._platformAllowsTag(block.tag),
    );
    return this.getFilteredBlocks(blocks);
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
        if (propName === "activeNode" && this.activeNode !== oldValue) {
          this.setTarget(this.activeNode);
          this._updateContextualVisibility();
        }
        if (propName === "range") {
          this._updateContextualVisibility();
        }
        if (propName === "range" || propName === "barSize") {
          this._positionSelectionBubble();
        }
      });
    }
  }
  willUpdate(changedProperties) {
    // Build config here (before super) so the base toolbar's willUpdate sees
    // the config change and rebuilds the buttons once, inside this update.
    // Assigning config in firstUpdated / updated scheduled a full second
    // rebuild (Lit change-in-update warning).
    if (!this.hasUpdated) {
      const config = this.updateToolbarElements();
      if (config) this.config = config;
    }
    this.bubbleMode = this.usesBubble;
    if (this.hasUpdated && changedProperties.has("barSize")) {
      // fewer / all tools: rebuild the buttons for the new layout
      this.__updated = false;
      const config = this.updateToolbarElements();
      if (config) this.config = config;
    }
    if (super.willUpdate) super.willUpdate(changedProperties);
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    // the text waiting for a link stays highlighted while its field has
    // focus; ::highlight() has to be styled where the content lives
    if (
      globalThis.document.head &&
      !globalThis.document.head.querySelector("style[data-hax-link-pending]")
    ) {
      const style = globalThis.document.createElement("style");
      style.setAttribute("data-hax-link-pending", "");
      style.textContent =
        "::highlight(hax-link-pending){background-color:color-mix(in srgb, #009cde 28%, transparent);}";
      globalThis.document.head.appendChild(style);
    }
    this.__prompt.haxUIElement = true;
    this.__prompt.classList.add("ignore-activation");
    this.addEventListener("keydown", this.trapKeys.bind(this));
    this.__prompt.addEventListener("keydown", this.trapKeys.bind(this));
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
  positionByTarget(_target) {
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
  _handleHaxStoreReady(_e) {
    this.__ready = true;
    let elements = HAXStore.elementList || {},
      keys = Object.keys(elements);
    keys.forEach((key) => this._setInlineElement(key, elements[key]));
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
    if (!element.gizmo) {
      element.gizmo = {};
    }
    if (!element.gizmo.tag) {
      element.gizmo.tag = tag;
    }
    if (!element.gizmo.title) element.gizmo.title = title;
    if (inline) {
      globalThis.HaxTextEditorToolbarConfig.inlineGizmos[tag] = {
        element: element,
        type: "hax-text-editor-button",
      };
      this.__updated = false;
      setTimeout((_e) => {
        // several inline gizmos can register in one tick; only the first
        // timeout gets a config back (the rest return undefined)
        const config = this.updateToolbarElements();
        if (config) this.config = config;
      }, 500);
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
    buttons = this._filterButtonsByTag(buttons);
    if (this.usesBubble) {
      return this._compactConfigWithInlineElements(buttons);
    }
    return buttons.length === 0
      ? [...(this.activeConfig || [])]
      : [
          ...(this.activeConfig || []),
          {
            type: "button-group",
            subtype: "hax-insert-button-group",
            buttons: buttons,
          },
        ];
  }

  /**
   * Checks if current range or activeNode is inside a list element
   * @returns {boolean}
   */
  _isInList() {
    // First check activeNode (the currently selected item in HAX)
    // This ensures buttons stay visible even when focus shifts (e.g., clicking alignment)
    if (this.activeNode) {
      let node = this.activeNode;
      while (node && node !== this.target) {
        if (
          node.tagName &&
          (node.tagName === "UL" ||
            node.tagName === "OL" ||
            node.tagName === "LI")
        ) {
          return true;
        }
        node = node.parentNode;
      }
    }

    // Fallback to checking range if activeNode doesn't indicate a list
    if (!this.range) return false;
    let node = this.range.commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }
    while (node && node !== this.target) {
      if (
        node.tagName &&
        (node.tagName === "UL" ||
          node.tagName === "OL" ||
          node.tagName === "LI")
      ) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  /**
   * Updates visibility of contextual buttons based on selection and cursor position
   */
  _updateContextualVisibility() {
    // Check if any picker is currently expanded (dropdown open)
    // If so, preserve the current button state to avoid flickering
    const alignmentPicker = this.querySelector(
      "hax-text-editor-alignment-picker",
    );
    const isPickerExpanded = alignmentPicker && alignmentPicker.expanded;

    this.__inList = this._isInList();
    this.__hasSelection = this.range && !this.range.collapsed;

    // Show/hide indent/outdent buttons based on whether we're in a list
    // Don't update visibility if a picker is expanded to prevent buttons from disappearing
    const listIndentGroup = this.querySelector(".list-indent-button-group");
    if (listIndentGroup && !isPickerExpanded) {
      const indentButton = listIndentGroup.querySelector('[command="indent"]');
      const outdentButton = listIndentGroup.querySelector(
        '[command="outdent"]',
      );
      if (indentButton) {
        indentButton.style.display = this.__inList ? "" : "none";
      }
      if (outdentButton) {
        outdentButton.style.display = this.__inList ? "" : "none";
      }
    }

    // Show/hide selection-dependent buttons in the advanced inline group
    // These buttons only work when text is selected: strikethrough, mark, abbr, code, underline
    const advancedInlineGroup = this.querySelector(
      ".advanced-inline-button-group",
    );
    if (advancedInlineGroup) {
      const allButtons = advancedInlineGroup.querySelectorAll(
        "rich-text-editor-button, rich-text-editor-underline, [command], [tag]",
      );
      allButtons.forEach((button) => {
        // All buttons in this group require a selection
        button.style.display = this.__hasSelection ? "" : "none";
      });
    }

    // Show/hide selection-dependent inline insert buttons
    // Check the selectionRequired property in the element's HAX schema
    const haxInsertGroup = this.querySelector(".hax-insert-button-group");
    if (haxInsertGroup) {
      const insertButtons = haxInsertGroup.querySelectorAll(
        "hax-text-editor-button",
      );
      insertButtons.forEach((button) => {
        // Check if the element has selectionRequired in its meta
        const element = button.element || {};
        const gizmo = element.gizmo || {};
        const meta = gizmo.meta || {};

        // If selectionRequired is explicitly false, always show the button
        // Otherwise, default to requiring selection for inline elements
        if (meta.selectionRequired === false) {
          button.style.display = ""; // Always visible
        } else {
          // Default: inline elements require selection
          button.style.display = this.__hasSelection ? "" : "none";
        }
      });
    }
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * "compact": block format, lists, alignment and inserts in the bar,
       * inline formatting in a bubble on text selection;
       * "full": every button in the bar
       */
      barSize: {
        type: String,
        attribute: "bar-size",
        reflect: true,
      },
      /**
       * set when inline formatting is in the selection bubble
       */
      bubbleMode: {
        type: Boolean,
        attribute: "bubble-mode",
        reflect: true,
      },
    };
  }

  disconnectedCallback() {
    this._listenForBubbleMoves(false);
    this._endLinkEdit(false);
    if (super.disconnectedCallback) super.disconnectedCallback();
  }

  get selectionBubble() {
    return this.querySelector(".hax-selection-bubble");
  }

  /**
   * More formats / Fewer formats in the selection bubble
   */
  _handleBubbleToggle(e) {
    const button = e.detail;
    const bubble = this.selectionBubble;
    if (!bubble || !button || !button.classList) return;
    if (button.classList.contains("hax-selection-link")) {
      this._startLinkEdit();
      return;
    }
    if (!button.classList.contains("hax-selection-more-toggle")) {
      return;
    }
    if (button.toggled) {
      bubble.setAttribute("data-more", "");
      button.label = this.t.fewerFormats;
    } else {
      bubble.removeAttribute("data-more");
      button.label = this.t.moreFormats;
    }
    this._positionSelectionBubble();
  }

  _listenForBubbleMoves(listen) {
    if (listen && !this.__bubbleListening) {
      this.__bubbleListening = true;
      globalThis.addEventListener("scroll", this._positionSelectionBubble, {
        capture: true,
        passive: true,
      });
      globalThis.addEventListener("resize", this._positionSelectionBubble, {
        passive: true,
      });
    } else if (!listen && this.__bubbleListening) {
      this.__bubbleListening = false;
      globalThis.removeEventListener("scroll", this._positionSelectionBubble, {
        capture: true,
      });
      globalThis.removeEventListener("resize", this._positionSelectionBubble);
    }
  }

  _hideSelectionBubble(bubble = this.selectionBubble) {
    if (this.__linkEdit) return;
    this._removeLinkCard(bubble);
    if (bubble && bubble.hasAttribute("data-open")) {
      bubble.removeAttribute("data-open");
      bubble.removeAttribute("data-more");
      const toggle = bubble.querySelector(".hax-selection-more-toggle");
      if (toggle) {
        toggle.toggled = false;
        toggle.label = this.t.moreFormats;
      }
    }
    this._listenForBubbleMoves(false);
  }

  /**
   * the link the range sits in, inside the block being edited
   */
  _linkFromRange(range) {
    if (!range || !this.target) return null;
    let node = range.commonAncestorContainer;
    while (node && node !== this.target) {
      if (node.nodeType === 1 && node.tagName === "A") return node;
      node = node.parentNode;
    }
    if (!range.collapsed && range.cloneContents) {
      const frag = range.cloneContents();
      if (frag.childNodes.length === 1 && frag.firstChild.tagName === "A") {
        const start = range.startContainer;
        const el = start.nodeType === 1 ? start : start.parentNode;
        const a = el && el.closest ? el.closest("a") : null;
        if (a && this.target.contains(a)) return a;
      }
    }
    return null;
  }

  /**
   * In the compact bar, show the inline formatting bubble just below the
   * selected text (above it when there is no room below), with its tip
   * pointing at the middle of the selection. A caret in a link shows the
   * link's address with Edit and Remove Link instead.
   */
  _positionSelectionBubble() {
    const bubble = this.selectionBubble;
    if (!bubble) return;
    const range = this.__linkEdit ? this.__linkEdit.range : this.range;
    const inScope = this.__linkEdit || (this.range && this.isRangeInScope);
    const hasSelection =
      this.usesBubble &&
      inScope &&
      range &&
      !range.collapsed &&
      range.toString().trim() !== "";
    const caretLink =
      this.usesBubble && inScope && range && range.collapsed
        ? this._linkFromRange(range)
        : null;
    if (!hasSelection && !caretLink && !this.__linkEdit) {
      // keep the bubble while one of its own buttons has focus, so a click
      // on it does not make it vanish mid-action
      if (!bubble.contains(globalThis.document.activeElement)) {
        this._hideSelectionBubble(bubble);
      }
      return;
    }
    if (!this.__linkEdit) {
      if (caretLink) {
        this._showLinkCard(bubble, caretLink);
      } else {
        this._removeLinkCard(bubble);
      }
      const link = bubble.querySelector(".hax-selection-link");
      if (link) link.toggled = !!(hasSelection && this._linkFromRange(range));
    }
    let rect = range.getBoundingClientRect();
    if ((!rect || (!rect.width && !rect.height)) && caretLink) {
      rect = caretLink.getBoundingClientRect();
    }
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      this._hideSelectionBubble(bubble);
      return;
    }
    bubble.setAttribute("data-open", "");
    this._listenForBubbleMoves(true);
    const gap = 10;
    const edge = 8;
    const width = bubble.offsetWidth;
    const height = bubble.offsetHeight;
    const viewWidth = globalThis.innerWidth;
    const viewHeight = globalThis.innerHeight;
    const center = rect.left + rect.width / 2;
    const left = Math.max(
      edge,
      Math.min(center - width / 2, viewWidth - width - edge),
    );
    let top = rect.bottom + gap;
    let tip = "up";
    if (top + height > viewHeight - edge && rect.top - gap - height > edge) {
      top = rect.top - gap - height;
      tip = "down";
    }
    const tipX = Math.max(12, Math.min(center - left, width - 12));
    bubble.style.left = `${Math.round(left)}px`;
    bubble.style.top = `${Math.round(top)}px`;
    bubble.style.setProperty(
      "--hax-selection-bubble-tip-x",
      `${Math.round(tipX)}px`,
    );
    bubble.setAttribute("data-tip", tip);
  }

  // ---------- links in the bubble ----------
  _bubbleButton(icon, label, onClick) {
    const b = globalThis.document.createElement("button");
    b.type = "button";
    b.className = "hax-bubble-btn";
    b.setAttribute("aria-label", label);
    b.title = label;
    const i = globalThis.document.createElement("simple-icon-lite");
    i.setAttribute("icon", icon);
    i.setAttribute("aria-hidden", "true");
    b.appendChild(i);
    b.addEventListener("mousedown", (e) => e.preventDefault());
    b.addEventListener("click", onClick);
    return b;
  }
  /**
   * a caret in a link: its address (opens in a new tab), Edit link and
   * Remove Link
   */
  _showLinkCard(bubble, link) {
    let card = bubble.querySelector(".hax-link-card");
    if (card && card.__link === link) return;
    this._removeLinkCard(bubble);
    card = globalThis.document.createElement("div");
    card.className = "hax-link-card";
    card.__link = link;
    const href = link.getAttribute("href") || "";
    const go = globalThis.document.createElement("a");
    go.href = this._safeHref(href) || "#";
    go.target = "_blank";
    go.rel = "noopener noreferrer";
    go.textContent = href.replace(/^https?:\/\//, "");
    go.title = href;
    card.appendChild(go);
    card.appendChild(
      this._bubbleButton("editor:mode-edit", this.t.editLink, () =>
        this._startLinkEdit(link),
      ),
    );
    card.appendChild(
      this._bubbleButton("mdextra:unlink", this.t.unlinkButton, () => {
        this._unwrapLink(link);
      }),
    );
    bubble.setAttribute("data-mode", "link-card");
    bubble.appendChild(card);
  }
  _removeLinkCard(bubble = this.selectionBubble) {
    if (!bubble) return;
    const card = bubble.querySelector(".hax-link-card");
    if (card) card.remove();
    if (bubble.getAttribute("data-mode") === "link-card") {
      bubble.removeAttribute("data-mode");
    }
  }
  _unwrapLink(link) {
    if (!link || !link.parentNode) return;
    const parent = link.parentNode;
    while (link.firstChild) parent.insertBefore(link.firstChild, link);
    link.remove();
    parent.normalize();
    this._hideSelectionBubble();
  }
  /**
   * links may be web addresses, mail, phone, in-page anchors or site
   * paths; anything else (e.g. script URLs) is not accepted
   */
  _safeHref(value) {
    const v = (value || "").trim();
    if (!v) return "";
    if (/^(https?:|mailto:|tel:)/i.test(v)) return v;
    if (/^[#/?.]/.test(v)) return v;
    if (/^[a-z][a-z0-9+.-]*:/i.test(v)) return "";
    if (/^[^\s/]+\.[^\s]+$/.test(v)) return `https://${v}`;
    return "";
  }
  /**
   * Link turns the bubble into a link field in place; the selected text
   * stays highlighted while the field has focus
   */
  _startLinkEdit(existing) {
    const bubble = this.selectionBubble;
    const base = this.range ? this.range.cloneRange() : null;
    if (!bubble || !base) return;
    const link = existing || this._linkFromRange(base);
    if (link) base.selectNodeContents(link);
    if (base.collapsed) return;
    const from = bubble.offsetWidth;
    this._removeLinkCard(bubble);
    this.__linkEdit = { range: base, link: link };
    this.__promptOpen = true;
    // progressive enhancement: without the Highlight API the link field
    // still works, the text just is not tinted
    /* eslint-disable baseline-js/use-baseline */
    if (globalThis.CSS && CSS.highlights && globalThis.Highlight) {
      CSS.highlights.set("hax-link-pending", new globalThis.Highlight(base));
    }
    /* eslint-enable baseline-js/use-baseline */
    const form = globalThis.document.createElement("form");
    form.className = "hax-link-form";
    form.setAttribute("aria-label", link ? this.t.editLink : this.t.addLink);
    const lead = globalThis.document.createElement("simple-icon-lite");
    lead.setAttribute("icon", "link");
    lead.setAttribute("aria-hidden", "true");
    const input = globalThis.document.createElement("input");
    input.type = "text";
    input.inputMode = "url";
    input.placeholder = this.t.linkPlaceholder;
    input.setAttribute("aria-label", this.t.linkAddress);
    input.value = link ? link.getAttribute("href") || "" : "";
    const apply = this._bubbleButton(
      "icons:check",
      link ? this.t.updateLink : this.t.applyLink,
      () => form.requestSubmit(),
    );
    apply.classList.add("apply");
    apply.disabled = !this._safeHref(input.value);
    const cancel = this._bubbleButton("icons:close", this.t.cancel, () =>
      this._endLinkEdit(true),
    );
    input.addEventListener("input", () => {
      apply.disabled = !this._safeHref(input.value);
      input.removeAttribute("aria-invalid");
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        this._endLinkEdit(true);
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const href = this._safeHref(input.value);
      if (!href) {
        input.setAttribute("aria-invalid", "true");
        return;
      }
      this._applyLink(href);
    });
    form.append(lead, input, apply, cancel);
    bubble.setAttribute("data-mode", "link-edit");
    bubble.appendChild(form);
    this._positionSelectionBubble();
    if (!this._reducedMotion && bubble.animate) {
      bubble.animate(
        [{ width: `${from}px` }, { width: `${bubble.offsetWidth}px` }],
        { duration: 180, easing: "cubic-bezier(0.2, 0, 0, 1)" },
      );
    }
    setTimeout(() => {
      input.focus();
      input.select();
    }, 0);
  }
  get _reducedMotion() {
    return (
      !!globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
  _restoreRange(range) {
    if (!range || !this.target) return;
    if (this.target.focus) this.target.focus({ preventScroll: true });
    const sel = this.getSelection ? this.getSelection() : null;
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
  _applyLink(href) {
    const edit = this.__linkEdit;
    if (!edit) return;
    this._endLinkEdit(false);
    this._restoreRange(edit.range);
    let link = edit.link;
    if (link) {
      link.setAttribute("href", href);
    } else {
      globalThis.document.execCommand("createLink", false, href);
      const sel = this.getSelection ? this.getSelection() : null;
      const r = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
      link = r ? this._linkFromRange(r) : null;
    }
    if (link) {
      // caret after the link shows its address with Edit and Remove Link
      const after = globalThis.document.createRange();
      after.selectNodeContents(link);
      after.collapse(false);
      this._restoreRange(after);
      if (!this._reducedMotion && link.animate) {
        link.animate(
          [
            { backgroundColor: "var(--hax-ui-landed)" },
            { backgroundColor: "transparent" },
          ],
          { duration: 900, easing: "ease-out" },
        );
      }
    }
  }
  _endLinkEdit(restore) {
    const edit = this.__linkEdit;
    this.__linkEdit = null;
    this.__promptOpen = false;
    // progressive enhancement: without the Highlight API the link field
    // still works, the text just is not tinted
    /* eslint-disable baseline-js/use-baseline */
    if (globalThis.CSS && CSS.highlights) {
      CSS.highlights.delete("hax-link-pending");
    }
    /* eslint-enable baseline-js/use-baseline */
    const bubble = this.selectionBubble;
    if (bubble) {
      const form = bubble.querySelector(".hax-link-form");
      if (form) form.remove();
      if (bubble.getAttribute("data-mode") === "link-edit") {
        bubble.removeAttribute("data-mode");
      }
    }
    if (restore && edit) {
      this._restoreRange(edit.range);
      this._positionSelectionBubble();
    }
  }
  /**
   * Ctrl / Cmd + K edits the link in place in the bubble layout
   */
  _handleShortcutKeys(e, key) {
    if (
      this.usesBubble &&
      e &&
      (e.ctrlKey || e.metaKey) &&
      !e.shiftKey &&
      !e.altKey &&
      (e.key === "k" || e.key === "K")
    ) {
      e.preventDefault();
      this._startLinkEdit();
      return;
    }
    return super._handleShortcutKeys(e, key);
  }
}
globalThis.customElements.define(
  "hax-text-editor-toolbar",
  HaxTextEditorToolbar,
);
export { HaxTextEditorToolbar };
