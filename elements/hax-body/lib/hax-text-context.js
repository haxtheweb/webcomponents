import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar-menu.js";
import "@lrnwebcomponents/simple-toolbar/lib/simple-toolbar-menu-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item-textop.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";
import { HaxContextBehaviors } from "./hax-context-container.js";

/**
 * `hax-text-context`
 * @element hax-text-context
 * `A context menu that provides common text based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 */
class HaxTextContext extends HaxContextBehaviors(LitElement) {
  static get styles() {
    return [...super.styles];
  }
  constructor() {
    super();
    this.sourceView = false;
    this.haxUIElement = true;
    this.tourName = "hax";
    setTimeout(() => {
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
      );
      window.addEventListener(
        "hax-context-item-selected",
        this._haxInMenuContextOperation.bind(this)
      );
    }, 0);
    this.formattingList = [
      {
        value: "p",
        icon: "hax:paragraph",
        text: "Paragraph",
      },
      {
        value: "ul",
        icon: "editor:format-list-bulleted",
        text: "Bulleted list",
      },
      {
        value: "ol",
        icon: "editor:format-list-numbered",
        text: "Numbered list",
      },
      {
        value: "h2",
        icon: "hax:h2",
        text: "Title",
      },
      {
        value: "h3",
        icon: "hax:h3",
        text: "Content heading",
      },
      {
        value: "h4",
        icon: "hax:h4",
        text: "Subheading",
      },
      {
        value: "h5",
        icon: "hax:h5",
        text: "Deep subheading",
      },
      {
        value: "blockquote",
        icon: "editor:format-quote",
        text: "Blockquote",
      },
      {
        value: "code",
        icon: "icons:code",
        text: "Code",
      },
    ];
    this.realSelectedValue = "p";
    this.formatIcon = "hax:paragraph";
    this.isSafari = this._isSafari();
    autorun(() => {
      this.hasSelectedText = toJS(HAXStore.haxSelectedText).length > 0;
    });
    autorun(() => {
      // this just forces this block to run when editMode is modified
      const editMode = toJS(HAXStore.editMode);
      const activeNode = toJS(HAXStore.activeNode);
      this.viewSource = false;
      if (activeNode && activeNode.tagName) {
        let schema = HAXStore.haxSchemaFromTag(activeNode.tagName);
        this.sourceView = schema.canEditSource;
      }
      if (
        this.shadowRoot &&
        this.shadowRoot.querySelector("simple-popover-selection")
      ) {
        this.shadowRoot.querySelector(
          "simple-popover-selection"
        ).opened = false;
      }
      // update our icon if global changes what we are pointing to
      if (
        activeNode &&
        HAXStore.isTextElement(activeNode) &&
        this.shadowRoot.querySelector(
          'button[value="' + activeNode.tagName.toLowerCase() + '"]'
        )
      ) {
        this.updateTextIconSelection(activeNode.tagName.toLowerCase());
      } else if (
        activeNode &&
        activeNode.tagName === "LI" &&
        this.shadowRoot.querySelector(
          'button[value="' + activeNode.parentNode.tagName.toLowerCase() + '"]'
        )
      ) {
        this.updateTextIconSelection(
          activeNode.parentNode.tagName.toLowerCase()
        );
      }
    });
  }
  get textFormatLookup() {
    let lookup = {};
    this.formattingList.forEach((item) => {
      lookup[item.value] = item.icon;
    });
    return lookup;
  }
  /**
   *
   *
   * @returns
   * @memberof HaxTextContext
   */
  render() {
    return html`
      <div id="toolbar">
        <hax-toolbar>
          <div class="group">
            <hax-toolbar-menu
              id="textformat"
              icon="${this._formatIcon(
                this.realSelectedValue || this.formatIcon
              )}"
              label="Format"
              show-text-label
              data-simple-tour-stop
              data-stop-title="label"
            >
              ${this.formattingList.map(
                (val) =>
                  html` <simple-toolbar-menu-item slot="menuitem">
                    <hax-context-item-textop
                      action
                      align-horizontal="left"
                      role="menuitem"
                      label="${val.text}"
                      show-text-label
                      ?hidden="${!this.sourceView}"
                      event-name="${val.value}"
                      @click="${(e) => this.textFormatChanged(val.value)}"
                    ></hax-context-item-textop>
                  </simple-toolbar-menu-item>`
              )}
              <div slot="tour" data-stop-content>
                Change how the text is structured and visualized in the page.
              </div>
            </hax-toolbar-menu>
            <!-- comment this in when rich-text-editor is viable -->
            <!--
            <hax-context-item
              action
              hidden
              icon="icons:flip-to-back"
              label="Full text editor"
              event-name="hax-full-text-editor-toggle"
            ></hax-context-item> -->
            <slot name="primary"></slot>
          </div>
          <div class="group">
            <hax-context-item
              action
              icon="icons:code"
              label="Modify HTML source"
              ?hidden="${!this.sourceView}"
              event-name="hax-source-view-toggle"
              toggles
              ?toggled="${this.viewSource}"
              @click="${(e) => (this.viewSource = !this.viewSource)}"
            ></hax-context-item>
            <hax-context-item-textop
              mini
              action
              icon="editor:format-list-bulleted"
              event-name="text-tag-ul"
              label="Bulleted list"
              ?hidden="${!this._showLists}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              mini
              action
              icon="editor:format-list-numbered"
              label="Numbered list"
              event-name="text-tag-ol"
              ?hidden="${!this._showLists}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              mini
              action
              icon="editor:format-indent-decrease"
              label="Outdent"
              event-name="text-outdent"
              ?hidden="${!this._showIndent}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              mini
              action
              icon="editor:format-indent-increase"
              label="Indent"
              event-name="text-indent"
              ?hidden="${!this._showIndent}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              mini
              action
              icon="editor:format-bold"
              label="Bold"
              class="selected-buttons"
              event-name="text-bold"
              ?hidden="${!this.hasSelectedText}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              mini
              action
              icon="editor:format-italic"
              label="Italic"
              class="selected-buttons"
              event-name="text-italic"
              ?hidden="${!this.hasSelectedText}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              mini
              action
              icon="editor:insert-link"
              label="Link"
              class="selected-buttons"
              event-name="text-link"
              ?hidden="${!this.hasSelectedText}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              mini
              action
              icon="mdextra:unlink"
              label="Remove link"
              class="selected-buttons"
              event-name="text-unlink"
              ?hidden="${!this.hasSelectedText}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              mini
              action
              icon="editor:format-clear"
              label="Remove format"
              class="selected-buttons"
              event-name="text-remove-format"
              ?hidden="${!this.hasSelectedText}"
            ></hax-context-item-textop>
            <hax-context-item
              mini
              action
              icon="hax:add-brick"
              label="Add element to selection"
              class="selected-buttons"
              event-name="insert-inline-gizmo"
              ?hidden="${this.isSafari || !this.hasSelectedText}"
            ></hax-context-item>
            <hax-context-item-textop
              mini
              action
              icon="hax:add-brick"
              label="Add element to selection"
              class="selected-buttons"
              event-name="insert-inline-gizmo"
              ?hidden="${!this.isSafari || !this.hasSelectedText}"
            ></hax-context-item-textop>
            <slot name="secondary"></slot>
          </div>
          <div class="group">
            <hax-context-item-textop
              action
              menu
              icon="mdextra:subscript"
              event-name="text-subscript"
              ?hidden="${!this.hasSelectedText}"
              label="Subscript"
            ></hax-context-item-textop>
            <hax-context-item-textop
              action
              menu
              icon="mdextra:superscript"
              event-name="text-superscript"
              ?hidden="${!this.hasSelectedText}"
              label="Superscript"
            ></hax-context-item-textop>
            <hax-context-item-textop
              action
              menu
              icon="editor:format-underlined"
              label="Underline"
              event-name="text-underline"
              ?hidden="${!this.hasSelectedText}"
            ></hax-context-item-textop>
            <hax-context-item-textop
              action
              menu
              icon="editor:format-strikethrough"
              event-name="text-strikethrough"
              ?hidden="${!this.hasSelectedText}"
              label="Cross out"
            ></hax-context-item-textop>
            <slot name="more"></slot>
          </div>
          <div class="group">
            <hax-toolbar-menu icon="add" label="Insert item above or below">
              <simple-toolbar-menu-item slot="menuitem">
                <hax-context-item
                  action
                  align-horizontal="left"
                  role="menuitem"
                  show-text-label
                  icon="hardware:keyboard-arrow-up"
                  event-name="insert-above-active"
                  label="Insert item above"
                ></hax-context-item>
              </simple-toolbar-menu-item>
              <simple-toolbar-menu-item slot="menuitem">
                <hax-context-item
                  action
                  align-horizontal="left"
                  role="menuitem"
                  show-text-label
                  icon="hardware:keyboard-arrow-down"
                  event-name="insert-below-active"
                  label="Insert item below"
                ></hax-context-item>
              </simple-toolbar-menu-item>
            </hax-toolbar-menu>
          </div>
        </hax-toolbar>
      </div>
    `;
  }
  static get tag() {
    return "hax-text-context";
  }
  static get properties() {
    return {
      ...super.properties,
      _showIndent: {
        type: Boolean,
      },
      _showLists: {
        type: Boolean,
      },
      realSelectedValue: {
        type: String,
      },
      sourceView: {
        type: Boolean,
      },
      formattingList: {
        type: Array,
      },
      /**
       * calculated boolean off of if there is currently text
       */
      hasSelectedText: {
        type: Boolean,
        attribute: "has-selected-text",
        reflect: true,
      },
      /**
       * Selected item icon
       */
      formatIcon: {
        type: String,
        attribute: "format-icon",
      },
      /**
       * Is this safari
       */
      isSafari: {
        type: Boolean,
        attribute: "is-safari",
      },
      viewSource: {
        type: Boolean,
      },
    };
  }
  textFormatChanged(tag) {
    // set internally
    this.shadowRoot.querySelector("#textformat").collapsed = true;
    this.updateTextIconSelection(tag);
    // notify up above that we want to change the tag
    this.dispatchEvent(
      new CustomEvent("hax-context-item-selected", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: {
          eventName: "text-tag",
          value: this.realSelectedValue,
        },
      })
    );
  }
  updateTextIconSelection(tag) {
    this.realSelectedValue = tag;
  }

  _formatIcon(tag = this.realSelectedValue || "p") {
    let icon = this.textFormatLookup[tag] || {};
    return icon || "hax:paragraph";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // computed based on these changing
      if (propName == "realSelectedValue") {
        this._showIndent = this._computeShowIndent(this.realSelectedValue);
        if (this.realSelectedValue == "p") {
          this._showLists = true;
        } else {
          this._showLists = false;
        }
      }
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    if (toJS(HAXStore.activeNode) && toJS(HAXStore.activeNode).tagName) {
      this.updateTextIconSelection(
        toJS(HAXStore.activeNode).tagName.toLowerCase()
      );
    }
  }
  /**
   * Show indentation on lists
   */
  _computeShowIndent(realSelectedValue) {
    if (
      HAXStore.computePolyfillSafe() &&
      (realSelectedValue == "li" ||
        realSelectedValue == "ol" ||
        realSelectedValue == "ul")
    ) {
      return true;
    }
    return false;
  }
  /**
   * Respond to simple modifications.
   */
  _haxInMenuContextOperation(e) {
    let detail = e.detail;
    let prevent = false;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "insert-above-active":
      case "insert-below-active":
        this.shadowRoot.querySelector(
          "simple-popover-selection"
        ).opened = false;
        break;
      case "text-underline":
        document.execCommand("underline");
        prevent = true;
        break;
      case "text-subscript":
        document.execCommand("subscript");
        prevent = true;
        break;
      case "text-superscript":
        document.execCommand("superscript");
        prevent = true;
        break;
      case "text-strikethrough":
        document.execCommand("strikeThrough");
        prevent = true;
        break;
    }
    if (prevent) {
      if (this.shadowRoot.querySelector("simple-popover-selection").opened) {
        this.shadowRoot.querySelector(
          "simple-popover-selection"
        ).opened = false;
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }
  /**
   * Respond to simple modifications.
   */
  _haxContextOperation(e) {
    let detail = e.detail;
    let selection = HAXStore.getSelection();
    let prevent = false;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "insert-inline-gizmo":
        if (HAXStore._tmpSelection && HAXStore.editMode) {
          try {
            if (
              HAXStore._tmpRange.startContainer.parentNode.parentNode
                .tagName === "HAX-BODY" ||
              HAXStore._tmpRange.startContainer.parentNode.parentNode.parentNode
                .tagName === "HAX-BODY"
            ) {
              HAXStore.activePlaceHolder = HAXStore._tmpRange;
            }
          } catch (err) {}
        }
        if (HAXStore.activePlaceHolder != null) {
          // store placeholder because if this all goes through we'll want
          // to kill the originating text
          let values = {
            text: HAXStore.activePlaceHolder.toString(),
          };
          let type = "inline";
          let haxElements = HAXStore.guessGizmo(type, values);
          // see if we got anything
          if (haxElements.length > 0) {
            // hand off to hax-app-picker to deal with the rest of this
            HAXStore.haxAppPicker.presentOptions(
              haxElements,
              type,
              "Transform selected text to..",
              "gizmo"
            );
          }
        }
        break;
      // wow these are way too easy
      case "text-bold":
        document.execCommand("bold");
        prevent = true;
        break;
      case "text-italic":
        document.execCommand("italic");
        prevent = true;
        break;
      case "text-remove-format":
        document.execCommand("removeFormat");
        prevent = true;
        break;
      case "text-link":
        var href = "";
        if (
          selection &&
          selection.focusNode &&
          selection.focusNode.parentNode &&
          typeof selection.focusNode.parentNode.href !== typeof undefined
        ) {
          href = selection.focusNode.parentNode.href;
        }
        // @todo put in a dialog instead of this
        let url = prompt("Enter a URL:", href);
        if (url) {
          document.execCommand("createLink", false, url);
          if (selection.focusNode.parentNode) {
            selection.focusNode.parentNode.setAttribute(
              "contenteditable",
              true
            );
            // just to be safe
            selection.focusNode.parentNode.removeEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            });
            selection.focusNode.parentNode.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            });
          }
          prevent = true;
        }
        break;
      case "text-unlink":
        document.execCommand("unlink");
        prevent = true;
        break;
      /**
       * Our bad actors when it comes to polyfill'ed shadowDOM.
       * Naughty, naughty shadyDOM. Fortunately this is only IE11/Edge
       */
      case "text-indent":
        HAXStore.activeHaxBody.__indentTrap = true;
        document.execCommand("indent");
        prevent = true;
        break;
      case "text-outdent":
        HAXStore.activeHaxBody.__indentTrap = true;
        document.execCommand("outdent");
        prevent = true;
        break;
    }
    if (prevent) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /**
   * Test for safari, if it is don't place things in the menu
   */
  _isSafari() {
    let ua = navigator.userAgent.toLowerCase();
    // test to find safari to account for it's handling
    // of what's been selected. This isn't great UX but
    // there's literally nothing we can do for Safari
    // because of https://github.com/LRNWebComponents/hax-body/issues/38
    if (ua.indexOf("safari") != -1) {
      if (ua.indexOf("chrome") > -1) {
      } else {
        return true;
      }
    }
    return false;
  }
}
window.customElements.define(HaxTextContext.tag, HaxTextContext);
export { HaxTextContext };
