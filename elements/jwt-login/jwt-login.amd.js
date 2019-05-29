define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/iron-ajax/iron-ajax.js"],function(_exports,_polymerElement,_ironAjax){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.JwtLogin=void 0;function _templateObject_de34637081c011e9893bffb227c7d2f0(){var data=babelHelpers.taggedTemplateLiteral(["\n      <style>\n        :host {\n          visibility: hidden;\n        }\n      </style>\n      <iron-ajax\n        id=\"loginrequest\"\n        method=\"[[method]]\"\n        body=\"[[body]]\"\n        url=\"[[url]]\"\n        handle-as=\"json\"\n        content-type=\"application/json\"\n        on-response=\"loginResponse\"\n      >\n      </iron-ajax>\n    "]);_templateObject_de34637081c011e9893bffb227c7d2f0=function _templateObject_de34637081c011e9893bffb227c7d2f0(){return data};return data}/**
 * `jwt-login`
 * `a simple element to check for and fetch JWTs`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */var JwtLogin=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(JwtLogin,_PolymerElement);function JwtLogin(){babelHelpers.classCallCheck(this,JwtLogin);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(JwtLogin).apply(this,arguments))}babelHelpers.createClass(JwtLogin,[{key:"_jwtChanged",value:function _jwtChanged(newValue,oldValue){if((null==newValue||""==newValue)&&babelHelpers.typeof(oldValue)!==("undefined"===typeof void 0?"undefined":babelHelpers.typeof(void 0))){// remove this key from local storage bin
localStorage.removeItem(this.key);// jwt was invalid some how
this.dispatchEvent(new CustomEvent("jwt-logged-in",{bubbles:!0,cancelable:!0,composed:!0,detail:!1}))}else if(newValue){// set the jwt into local storage so we can reference later
localStorage.setItem(this.key,newValue);this.dispatchEvent(new CustomEvent("jwt-token",{bubbles:!0,cancelable:!0,composed:!0,detail:newValue}));this.dispatchEvent(new CustomEvent("jwt-logged-in",{bubbles:!0,cancelable:!0,composed:!0,detail:!0}))}}/**
   * Ready life cycle
   */},{key:"ready",value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(JwtLogin.prototype),"ready",this).call(this);// set jwt from local storage bin
this.jwt=localStorage.getItem(this.key)}/**
   * Request a user login if we need one or log out
   */},{key:"toggleLogin",value:function toggleLogin(){// null is default, if we don't have anything go get one
if(null==this.jwt){this.$.loginrequest.generateRequest()}else{// we were told to logout, reset body
this.set("body",{});// reset jwt which will do all the events / local storage work
this.jwt=null}}/**
   * Login bridge to get a JWT and hang onto it
   */},{key:"loginResponse",value:function loginResponse(e){this.jwt=e.detail.response}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_de34637081c011e9893bffb227c7d2f0())}},{key:"tag",get:function get(){return"jwt-login"}},{key:"properties",get:function get(){return{/**
       * url
       */url:{type:String},/**
       * Request method
       */method:{type:String,value:"GET"},/**
       * Optional body, useful when doing posts
       */body:{type:Object,value:{}},/**
       * Key that contains the token in local storage
       */key:{type:String,value:"jwt"},/**
       * JSON Web token to securely pass around
       */jwt:{type:String,notify:!0,observer:"_jwtChanged"}}}}]);return JwtLogin}(_polymerElement.PolymerElement);_exports.JwtLogin=JwtLogin;window.customElements.define(JwtLogin.tag,JwtLogin)});