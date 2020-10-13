import { LitElement, html, css } from "lit-element/lit-element.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icon/iron-icon.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item.js";
import "@lrnwebcomponents/hax-body/lib/hax-context-item-textop.js";
import "@lrnwebcomponents/hax-body/lib/hax-toolbar.js";
import "@lrnwebcomponents/simple-popover/lib/simple-popover-selection.js";
import { HAXTourFinder } from "./HAXTourFinder.js";

/**
 * `hax-text-context`
 * @element hax-text-context
 * `A context menu that provides common text based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 */
class HaxTextContext extends HAXTourFinder(winEventsElement(LitElement)) {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          pointer-events: none;
          --hax-contextual-action-color: var(
            --simple-colors-default-theme-cyan-8,
            #007999
          );
        }
        hax-context-item-textop:not(:defined),
        hax-context-item-menu:not(:defined),
        hax-context-item:not(:defined),
        hax-toolbar:not(:defined),
        paper-item:not(:defined),
        iron-icon:not(:defined) {
          display: none;
        }
        :host [hidden] {
          display: none;
        }
        simple-popover-selection {
          display: inline-flex;
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
        paper-item {
          color: black;
          -webkit-justify-content: flex-start;
          justify-content: flex-start;
          font-size: 11px;
          line-height: 24px;
          margin: 0;
          padding: 0 4px;
          min-height: 24px;
        }
        paper-item:hover {
          cursor: pointer;
          color: black;
        }
        iron-icon {
          width: 20px;
          height: 20px;
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
          top: 40px;
          flex-direction: column;
        }
      `,
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated",
    };
    setTimeout(() => {
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
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
    this.selection = false;
    this.formatIcon = "hax:format-textblock";
    this.isSafari = this._isSafari();
  }
  /**
   * Store updated, sync.
   */
  _haxStorePropertyUpdated(e) {
    if (
      e.detail &&
      typeof e.detail.value !== typeof undefined &&
      e.detail.property
    ) {
      this[e.detail.property] = e.detail.value;
    }
    // update our icon if global changes what we are pointing to
    if (
      e.detail.property == "activeNode" &&
      window.HaxStore.instance.isTextElement(e.detail.value) &&
      this.shadowRoot.querySelector(
        '#textformat paper-item[value="' +
          e.detail.value.tagName.toLowerCase() +
          '"]'
      )
    ) {
      if (this.shadowRoot.querySelector("simple-popover-selection").opened) {
        this.shadowRoot.querySelector(
          "simple-popover-selection"
        ).opened = false;
      }
      this.updateTextIconSelection(e.detail.value.tagName.toLowerCase());
    }
  }
  render() {
    return html`
      <hax-toolbar
        .selected="${this.selection}"
        ?hide-more="${!this.hasSelectedText}"
        id="toolbar"
      >
        <simple-popover-selection
          slot="primary"
          @simple-popover-selection-changed="${this.textFormatChanged}"
          auto
          orientation="tb"
          id="textformat"
        >
          <style slot="style">
            simple-popover-manager paper-item {
              color: var(--simple-colors-default-theme-cyan-8);
              font-size: 10px !important;
              margin: 0;
              padding: 2px;
              min-height: unset;
            }
            simple-popover-manager paper-item iron-icon {
              width: 18px;
              margin-right: 8px;
            }
          </style>
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
              html` <paper-item slot="options" value="${val.value}">
                <iron-icon icon="${val.icon}"></iron-icon>
                ${val.text}
              </paper-item>`
          )}
        </simple-popover-selection>
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
          ?disabled="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-italic"
          label="Italic"
          class="selected-buttons"
          event-name="text-italic"
          ?disabled="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:insert-link"
          label="Link"
          class="selected-buttons"
          event-name="text-link"
          ?disabled="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="mdextra:unlink"
          label="Remove link"
          class="selected-buttons"
          event-name="text-unlink"
          ?disabled="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-clear"
          label="Remove format"
          class="selected-buttons"
          event-name="text-remove-format"
          ?disabled="${!this.hasSelectedText}"
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
          >Subscript</hax-context-item-textop
        >
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="mdextra:superscript"
          event-name="text-superscript"
          >Superscript</hax-context-item-textop
        >
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="editor:format-underlined"
          event-name="text-underline"
          >Underline</hax-context-item-textop
        >
        <hax-context-item-textop
          action
          menu
          slot="more"
          icon="editor:format-strikethrough"
          event-name="text-strikethrough"
          >Cross out</hax-context-item-textop
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
       * Text hax-store has detected is selected currently.
       */
      haxSelectedText: {
        type: String,
      },
      /**
       * Selection tracking
       */
      selection: {
        type: Boolean,
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
    this.updateTextIconSelection(e.detail.getAttribute("value"));
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
      '#textformat paper-item[value="' + this.realSelectedValue + '"]'
    );
    localItem.setAttribute("data-simple-popover-selection-active", true);
    this.formatIcon = localItem.querySelector("iron-icon").getAttribute("icon");
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // computed based on these changing
      if (propName == "realSelectedValue" && this.shadowRoot) {
        this._showIndent = this._computeShowIndent(this.realSelectedValue);
        if (this.realSelectedValue == "p") {
          this._showLists = true;
        } else {
          this._showLists = false;
        }
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
      // calculate boolean status of having text
      if (propName == "haxSelectedText") {
        this.hasSelectedText = this[propName].length > 0;
      }
    });
  }
  /**
   * Show indentation on lists
   */
  _computeShowIndent(realSelectedValue) {
    if (
      window.HaxStore.instance.computePolyfillSafe() &&
      (realSelectedValue == "ol" || realSelectedValue == "ul")
    ) {
      return true;
    }
    return false;
  }
  /**
   * Respond to simple modifications.
   */
  _haxContextOperation(e) {
    let detail = e.detail;
    let selection = window.HaxStore.getSelection();
    let prevent = false;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "close-menu":
        // force selection menu closed if open
        if (this.shadowRoot.querySelector("simple-popover-selection").opened) {
          this.shadowRoot.querySelector(
            "simple-popover-selection"
          ).opened = false;
        }
        break;
      case "insert-inline-gizmo":
        if (
          window.HaxStore._tmpSelection &&
          window.HaxStore.instance.editMode
        ) {
          try {
            if (
              window.HaxStore._tmpRange.startContainer.parentNode.parentNode
                .tagName === "HAX-BODY" ||
              window.HaxStore._tmpRange.startContainer.parentNode.parentNode
                .parentNode.tagName === "HAX-BODY"
            ) {
              window.HaxStore.instance.activePlaceHolder =
                window.HaxStore._tmpRange;
              window.HaxStore.write(
                "activePlaceHolder",
                window.HaxStore._tmpRange,
                this
              );
            }
          } catch (err) {}
        }
        if (window.HaxStore.instance.activePlaceHolder != null) {
          // store placeholder because if this all goes through we'll want
          // to kill the originating text
          let values = {
            text: window.HaxStore.instance.activePlaceHolder.toString(),
          };
          let type = "inline";
          let haxElements = window.HaxStore.guessGizmo(type, values);
          // see if we got anything
          if (haxElements.length > 0) {
            // hand off to hax-app-picker to deal with the rest of this
            window.HaxStore.instance.haxAppPicker.presentOptions(
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
      case "text-underline":
        document.execCommand("underline");
        prevent = true;
        // silly hack to account for trigging a selection from
        // inside the menu that isn't from a paper-item
        this.shadowRoot
          .querySelector("#toolbar")
          .shadowRoot.querySelector("#moremenu")
          .shadowRoot.querySelector("#menu")
          .hideMenu();
        break;
      case "text-subscript":
        document.execCommand("subscript");
        prevent = true;
        // silly hack to account for trigging a selection from
        // inside the menu that isn't from a paper-item
        this.shadowRoot
          .querySelector("#toolbar")
          .shadowRoot.querySelector("#moremenu")
          .shadowRoot.querySelector("#menu")
          .hideMenu();
        break;
      case "text-superscript":
        document.execCommand("superscript");
        prevent = true;
        // silly hack to account for trigging a selection from
        // inside the menu that isn't from a paper-item
        this.shadowRoot
          .querySelector("#toolbar")
          .shadowRoot.querySelector("#moremenu")
          .shadowRoot.querySelector("#menu")
          .hideMenu();
        break;
      case "text-remove-format":
        document.execCommand("removeFormat");
        prevent = true;
        break;
      case "text-strikethrough":
        document.execCommand("strikeThrough");
        prevent = true;
        // silly hack to account for trigging a selection from
        // inside the menu that isn't from a paper-item
        this.shadowRoot
          .querySelector("#toolbar")
          .shadowRoot.querySelector("#moremenu")
          .shadowRoot.querySelector("#menu")
          .hideMenu();
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
        document.execCommand("indent");
        prevent = true;
        break;
      case "text-outdent":
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
