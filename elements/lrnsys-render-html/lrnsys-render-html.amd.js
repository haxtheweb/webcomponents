define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js"],function(_exports,_polymerLegacy){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnsysRenderHtml=void 0;function _templateObject_6e966c506a8411e9979633906cf9c37c(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <div id=\"container\"></div>\n  "]);_templateObject_6e966c506a8411e9979633906cf9c37c=function _templateObject_6e966c506a8411e9979633906cf9c37c(){return data};return data}/**
`lrnsys-render-html`
A legacy element which just directly renders HTML.
WARNING: DO NOT USE THIS UNLESS YOU KNOW WHAT YOU ARE DOING!

This element is meant to render html from a source that has already been sanitized.
Polymer will, by design, not render html for security reasons. This element gets around
that. Do not render raw user input through this element! This would allow XSS attacks for
your users.

* @demo demo/index.html
*/var LrnsysRenderHtml=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_6e966c506a8411e9979633906cf9c37c()),is:"lrnsys-render-html",properties:{/**
     * String to render as HTML directly
     * @type {Object}
     */html:{type:String}},/**
   * When HTML changes, inject it directly.
   */observers:["_render(html)"],/**
   * Render the HTML by just injecting it directly.
   */_render:function _render(html){this.$.container.innerHTML=html}});_exports.LrnsysRenderHtml=LrnsysRenderHtml});