define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/iron-icons/iron-icons.js","./node_modules/@polymer/paper-input/paper-input.js","./node_modules/@polymer/paper-tooltip/paper-tooltip.js","./lib/simple-search-content.js"],function(_exports,_polymerElement,_ironIcons,_paperInput,_paperTooltip,_simpleSearchContent){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleSearch=void 0;function _templateObject_51f3c1206a8311e999e64354dcebaad3(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style is=\"custom-style\">\n        :host {\n          display: flex;\n          align-items: flex-end;\n          justify-content: space-between;\n          width: 100%;\n        }\n        :host #input {\n          flex-grow: 2;\n          margin-right: 4px;\n          --paper-input-container-input-color: var(\n            --simple-search-input-text-color,\n            #000\n          );\n          --paper-input-container-shared-input-style_-_color: var(\n            --simple-search-input-text-color,\n            #000\n          );\n          --paper-input-container-focus-color: var(\n            --simple-search-input-line-color,\n            #000\n          );\n          --paper-input-container-color: var(\n            --simple-search-input-placeholder-color,\n            #222\n          );\n          color: var(--simple-search-input-placeholder-color, #222);\n          @apply --simple-search-container;\n        }\n        :host #xofy {\n          margin: 8px;\n        }\n        :host button {\n          margin: 8px 0 8px;\n          color: var(--simple-search-button-color, #111);\n          background-color: var(--simple-search-button-bg-color, #eee);\n          border-color: var(--simple-search-button-border-color, #ccc);\n          @apply --simple-search-button;\n        }\n        :host button:not([disabled]):focus,\n        :host button:not([disabled]):hover {\n          cursor: pointer;\n          color: var(--simple-search-button-hover-color, #000);\n          background-color: var(--simple-search-button-hover-bg-color, #fff);\n          border-color: var(--simple-search-button-hover-border-color, #ddd);\n          @apply --simple-search-button-hover;\n        }\n        :host button[disabled] {\n          cursor: not-allowed;\n          color: var(--simple-search-button-disabled-color, #999);\n          background-color: var(--simple-search-button-disabled-bg-color, #eee);\n          border-color: var(--simple-search-button-disabled-border-color, #ccc);\n          @apply --simple-search-button-disabled;\n        }\n        :host button:not([controls]) {\n          display: none;\n        }\n        :host [shrink-hide] {\n          display: none;\n        }\n      </style>\n      <paper-input\n        id=\"input\"\n        always-float-label$=\"[[alwaysFloatLabel]]\"\n        label=\"[[searchInputLabel]]\"\n        no-label-float$=\"[[noLabelFloat]]\"\n        on-change=\"_handleChange\"\n      >\n        <iron-icon icon=\"[[searchInputIcon]]\" slot=\"prefix\"></iron-icon>\n      </paper-input>\n      <div id=\"xofy\" shrink-hide$=\"[[noSearch]]\"></div>\n      <div shrink-hide$=\"[[noResults]]\">\n        <button\n          id=\"prev\"\n          aria-label=\"[[prevButtonLabel]]\"\n          aria-role=\"button\"\n          controls$=\"[[controls]]\"\n          disabled$=\"[[prevButtonDisabled]]\"\n          on-tap=\"_navigateResults\"\n          tabindex=\"0\"\n        >\n          <iron-icon icon=\"[[prevButtonIcon]]\"></iron-icon>\n        </button>\n        <paper-tooltip for=\"prev\">[[prevButtonLabel]]</paper-tooltip>\n        <button\n          id=\"next\"\n          aria-label=\"[[nextButtonLabel]]\"\n          aria-role=\"button\"\n          controls$=\"[[controls]]\"\n          disabled$=\"[[nextButtonDisabled]]\"\n          on-tap=\"_navigateResults\"\n          tabindex=\"0\"\n        >\n          <iron-icon icon$=\"[[nextButtonIcon]]\"></iron-icon>\n        </button>\n        <paper-tooltip for=\"next\">[[nextButtonLabel]]</paper-tooltip>\n      </div>\n    "],["\n      <style is=\"custom-style\">\n        :host {\n          display: flex;\n          align-items: flex-end;\n          justify-content: space-between;\n          width: 100%;\n        }\n        :host #input {\n          flex-grow: 2;\n          margin-right: 4px;\n          --paper-input-container-input-color: var(\n            --simple-search-input-text-color,\n            #000\n          );\n          --paper-input-container-shared-input-style_-_color: var(\n            --simple-search-input-text-color,\n            #000\n          );\n          --paper-input-container-focus-color: var(\n            --simple-search-input-line-color,\n            #000\n          );\n          --paper-input-container-color: var(\n            --simple-search-input-placeholder-color,\n            #222\n          );\n          color: var(--simple-search-input-placeholder-color, #222);\n          @apply --simple-search-container;\n        }\n        :host #xofy {\n          margin: 8px;\n        }\n        :host button {\n          margin: 8px 0 8px;\n          color: var(--simple-search-button-color, #111);\n          background-color: var(--simple-search-button-bg-color, #eee);\n          border-color: var(--simple-search-button-border-color, #ccc);\n          @apply --simple-search-button;\n        }\n        :host button:not([disabled]):focus,\n        :host button:not([disabled]):hover {\n          cursor: pointer;\n          color: var(--simple-search-button-hover-color, #000);\n          background-color: var(--simple-search-button-hover-bg-color, #fff);\n          border-color: var(--simple-search-button-hover-border-color, #ddd);\n          @apply --simple-search-button-hover;\n        }\n        :host button[disabled] {\n          cursor: not-allowed;\n          color: var(--simple-search-button-disabled-color, #999);\n          background-color: var(--simple-search-button-disabled-bg-color, #eee);\n          border-color: var(--simple-search-button-disabled-border-color, #ccc);\n          @apply --simple-search-button-disabled;\n        }\n        :host button:not([controls]) {\n          display: none;\n        }\n        :host [shrink-hide] {\n          display: none;\n        }\n      </style>\n      <paper-input\n        id=\"input\"\n        always-float-label\\$=\"[[alwaysFloatLabel]]\"\n        label=\"[[searchInputLabel]]\"\n        no-label-float\\$=\"[[noLabelFloat]]\"\n        on-change=\"_handleChange\"\n      >\n        <iron-icon icon=\"[[searchInputIcon]]\" slot=\"prefix\"></iron-icon>\n      </paper-input>\n      <div id=\"xofy\" shrink-hide\\$=\"[[noSearch]]\"></div>\n      <div shrink-hide\\$=\"[[noResults]]\">\n        <button\n          id=\"prev\"\n          aria-label=\"[[prevButtonLabel]]\"\n          aria-role=\"button\"\n          controls\\$=\"[[controls]]\"\n          disabled\\$=\"[[prevButtonDisabled]]\"\n          on-tap=\"_navigateResults\"\n          tabindex=\"0\"\n        >\n          <iron-icon icon=\"[[prevButtonIcon]]\"></iron-icon>\n        </button>\n        <paper-tooltip for=\"prev\">[[prevButtonLabel]]</paper-tooltip>\n        <button\n          id=\"next\"\n          aria-label=\"[[nextButtonLabel]]\"\n          aria-role=\"button\"\n          controls\\$=\"[[controls]]\"\n          disabled\\$=\"[[nextButtonDisabled]]\"\n          on-tap=\"_navigateResults\"\n          tabindex=\"0\"\n        >\n          <iron-icon icon\\$=\"[[nextButtonIcon]]\"></iron-icon>\n        </button>\n        <paper-tooltip for=\"next\">[[nextButtonLabel]]</paper-tooltip>\n      </div>\n    "]);_templateObject_51f3c1206a8311e999e64354dcebaad3=function _templateObject_51f3c1206a8311e999e64354dcebaad3(){return data};return data}/**
 * `simple-search`
 * `A button used in simple-search`
 *
 *
 * @microcopy - the mental model for this element
 *
 * ```<simple-search
 *   case-sensitive$="[[caseSensitive]]"     // is search case sensitive?
 *   controls$="[[controls]]">
 * </simple-search>```
 *
 *   The searchTerms property provides an array of search terms entered in to the input.
 *   The findMatches function returns an array of parsed results.
 *   For example if I searched for the with
 *   `findMatches("The quick brown fox jumps over the lazy dog.")`,
 *   the array would be:
 *   ``[
 *     {
 *       "matched": true,
 *       "matchNumber": 1,
 *       "text": "The"
 *     },{
 *       "matched": false,
 *       "text": " quick brown fox jumps over "
 *     },{
 *       "matched": true,
 *       "matchNumber": 2,
 *       "text": "the"
 *     },{
 *       "matched": false,
 *       "text": " lazy dog."
 *     }
 *   ]```
 *   or `findMatches("The quick brown fox jumps over the lazy dog.",true)`,
 *   the array would be:
 *   ```[
 *     {
 *       "matched": false,
 *       "text": "The quick brown fox jumps over "
 *     },{
 *       "matched": true,
 *       "matchNumber": 1,
 *       "text": "the"
 *     },{
 *       "matched": false,
 *       "text": " lazy dog."
 *     }
 *   ]```
 *
 *   CSS Variables:
 *   For the input field...
 *   ```--paper-input-container-input-color: var(--simple-search-input-color, #111);
 *   --paper-input-container-focus-color: var(--simple-search-input-placeholder-color, #000);
 *   --paper-input-container-color: var(--simple-search-input-line-color, #fff);
 *   @apply --simple-search-container;```
 *
 *   For buttons:
 *   ```color: var(--simple-search-button-color, #111);
 *   background-color: var(--simple-search-button-bg-color, #eee);
 *   border-color: var(--simple-search-button-border-color, #ccc);
 *   @apply --simple-search-button;`
 *
 *   For buttons on hover:
 *   ```color: var(--simple-search-button-hover-color, #000);
 *   background-color: var(--simple-search-button-hover-bg-color, #fff);
 *   border-color: var(--simple-search-button-hover-border-color, #ddd);
 *   @apply --simple-search-button-hover;```
 *
 *   For disabled buttons:
 *   ```color: var(--simple-search-button-disabled-color, #666);
 *   background-color: var(--simple-search-button-disabled-bg-color, #ccc);
 *   border-color: var(--simple-search-button-disabled-border-color, #aaa);
 *   @apply --simple-search-button-disabled;```
 *
 * @polymer
 * @customElement
 * @demo demo/index.html
 *
 */var SimpleSearch=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleSearch,_PolymerElement);function SimpleSearch(){babelHelpers.classCallCheck(this,SimpleSearch);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleSearch).apply(this,arguments))}babelHelpers.createClass(SimpleSearch,[{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(SimpleSearch.prototype),"ready",this).call(this);var root=this,search=root.$.input;root._getSearchText(search.value)}/**
   * are there any results to navigate?
   */},{key:"_handleChange",value:function _handleChange(e){var root=this;root._getSearchText(root.$.input.value);root.resultCount=0;root.resultPointer=0;root.dispatchEvent(new CustomEvent("simple-search",{detail:{search:root,content:e}}))}/**
   * are there any results to navigate?
   *
   * @param {number} total number of results
   * @returns {boolean} whether or not there are results
   */},{key:"_hasNoResults",value:function _hasNoResults(resultCount){return 1>resultCount}/**
   * are there any results to navigate?
   *
   * @param {array} array of search terms
   * @returns {boolean} whether or not there are search terms
   */},{key:"_hasNoSearch",value:function _hasNoSearch(searchTerms){return 1>searchTerms.length}/**
   * get results span text
   *
   * @param {boolean} whether or not there are search terms
   * @param {number} the current search result's position
   * @param {number} the total number of search results
   * @returns {string} "y results" or "x/y" text
   */},{key:"_getResultsSpan",value:function _getResultsSpan(noSearch,resultPointer,resultCount){var html="";if(0<resultCount&&0<resultPointer){html=resultPointer+"/"+resultCount}else{html=" "+resultCount}this.$.xofy.innerHTML=html;return this.$.xofy.innerHTML}/**
   * navigate results
   */},{key:"_navigateResults",value:function _navigateResults(e){var root=this,increment="next"===e.currentTarget.id?1:-1;if(0<this.resultPointer+increment&&this.resultPointer+increment<=this.resultCount){this.resultPointer+=increment;this.dispatchEvent(new CustomEvent("goto-result",{detail:this.resultPointer}))}}/**
   * navigate results
   */},{key:"_isNavButtonDisabled",value:function _isNavButtonDisabled(pointer,count,span,inc){return""==span||0>=pointer+inc||pointer+inc>count}/**
   * gets the tab-index of cues based on whether or not interactive cues are disabled
   *
   * @param {string} a string of search text
   */},{key:"_getSearchText",value:function _getSearchText(find){var temp=[];if(find!==void 0&&null!==find){temp=find.split(/[\"\']/gm);for(var i=0;i<temp.length;i++){temp[i]=temp[i].trim();if(""===temp[i])temp.splice(i,1)}}this.set("searchTerms",[]);this.set("searchTerms",temp.slice(0))}/**
   * search a string of content for any terms and return an array of results.
   * For example if I searched for the with
   * `findMatches("The quick brown fox jumps over the lazy dog.")`,
   * the array would be:
   * ```[
   *   {
   *     "matched": true,
   *     "matchNumber": 1,
   *     "text": "The",
   *     "searchObject": root
   *   },{
   *     "matched": false,
   *     "text": " quick brown fox jumps over ",
   *     "searchObject": root
   *   },{
   *     "matched": true,
   *     "matchNumber": 2,
   *     "text": "the",
   *     "searchObject": root
   *   },{
   *     "matched": false,
   *     "text": " lazy dog.",
   *     "searchObject": root
   *   }
   * ]```
   *
   * or `findMatches("The quick brown fox jumps over the lazy dog.",true)`,
   * the array would be:
   * ```[
   *   {
   *     "matched": false,
   *     "text": "The quick brown fox jumps over ",
   *     "searchObject": root
   *   },{
   *     "matched": true,
   *     "matchNumber": 1,
   *     "text": "the",
   *     "searchObject": root
   *   },{
   *     "matched": false,
   *     "text": " lazy dog.",
   *     "searchObject": root
   *   }
   * ]```
   *
   * @param {array} an array of search terms
   * @returns {array} an array of search results
   */},{key:"findMatches",value:function findMatches(content){for(var root=this,terms=root.searchTerms,modifier=this.caseSensitive?"gm":"gim",results=content.slice(0),updateResults=function updateResults(find){for(var i=0;i<results.length;i++){if(!1===results[i].matched){var regex=new RegExp("\\b"+find+"\\b",modifier),text=results[i].text,start=text.search(regex),end=start+find.length;if(-1<start){root.resultCount+=1;var pre=text.slice(0,start),match=text.slice(start,end),post=text.slice(end,text.length),update=results.splice(i,1,{matched:!1,text:pre,searchObject:root},{matched:!0,matchNumber:root.resultCount,text:match,searchObject:root},{matched:!1,text:post,searchObject:root})}}}},i=0;i<terms.length;i++){updateResults(terms[i])}root.resultPointer=0;return results}}],[{key:"is",get:function get(){return"simple-search"}},{key:"properties",get:function get(){return{/**
       * always float the label
       */alwaysFloatLabel:{type:Boolean,value:!1},/**
       * Is the search case-sensitive
       */caseSensitive:{type:Boolean,value:null},/**
       * The id of the container element that the navigation buttons control
       */controls:{type:String,value:null},/**
       * is the previous next button disabled
       */nextButtonDisabled:{type:Boolean,computed:"_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,1)"},/**
       * label for next result icon
       */nextButtonIcon:{type:String,value:"arrow-forward"},/**
       * label for next result button
       */nextButtonLabel:{type:String,value:"next result"},/**
       * never float the label
       */noLabelFloat:{type:Boolean,value:!1},/**
       * are there any results to navigate?
       */noResults:{type:Boolean,computed:"_hasNoResults(resultCount)"},/**
       * is there an active search?
       */noSearch:{type:Boolean,computed:"_hasNoSearch(searchTerms)"},/**
       * is the previous result button disabled
       */prevButtonDisabled:{type:Boolean,computed:"_isNavButtonDisabled(resultPointer,resultCount,resultsSpan,-1)"},/**
       * label for previous result icon
       */prevButtonIcon:{type:String,value:"arrow-back"},/**
       * label for previous result button
       */prevButtonLabel:{type:String,value:"previous result"},/**
       * Number of results.
       */resultCount:{type:Number,value:0},/**
       * Which result are we currently on?
       */resultPointer:{type:Number,value:0},/**
       * Number of results.
       */resultsSpan:{type:String,computed:"_getResultsSpan(noSearch,resultPointer,resultCount)"},/**
       * label for search icon
       */searchInputIcon:{type:String,value:"search"},/**
       * label for search input
       */searchInputLabel:{type:String,value:"search"},/**
       * an array of search terms
       */searchTerms:{type:Array,value:[]},/**
       * The container element that the navigation buttons control
       */target:{type:Object,value:null}}}// render function
},{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_51f3c1206a8311e999e64354dcebaad3())}}]);return SimpleSearch}(_polymerElement.PolymerElement);_exports.SimpleSearch=SimpleSearch;customElements.define(SimpleSearch.is,SimpleSearch)});