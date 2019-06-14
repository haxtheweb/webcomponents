define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js","./node_modules/@polymer/iron-meta/iron-meta.js","./node_modules/@polymer/iron-flex-layout/iron-flex-layout.js","./node_modules/@lrnwebcomponents/lrn-shared-styles/lrn-shared-styles.js"],function(_exports,_polymerElement,_polymerDom,_ironMeta,_ironFlexLayout,_lrnSharedStyles){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnIcon=void 0;function _templateObject_c48802f081c111e9976b334071dca852(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style include=\"lrn-shared-styles\">\n        :host {\n          position: relative;\n\n          vertical-align: middle;\n\n          fill: var(--lrn-icon-fill-color, currentcolor);\n          stroke: var(--lrn-icon-stroke-color, none);\n\n          width: var(--lrn-icon-width, 24px);\n          height: var(--lrn-icon-height, 24px);\n          @apply --layout-inline;\n          @apply --layout-center-center;\n          @apply --lrn-icon;\n        }\n      </style>\n      <iron-icon icon$=\"lrn:[[icon]]\"></iron-icon>\n    "]);_templateObject_c48802f081c111e9976b334071dca852=function _templateObject_c48802f081c111e9976b334071dca852(){return data};return data}/**
This is a fork of https://github.com/PolymerElements/lrn-icon
@license
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/ /**

The `lrn-icon` element displays an icon. By default an icon renders as a 24px square.

Example using src:

    <lrn-icon src="star.png"></lrn-icon>

Example setting size to 32px x 32px:

    <lrn-icon class="big" src="big_star.png"></lrn-icon>

    <style>
      .big {
        --lrn-icon-height: 32px;
        --lrn-icon-width: 32px;
      }
    </style>

The iron elements include several sets of icons.
To use the default set of icons, import `lrn-icons.html` and use the `icon` attribute to specify an icon:

    <link rel="import" href="/components/lrn-icons/lrn-icons.html">

    <lrn-icon icon="menu"></lrn-icon>

To use a different built-in set of icons, import the specific `lrn-icons/<iconset>-icons.html`, and
specify the icon as `<iconset>:<icon>`. For example, to use a communication icon, you would
use:

    <link rel="import" href="/components/lrn-icons/communication-icons.html">

    <lrn-icon icon="communication:email"></lrn-icon>

You can also create custom icon sets of bitmap or SVG icons.

Example of using an icon named `cherry` from a custom iconset with the ID `fruit`:

    <lrn-icon icon="fruit:cherry"></lrn-icon>

See [lrn-iconset](lrn-iconset) and [lrn-iconset-svg](lrn-iconset-svg) for more information about
how to create a custom iconset.

See the [lrn-icons demo](lrn-icons?view=demo:demo/index.html) to see the icons available
in the various iconsets.

To load a subset of icons from one of the default `lrn-icons` sets, you can
use the [poly-icon](https://poly-icon.appspot.com/) tool. It allows you
to select individual icons, and creates an iconset from them that you can
use directly in your elements.

### Styling

The following custom properties are available for styling:

Custom property | Description | Default
----------------|-------------|----------
`--lrn-icon` | Mixin applied to the icon | {}
`--lrn-icon-width` | Width of the icon | `24px`
`--lrn-icon-height` | Height of the icon | `24px`
`--lrn-icon-fill-color` | Fill color of the svg icon | `currentcolor`
`--lrn-icon-stroke-color` | Stroke color of the svg icon | none

@group Iron Elements
@element lrn-icon
* @demo demo/index.html
@hero hero.svg
@homepage polymer.github.io
*/var LrnIcon=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(LrnIcon,_PolymerElement);function LrnIcon(){babelHelpers.classCallCheck(this,LrnIcon);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(LrnIcon).apply(this,arguments))}babelHelpers.createClass(LrnIcon,[{key:"_iconChanged",value:function _iconChanged(icon){this._iconName=icon;this._iconsetName="lrn";this._updateIcon()}},{key:"_srcChanged",value:function _srcChanged(src){this._updateIcon()}},{key:"_usesIconset",value:function _usesIconset(){return this.icon||!this.src}/** @suppress {visibility} */},{key:"_updateIcon",value:function _updateIcon(){if(this._usesIconset()){if(this._img&&this._img.parentNode){(0,_polymerDom.dom)(this.root).removeChild(this._img)}if(""===this._iconName){if(this._iconset){this._iconset.removeIcon(this)}}else if(this._iconsetName&&this._meta){this._iconset=this._meta.byKey(this._iconsetName);if(this._iconset){this._iconset.applyIcon(this,this._iconName,this.theme);window.removeEventListener("lrn-iconset-added",this._updateIcon.bind(this))}else{window.addEventListener("lrn-iconset-added",this._updateIcon.bind(this))}}}else{if(this._iconset){this._iconset.removeIcon(this)}if(!this._img){this._img=document.createElement("img");this._img.style.width="100%";this._img.style.height="100%";this._img.draggable=!1}this._img.src=this.src;(0,_polymerDom.dom)(this.root).appendChild(this._img)}}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_c48802f081c111e9976b334071dca852())}},{key:"tag",get:function get(){return"lrn-icon"}},{key:"properties",get:function get(){return{/**
       * The name of the icon to use. The name should be of the form:
       * `iconset_name:icon_name`.
       */icon:{type:String},/**
       * The name of the theme to used, if one is specified by the
       * iconset.
       */theme:{type:String},/**
       * If using lrn-icon without an iconset, you can set the src to be
       * the URL of an individual icon image file. Note that this will take
       * precedence over a given icon attribute.
       */src:{type:String},_meta:{value:document.createElement("iron-meta",{type:"iconset"})}}}},{key:"observers",get:function get(){return["_updateIcon(_meta, isAttached)","_updateIcon(theme, isAttached)","_srcChanged(src, isAttached)","_iconChanged(icon, isAttached)"]}}]);return LrnIcon}(_polymerElement.PolymerElement);_exports.LrnIcon=LrnIcon;window.customElements.define(LrnIcon.tag,LrnIcon)});