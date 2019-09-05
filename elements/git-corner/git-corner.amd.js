define(["exports","./node_modules/lit-element/lit-element.js"],function(_exports,_litElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.GitCorner=void 0;function _templateObject2_feada0d0cfdb11e99658afe1e7dcbb4b(){var data=babelHelpers.taggedTemplateLiteral(["\n    :host {\n      display: block;\n    }\n  "]);_templateObject2_feada0d0cfdb11e99658afe1e7dcbb4b=function _templateObject2_feada0d0cfdb11e99658afe1e7dcbb4b(){return data};return data}function _templateObject_feada0d0cfdb11e99658afe1e7dcbb4b(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>","</div>"]);_templateObject_feada0d0cfdb11e99658afe1e7dcbb4b=function _templateObject_feada0d0cfdb11e99658afe1e7dcbb4b(){return data};return data}/**
 * `git-corner`
 * `display a quick link with styling to a repo to help with contributions`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */var GitCorner=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(GitCorner,_LitElement);babelHelpers.createClass(GitCorner,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_feada0d0cfdb11e99658afe1e7dcbb4b(),this.source)}// properties available to the custom element for data binding
}],[{key:"properties",get:function get(){var props={source:{name:"source",type:"String",value:"",reflectToAttribute:!1,observer:!1}};if(babelHelpers.get(babelHelpers.getPrototypeOf(GitCorner),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(GitCorner),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"git-corner"}/**
   * Register CSS styles
   */},{key:"styles",get:function get(){return[(0,_litElement.css)(_templateObject2_feada0d0cfdb11e99658afe1e7dcbb4b())]}// life cycle
}]);function GitCorner(){babelHelpers.classCallCheck(this,GitCorner);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(GitCorner).call(this));// put default values here
}/**
   * life cycle, element is afixed to the DOM
   */babelHelpers.createClass(GitCorner,[{key:"connectedCallback",value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(GitCorner.prototype),"connectedCallback",this).call(this)}/**
   * life cycle, element removed from DOM
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(GitCorner.prototype),"disconnectedCallback",this).call(this)}/**
   * runs on first go
   */},{key:"firstUpdated",value:function firstUpdated(changedProperties){changedProperties.forEach(function(oldValue,propName){})}/**
   * updated / notice property changes
   */},{key:"updated",value:function updated(changedProperties){changedProperties.forEach(function(oldValue,propName){})}}]);return GitCorner}(_litElement.LitElement);_exports.GitCorner=GitCorner;customElements.define("git-corner",GitCorner)});