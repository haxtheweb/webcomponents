define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-a11y-keys/iron-a11y-keys.js",
  "../node_modules/@lrnwebcomponents/simple-search/lib/simple-search-content.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_8515ab50e70611e89fc38fd9bed061c6() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n      :host {\n        cursor: default;\n        display: table-row;\n        width: 100%;\n        color: var(--a11y-media-transcript-color);\n        background-color: var(--a11y-media-transcript-bg-color);\n        transition: color 0.25s, background-color 0.25s;\n      }\n      :host([hide-timestamps]) {\n        display: inline;\n      }\n      :host(:not([active]):not([disabled]):active),\n      :host(:not([active]):not([disabled]):focus),\n      :host(:not([active]):not([disabled]):hover) {\n        cursor: pointer;\n        color: var(--a11y-media-transcript-focused-cue-color);\n        background-color: var(--a11y-media-transcript-focused-cue-bg-color);\n        outline: 1px dotted var(--a11y-media-transcript-focused-cue-color);\n        @apply --a11y-media-transcript-focused-cue;\n      }\n      :host([active]) {\n        color: var(--a11y-media-transcript-active-cue-color);\n        background-color: var(--a11y-media-transcript-active-cue-bg-color);\n        @apply --a11y-media-transcript-active-cue;\n      }\n      :host #text {\n        display: table-cell;\n        width: 100%;\n        line-height: 200%;\n      }\n      :host([hide-timestamps]) #text {\n        display: inline;\n      }\n      :host #time {\n        display: table-cell;\n        font-size: 80%;\n        padding: 0 16px 0 0;\n        white-space: nowrap;\n        font-family: monospace;\n      }\n      :host([hide-timestamps]) #time {\n        display: none;\n      }\n      :host simple-search-content {\n        --simple-search-match-text-color: var(--a11y-media-transcript-match-color);\n        --simple-search-match-bg-color: var(--a11y-media-transcript-match-bg-color);\n        --simple-search-match-border-color:  var(--a11y-media-transcript-match-border-color);\n        --simple-search-match: {\n          border: none;\n          border-radius: 4px;\n          font-weight: normal;\n        };\n      }\n      @media print {\n        :host, :host([active]),\n        :host(:not([active]):not([disabled]):active),\n        :host(:not([active]):not([disabled]):focus),\n        :host(:not([active]):not([disabled]):hover) {\n          color: #000000;\n          background-color: #ffffff;\n        }\n      }\n    </style>\n    <span id="time">[[cue.start]] - [[cue.end]]</span>\n    <span id="text">\n      <simple-search-content id="content" content="[[cue.text]]"></simple-search-content>\n    </span>\n    <iron-a11y-keys id="a11y" keys="enter" target$="[[__target]]" on-keys-pressed="_onClick">\n    </iron-a11y-keys>\n'
      ],
      [
        '\n    <style is="custom-style">\n      :host {\n        cursor: default;\n        display: table-row;\n        width: 100%;\n        color: var(--a11y-media-transcript-color);\n        background-color: var(--a11y-media-transcript-bg-color);\n        transition: color 0.25s, background-color 0.25s;\n      }\n      :host([hide-timestamps]) {\n        display: inline;\n      }\n      :host(:not([active]):not([disabled]):active),\n      :host(:not([active]):not([disabled]):focus),\n      :host(:not([active]):not([disabled]):hover) {\n        cursor: pointer;\n        color: var(--a11y-media-transcript-focused-cue-color);\n        background-color: var(--a11y-media-transcript-focused-cue-bg-color);\n        outline: 1px dotted var(--a11y-media-transcript-focused-cue-color);\n        @apply --a11y-media-transcript-focused-cue;\n      }\n      :host([active]) {\n        color: var(--a11y-media-transcript-active-cue-color);\n        background-color: var(--a11y-media-transcript-active-cue-bg-color);\n        @apply --a11y-media-transcript-active-cue;\n      }\n      :host #text {\n        display: table-cell;\n        width: 100%;\n        line-height: 200%;\n      }\n      :host([hide-timestamps]) #text {\n        display: inline;\n      }\n      :host #time {\n        display: table-cell;\n        font-size: 80%;\n        padding: 0 16px 0 0;\n        white-space: nowrap;\n        font-family: monospace;\n      }\n      :host([hide-timestamps]) #time {\n        display: none;\n      }\n      :host simple-search-content {\n        --simple-search-match-text-color: var(--a11y-media-transcript-match-color);\n        --simple-search-match-bg-color: var(--a11y-media-transcript-match-bg-color);\n        --simple-search-match-border-color:  var(--a11y-media-transcript-match-border-color);\n        --simple-search-match: {\n          border: none;\n          border-radius: 4px;\n          font-weight: normal;\n        };\n      }\n      @media print {\n        :host, :host([active]),\n        :host(:not([active]):not([disabled]):active),\n        :host(:not([active]):not([disabled]):focus),\n        :host(:not([active]):not([disabled]):hover) {\n          color: #000000;\n          background-color: #ffffff;\n        }\n      }\n    </style>\n    <span id="time">[[cue.start]] - [[cue.end]]</span>\n    <span id="text">\n      <simple-search-content id="content" content="[[cue.text]]"></simple-search-content>\n    </span>\n    <iron-a11y-keys id="a11y" keys="enter" target\\$="[[__target]]" on-keys-pressed="_onClick">\n    </iron-a11y-keys>\n'
      ]
    );
    _templateObject_8515ab50e70611e89fc38fd9bed061c6 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8515ab50e70611e89fc38fd9bed061c6()
    ),
    is: "a11y-media-transcript-cue",
    listeners: { tap: "_onClick" },
    behaviors: [simpleColorsBehaviors, a11yMediaBehaviors.TranscriptBehaviors],
    properties: {
      active: babelHelpers.defineProperty(
        {
          type: Boolean,
          reflectToAttribute: !0,
          computed: "_getActiveCue(cue,activeCues)",
          notify: !0
        },
        "reflectToAttribute",
        !0
      ),
      activeCues: { type: Array, value: null, notify: !0 },
      cue: { type: Array, value: null },
      disabled: { type: Boolean, value: !1 },
      text: { type: String, value: "" }
    },
    ready: function ready() {
      var root = this,
        search = root.search;
      if (!root.disabled) {
        root.__target = this;
        root.setAttribute("aria-role", "button");
        root.setAttribute("controls", this.mediaId);
      }
      if (
        !root.disableSearch &&
        root.search !== void 0 &&
        null !== root.search
      ) {
        root.$.content.enableSearch(search);
      }
    },
    print: function print() {},
    _getActiveCue: function _getActiveCue(cue, activeCues) {
      return null !== activeCues && activeCues.includes(cue.order.toString())
        ? !0
        : !1;
    },
    _onClick: function _onClick() {
      if (!this.disabled) {
        this.fire("cue-seek", this);
      }
    }
  });
});
