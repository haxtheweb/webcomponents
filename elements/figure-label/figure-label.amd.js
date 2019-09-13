define(["exports","./node_modules/lit-element/lit-element.js"],function(_exports,_litElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.FigureLabel=void 0;function _templateObject_7b5e0990d65711e9a7eeb757c6f78a9e(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\n#wrap {\n  display: flex;\n  margin-bottom: 1em;\n}\n\n#title {\n  background-color: #f2f2f2;\n  padding: 10.8px 13.5px 10.8px;\n  font-size: 13.5px;\n}\n\n#description {\n  border: solid 1px #f2f2f2;\n  padding: 10.8px 13.5px 10.8px;\n  font-size: 13.5px;\n}</style>\n<div id=\"wrap\">\n  <div id=\"title\">","</div>\n  <div id=\"description\">","</div>\n</div>"]);_templateObject_7b5e0990d65711e9a7eeb757c6f78a9e=function _templateObject_7b5e0990d65711e9a7eeb757c6f78a9e(){return data};return data}/**
 * `figure-label`
 * `Figure label element to mark media assets within content.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-element
 * @demo demo/index.html
 */var FigureLabel=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(FigureLabel,_LitElement);function FigureLabel(){babelHelpers.classCallCheck(this,FigureLabel);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(FigureLabel).apply(this,arguments))}babelHelpers.createClass(FigureLabel,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_7b5e0990d65711e9a7eeb757c6f78a9e(),this.title,this.description)}// haxProperty definition
},{key:"tag",/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */value:function tag(){return"figure-label"}}],[{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Figure label",description:"Figure label element to mark media assets within content.",icon:"icons:android",color:"green",groups:["Label"],meta:{author:"heymp",owner:"PSU"}},settings:{quick:[],configure:[{property:"title",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"},{property:"description",description:"",inputMethod:"textfield",required:!1,icon:"icons:android"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{title:{name:"title",type:String,value:"",reflectToAttribute:!1,observer:!1},description:{name:"description",type:String,value:"",reflectToAttribute:!1,observer:!1}}}}]);return FigureLabel}(_litElement.LitElement);_exports.FigureLabel=FigureLabel;customElements.define("figure-label",FigureLabel)});