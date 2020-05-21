define(["exports","./node_modules/lit-element/lit-element.js"],function(_exports,_litElement){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.GitCorner=void 0;function _templateObject2_80e6f7f0d65711e9902cbfc514b33561(){var data=babelHelpers.taggedTemplateLiteral(["\n        :host {\n          display: block;\n        }\n        :host([corner]) svg {\n          z-index: var(--github-corner-z-index, 1);\n          position: absolute;\n          top: 0;\n          border: 0;\n          right: 0;\n        }\n        :host([circle]) svg {\n          border-radius: 100px;\n          transform: rotate(-45deg);\n        }\n        :host([size=\"micro\"]) {\n          --github-corner-size: 28px;\n        }\n        :host([size=\"small\"]) {\n          --github-corner-size: 50px;\n        }\n        :host([size=\"large\"]) {\n          --github-corner-size: 100px;\n        }\n        svg {\n          fill: var(--github-corner-background, #24292e);\n          color: var(--github-corner-color, #ffffff);\n          width: var(--github-corner-size, 80px);\n          height: var(--github-corner-size, 80px);\n        }\n        a {\n          display: table;\n          outline-color: var(--github-corner-background, #24292e);\n          outline-width: 2px;\n        }\n\n        .github-corner:focus .octo-arm,\n        .github-corner:hover .octo-arm {\n          animation: octocat-wave 560ms ease-in-out;\n        }\n\n        @keyframes octocat-wave {\n          0%,\n          100% {\n            transform: rotate(0);\n          }\n          20%,\n          60% {\n            transform: rotate(-25deg);\n          }\n          40%,\n          80% {\n            transform: rotate(10deg);\n          }\n        }\n        @media (max-width: 500px) {\n          .github-corner:hover .octo-arm {\n            animation: none;\n          }\n          .github-corner .octo-arm {\n            animation: octocat-wave 560ms ease-in-out;\n          }\n        }\n      "]);_templateObject2_80e6f7f0d65711e9902cbfc514b33561=function _templateObject2_80e6f7f0d65711e9902cbfc514b33561(){return data};return data}function _templateObject_80e6f7f0d65711e9902cbfc514b33561(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}</style>\n<a .title=\"","\" .href=\"","\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"github-corner\">\n    <svg viewBox=\"0 0 250 250\">\n        <path d=\"M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z\"></path>\n        <path\n            d=\"M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2\"\n            fill=\"currentColor\" style=\"transform-origin: 130px 106px;\" class=\"octo-arm\"></path>\n        <path\n            d=\"M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z\"\n            fill=\"currentColor\" class=\"octo-body\"></path>\n    </svg>\n</a>"]);_templateObject_80e6f7f0d65711e9902cbfc514b33561=function _templateObject_80e6f7f0d65711e9902cbfc514b33561(){return data};return data}/**
 * `git-corner`
 * `display a quick link with styling to a repo to help with contributions`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-element
 * @demo demo/index.html
 */var GitCorner=/*#__PURE__*/function(_LitElement){babelHelpers.inherits(GitCorner,_LitElement);function GitCorner(){babelHelpers.classCallCheck(this,GitCorner);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(GitCorner).apply(this,arguments))}babelHelpers.createClass(GitCorner,[{key:"render",// render function
value:function render(){return(0,_litElement.html)(_templateObject_80e6f7f0d65711e9902cbfc514b33561(),this.alt,this.source)}// properties available to the custom element for data binding
},{key:"firstUpdated",/**
   * runs on first go
   */value:function firstUpdated(changedProperties){changedProperties.forEach(function(oldValue,propName){})}/**
   * updated / notice property changes
   */},{key:"updated",value:function updated(changedProperties){changedProperties.forEach(function(oldValue,propName){})}}],[{key:"properties",get:function get(){var props={/**
   * source to point to
   */source:{name:"source",type:String},/**
   * alt text
   */alt:{name:"alt",type:String},/**
   * Whether or not to be rendered in the top corner, common on tech sites
   */corner:{name:"corner",type:Boolean,reflect:!0},/**
   * basic size adjustment
   */size:{name:"size",type:String,reflect:!0}};if(babelHelpers.get(babelHelpers.getPrototypeOf(GitCorner),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(GitCorner),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"git-corner"}/**
   * Register CSS styles
   */},{key:"styles",get:function get(){return[(0,_litElement.css)(_templateObject2_80e6f7f0d65711e9902cbfc514b33561())]}}]);return GitCorner}(_litElement.LitElement);_exports.GitCorner=GitCorner;customElements.define(GitCorner.tag,GitCorner)});