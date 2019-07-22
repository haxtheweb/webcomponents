define(["exports","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.RandomItem=void 0;/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */ /**
 * `random-item`
 * `show a random item from a list of items`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @demo demo/index.html
 */var RandomItem=/*#__PURE__*/function(_HTMLElement){babelHelpers.inherits(RandomItem,_HTMLElement);babelHelpers.createClass(RandomItem,[{key:"html",// render function
get:function get(){return"\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n".concat(this.dataPoint)}// haxProperty definition
}],[{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Random item",description:"Show a random item from a list of items",icon:"communication:rss-feed",color:"red",groups:["Item"],handles:[],meta:{author:"btopro",owner:"The Pennsylvania State University"}},settings:{quick:[],configure:[{property:"field",title:"Field",description:"Field in the file to show",inputMethod:"textfield",required:!1},{property:"source",title:"Source",description:"URL pointing to a CSV file",inputMethod:"haxupload",required:!0}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={source:{name:"source",type:"String"},field:{name:"field",type:"String"}};if(babelHelpers.get(babelHelpers.getPrototypeOf(RandomItem),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(RandomItem),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"random-item"}/**
   * life cycle
   */}]);function RandomItem(){var _this,delayRender=0<arguments.length&&arguments[0]!==void 0?arguments[0]:!1;babelHelpers.classCallCheck(this,RandomItem);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(RandomItem).call(this));// set tag for later use
_this.tag=RandomItem.tag;_this.template=document.createElement("template");_this.attachShadow({mode:"open"});if(!delayRender){_this.render()}return _this}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(RandomItem,[{key:"connectedCallback",value:function connectedCallback(){if(window.ShadyCSS){window.ShadyCSS.styleElement(this)}this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(RandomItem.haxProperties,RandomItem.tag,this)}},{key:"render",value:function render(){this.shadowRoot.innerHTML=null;this.template.innerHTML=this.html;if(window.ShadyCSS){window.ShadyCSS.prepareTemplate(this.template,this.tag)}this.shadowRoot.appendChild(this.template.content.cloneNode(!0))}},{key:"attributeChangedCallback",// disconnectedCallback() {}
value:function attributeChangedCallback(attr,oldValue,newValue){if("source"===attr&&newValue){this.source=newValue;this.sourceChanged(newValue)}else if("field"===attr&&newValue){this.field=newValue;if(this.source){this.setDataWithRandom()}}}/**
   * source changed
   */},{key:"sourceChanged",value:function(){var _sourceChanged=babelHelpers.asyncToGenerator(/*#__PURE__*/regeneratorRuntime.mark(function _callee(value){var data,heading;return regeneratorRuntime.wrap(function _callee$(_context){while(1){switch(_context.prev=_context.next){case 0:_context.next=2;return fetch(value).then(function(response){return response.text()});case 2:data=_context.sent;this.items=this.CSVtoArray(data);heading=this.items.shift();this.qKey=heading;this.entryPoint=0;this.setDataWithRandom();case 8:case"end":return _context.stop();}}},_callee,this)}));function sourceChanged(_x){return _sourceChanged.apply(this,arguments)}return sourceChanged}()/**
   * Set data with a random value
   */},{key:"setDataWithRandom",value:function setDataWithRandom(){for(var key in this.qKey){if(this.qKey[key]===this.field){this.entryPoint=+key}}var qKey=Math.floor(Math.random()*this.items.length);this.dataPoint=this.items[qKey][this.entryPoint];this.render()}/**
   * Mix of solutions from https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
   */},{key:"CSVtoArray",value:function CSVtoArray(text){var p="",row=[""],ret=[row],i=0,r=0,s=!0,l;for(l in text){l=text[l];if("\""===l){if(s&&l===p)row[i]+=l;s=!s}else if(","===l&&s)l=row[++i]="";else if("\n"===l&&s){if("\r"===p)row[i]=row[i].slice(0,-1);row=ret[++r]=[l=""];i=0}else row[i]+=l;p=l}return ret}}],[{key:"observedAttributes",get:function get(){return["source","field"]}}]);return RandomItem}(babelHelpers.wrapNativeSuper(HTMLElement));_exports.RandomItem=RandomItem;window.customElements.define(RandomItem.tag,RandomItem)});