define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"],function(_exports,_polymerElement,_simpleColors,_HAXWiring){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.FilteredImage=void 0;function _templateObject_09ff1a7081c311e9846a97d7153d02e3(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n:host([hidden]) {\n  display: none;\n}\n</style>\n<style>\n</style>\n<svg id=\"svg\" viewBox$=\"[[viewBox]]\"> \n  <rect id=\"rect\" x=\"0\" y=\"0\"></rect>\n  <filter id$=\"[[__id]]\">\n    <feColorMatrix\n      id=\"matrix\"\n      type=\"matrix\"\n      values=\" 1   0   0   0   0\n               0   1   0   0   0\n               0   0   1   0   0\n               0   0   0   1   0 \"/>\n\n  </filter>      \n  <image id=\"image\" filter$=\"url(#[[__id]])\" x=\"0\" y=\"0\"></image>\n</svg>"]);_templateObject_09ff1a7081c311e9846a97d7153d02e3=function _templateObject_09ff1a7081c311e9846a97d7153d02e3(){return data};return data}/**
 * `filtered-image`
 * `An image using an SVG filter. Can be used to make background images have more contrast with text.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @demo demo/filters.html Filters
 */var FilteredImage=/*#__PURE__*/function(_SimpleColors){babelHelpers.inherits(FilteredImage,_SimpleColors);function FilteredImage(){babelHelpers.classCallCheck(this,FilteredImage);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(FilteredImage).apply(this,arguments))}babelHelpers.createClass(FilteredImage,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(FilteredImage.prototype),"connectedCallback",this).call(this);this.HAXWiring=new _HAXWiring.HAXWiring;this.HAXWiring.setup(FilteredImage.haxProperties,FilteredImage.tag,this);this._srcChanged()}},{key:"_heightChanged",value:function _heightChanged(){var svg=this.$.svg,image=svg.querySelector("#image"),rect=svg.querySelector("#rect");svg.setAttribute("height",this.height);image.setAttribute("height",this.height);rect.setAttribute("height",this.height)}},{key:"_widthChanged",value:function _widthChanged(){var svg=this.$.svg,image=svg.querySelector("#image"),rect=svg.querySelector("#rect");svg.setAttribute("width",this.width);image.setAttribute("width",this.width);rect.setAttribute("width",this.width)}},{key:"_getViewBox",value:function _getViewBox(height,width){return"0 0 ".concat(width," ").concat(height)}},{key:"_srcChanged",value:function _srcChanged(){var svg=this.$.svg,image=svg.querySelector("#image");image.setAttribute("href",this.src);image.setAttribute("xlink:href",this.src)}},{key:"_getMatrix",value:function _getMatrix(color,contrast,strength){var values=[[1,0,0,0,0],[0,1,0,0,0],[0,0,1,0,0],[0,0,0,1,0]],svg=this.$.svg,matrix=svg.querySelector("#matrix"),rgba=null;if(color.startsWith("#")&&6<color.length){if(7===color.length)color+="ff";values[0][0]=parseInt(color.substring(1,3),16)/255;values[1][1]=parseInt(color.substring(3,5),16)/255;values[2][2]=parseInt(color.substring(5,7),16)/255;values[3][3]=parseInt(color.substring(7,9),16)/255}else if(color.startsWith("#")){if(4===color.length)color+="f";values[0][0]=parseInt(color.substring(1,2)+color.substring(1,2),16)/255;values[1][1]=parseInt(color.substring(2,3)+color.substring(2,3),16)/255;values[2][2]=parseInt(color.substring(3,4)+color.substring(3,4),16)/255;values[3][3]=parseInt(color.substring(4,5)+color.substring(4,5),16)/255}else if(color.startsWith("rgb")){var temp=color.replace(/rgba?\(/g,"").replace(/\)/g,"");rgba=temp.split(",");values[0][0]=parseInt(rgba[0]/255);values[1][1]=parseInt(rgba[1]/255);values[2][2]=parseInt(rgba[2]/255);values[3][3]=values[3][3]||"1"}//console.log(values);
if(0!==contrast){values[0][3]=values[0][0]*contrast/100;values[1][3]=values[1][1]*contrast/100;values[2][3]=values[2][2]*contrast/100}if(1!==strength){var adjust=function adjust(val,strength){var diff=1-val,pct=diff/100,adjustment=pct*(1-strength);return val+.01*(1-val)*(1-strength)};values[0][0]=values[0][0]+(1-strength)*(1-values[0][0]);values[1][1]=values[1][1]+(1-strength)*(1-values[1][1]);values[2][2]=values[2][2]+(1-strength)*(1-values[2][2])}console.log(values);matrix.setAttribute("values",JSON.stringify(values).replace(/[,\[\]]/g," "));return values}},{key:"_getID",value:function _getID(src,matrix){var id="svg"+Math.random();return id.replace(/0./g,"-")}/**
   * life cycle, element is removed from the DOM
   */ //disconnectedCallback() {}
}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_09ff1a7081c311e9846a97d7153d02e3())}// haxProperty definition
},{key:"haxProperties",get:function get(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Filtered image",description:"An image using an SVG filter. Can be used to make background images have more contrast with text.",icon:"icons:android",color:"green",groups:["Image"],handles:[{type:"todo:read-the-docs-for-usage"}],meta:{author:"nikkimk",owner:"The Pennsylvania State University"}},settings:{quick:[{property:"src",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"},{property:"alt",description:"",inputMethod:"alt",required:!0,icon:"icons:accessibility"}],configure:[{property:"src",description:"",inputMethod:"textfield",required:!0,icon:"icons:link",validationType:"url"},{property:"alt",description:"",inputMethod:"alt",required:!0,icon:"icons:accessibility"}],advanced:[]}}}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{src:{name:"src",type:"String",value:"",observer:"_srcChanged"},__id:{name:"__id",type:"String",computed:"_getID(src,matrix)"},alt:{name:"alt",type:"String",value:""},height:{name:"width",type:"String",value:"",observer:"_heightChanged"},width:{name:"unset",type:"String",value:"",observer:"_widthChanged"},viewBox:{name:"viewBox",type:"String",computed:"_getViewBox(height,width)"},color:{name:"color",type:"String",value:"#ffffff"},strength:{name:"strength",type:"Number",value:1},contrast:{name:"contrast",type:"Number",value:0},/*"__filters": {
    "name": "__filters",
    "type": "Array",
    "value": {
      "red": [0.750,0.0500,0.000],
      "pink": [0.650,0.0300,0.270],
      "purple": [0.400,0.000,0.650],
      "deep-purple": [0.175,0.000,0.600],
      "indigo": [0.025,0.000,0.675],
      "blue": [0.000,0.100,0.700],
      "light-blue": [0.000,0.200,0.850],
      "cyan": [0.000,0.450,0.750],
      "teal": [0.000,0.550,0.200],
      "green": [0.000,0.650,0.050],
      "light-green": [0.075,0.625,0.000],
      "lime": [0.250,0.750,0.000],
      "yellow": [0.850,0.850,0.000],
      "amber": [0.800,0.500,0.000],
      "orange": [0.850,0.150,0.000],
      "deep-orange": [0.950,0.050,0.000],
      "brown": [0.200,0.100,0.075],
      "blue-grey": [0.100,0.200,0.300]
    }
  },*/__matrix:{name:"matrix",type:"Array",computed:"_getMatrix(color,contrast,strength)"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"filtered-image"}}]);return FilteredImage}(_simpleColors.SimpleColors);_exports.FilteredImage=FilteredImage;window.customElements.define(FilteredImage.tag,FilteredImage)});