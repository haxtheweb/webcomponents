define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@lrnwebcomponents/simple-search/simple-search.js",
  "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js",
  "./a11y-media-behaviors.js",
  "./a11y-media-button.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_17bf53f0db3311e8863893080185eb7e() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style is="custom-style">\n        :host { \n          background-color: var(--a11y-media-transcript-bg-color);\n          color: var(--a11y-media-transcript-text-color);\n          --a11y-media-button-color: var(--a11y-media-transcript-color);\n          --a11y-media-button-bg-color: var(--a11y-media-transcript-bg-color);\n          --a11y-media-button-toggle-color: var(--a11y-media-transcript-accent-color);\n          --a11y-media-button-hover-color: var(--a11y-media-transcript-faded-accent-color);\n          --a11y-media-button-hover-bg-color:  var(--a11y-media-transcript-bg-color);\n          --simple-search-input-color: var(--a11y-media-transcript-color);\n          --simple-search-input-line-color: var(--a11y-media-transcript-accent-color);\n          --simple-search-input-placeholder-color: var(--a11y-media-transcript-color);\n          --simple-search-button-color: var(--a11y-media-transcript-accent-color);\n          --simple-search-button-hover-color: var(--a11y-media-transcript-faded-accent-color);\n          --simple-search-button-bg-color: var(--a11y-media-transcript-bg-color);\n          --simple-search-button-border-color: var(--a11y-media-transcript-bg-color);\n          --simple-search-button-hover-border-color: var(--a11y-media-transcript-bg-color);\n          --simple-search-button-disabled-color: var(--simple-colors-background5);\n          --simple-search-button-disabled-bg-color: var(--simple-colors-background2);\n          --simple-search-button-disabled-border-color: var(--simple-colors-background3);\n          --simple-search-container: {\n            padding: 0 15px;\n          };\n        }\n        :host #searchbar {\n          display: flex;\n          align-items: stretch;\n          justify-content: space-between;\n          width: 100%;\n        }\n        :host #searching {\n          flex-grow: 2;\n        }\n        :host #autoscroll {\n          padding-right: 0.5em;\n        }\n        :host #scrolling,\n        :host #printing {\n          display: flex;\n          align-items: center;\n        }\n        @media print {\n          :host {\n            display: none;\n          }\n        }\n    </style>\n    <div id="searchbar">\n      <div id="searching">\n        <simple-search id="search" disabled$="[[disableSearch]]" controls="transcript" hidden$="[[disableSearch]]" no-label-float="" next-button-icon$="[[searchNextIcon]]" next-button-label$="[[searchNextLabel]]" prev-button-icon$="[[searchPrevIcon]]" prev-button-label$="[[searchPrevLabel]]" search-input-icon$="[[searchIcon]]" search-input-label$="[[searchLabel]]" target="[[target]]">\n        </simple-search>\n      </div>\n      <div id="scrolling">\n        <a11y-media-button id="scroll" controls="transcript" icon="[[autoScrollIcon]]" label="[[autoScrollLabel]]" toggle$="[[!disableScroll]]">\n        </a11y-media-button>\n      </div>\n      <div id="printing" hidden$="[[disablePrintButton]]" disabled$="[[disablePrintButton]]">\n        <a11y-media-button controls="transcript" id="print" icon="[[printIcon]]" label="[[printLabel]]">\n        </a11y-media-button>\n      </div>\n    </div>\n'
      ],
      [
        '\n    <style is="custom-style">\n        :host { \n          background-color: var(--a11y-media-transcript-bg-color);\n          color: var(--a11y-media-transcript-text-color);\n          --a11y-media-button-color: var(--a11y-media-transcript-color);\n          --a11y-media-button-bg-color: var(--a11y-media-transcript-bg-color);\n          --a11y-media-button-toggle-color: var(--a11y-media-transcript-accent-color);\n          --a11y-media-button-hover-color: var(--a11y-media-transcript-faded-accent-color);\n          --a11y-media-button-hover-bg-color:  var(--a11y-media-transcript-bg-color);\n          --simple-search-input-color: var(--a11y-media-transcript-color);\n          --simple-search-input-line-color: var(--a11y-media-transcript-accent-color);\n          --simple-search-input-placeholder-color: var(--a11y-media-transcript-color);\n          --simple-search-button-color: var(--a11y-media-transcript-accent-color);\n          --simple-search-button-hover-color: var(--a11y-media-transcript-faded-accent-color);\n          --simple-search-button-bg-color: var(--a11y-media-transcript-bg-color);\n          --simple-search-button-border-color: var(--a11y-media-transcript-bg-color);\n          --simple-search-button-hover-border-color: var(--a11y-media-transcript-bg-color);\n          --simple-search-button-disabled-color: var(--simple-colors-background5);\n          --simple-search-button-disabled-bg-color: var(--simple-colors-background2);\n          --simple-search-button-disabled-border-color: var(--simple-colors-background3);\n          --simple-search-container: {\n            padding: 0 15px;\n          };\n        }\n        :host #searchbar {\n          display: flex;\n          align-items: stretch;\n          justify-content: space-between;\n          width: 100%;\n        }\n        :host #searching {\n          flex-grow: 2;\n        }\n        :host #autoscroll {\n          padding-right: 0.5em;\n        }\n        :host #scrolling,\n        :host #printing {\n          display: flex;\n          align-items: center;\n        }\n        @media print {\n          :host {\n            display: none;\n          }\n        }\n    </style>\n    <div id="searchbar">\n      <div id="searching">\n        <simple-search id="search" disabled\\$="[[disableSearch]]" controls="transcript" hidden\\$="[[disableSearch]]" no-label-float="" next-button-icon\\$="[[searchNextIcon]]" next-button-label\\$="[[searchNextLabel]]" prev-button-icon\\$="[[searchPrevIcon]]" prev-button-label\\$="[[searchPrevLabel]]" search-input-icon\\$="[[searchIcon]]" search-input-label\\$="[[searchLabel]]" target="[[target]]">\n        </simple-search>\n      </div>\n      <div id="scrolling">\n        <a11y-media-button id="scroll" controls="transcript" icon="[[autoScrollIcon]]" label="[[autoScrollLabel]]" toggle\\$="[[!disableScroll]]">\n        </a11y-media-button>\n      </div>\n      <div id="printing" hidden\\$="[[disablePrintButton]]" disabled\\$="[[disablePrintButton]]">\n        <a11y-media-button controls="transcript" id="print" icon="[[printIcon]]" label="[[printLabel]]">\n        </a11y-media-button>\n      </div>\n    </div>\n'
      ]
    );
    _templateObject_17bf53f0db3311e8863893080185eb7e = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_17bf53f0db3311e8863893080185eb7e()
    ),
    is: "a11y-media-transcript-controls",
    behaviors: [
      simpleColorsBehaviors,
      a11yMediaBehaviors.GeneralFunctions,
      a11yMediaBehaviors.TranscriptBehaviors
    ],
    properties: {
      lang: { type: String, value: "en", reflectToAttribute: !0 },
      target: { type: Object, value: null }
    },
    attached: function attached() {
      var root = this;
      window.SimpleColorsUtility.requestAvailability();
      root.search = root.$.search;
      root.fire("searchbar-added", root.$.search);
      root.$.scroll.addEventListener("button-clicked", function() {
        this.fire("toggle-scroll", this);
      });
      root.$.print.addEventListener("button-clicked", function() {
        this.fire("print-transcript", this);
      });
    }
  });
});
