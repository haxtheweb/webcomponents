define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/polymer/lib/utils/render-status.js","./node_modules/@polymer/paper-button/paper-button.js","./node_modules/@polymer/paper-input/paper-input.js","./node_modules/@polymer/paper-progress/paper-progress.js","./node_modules/@polymer/paper-styles/shadow.js","./node_modules/@polymer/paper-styles/typography.js","./node_modules/@polymer/paper-styles/color.js"],function(_exports,_polymerElement,_renderStatus,_paperButton,_paperInput,_paperProgress,_shadow,_typography,_color){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.SimpleLogin=void 0;function _templateObject_10d5dbd0ab1311e9a90b29cb31082c9b(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n\n#loginform {\n    width: var(--login-form-width, 450px);\n    height: var(--login-form-height, auto);\n    --simple-camera-snap-color: var(--login-form-color, #36bed4);\n    --simple-camera-snap-error: var(--login-form-error, red);\n    --simple-camera-snap-width: var(--login-form-image-width, 200px);\n    --simple-camera-snap-height: var(--login-form-image-height, 200px);\n    --simple-camera-snap-background: var(--login-form-background, white);\n    --simple-camera-snap-border-radius: var(--login-form-image-bnorder-radius,100%);\n    @apply --shadow-elevation-12dp;\n    @apply --login-form;\n}\n\n#loginformcontent {\n    padding: var(--login-form-padding, 48px);\n}\n\n#loginformcontent>* {\n    margin-top: var(--login-form-margin-top, var(--login-form-margin, 8px));\n    margin-bottom: var(--login-form-margin-bottom, var(--login-form-margin, 8px));\n}\n\n#loginbtn,\n#buttons ::slotted(paper-button) {\n    margin-top: 24px;\n    background-color: var(--login-btn-background-color, var(--login-form-color, var(--paper-indigo-500)));\n    color: var(--login-btn-text-color, var(--login-form-background, white));\n    --paper-button-raised-keyboard-focus: {\n        background-color: var(--login-btn-raised-background-color, var(--paper-pink-a200)) !important;\n        color: var(--login-btn-text-color, var(--login-form-background, white)) !important;\n    };\n    @apply --login-btn;\n}\n\n#loginbtn[disabled] {\n    background-color: var(--login-btn-disabled-background-color, var(--paper-indigo-100));\n}\n\nh1 {\n    @apply --paper-font-display1;\n    margin: 0;\n    @apply --login-title;\n}\n\nh2 {\n    @apply --paper-font-title;\n    margin: 0;\n    @apply --login-subtitle;\n}\n\npaper-progress {\n    width: 100%;\n}\n\n::slotted(simple-login-avatar) {\n  margin: 0 auto;\n}\n\n#errormsg {\n    margin-top: 16px;\n    color: var(--login-error-label-color, var(--error-color));\n    @apply --paper-font-menu;\n}</style>\n<div id=\"loginform\">\n  <paper-progress disabled=\"[[!loading]]\" indeterminate></paper-progress>\n  <div id=\"loginformcontent\">\n    <h1>[[title]]</h1>\n    <h2>[[subtitle]]</h2>\n    <div id=\"errormsg\">[[errorMsg]]</div>\n    <slot></slot>\n    <paper-input id=\"userinput\" value=\"{{username}}\" disabled=\"[[loading]]\" type=\"text\" label=\"[[userInputLabel]]\"\n      required error-message=\"[[userInputErrMsg]]\"></paper-input>\n    <paper-input id=\"passinput\" value=\"{{password}}\" disabled=\"[[loading]]\" type=\"password\"\n      label=\"[[passwordInputLabel]]\" required error-message=\"[[passwordInputErrMsg]]\"></paper-input>\n    <paper-button on-click=\"_login\" disabled=\"[[loading]]\" id=\"loginbtn\" raised class=\"indigo\">[[loginBtnText]]\n    </paper-button>\n    <span id=\"buttons\"><slot name=\"buttons\"></slot></span>\n  </div>\n</div>"]);_templateObject_10d5dbd0ab1311e9a90b29cb31082c9b=function _templateObject_10d5dbd0ab1311e9a90b29cb31082c9b(){return data};return data}/**
 * `simple-login`
 * `a simple login form`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */var SimpleLogin=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(SimpleLogin,_PolymerElement);babelHelpers.createClass(SimpleLogin,null,[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_10d5dbd0ab1311e9a90b29cb31082c9b())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){var props={/**
   * Title of the loginscreen
   */title:String,/**
   * Subtitle of the loginscreen
   */subtitle:String,/**
   * Error message to show (example : "Invalid username")
   */errorMsg:String,/**
   * Content of the username field
   */username:{type:String,notify:!0},/**
   * Content of the password field
   */password:{type:String,notify:!0},/**
   * When true, all fields are disabled and the progress bar is visible
   */loading:{type:Boolean,value:!1},/**
   * Placeholder of the username field
   */userInputLabel:{type:String,value:"Username"},/**
   * Error message of the username field
   */userInputErrMsg:{type:String,value:"Username required"},/**
   * Placeholder of the password field
   */passwordInputLabel:{type:String,value:"Password"},/**
   * Error message of the password field
   */passwordInputErrMsg:{type:String,value:"Password required"},/**
   * Login button label
   */loginBtnText:{type:String,value:"Login"}};if(babelHelpers.get(babelHelpers.getPrototypeOf(SimpleLogin),"properties",this)){props=Object.assign(props,babelHelpers.get(babelHelpers.getPrototypeOf(SimpleLogin),"properties",this))}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"simple-login"}/**
   * constructor
   */}]);function SimpleLogin(){var _this;babelHelpers.classCallCheck(this,SimpleLogin);_this=babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(SimpleLogin).call(this));(0,_renderStatus.afterNextRender)(babelHelpers.assertThisInitialized(_this),function(){this.shadowRoot.querySelector("#loginform").addEventListener("keypress",this._keyPressLogin.bind(this))});return _this}/**
   * life cycle
   */babelHelpers.createClass(SimpleLogin,[{key:"disconnectedCallback",value:function disconnectedCallback(){this.shadowRoot.querySelector("#loginform").removeEventListener("keypress",this._keyPressLogin.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(SimpleLogin.prototype),"disconnectedCallback",this).call(this)}/**
   * Key pressed for the login
   */},{key:"_keyPressLogin",value:function _keyPressLogin(e){if(13==e.keyCode){//Enter
this._login();return!1}}/**
   * Login
   */},{key:"_login",value:function _login(){if(this.shadowRoot.querySelector("#userinput").validate()&&this.shadowRoot.querySelector("#passinput").validate()){this.dispatchEvent(new CustomEvent("simple-login-login",{cancelable:!0,bubbles:!0,composed:!0,detail:{u:this.shadowRoot.querySelector("#userinput").value,p:this.shadowRoot.querySelector("#passinput").value}}))}}}]);return SimpleLogin}(_polymerElement.PolymerElement);_exports.SimpleLogin=SimpleLogin;window.customElements.define(SimpleLogin.tag,SimpleLogin)});