define(["exports","meta","require","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js","./node_modules/@polymer/iron-ajax/iron-ajax.js","./node_modules/@polymer/polymer/lib/elements/dom-repeat.js"],function(_exports,meta,_require,_polymerElement,_renderStatus,_HAXWiring,_resolveUrl,_esGlobalBridge,_ironAjax,_domRepeat){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.RssItems=void 0;meta=babelHelpers.interopRequireWildcard(meta);_require=babelHelpers.interopRequireWildcard(_require);function _templateObject_f5ca2ee0ab1211e98929c3ce74afbdb4(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host([hidden]) {\n  display: none;\n}\n:host {\n  display: flex;\n  flex-wrap: wrap;\n  flex-direction: row;\n  align-items: flex-start;\n  justify-content: space-between;\n  @apply --rss-items;\n}\n\n:host * {\n  box-sizing: border-box;\n}\n\nh3,\np {\n  margin: 0;\n}\n\na {\n  color: var(--primary-color, inherit);\n  text-decoration: none;\n}\n\narticle {\n  margin-bottom: 2em;\n\n  @apply --rss-items-article;\n}\n\n.thumbnail-container {\n  display: block;\n  overflow: hidden;\n  width: 100%;\n  height: 180px;\n\n  @apply --rss-items-thumbnail-container;\n}\n\n.thumbnail {\n  width: 100%;\n  height: 100%;\n  transition: transform .5s ease-out;\n\n  @apply --rss-items-thumbnail;\n}\n\n.thumbnail-container:hover .thumbnail,\n.thumbnail-container:focus .thumbnail {\n  transform: scale3d(1.3, 1.3, 1);\n\n  @apply --rss-items-thumbnail-hover;\n}\n\n.title {\n  min-height: 3em;\n  margin: 1em 0 .5em;\n\n  @apply --rss-items-title;\n}\n\n.excerpt {\n  min-height: 6em;\n  margin: .5em 0 2em;\n\n  @apply --rss-items-excerpt;\n}\n\n@media (max-width: 599px) {\n  .title,\n  .excerpt {\n    min-height: 0;\n  }\n}\n\n@media (min-width: 600px) {\n  article {\n    flex: 1 1 40%;\n    margin-right: 2em;\n\n    @apply --rss-items-article-mq-m-up;\n  }\n\n  article:nth-of-type(2n),\n  article:last-of-type {\n    margin-right: 0;\n  }\n}\n\n@media (min-width: 900px) {\n  article {\n    flex: 1 1 30%;\n\n    @apply --rss-items-article-mq-l-up;\n  }\n\n  article:nth-of-type(2n) {\n    margin-right: 2em;\n  }\n\n  article:nth-of-type(3n) {\n    margin-right: 0;\n  }\n}</style>\n<iron-ajax id=\"rssajax\" url=\"[[url]]\" handle-as=\"xml\" last-response=\"{{xml}}\"></iron-ajax>\n<dom-repeat items=\"[[items]]\">\n  <template>\n  <article>\n    <a class=\"thumbnail-container\" href=\"[[item.link]]\" title=\"[[item.title]]\">\n      <iron-image class=\"thumbnail\" src=\"[[item.imageSrc]]\" alt=\"[[item.title]]\" sizing=\"cover\"></iron-image>\n    </a>\n    <a href=\"[[item.link]]\" title=\"[[item.title]]\">\n      <span class=\"title\">[[_truncateText(item.title, maxTitleLength)]]</span>\n    </a>\n    <div class=\"excerpt\">[[_truncateText(item.excerpt, maxExcerptLength)]]</div>\n    <template is=\"dom-if\" if=\"[[showReadMore]]\">\n      <a tabindex=\"-1\" href=\"[[item.link]]\" class=\"read-more\" title=\"[[item.title]]\">[[readMoreAnchorText]]\n        <paper-icon-button icon=\"icons:arrow-forward\" class=\"read-more-icon\" alt=\"[[readMoreImageAlt]]\"></paper-icon-button>\n      </a>\n    </template>\n  </article>\n  </template>\n</dom-repeat>"]);_templateObject_f5ca2ee0ab1211e98929c3ce74afbdb4=function _templateObject_f5ca2ee0ab1211e98929c3ce74afbdb4(){return data};return data}/**
 * `rss-items`
 * `visualize RSS items`
 * 
 * Example:
  ```html
  <rss-items
    url="https://content.therapychat.com/rss.xml"
    max="4"
    auto
  ></rss-items>
  ```
 * It will retrieve the items from the url automatically.
   ### Styling

    The following custom properties and mixins are available for styling:

    Custom property | Description | Default
    ----------------|-------------|----------
    `--rss-items` | Mixin applied to the component | `{}`
    `--rss-items-article` | Mixin applied to the articles | `{}`
    `--rss-items-article-mq-m-up` | Mixin applied to the articles on `min-width: 600px` | `{}`
    `--rss-items-article-mq-l-up` | Mixin applied to the articles on `min-width: 900px` | `{}`
    `--rss-items-thumbnail` | Mixin applied to the image thumbnails | `{}`
    `--rss-items-thumbnail-hover` | Mixin applied to the image thumbnails when hover | `{}`
    `--rss-items-thumbnail-container` | Mixin applied to the image thumbnails container | `{}`
    `--rss-items-title` | Mixin applied to the title | `{}`
    `--rss-items-excerpt` | Mixin applied to the excerpt | `{}`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var RssItems=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(RssItems,_PolymerElement);babelHelpers.createClass(RssItems,[{key:"initRequest",/**
   * Init ajax request to get rss.
   */value:function initRequest(){this.shadowRoot.querySelector("#rssajax").generateRequest()}},{key:"_maxChanged",value:function _maxChanged(newValue){if(newValue&&this._x2js&&this.__ready){this.xmlToItems(this.xml)}}/**
   * Receives a xml and set this.items as json.
   * @param {Object} xml XML element.
   */},{key:"xmlToItems",value:function xmlToItems(newValue){if(newValue&&this._x2js&&this.__ready){// parse xml to json and get items
var conversor=new X2JS,json=conversor.xml2json(newValue),items=json.rss?json.rss.channel.item:json.channel.item;// truncate with this.max and parse items
items=this.max===void 0?items:items.splice(0,this.max);this.items=this._parseItems(items)}}},{key:"_urlChanged",value:function _urlChanged(newValue){if(newValue&&this._x2js&&this.__ready){this.initRequest()}}/**
   * Parse items by getting excerpt and image source.
   * @param {Array} items RSS items.
   */},{key:"_parseItems",value:function _parseItems(items){return items.map(function(item){item.excerpt=this._getItemExcerpt(item);item.imageSrc=this._getItemImageScr(item);return item}.bind(this))}/**
   * Get excerpt from item description.
   * @param {Object} item Item where find excerpt.
   */},{key:"_getItemExcerpt",value:function _getItemExcerpt(item){var element=document.createElement("div");element.innerHTML=item.description;return element.textContent.trim()}/**
   * Get image source from item description.
   * @param {Object} item Item where find image.
   */},{key:"_getItemImageScr",value:function _getItemImageScr(item){if(item.thumbnail&&item.thumbnail._url){return item.thumbnail._url}else{var element=document.createElement("div");element.innerHTML=item.description;var image=element.querySelector("img")||{};return image.src||""}}/**
   * Truncate a text and concatenate with ellipsis if needed.
   * @param {String} text Text to truncate.
   * @param {Number} maxLength Max length of the text.
   * @return {String} Truncated text.
   */},{key:"_truncateText",value:function _truncateText(text,maxLength){if(text){return maxLength&&text.length>maxLength?text.substr(0,maxLength)+"...":text}}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_f5ca2ee0ab1211e98929c3ce74afbdb4())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Rss feed",description:"visualize RSS items",icon:"communication:rss-feed",color:"orange",groups:["RSS"],handles:[{type:"rss",source:"source"}],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"url",title:"Feed URL",description:"URL to the XML feed",inputMethod:"textfield"},{property:"max",title:"Max items",description:"Max number of feed items to display",inputMethod:"number"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={/**
   * If true init rss request.
   */auto:{type:Boolean,value:!1},/**
   * The retrieved items array.
   */items:{type:Array,notify:!0},/**
   * Max number of items to show. If it is undefined shows all items.
   */max:{type:Number,value:10,observer:"_maxChanged"},/**
   * Max length for item excerpts. If the excerpt exceeds this length it will be trimed and will have an ellipsis appended.
   */maxExcerptLength:{type:Number,value:100},/**
   * Max length for item titles. If the title exceeds this length it will be trimed and will have an ellipsis appended.
   */maxTitleLength:{type:Number,value:50},/**
   * Read more anchor text.
   */readMoreAnchorText:{type:Boolean,value:"Read more"},/**
   * Read more image alternative text.
   */readMoreImageAlt:{type:Boolean,value:"Icono de flecha"},/**
   * If true the items elements will display a read more link.
   */showReadMore:{type:Boolean,value:!1},/**
   * The URL of the RSS.
   */url:{type:String,observer:"_urlChanged"},xml:{type:Object,observer:"xmlToItems"}};if(babelHelpers.get(babelHelpers.getPrototypeOf(RssItems),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(RssItems),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"rss-items"}}]);function RssItems(){var _this;babelHelpers.classCallCheck(this,RssItems);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(RssItems).call(this));new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/iron-image/iron-image.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/paper-icon-button/paper-icon-button.js"],res,rej)});new Promise(function(res,rej){return _require.default(["./node_modules/@polymer/iron-icons/iron-icons.js"],res,rej)});var name="x2js",basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/x2js.js");window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load(name,location);window.addEventListener("es-bridge-".concat(name,"-loaded"),_this._x2jsLoaded.bind(babelHelpers.assertThisInitialized(_this)));return _this}babelHelpers.createClass(RssItems,[{key:"_x2jsLoaded",value:function _x2jsLoaded(e){this._x2js=!0;if(this.__ready){if(this.auto){this.shadowRoot.querySelector("#rssajax").auto=this.auto}else{this.initRequest()}}}/**
   * life cycle, element is afixed to the DOM
   */},{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(RssItems.prototype),"connectedCallback",this).call(this);this.__ready=!0;(0,_renderStatus.afterNextRender)(this,function(){this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(RssItems.haxProperties,RssItems.tag,this);if(this._x2js){if(this.auto){this.shadowRoot.querySelector("#rssajax").auto=this.auto}else{this.initRequest()}}})}/**
   * life cycle, element is removed from the DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("es-bridge-".concat(name,"-loaded"),this._x2jsLoaded.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(RssItems.prototype),"disconnectedCallback",this).call(this)}}]);return RssItems}(_polymerElement.PolymerElement);_exports.RssItems=RssItems;window.customElements.define(RssItems.tag,RssItems)});