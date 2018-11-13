define([
  "../node_modules/@polymer/polymer/polymer-element.js",
  "../lrn-shared-styles.js"
], function(_polymerElement) {
  "use strict";
  function _templateObject_0a741580e70611e89a3a77036cd78612() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n        <!-- include the lrn-shared-styles in the element-->\n        <style include="lrn-shared-styles">\n            /** \n             * add styles specific to the element here \n             */\n            :host .demo-container {\n                padding: 0px 0px 20px;\n            }\n            :host .code-container {\n                margin: 0;\n                background-color: var(--google-grey-100,#f5f5f5);\n                border-top: 1px solid #e0e0e0;\n            }\n            :host code {\n                padding: 20px 0px;\n                display: block;\n                margin: 0;\n                font-size: 13px;\n            }\n            :host .tag {\n            color: #905;\n            }\n            :host .attr-name {\n            color: #690;\n            }\n            :host .attr-value {\n            color: #07a;\n            }\n        </style>\n        <div class="demo-container">\n            <p class="sr-only">This text can only be read on screen readers. It is not visible on screen.</p>\n            <p class="screen-only">This text can only be read on screen. It will not print.</p>\n            <p class="print-only">This text can only be read when printed. It will not be visible on screen.</p>\n        </demo>\n        <div class="code-container">\n            <code>\n                /**<br> \n                 &nbsp;* importing the styles in the javascript<br>\n                 &nbsp;*/<br>\n                 <span class="tag">import </span><span class="attr-value">"@lrnwebcomponents/lrn-shared-styles/lrn-shared-styles.js"</span>;<br>\n                <br>\n                &lt;!-- using the styles --&gt;<br>\n                <span class="tag">&lt;style <span class="attr-name">include=<span class="attr-value">"lrn-shared-styles"</span></span>&gt;</span><br>\n                &nbsp;&nbsp;&nbsp;&nbsp;/* your custom CSS here */<br>\n                <span class="tag">&lt;/style"&gt;</span>\n            </code>\n        </div>\n    '
    ]);
    _templateObject_0a741580e70611e89a3a77036cd78612 = function() {
      return data;
    };
    return data;
  }
  var LrnSharedStylesDemo = (function(_PolymerElement) {
    babelHelpers.inherits(LrnSharedStylesDemo, _PolymerElement);
    function LrnSharedStylesDemo() {
      babelHelpers.classCallCheck(this, LrnSharedStylesDemo);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrnSharedStylesDemo.__proto__ ||
          Object.getPrototypeOf(LrnSharedStylesDemo)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(LrnSharedStylesDemo, null, [
      {
        key: "template",
        get: function get() {
          return (0, _polymerElement.html)(
            _templateObject_0a741580e70611e89a3a77036cd78612()
          );
        }
      }
    ]);
    return LrnSharedStylesDemo;
  })(_polymerElement.PolymerElement);
  customElements.define("lrn-shared-styles-demo", LrnSharedStylesDemo);
});
