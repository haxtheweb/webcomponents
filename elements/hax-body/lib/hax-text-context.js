import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/md-extra-icons/md-extra-icons.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
import "./hax-context-item-textop.js";
import "./hax-toolbar.js";
import "./hax-shared-styles.js";

/**
`hax-text-context`
A context menu that provides common text based authoring options.

* @demo demo/index.html

@microcopy - the mental model for this element
 - context menu - this is a menu of text based buttons and events for use in a larger solution.
*/
Polymer({
  _template: html`
    <style include="simple-colors hax-shared-styles">
      :host {
        display: block;
        pointer-events: none;
        background-color: white;
      }
      :host [hidden] {
        display: none;
      }
      paper-item {
        -webkit-justify-content: flex-start;
        justify-content: flex-start;
        height: 36px;
        padding: 0 8px;
        min-height: 36px;
      }
      paper-item:hover {
        background-color: #d3d3d3;
        cursor: pointer;
      }
      iron-icon {
        padding: 8px;
      }
      paper-item strong {
        padding: 8px;
        font-size: 12px;
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
    </style>
    <hax-toolbar selected="[[selection]]" hide-transform="" id="toolbar">
      <hax-context-item-menu
        slot="primary"
        selected-value="{{selectedValue}}"
        id="formatsize"
        icon="text-format"
        label="Format"
        event-name="text-tag"
      >
        <paper-item value="p"
          ><iron-icon icon="editor:format-textdirection-l-to-r"></iron-icon
          >Normal text <strong>&lt;P&gt;</strong></paper-item
        >
        <paper-item value="ul"
          ><iron-icon icon="editor:format-list-bulleted"></iron-icon>Bulleted
          list <strong>&lt;UL&gt;</strong></paper-item
        >
        <paper-item value="ol"
          ><iron-icon icon="editor:format-list-numbered"></iron-icon>Numbered
          list <strong>&lt;OL&gt;</strong></paper-item
        >
        <paper-item value="h2"
          ><iron-icon icon="editor:title"></iron-icon>Title
          <strong>&lt;H2&gt;</strong></paper-item
        >
        <paper-item value="h3"
          ><iron-icon icon="editor:title"></iron-icon>Content heading
          <strong>&lt;H3&gt;</strong></paper-item
        >
        <paper-item value="h4"
          ><iron-icon icon="editor:text-fields"></iron-icon>Subheading
          <strong>&lt;H4&gt;</strong></paper-item
        >
        <paper-item value="h5"
          ><iron-icon icon="editor:text-fields"></iron-icon>Deeper subheading
          <strong>&lt;H5&gt;</strong></paper-item
        >
        <paper-item value="blockquote"
          ><iron-icon icon="editor:format-quote"></iron-icon>Quote<strong
            >&lt;blockquote&gt;</strong
          ></paper-item
        >
        <paper-item value="code"
          ><iron-icon icon="icons:code"></iron-icon>Code block<strong
            >&lt;code&gt;</strong
          ></paper-item
        >
      </hax-context-item-menu>
      <hax-context-item-textop
        slot="primary"
        icon="editor:format-bold"
        label="Bold"
        event-name="text-bold"
      ></hax-context-item-textop>
      <hax-context-item-textop
        slot="primary"
        icon="editor:format-italic"
        label="Italic"
        event-name="text-italic"
      ></hax-context-item-textop>
      <hax-context-item-textop
        slot="primary"
        icon="editor:insert-link"
        label="Link"
        event-name="text-link"
      ></hax-context-item-textop>
      <hax-context-item-textop
        slot="primary"
        icon="editor:format-list-bulleted"
        event-name="text-list-bulleted"
        label="Bulleted list"
        hidden$="[[!_showIndent]]"
      ></hax-context-item-textop>
      <hax-context-item-textop
        slot="primary"
        icon="editor:format-list-numbered"
        label="Numbered list"
        event-name="text-list-numbered"
        hidden\$="[[!_showIndent]]"
      ></hax-context-item-textop>
      <hax-context-item-textop
        slot="primary"
        icon="editor:format-indent-decrease"
        label="Outdent"
        event-name="text-outdent"
        hidden$="[[!_showIndent]]"
      ></hax-context-item-textop>
      <hax-context-item-textop
        slot="primary"
        icon="editor:format-indent-increase"
        label="Indent"
        event-name="text-indent"
        hidden$="[[!_showIndent]]"
      ></hax-context-item-textop>
      <hax-context-item-textop
        slot="primary"
        icon="editor:format-clear"
        label="Remove format"
        event-name="text-remove-format"
      ></hax-context-item-textop>
      <hax-context-item
        slot="primary"
        icon="device:graphic-eq"
        label="Advanced item"
        event-name="insert-inline-gizmo"
        hidden$="[[isSafari]]"
      ></hax-context-item>
      <hax-context-item-textop
        slot="primary"
        icon="device:graphic-eq"
        label="Advanced item"
        event-name="insert-inline-gizmo"
        hidden$="[[!isSafari]]"
      ></hax-context-item-textop>

      <hax-context-item-textop
        menu=""
        slot="more"
        icon="mdextra:unlink"
        event-name="text-unlink"
        >Remove link</hax-context-item-textop
      >
      <hax-context-item-textop
        menu=""
        slot="more"
        icon="mdextra:subscript"
        event-name="text-subscript"
        >Subscript</hax-context-item-textop
      >
      <hax-context-item-textop
        menu=""
        slot="more"
        icon="mdextra:superscript"
        event-name="text-superscript"
        >Superscript</hax-context-item-textop
      >
      <hax-context-item-textop
        menu=""
        slot="more"
        icon="editor:format-strikethrough"
        event-name="text-strikethrough"
        >Cross out</hax-context-item-textop
      >
    </hax-toolbar>
  `,

  is: "hax-text-context",

  listeners: {
    "hax-context-item-selected": "_haxContextOperation"
  },

  properties: {
    _showIndent: {
      type: Boolean,
      computed: "_computeShowIndent(selectedValue, polyfillSafe)"
    },
    /**
     * Polyfill safe; this helps remove options from polyfilled platforms
     * as far as text manipulation operations.
     */
    polyfillSafe: {
      type: Boolean
    },
    /**
     * Selected value to match format of the tag currently.
     */
    selectedValue: {
      type: String,
      value: "p",
      notify: true
    },
    /**
     * Selection tracking
     */
    selection: {
      type: Boolean,
      value: false
    },
    /**
     * Is this safari
     */
    isSafari: {
      type: Boolean,
      notify: true,
      computed: "_isSafari()"
    }
  },
  /**
   *
   */
  _computeShowIndent(selectedValue, polyfillSafe) {
    if (polyfillSafe && (selectedValue === "ol" || selectedValue === "ul")) {
      return true;
    }
    return false;
  },
  /**
   * Ready, figure out polyfill
   */
  attached: function() {
    this.polyfillSafe = window.HaxStore.instance.computePolyfillSafe();
  },

  /**
   * Respond to simple modifications.
   */
  _haxContextOperation: function(e) {
    let detail = e.detail;
    let selection = window.HaxStore.getSelection();
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      case "close-menu":
        this.$.formatsize.$.menu.hideMenu();
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
        break;
      case "text-italic":
        document.execCommand("italic");
        break;
      case "text-underline":
        document.execCommand("underline");
        // silly hack to account for trigging a selection from
        // inside the menu that isn't from a paper-item
        this.$.toolbar.$.moremenu.$.menu.hideMenu();
        break;
      case "text-subscript":
        document.execCommand("subscript");
        // silly hack to account for trigging a selection from
        // inside the menu that isn't from a paper-item
        this.$.toolbar.$.moremenu.$.menu.hideMenu();
        break;
      case "text-superscript":
        document.execCommand("superscript");
        // silly hack to account for trigging a selection from
        // inside the menu that isn't from a paper-item
        this.$.toolbar.$.moremenu.$.menu.hideMenu();
        break;
      case "text-remove-format":
        document.execCommand("removeFormat");
        break;
      case "text-strikethrough":
        document.execCommand("strikeThrough");
        // silly hack to account for trigging a selection from
        // inside the menu that isn't from a paper-item
        this.$.toolbar.$.moremenu.$.menu.hideMenu();
        break;
      case "text-link":
        var href = "";
        if (typeof selection.focusNode.parentNode.href !== typeof undefined) {
          href = selection.focusNode.parentNode.href;
        }
        // @todo put in a dialog instead of this
        let url = prompt("Enter a URL:", href);
        if (url) {
          document.execCommand("createLink", false, url);
        }
        break;
      case "text-unlink":
        document.execCommand("unlink");
        break;
      /**
       * Our bad actors when it comes to polyfill'ed shadowDOM.
       * Naughty, naughty shadyDOM. Fortunately this is only IE11/Edge
       */
      case "text-indent":
        document.execCommand("indent");
        break;
      case "text-outdent":
        document.execCommand("outdent");
        break;
      case "text-list-numbered":
        try {
          document.execCommand("insertOrderedList");
        } catch (e) {}
        break;
      case "text-list-bulleted":
        try {
          document.execCommand("insertUnorderedList");
        } catch (e) {}
        break;
    }
  },

  /**
   * Test for safari, if it is don't place things in the menu
   */
  _isSafari: function() {
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
});
