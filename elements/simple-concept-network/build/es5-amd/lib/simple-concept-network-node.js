define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-button/paper-button.js",
  "../node_modules/@polymer/paper-tooltip/paper-tooltip.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js",
  "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js"
], function(
  _polymerLegacy,
  _paperButton,
  _paperTooltip,
  _ironIcons,
  _lrnIcons,
  _materializecssStyles
) {
  "use strict";
  function _templateObject_8e8a3eb0f32e11e8bbec8f36692228b9() {
    var data = babelHelpers.taggedTemplateLiteral(
      [
        '\n    <style include="materializecss-styles">\n      :host {\n        display: inline-flex;\n        --simple-concept-network-color: #220066;\n        --simple-concept-network-bg: #FFFFFF;\n      }\n      paper-button {\n        -webkit-transition: .6s transform ease-in-out;\n        transition: .6s transform ease-in-out;\n        -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n        color: var(--simple-concept-network-color);\n      }\n      :host([visualization="network"]) paper-button:hover,\n      :host([visualization="network"]) paper-button:focus {\n        opacity: .8;\n      }\n      :host([visualization="3d"]) paper-button {\n        -webkit-transform: perspective(600px) rotateX(60deg);\n        -moz-transform: perspective(600px) rotateX(60deg);\n        -ms-transform: perspective(600px) rotateX(60deg);\n        -o-transform: perspective(600px) rotateX(60deg);\n        transform: perspective(600px) rotateX(60deg);\n      }\n      :host([visualization="3d"]) paper-button:hover,\n      :host([visualization="3d"]) paper-button:focus {\n        transform: perspective(0px) rotateX(0deg);\n      }\n      iron-icon {\n        width: 50px;\n        height: 50px;\n        margin: 1px 19px;\n        z-index: 3;\n        color: var(--simple-concept-network-color);\n      }\n      .hexagon {\n        position: relative;\n        width: 88px;\n        height: 50.81px;\n        margin: 25.40px 0;\n        background-size: auto 101.6136px;\n        background-position: center;\n        box-shadow: 0 0 20px rgba(0,0,0,0.6);\n        background-color: var(--simple-concept-network-bg);\n      }\n\n      .hexTop,\n      .hexBottom {\n        position: absolute;\n        z-index: 1;\n        width: 62.23px;\n        height: 62.23px;\n        overflow: hidden;\n        -webkit-transform: scaleY(0.5774) rotate(-45deg);\n        -ms-transform: scaleY(0.5774) rotate(-45deg);\n        transform: scaleY(0.5774) rotate(-45deg);\n        background: inherit;\n        left: 12.89px;\n        box-shadow: 0 0 20px rgba(0,0,0,0.6);\n      }\n\n      /*counter transform the bg image on the caps*/\n      .hexTop:after,\n      .hexBottom:after {\n        content: "";\n        position: absolute;\n        width: 88.0000px;\n        height: 50.80682368868707px;\n        -webkit-transform:  rotate(45deg) scaleY(1.7321) translateY(-25.4034px);\n        -ms-transform:      rotate(45deg) scaleY(1.7321) translateY(-25.4034px);\n        transform:          rotate(45deg) scaleY(1.7321) translateY(-25.4034px);\n        -webkit-transform-origin: 0 0;\n        -ms-transform-origin: 0 0;\n        transform-origin: 0 0;\n        background: inherit;\n      }\n\n      .hexTop {\n        top: -31.1127px;\n      }\n\n      .hexTop:after {\n        background-position: center top;\n      }\n\n      .hexBottom {\n        bottom: -31.1127px;\n      }\n\n      .hexBottom:after {\n        background-position: center bottom;\n      }\n\n      .hexagon:after {\n        content: "";\n        position: absolute;\n        top: 0.0000px;\n        left: 0;\n        width: 88.0000px;\n        height: 50.8068px;\n        z-index: 2;\n        background: inherit;\n      }\n    </style>\n    <a tabindex="-1" href="[[src]]" disabled$="[[disabled]]">\n      <paper-button disabled$="[[disabled]]" id="button">\n      <div class="hexagon" style$="background-image: url([[image]]); background-color:[[color]];">\n        <div class="hexTop"></div>\n        <div class="hexBottom"></div>\n        <iron-icon icon="[[icon]]" style$="color:[[iconColor]];">&gt;</iron-icon>\n      </div>\n      </paper-button>\n    </a>\n    <paper-tooltip for="button" position="bottom" offset="45">\n      [[label]]\n    </paper-tooltip>\n'
      ],
      [
        '\n    <style include="materializecss-styles">\n      :host {\n        display: inline-flex;\n        --simple-concept-network-color: #220066;\n        --simple-concept-network-bg: #FFFFFF;\n      }\n      paper-button {\n        -webkit-transition: .6s transform ease-in-out;\n        transition: .6s transform ease-in-out;\n        -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n        clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);\n        color: var(--simple-concept-network-color);\n      }\n      :host([visualization="network"]) paper-button:hover,\n      :host([visualization="network"]) paper-button:focus {\n        opacity: .8;\n      }\n      :host([visualization="3d"]) paper-button {\n        -webkit-transform: perspective(600px) rotateX(60deg);\n        -moz-transform: perspective(600px) rotateX(60deg);\n        -ms-transform: perspective(600px) rotateX(60deg);\n        -o-transform: perspective(600px) rotateX(60deg);\n        transform: perspective(600px) rotateX(60deg);\n      }\n      :host([visualization="3d"]) paper-button:hover,\n      :host([visualization="3d"]) paper-button:focus {\n        transform: perspective(0px) rotateX(0deg);\n      }\n      iron-icon {\n        width: 50px;\n        height: 50px;\n        margin: 1px 19px;\n        z-index: 3;\n        color: var(--simple-concept-network-color);\n      }\n      .hexagon {\n        position: relative;\n        width: 88px;\n        height: 50.81px;\n        margin: 25.40px 0;\n        background-size: auto 101.6136px;\n        background-position: center;\n        box-shadow: 0 0 20px rgba(0,0,0,0.6);\n        background-color: var(--simple-concept-network-bg);\n      }\n\n      .hexTop,\n      .hexBottom {\n        position: absolute;\n        z-index: 1;\n        width: 62.23px;\n        height: 62.23px;\n        overflow: hidden;\n        -webkit-transform: scaleY(0.5774) rotate(-45deg);\n        -ms-transform: scaleY(0.5774) rotate(-45deg);\n        transform: scaleY(0.5774) rotate(-45deg);\n        background: inherit;\n        left: 12.89px;\n        box-shadow: 0 0 20px rgba(0,0,0,0.6);\n      }\n\n      /*counter transform the bg image on the caps*/\n      .hexTop:after,\n      .hexBottom:after {\n        content: "";\n        position: absolute;\n        width: 88.0000px;\n        height: 50.80682368868707px;\n        -webkit-transform:  rotate(45deg) scaleY(1.7321) translateY(-25.4034px);\n        -ms-transform:      rotate(45deg) scaleY(1.7321) translateY(-25.4034px);\n        transform:          rotate(45deg) scaleY(1.7321) translateY(-25.4034px);\n        -webkit-transform-origin: 0 0;\n        -ms-transform-origin: 0 0;\n        transform-origin: 0 0;\n        background: inherit;\n      }\n\n      .hexTop {\n        top: -31.1127px;\n      }\n\n      .hexTop:after {\n        background-position: center top;\n      }\n\n      .hexBottom {\n        bottom: -31.1127px;\n      }\n\n      .hexBottom:after {\n        background-position: center bottom;\n      }\n\n      .hexagon:after {\n        content: "";\n        position: absolute;\n        top: 0.0000px;\n        left: 0;\n        width: 88.0000px;\n        height: 50.8068px;\n        z-index: 2;\n        background: inherit;\n      }\n    </style>\n    <a tabindex="-1" href="[[src]]" disabled\\$="[[disabled]]">\n      <paper-button disabled\\$="[[disabled]]" id="button">\n      <div class="hexagon" style\\$="background-image: url([[image]]); background-color:[[color]];">\n        <div class="hexTop"></div>\n        <div class="hexBottom"></div>\n        <iron-icon icon="[[icon]]" style\\$="color:[[iconColor]];">&gt;</iron-icon>\n      </div>\n      </paper-button>\n    </a>\n    <paper-tooltip for="button" position="bottom" offset="45">\n      [[label]]\n    </paper-tooltip>\n'
      ]
    );
    _templateObject_8e8a3eb0f32e11e8bbec8f36692228b9 = function _templateObject_8e8a3eb0f32e11e8bbec8f36692228b9() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_8e8a3eb0f32e11e8bbec8f36692228b9()
    ),
    is: "simple-concept-network-node",
    behaviors: [
      HAXBehaviors.PropertiesBehaviors,
      MaterializeCSSBehaviors.ColorBehaviors,
      A11yBehaviors.A11y
    ],
    properties: {
      color: { type: String },
      iconColor: { type: String },
      visualization: { type: String, reflectToAttribute: !0, value: "3d" },
      icon: { type: String },
      image: { type: String },
      disabled: { type: Boolean },
      label: { type: String },
      description: { type: String },
      src: { type: String }
    }
  });
});
