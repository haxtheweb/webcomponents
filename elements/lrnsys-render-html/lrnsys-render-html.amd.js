define(["exports","./node_modules/@polymer/polymer/polymer-element.js"],function(_exports,_polymerElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnsysRenderHtml=void 0;function _templateObject_f97a17c06d6a11e9a217098acef6bdeb(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id=\"container\"></div>"]);_templateObject_f97a17c06d6a11e9a217098acef6bdeb=function _templateObject_f97a17c06d6a11e9a217098acef6bdeb(){return data};return data}/**
`lrnsys-render-html`
A legacy element which just directly renders HTML.
WARNING: DO NOT USE THIS UNLESS YOU KNOW WHAT YOU ARE DOING!

This element is meant to render html from a source that has already been sanitized.
Polymer will, by design, not render html for security reasons. This element gets around
that. Do not render raw user input through this element! This would allow XSS attacks for
your users.

* @demo demo/index.html
*/var LrnsysRenderHtml=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(LrnsysRenderHtml,_PolymerElement);function LrnsysRenderHtml(){babelHelpers.classCallCheck(this,LrnsysRenderHtml);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LrnsysRenderHtml).apply(this,arguments))}babelHelpers.createClass(LrnsysRenderHtml,[{key:"_render",/**
   * Render the HTML by just injecting it directly.
   */value:function _render(html){this.$.container.innerHTML=html}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_f97a17c06d6a11e9a217098acef6bdeb())}},{key:"tag",get:function get(){return"lrnsys-render-html"}},{key:"properties",get:function get(){return{/**
       * String to render as HTML directly
       * @type {Object}
       */html:{type:String}}}/**
   * When HTML changes, inject it directly.
   */},{key:"observers",get:function get(){return["_render(html)"]}}]);return LrnsysRenderHtml}(_polymerElement.PolymerElement);_exports.LrnsysRenderHtml=LrnsysRenderHtml;window.customElements.define(LrnsysRenderHtml.tag,LrnsysRenderHtml)});