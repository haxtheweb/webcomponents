import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item-textop.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import "@lrnwebcomponents/simple-popover/lib/simple-popover-selection.js";
import { SimpleTourFinder } from "@lrnwebcomponents/simple-popover/lib/SimpleTourFinder";
import { HAXStore } from "./hax-store.js";
import { autorun, toJS } from "mobx";

/**
 * `hax-text-context`
 * @element hax-text-context
 * `A context menu that provides common text based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 */
class HaxTextContext extends SimpleTourFinder(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          pointer-events: none;
        }
        :host [hidden] {
          display: none;
        }
        simple-popover-selection {
          display: flex;
        }
        .selected-buttons {
          transition: 0.1s all ease-in-out;
          width: 0;
        }
        :host([has-selected-text]) .selected-buttons {
          width: 100%;
        }
        #toolbar {
          overflow: hidden;
        }
        button {
          color: black;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          font-size: 11px;
          line-height: 24px;
          margin: 0;
          padding: 0 4px;
          min-height: 24px;
        }
        button:hover {
          cursor: pointer;
          color: black;
        }
        simple-icon-lite {
          --simple-icon-height: 20px;
          --simple-icon-width: 20px;
          padding: 4px;
        }
        hax-context-item-textop,
        hax-context-item {
          transition: all 0.2s linear;
          visibility: visible;
          opacity: 1;
        }
        hax-context-item-textop[hidden],
        hax-context-item[hidden] {
          visibility: hidden;
          opacity: 0;
        }
        :host(.hax-context-pin-top) hax-toolbar {
          position: fixed;
          top: 0px;
          flex-direction: column;
        }
      `,
    ];
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
    this.formatIcon = "hax:format-textblock";
    this.isSafari = this._isSafari();
    autorun(() => {
      this.hasSelectedText = toJS(HAXStore.haxSelectedText).length > 0;
    });
    autorun(() => {
      // this just forces this block to run when editMode is modified
      const editMode = toJS(HAXStore.editMode);
      const activeNode = toJS(HAXStore.activeNode);
      if (toJS(HAXStore.activeNode) && toJS(HAXStore.activeNode).tagName) {
        let schema = HAXStore.haxSchemaFromTag(HAXStore.activeNode.tagName);
        this.sourceView = schema.canEditSource;
      }
      // update our icon if global changes what we are pointing to
      if (
        HAXStore.isTextElement(activeNode) &&
        this.shadowRoot.querySelector(
          '#textformat button[value="' + activeNode.tagName.toLowerCase() + '"]'
        )
      ) {
        if (this.shadowRoot.querySelector("simple-popover-selection").opened) {
          this.shadowRoot.querySelector(
            "simple-popover-selection"
          ).opened = false;
        }
        this.updateTextIconSelection(activeNode.tagName.toLowerCase());
      }
    });
  }
  render() {
    return html`
      <hax-toolbar id="toolbar">
        <simple-popover-selection
          slot="primary"
          @simple-popover-selection-changed="${this.textFormatChanged}"
          auto
          orientation="tb"
          id="textformat"
        >
          <div slot="style">
            simple-popover-manager button { color: black; font-size: 10px
            !important; margin: 0; padding: 4px; text-align:left; overflow:
            hidden; min-height: unset; width: 100%; display: block;
            justify-content: start; align-items: center; border: 0; }
            simple-popover-manager button simple-icon-lite {
            --simple-icon-height: 18px; --simple-icon-width: 18px; margin-right:
            8px; }
          </div>
          <hax-context-item
            action
            mini
            slot="button"
            id="formatsize"
            icon="${this.formatIcon}"
            label="Text format"
            data-simple-tour-stop
            data-stop-title="label"
          >
            <div slot="tour" data-stop-content>
              Change how the text is structured and visualized in the page.
            </div>
          </hax-context-item>
          ${this.formattingList.map(
            (val) =>
              html` <button slot="options" value="${val.value}">
                <simple-icon-lite icon="${val.icon}"></simple-icon-lite>
                ${val.text}
              </button>`
          )}
        </simple-popover-selection>
        <hax-context-item
          mini
          action
          slot="primary"
          icon="icons:code"
          label="Modify HTML source"
          ?hidden="${!this.sourceView}"
          event-name="hax-source-view-toggle"
        ></hax-context-item>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-list-bulleted"
          event-name="text-tag-ul"
          label="Bulleted list"
          .hidden="${!this._showLists}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-list-numbered"
          label="Numbered list"
          event-name="text-tag-ol"
          .hidden="${!this._showLists}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-indent-decrease"
          label="Outdent"
          event-name="text-outdent"
          .hidden="${!this._showIndent}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-indent-increase"
          label="Indent"
          event-name="text-indent"
          .hidden="${!this._showIndent}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-bold"
          label="Bold"
          class="selected-buttons"
          event-name="text-bold"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-italic"
          label="Italic"
          class="selected-buttons"
          event-name="text-italic"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:insert-link"
          label="Link"
          class="selected-buttons"
          event-name="text-link"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="mdextra:unlink"
          label="Remove link"
          class="selected-buttons"
          event-name="text-unlink"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-clear"
          label="Remove format"
          class="selected-buttons"
          event-name="text-remove-format"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item
          mini
          action
          slot="primary"
          icon="hax:add-brick"
          label="Add element to selection"
          class="selected-buttons"
          event-name="insert-inline-gizmo"
          ?hidden="${this.isSafari || !this.hasSelectedText}"
        ></hax-context-item>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="hax:add-brick"
          label="Add element to selection"
          class="selected-buttons"
          event-name="insert-inline-gizmo"
          ?hidden="${!this.isSafari || !this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="mdextra:subscript"
          event-name="text-subscript"
          ?hidden="${!this.hasSelectedText}"
          >Subscript</hax-context-item-textop
        >
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="mdextra:superscript"
          event-name="text-superscript"
          ?hidden="${!this.hasSelectedText}"
          >Superscript</hax-context-item-textop
        >
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="editor:format-underlined"
          event-name="text-underline"
          ?hidden="${!this.hasSelectedText}"
          >Underline</hax-context-item-textop
        >
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="editor:format-strikethrough"
          event-name="text-strikethrough"
          ?hidden="${!this.hasSelectedText}"
          >Cross out</hax-context-item-textop
        >
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="hardware:keyboard-arrow-up"
          event-name="insert-above-active"
          >Insert item above</hax-context-item-textop
        >
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="hardware:keyboard-arrow-down"
          event-name="insert-below-active"
          >Insert item below</hax-context-item-textop
        >
      </hax-toolbar>
    `;
  }
  static get tag() {
    return "hax-text-context";
  }
  static get properties() {
    return {
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
    };
  }
  textFormatChanged(e) {
    // set internally
    this.shadowRoot.querySelector("simple-popover-selection").opened = false;
    this.updateTextIconSelection(e.detail.getAttribute("value"));
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
    // clear active if there is one
    if (
      this.shadowRoot.querySelector("[data-simple-popover-selection-active]")
    ) {
      this.shadowRoot
        .querySelector("[data-simple-popover-selection-active]")
        .removeAttribute("data-simple-popover-selection-active");
    }
    let localItem = this.shadowRoot.querySelector(
      '#textformat button[value="' + this.realSelectedValue + '"]'
    );
    localItem.setAttribute("data-simple-popover-selection-active", true);
    this.formatIcon = localItem
      .querySelector("simple-icon-lite")
      .getAttribute("icon");
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
