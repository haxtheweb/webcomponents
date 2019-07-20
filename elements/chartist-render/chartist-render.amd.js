define(["exports","meta","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/resolve-url.js","./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js","./lib/chartist-render-shared-styles.js"],function(_exports,meta,_polymerElement,_resolveUrl,_esGlobalBridge,_chartistRenderSharedStyles){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.ChartistRender=void 0;meta=babelHelpers.interopRequireWildcard(meta);function _templateObject_6b4c94a0ab1311e980aa6758ef9f4a5b(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style include=\"chartist-render-shared-styles\">\n        :host {\n          display: block;\n        }\n      </style>\n      <div id=\"chart\" chart$=\"[[__chartId]]\" class$=\"ct-chart [[scale]]\"></div>\n    "]);_templateObject_6b4c94a0ab1311e980aa6758ef9f4a5b=function _templateObject_6b4c94a0ab1311e980aa6758ef9f4a5b(){return data};return data}/**
 * `chartist-render`
 * Uses the chartist library to render a chart.
 *
 * @polymer
 * @customElement
 * @demo demo/index.html
 *
 */var ChartistRender=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(ChartistRender,_PolymerElement);function ChartistRender(){babelHelpers.classCallCheck(this,ChartistRender);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(ChartistRender).apply(this,arguments))}babelHelpers.createClass(ChartistRender,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(ChartistRender.prototype),"connectedCallback",this).call(this);var basePath=(0,_resolveUrl.pathFromUrl)(decodeURIComponent(meta.url)),location="".concat(basePath,"lib/chartist/dist/chartist.min.js");window.addEventListener("es-bridge-chartistLib-loaded",this._chartistLoaded.bind(this));window.ESGlobalBridge.requestAvailability();window.ESGlobalBridge.instance.load("chartistLib",location)}},{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("es-bridge-chartistLib-loaded",this._chartistLoaded.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(ChartistRender.prototype),"disconnectedCallback",this).call(this)}/**
   * life cycle, element is ready
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(ChartistRender.prototype),"ready",this).call(this);var root=this;window.dispatchEvent(new CustomEvent("chartist-render-ready",{detail:root}));if("object"===("undefined"===typeof Chartist?"undefined":babelHelpers.typeof(Chartist)))root._chartistLoaded.bind(root)}/**
   * determines if char is ready
   */},{key:"_chartistLoaded",value:function _chartistLoaded(){this.__chartistLoaded=!0;this.makeChart()}/**
   * Makes chart and returns the chart object.
   */},{key:"makeChart",value:function makeChart(){var _this=this;setTimeout(function(){_this.chart=_this._renderChart()},100)}/**
   * Renders chart and returns the chart object.
   */},{key:"_renderChart",value:function _renderChart(){var root=this,chart=null;root.__chartId=root._getUniqueId("chartist-render-");if(root!==void 0&&"object"===("undefined"===typeof Chartist?"undefined":babelHelpers.typeof(Chartist))&&null!==root.$.chart&&null!==root.data){if("bar"==root.type){if(root.responsiveOptions!==void 0&&0<root.responsiveOptions.length){root.responsiveOptions.forEach(function(option){if(option[1]!==void 0){if(option[1].axisX&&"noop"==option[1].axisX.labelInterpolationFnc)option[1].axisX.labelInterpolationFnc=Chartist.noop;if(option[1].axisY&&"noop"==option[1].axisY.labelInterpolationFnc)option[1].axisY.labelInterpolationFnc=Chartist.noop}})}chart=Chartist.Bar(this.$.chart,root.data,root.options,root.responsiveOptions)}else if("line"==root.type){chart=Chartist.Line(this.$.chart,root.data,root.options,root.responsiveOptions)}else if("pie"==root.type){chart=Chartist.Pie(this.$.chart,root.data,root.options,root.responsiveOptions)}window.dispatchEvent(new CustomEvent("chartist-render-draw",{detail:chart}));chart.on("created",function(){root.addA11yFeatures(chart.container.childNodes[0])})}return chart}/**
   * Add accessibility features.
   */},{key:"addA11yFeatures",value:function addA11yFeatures(svg){var desc=this.data.labels!==void 0&&null!==this.data.labels?this.chartDesc+this.makeA11yTable(svg):this.chartDesc;this._addA11yFeature(svg,"desc",desc);this._addA11yFeature(svg,"title",this.chartTitle);svg.setAttribute("aria-labelledby",this.__chartId+"-chart-title "+this.__chartId+"-chart-desc")}/**
   * Add accessibility features.
   */},{key:"makeA11yTable",value:function makeA11yTable(svg){for(var title=null!==this.chartTitle?this.chartTitle:"A "+this.type+" chart.",table=["<table summary=\"Each column is a series of data, and the first column is the data label.\">","<caption>"+title+"</caption>","<tbody>"],i=0;i<this.data.labels.length;i++){table.push("<tr><th scope=\"row\">"+this.data.labels[i]+"</th>");if("pie"==this.type){table.push("<td>"+this.data.series[i]+"</td>")}else{for(var j=0;j<this.data.series.length;j++){table.push("<td>"+this.data.series[j][i]+"</td>")}}table.push("</tr>")}table.push("</tbody></table>");return table.join("")}/**
   * For inserting chart title and description.
   */},{key:"_addA11yFeature",value:function _addA11yFeature(svg,tag,html){var el=document.createElement(tag),first=svg.childNodes[0];el.innerHTML=html;el.setAttribute("id",this.__chartId+"-chart-"+tag);svg.insertBefore(el,first)}/**
   * Get unique ID from the chart
   */},{key:"_getUniqueId",value:function _getUniqueId(prefix){var id=prefix+Date.now();return id}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_6b4c94a0ab1311e980aa6758ef9f4a5b())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{/**
       * The unique identifier of the chart.
       */id:{type:String,value:"chart"},/**
       * The type of chart:bar, line, or pie
       */type:{type:String,value:"bar"},/**
       * The scale of the chart. (See https://gionkunz.github.io/chartist-js/api-documentation.html)```
Container class	Ratio
.ct-square          1
.ct-minor-second	  15:16
.ct-major-second	  8:9
.ct-minor-third	    5:6
.ct-major-third	    4:5
.ct-perfect-fourth	3:4
.ct-perfect-fifth	  2:3
.ct-minor-sixth	    5:8
.ct-golden-section	1:1.618
.ct-major-sixth	    3:5
.ct-minor-seventh	  9:16
.ct-major-seventh	  8:15
.ct-octave	        1:2
.ct-major-tenth	    2:5
.ct-major-eleventh	3:8
.ct-major-twelfth	  1:3
.ct-double-octave	  1:4```
       */scale:{type:String,observer:"makeChart"},/**
       * The chart title used for accessibility.
       */chartTitle:{type:String,value:null,observer:"makeChart"},/**
       * The chart description used for accessibility.
       */chartDesc:{type:String,value:"",observer:"makeChart"},/**
       * The chart data.
       */data:{type:Object,value:null,observer:"makeChart"},/**
       * The options available at  https://gionkunz.github.io/chartist-js/api-documentation.html.
       */options:{type:Object,value:null,observer:"makeChart"},/**
       * The responsive options. (See https://gionkunz.github.io/chartist-js/api-documentation.html.)
       */responsiveOptions:{type:Array,value:[],observer:"makeChart"},/**
       * The show data in table form as well? Default is false.
       */showTable:{type:Boolean,value:!1,observer:"makeChart"}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"chartist-render"}}]);return ChartistRender}(_polymerElement.PolymerElement);_exports.ChartistRender=ChartistRender;window.customElements.define(ChartistRender.tag,ChartistRender)});