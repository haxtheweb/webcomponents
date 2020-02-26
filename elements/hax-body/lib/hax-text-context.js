import { LitElement, html, css } from "lit-element/lit-element.js";
import { winEventsElement } from "@lrnwebcomponents/utils/utils.js";
/**
 * `hax-text-context`
 * @customElement hax-text-context
 * `A context menu that provides common text based authoring options.`
 * @microcopy - the mental model for this element
 * - context menu - this is a menu of text based buttons and events for use in a larger solution.
 */
class HaxTextContext extends winEventsElement(LitElement) {
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
        paper-item {
          color: white;
          background-color: var(--hax-contextual-action-color);
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
        paper-item strong {
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
          top: 64px;
          opacity: 0.95;
        }
        :host(.hax-context-pin-bottom) hax-toolbar {
          position: fixed;
          bottom: 0;
          opacity: 0.95;
        }
      `
    ];
  }
  constructor() {
    super();
    this.__winEvents = {
      "hax-store-property-updated": "_haxStorePropertyUpdated"
    };
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/iron-icon/iron-icon.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item-menu.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item.js");
    import("@lrnwebcomponents/hax-body/lib/hax-context-item-textop.js");
    import("@lrnwebcomponents/hax-body/lib/hax-toolbar.js");
    setTimeout(() => {
      this.addEventListener(
        "hax-context-item-selected",
        this._haxContextOperation.bind(this)
      );
    }, 0);
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
  }
  render() {
    return html`
      <hax-toolbar
        .selected="${this.selection}"
        ?hide-more="${!this.hasSelectedText}"
        id="toolbar"
      >
        <hax-context-item-menu
          action
          mini
          slot="primary"
          .selected-value="${this.selectedValue}"
          @selected-value-changed="${this.selectedValueChanged}"
          id="formatsize"
          icon="${this.formatIcon}"
          label="Text format"
          event-name="text-tag"
        >
          <paper-item value="p"
            ><iron-icon icon="hax:paragraph"></iron-icon>Paragraph</paper-item
          >
          <paper-item value="ul"
            ><iron-icon icon="editor:format-list-bulleted"></iron-icon>Bulleted
            list</paper-item
          >
          <paper-item value="ol"
            ><iron-icon icon="editor:format-list-numbered"></iron-icon>Numbered
            list</paper-item
          >
          <paper-item value="h2"
            ><iron-icon icon="hax:h2"></iron-icon>Title
          </paper-item>
          <paper-item value="h3"
            ><iron-icon icon="hax:h3"></iron-icon>Content heading
          </paper-item>
          <paper-item value="h4"
            ><iron-icon icon="hax:h4"></iron-icon>Subheading
          </paper-item>
          <paper-item value="h5"
            ><iron-icon icon="hax:h5"></iron-icon>Deep subheading
          </paper-item>
          <paper-item value="blockquote"
            ><iron-icon icon="editor:format-quote"></iron-icon>Blockquote
          </paper-item>
          <paper-item value="code"
            ><iron-icon icon="icons:code"></iron-icon>Code
          </paper-item>
        </hax-context-item-menu>
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
          event-name="text-bold"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-italic"
          label="Italic"
          event-name="text-italic"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:insert-link"
          label="Link"
          event-name="text-link"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="mdextra:unlink"
          label="Remove link"
          event-name="text-unlink"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="editor:format-clear"
          label="Remove format"
          event-name="text-remove-format"
          ?hidden="${!this.hasSelectedText}"
        ></hax-context-item-textop>
        <hax-context-item
          mini
          action
          slot="primary"
          icon="hax:add-brick"
          label="Add element to selection"
          event-name="insert-inline-gizmo"
          ?hidden="${this.isSafari || !this.hasSelectedText}"
        ></hax-context-item>
        <hax-context-item-textop
          mini
          action
          slot="primary"
          icon="hax:add-brick"
          label="Add element to selection"
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
  selectedValueChanged(e) {
    this.selectedValue = e.detail;
  }
  static get tag() {
    return "hax-text-context";
  }
  static get properties() {
    return {
      _showIndent: {
        type: Boolean
      },
      _showLists: {
        type: Boolean
      },
      realSelectedValue: {
        type: String
      },
      /**
       * calculated boolean off of if there is currently text
       */
      hasSelectedText: {
        type: Boolean
      },
      /**
       * Text hax-store has detected is selected currently.
       */
      haxSelectedText: {
        type: String
      },
      /**
       * Selected value to match format of the tag currently.
       */
      selectedValue: {
        type: Number,
        attribute: "selected-value"
      },
      /**
       * Selection tracking
       */
      selection: {
        type: Boolean
      },
      /**
       * Selected item icon
       */
      formatIcon: {
        type: String,
        attribute: "format-icon"
      },
      /**
       * Is this safari
       */
      isSafari: {
        type: Boolean,
        attribute: "is-safari"
      }
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // computed based on these changing
      if (
        this.realSelectedValue &&
        propName == "realSelectedValue" &&
        this.shadowRoot
      ) {
        this._showIndent = this._computeShowIndent(this.realSelectedValue);
        if (this._showIndent || this.realSelectedValue == "p") {
          this._showLists = true;
        } else {
          this._showLists = false;
        }
        for (var i in this.shadowRoot.querySelector("#formatsize").children) {
          if (
            this.shadowRoot.querySelector("#formatsize").children[i] &&
            this.shadowRoot.querySelector("#formatsize").children[i]
              .getAttribute &&
            this.shadowRoot
              .querySelector("#formatsize")
              .children[i].getAttribute("value") == this.realSelectedValue
          ) {
            this.selectedValue = i;
          }
        }
      }
      // calculate boolean status of having text
      if (propName == "haxSelectedText") {
        this.hasSelectedText = this[propName].length > 0;
      }
      if (propName == "selectedValue") {
        this.realSelectedValue = this.shadowRoot
          .querySelector("#formatsize")
          .children[this.selectedValue].getAttribute("value");
        this.formatIcon = this.shadowRoot
          .querySelector("#formatsize")
          .children[this[propName]].querySelector("iron-icon").icon;
        // fire an event that this is a core piece of the system
        this.dispatchEvent(
          new CustomEvent("selected-value-changed", {
            detail: this[propName]
          })
        );
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
        setTimeout(() => {
          this.shadowRoot
            .querySelector("#formatsize")
            .shadowRoot.querySelector("#menu")
            .hideMenu();
        }, 200);
        break;
      case "insert-inline-gizmo":
        if (
          window.HaxStore._tmpSelection &&
          window.HaxStore.instance.editMode
        ) {
          var localRange = false;
          try {
            if (
              window.HaxStore._tmpRange.startContainer.parentNode.parentNode
                .tagName === "HAX-BODY" ||
              window.HaxStore._tmpRange.startContainer.parentNode.parentNode
                .parentNode.tagName === "HAX-BODY"
            ) {
              window.HaxStore.write(
                "activePlaceHolder",
                window.HaxStore._tmpRange,
                this
              );
              localRange = window.HaxStore._tmpRange;
            }
          } catch (err) {}
        }
        if (localRange || window.HaxStore.instance.activePlaceHolder != null) {
          // store placeholder because if this all goes through we'll want
          // to kill the originating text
          let values = {
            text: window.HaxStore.instance.activePlaceHolder.toString()
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
            selection.focusNode.parentNode.setAttribute("data-editable", true);
            // just to be safe
            selection.focusNode.parentNode.removeEventListener("click", e => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
            });
            selection.focusNode.parentNode.addEventListener("click", e => {
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
