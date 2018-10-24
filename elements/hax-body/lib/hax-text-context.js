import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "md-extra-icons/md-extra-icons.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@polymer/paper-item/paper-item.js";
import "@lrnwebcomponents/materializecss-styles/colors.js";
import "@polymer/iron-icons/iron-icons.js";
import "./hax-context-item-menu.js";
import "./hax-context-item.js";
import "./hax-context-item-textop.js";
import "./hax-toolbar.js";
import "./hax-toolbar-item.js";
/**
`hax-text-context`
A context menu that provides common text based authoring options.

@demo demo/index.html

@microcopy - the mental model for this element
 - context menu - this is a menu of text based buttons and events for use in a larger solution.
*/
Polymer({
  _template: html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
        pointer-events: none;
      }
      paper-item:hover {
        background-color: #d3d3d3;
        cursor: pointer;
      }
    </style>
    <hax-toolbar>
      <hax-context-item-menu slot="primary" selected-value="{{selectedValue}}" id="formatsize" icon="text-format" label="Format" event-name="text-tag">
        <paper-item value="p">Normal text</paper-item>
        <paper-item value="h2">Title</paper-item>
        <paper-item value="h3">Content heading</paper-item>
        <paper-item value="h4">Subheading</paper-item>
        <paper-item value="h5">Deeper subheading</paper-item>
        <paper-item value="blockquote">Quote</paper-item>
        <paper-item value="code">Code</paper-item>
      </hax-context-item-menu>
      <hax-context-item-menu slot="primary" selected-value="{{justifyValue}}" id="justify" icon="[[justifyIcon]]" label="Alignment">
        <paper-item value="" hidden=""></paper-item>
        <paper-item value="text-align-left">
          <iron-icon icon="editor:format-align-left"></iron-icon>
        </paper-item>
        <paper-item value="text-align-right">
          <iron-icon icon="editor:format-align-right"></iron-icon>
        </paper-item>
      </hax-context-item-menu>
      <hax-context-item-textop slot="primary" icon="editor:format-list-numbered" label="Numbered list" event-name="text-list-numbered" hidden\$="[[!polyfillSafe]]"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:format-list-bulleted" label="Bulleted list" event-name="text-list-bulleted" hidden\$="[[!polyfillSafe]]"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:format-indent-increase" label="Indent" event-name="text-indent" hidden\$="[[!polyfillSafe]]"></hax-context-item-textop>
      <hax-context-item-textop slot="primary" icon="editor:format-indent-decrease" label="Outdent" event-name="text-outdent" hidden\$="[[!polyfillSafe]]"></hax-context-item-textop>
    </hax-toolbar>
`,

  is: "hax-text-context",

  listeners: {
    "hax-context-item-selected": "_haxContextOperation"
  },

  properties: {
    /**
     * Justify icon to reflect state.
     */
    justifyIcon: {
      type: String,
      value: "editor:format-align-left"
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
     * Selected value to match text direction currently.
     */
    justifyValue: {
      type: String,
      value: "text-align-left",
      notify: true
    }
  },

  /**
   * Ready, figure out polyfill
   */
  ready: function() {
    this.polyfillSafe = Polymer.HaxStore.instance.computePolyfillSafe();
  },

  /**
   * Respond to simple modifications.
   */
  _haxContextOperation: function(e) {
    let detail = e.detail;
    // support a simple insert event to bubble up or everything else
    switch (detail.eventName) {
      // wow these are way too easy
      case "text-align-left":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "text-align-center":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "text-align-right":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "text-justify-full":
        this.justifyIcon = detail.target.children[0].attributes[0].value;
        break;
      case "close-menu":
        this.$.justify.$.menu.hideMenu();
        this.$.formatsize.$.menu.hideMenu();
        break;
      /**
       * Our bad actors when it comes to polyfill'ed shadowDOM.
       * Naughty, naughty shadyDOM.
       */
      case "text-indent":
        document.execCommand("indent");
        break;
      case "text-outdent":
        document.execCommand("outdent");
        break;
      case "text-list-numbered":
        document.execCommand("insertOrderedList");
        break;
      case "text-list-bulleted":
        document.execCommand("insertUnorderedList");
        break;
    }
  }
});
