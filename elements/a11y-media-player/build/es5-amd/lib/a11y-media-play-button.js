define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "./a11y-media-behaviors.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js"
], function(_polymerLegacy) {
  "use strict";
  function _templateObject_f2914830d96211e8b1fc6f0b8b28e741() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style>\n      :host {\n        display: block;\n        z-index: 2;\n        opacity: 1;\n        transition: opacity 0.5s; \n        position: absolute;\n        height: 100%;\n      }\n      :host[disabled]:not([audio-only]),\n      :host[playing]:not([audio-only]) {\n        opacity: 0;\n      }\n      :host, \n      :host #thumbnail, \n      :host #background, \n      :host #button {\n        width: 100%;\n        max-height: 80vh;\n        top: 0;\n        left: 0;\n        opacity: 1;\n        transition: opacity 0.5s; \n      } \n      :host #thumbnail, \n      :host #background, \n      :host #button {\n        position: absolute;\n        height: 100%;\n        padding:0;\n        margin: 0;\n        border: none;\n      }\n      :host[audio-only][thumbnail-src][playing] #button > *:not(#thumbnail), \n      :host[audio-only][thumbnail-src][disabled] #button > *:not(#thumbnail) {\n        opacity: 0;\n      }\n      :host #thumbnail {\n        height: auto;\n        overflow: hidden;\n      }\n      :host #button {\n        overflow: hidden;\n        background: transparent; \n      }\n      :host #button:hover {\n        cursor: pointer;\n      }\n      :host #background {\n        opacity: 0.3;\n        background: var(--a11y-play-button-bg-color);\n      }\n      :host #button:focus #background,\n      :host #button:hover #background {\n        background: var(--a11y-play-button-focus-bg-color);\n        opacity: 0.1;\n      }\n      :host #arrow {\n        stroke: #ffffff;\n        fill: #000000;\n      }\n      :host #text {\n        fill: #ffffff;\n      }\n      :host .sr-only {\n        font-size: 0;\n      }\n      @media print {\n        :host:not([thumbnail-src]),\n        :host #background, \n        :host #svg {\n          display: none;\n        }\n      }\n    </style>\n    <button id="button" aria-pressed$="[[playing]]" aria-hidden$="[[disabled]]" tabindex="0" disabled$="[[disabled]]" controls="video" title$="[[label]]">\n      <div id="background"></div>\n      <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="30%" height="30%" opacity="0.7">\n        <g>\n          <polygon id="arrow" points="30,20 30,180 170,100" fill="#000000" stroke="#ffffff" stroke-width="15px"></polygon>\n          <text id="text" class="sr-only" x="50" y="115" fill="#ffffff" font-size="30px">[[label]]</text>\n        </g>\n      </svg>\n    </button>\n'
      ],
      [
        '\n    <style>\n      :host {\n        display: block;\n        z-index: 2;\n        opacity: 1;\n        transition: opacity 0.5s; \n        position: absolute;\n        height: 100%;\n      }\n      :host[disabled]:not([audio-only]),\n      :host[playing]:not([audio-only]) {\n        opacity: 0;\n      }\n      :host, \n      :host #thumbnail, \n      :host #background, \n      :host #button {\n        width: 100%;\n        max-height: 80vh;\n        top: 0;\n        left: 0;\n        opacity: 1;\n        transition: opacity 0.5s; \n      } \n      :host #thumbnail, \n      :host #background, \n      :host #button {\n        position: absolute;\n        height: 100%;\n        padding:0;\n        margin: 0;\n        border: none;\n      }\n      :host[audio-only][thumbnail-src][playing] #button > *:not(#thumbnail), \n      :host[audio-only][thumbnail-src][disabled] #button > *:not(#thumbnail) {\n        opacity: 0;\n      }\n      :host #thumbnail {\n        height: auto;\n        overflow: hidden;\n      }\n      :host #button {\n        overflow: hidden;\n        background: transparent; \n      }\n      :host #button:hover {\n        cursor: pointer;\n      }\n      :host #background {\n        opacity: 0.3;\n        background: var(--a11y-play-button-bg-color);\n      }\n      :host #button:focus #background,\n      :host #button:hover #background {\n        background: var(--a11y-play-button-focus-bg-color);\n        opacity: 0.1;\n      }\n      :host #arrow {\n        stroke: #ffffff;\n        fill: #000000;\n      }\n      :host #text {\n        fill: #ffffff;\n      }\n      :host .sr-only {\n        font-size: 0;\n      }\n      @media print {\n        :host:not([thumbnail-src]),\n        :host #background, \n        :host #svg {\n          display: none;\n        }\n      }\n    </style>\n    <button id="button" aria-pressed\\$="[[playing]]" aria-hidden\\$="[[disabled]]" tabindex="0" disabled\\$="[[disabled]]" controls="video" title\\$="[[label]]">\n      <div id="background"></div>\n      <svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="30%" height="30%" opacity="0.7">\n        <g>\n          <polygon id="arrow" points="30,20 30,180 170,100" fill="#000000" stroke="#ffffff" stroke-width="15px"></polygon>\n          <text id="text" class="sr-only" x="50" y="115" fill="#ffffff" font-size="30px">[[label]]</text>\n        </g>\n      </svg>\n    </button>\n'
      ]
    );
    _templateObject_f2914830d96211e8b1fc6f0b8b28e741 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_f2914830d96211e8b1fc6f0b8b28e741()
    ),
    is: "a11y-media-play-button",
    behaviors: [a11yMediaBehaviors.PlayerBehaviors],
    listeners: { "button.tap": "_buttonTap" },
    properties: {
      label: {
        type: String,
        computed: "_getPlaying(playing,pauseLabel,playLabel)"
      },
      pauseLabel: { type: String, value: "play" },
      playLabel: { type: String, value: "play" },
      disabled: { type: Boolean, value: !1 },
      playing: { type: Boolean, value: !1 }
    },
    attached: function attached() {
      this.$.text.innerText = this.playLabel;
      if (this.audioOnly) {
        var root = this,
          img = this.$.thumbnail,
          check = setInterval(function() {
            if (img.naturalWidth) {
              clearInterval(check);
              var aspect = 100 * (img.naturalHeight / img.naturalWidth);
              root.style.height = aspect + "%";
              root.fire("thumbnail-aspect", aspect);
            }
          }, 10);
      }
    },
    _getPlaying: function _getPlaying(playing, pauseLabel, playLabel) {
      return playing ? pauseLabel : playLabel;
    },
    _buttonTap: function _buttonTap() {
      this.fire("controls-change", this);
    }
  });
});
