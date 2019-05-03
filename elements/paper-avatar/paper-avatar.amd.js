define(["exports","meta","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js","./node_modules/@polymer/polymer/lib/elements/dom-if.js","./lib/md5.min.js"],function(_exports,meta,_polymerElement,_resolveUrl,_esGlobalBridge,_domIf,md5){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.PaperAvatar=void 0;meta=babelHelpers.interopRequireWildcard(meta);md5=babelHelpers.interopRequireWildcard(md5);function _templateObject_263b9cc06d6b11e994046da4abd8a63a(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        --paper-avatar-width: 40px;\n        display: inline-block;\n        box-sizing: border-box;\n        position: relative;\n        width: var(--paper-avatar-width);\n        height: var(--paper-avatar-width);\n        border-radius: 50%;\n        cursor: default;\n        background-color: var(\n          --paper-avatar-color,\n          var(--paper-avatar-bgcolor)\n        );\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n        user-select: none;\n      }\n\n      :host > * {\n        pointer-events: none;\n      }\n\n      #label,\n      #img,\n      #jdenticon {\n        position: absolute;\n        top: 0;\n        left: 0;\n        right: 0;\n        bottom: 0;\n        width: 100%;\n        height: 100%;\n        border-radius: 50%;\n      }\n      #label {\n        overflow: hidden;\n        display: -ms-flexbox;\n        display: -webkit-flex;\n        display: flex;\n        -webkit-flex-direction: row;\n        -ms-flex-direction: row;\n        flex-direction: row;\n        -webkit-align-items: center;\n        -ms-flex-align: center;\n        align-items: center;\n      }\n      #label span {\n        display: block;\n        width: 100%;\n        font-weight: 400;\n        color: rgba(255, 255, 255, 0.8);\n        text-transform: capitalize;\n        font-family: \"Roboto\", \"Noto\", sans-serif;\n        -webkit-font-smoothing: antialiased;\n        text-align: center;\n        font-size: calc(var(--paper-avatar-width) / 1.65);\n      }\n      #jdenticon {\n        width: var(--paper-avatar-width);\n        height: var(--paper-avatar-width);\n      }\n    </style>\n    <div id=\"label\" title=\"[[label]]\"><span>[[_label(label)]]</span></div>\n    <svg id=\"jdenticon\" width=\"40\" height=\"40\"><slot></slot></svg>\n    <template is=\"dom-if\" if=\"[[src]]\">\n      <img\n        id=\"img\"\n        src=\"[[src]]\"\n        title=\"[[label]]\"\n        on-load=\"_onImgLoad\"\n        on-error=\"_onImgError\"\n        title=\"[[color]]\"\n      />\n    </template>"]);_templateObject_263b9cc06d6b11e994046da4abd8a63a=function _templateObject_263b9cc06d6b11e994046da4abd8a63a(){return data};return data}/**
`paper-avatar`
User avatar in material style

### Styling

To change the background color:

    paper-avatar {
      --paper-avatar-color: red;
    }
	
To change the size of the avatar:

    paper-avatar {
      --paper-avatar-width: 60px;
    }

Custom property | Description | Default
----------------|-------------|----------
`--paper-avatar-width` | Size (width and height) of the avatar image | `40px`
`--paper-avatar-color` | Background color of the avatar image | 


* @demo demo/index.html 
*/var PaperAvatar=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(PaperAvatar,_PolymerElement);function PaperAvatar(){babelHelpers.classCallCheck(this,PaperAvatar);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(PaperAvatar).apply(this,arguments))}babelHelpers.createClass(PaperAvatar,[{key:"_observerLabel",/**
   * Generate the correct label from change with optional jdenticon md5 hash
   */value:function _observerLabel(label){if(label){if(this.jdenticonExists&&this.jdenticon){this.$.label.hidden=!0;window.jdenticon.config={lightness:{color:[1,1],grayscale:[1,1]},saturation:1};window.jdenticon.update(this.$.jdenticon,window.md5(label))}this.updateStyles({"--paper-avatar-bgcolor":this._parseColor(label)})}}/**
   * ready lifecycle
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(PaperAvatar.prototype),"ready",this).call(this);var basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/jdenticon-1.4.0.min.js");window.addEventListener("es-bridge-jdenticon-loaded",this._jdenticonLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("jdenticon",location)}},{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("es-bridge-jdenticon-loaded",this._jdenticonLoaded.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(PaperAvatar.prototype),"disconnectedCallback",this).call(this)}/**
   * Callback once we know that the jdenticon library is globally loaded.
   */},{key:"_jdenticonLoaded",value:function _jdenticonLoaded(e){this.jdenticonExists=!0;this._observerLabel(this.label)}/**
   * convert label in context
   */},{key:"_label",value:function _label(label){if(!label)return"";if(this.twoChars){if(-1<this.label.indexOf(" ")){var matches=this.label.match(/\b(\w)/g);return matches[0]+matches[1]}else{return label.substring(0,2)}}return label.charAt(0)}},{key:"_onImgLoad",value:function _onImgLoad(e){e.currentTarget.hidden=!1}},{key:"_onImgError",value:function _onImgError(e){e.currentTarget.hidden=!0}},{key:"_parseColor",value:function _parseColor(label){for(var colors=this.colors?this.colors:["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#03A9F4","#00BCD4","#795548","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722","#9E9E9E","#607D8B"],hash=0,a=0;a<label.length;a++){hash+=label.charCodeAt(a)<<5}if(hash>=colors.length)return colors[hash%colors.length];return colors[hash]}}],[{key:"tag",get:function get(){return"paper-avatar"}},{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_263b9cc06d6b11e994046da4abd8a63a())}},{key:"properties",get:function get(){return{/**
       * Image address or base64
       */src:{type:String,value:!1},/**
       *	Label with username
      */label:{type:String,observer:"_observerLabel"},/**
       * Ensure we can support jdenticon before invoking it
       */jdenticonExists:{type:Boolean,value:!1},/**
       * Show two chars in avatar
       */twoChars:{type:Boolean,value:!1},/**
       * Array of colors for avatar background
       */colors:{type:Array},/**
       * Set true if you want use a jdenticon avatar
       */jdenticon:{type:Boolean,value:!1}}}}]);return PaperAvatar}(_polymerElement.PolymerElement);_exports.PaperAvatar=PaperAvatar;window.customElements.define(PaperAvatar.tag,PaperAvatar)});