define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@lrnwebcomponents/oer-schema/oer-schema.js"],function(_exports,_polymerLegacy,_oerSchema){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnPage=void 0;function _templateObject_438b7b806a8511e9a2ababac267f2e8e(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <oer-schema> <slot></slot> </oer-schema>\n  "]);_templateObject_438b7b806a8511e9a2ababac267f2e8e=function _templateObject_438b7b806a8511e9a2ababac267f2e8e(){return data};return data}/**
`lrn-page`
A LRN element for a "page" of material. This ensures there's an OERSchema wrapper
so that all content produced has a baseline level of being identified as OER.

* @demo demo/index.html
*/var LrnPage=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_438b7b806a8511e9a2ababac267f2e8e()),is:"lrn-page"});_exports.LrnPage=LrnPage});