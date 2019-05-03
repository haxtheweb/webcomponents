define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./node_modules/@polymer/iron-ajax/iron-ajax.js"],function(_exports,_polymerElement,_ironAjax){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.JwtLogin=void 0;function _templateObject_010cd5506d6a11e98e479150df0db4ca(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        visibility: hidden;\n      }\n    </style>\n    <iron-ajax\n      id=\"loginrequest\"\n      method=\"GET\"\n      url=\"[[url]]\"\n      handle-as=\"json\"\n      on-response=\"loginResponse\"\n    >\n    </iron-ajax>"]);_templateObject_010cd5506d6a11e98e479150df0db4ca=function _templateObject_010cd5506d6a11e98e479150df0db4ca(){return data};return data}/**
 * `jwt-login`
 * `a simple element to check for and fetch JWTs`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */var JwtLogin=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(JwtLogin,_PolymerElement);function JwtLogin(){babelHelpers.classCallCheck(this,JwtLogin);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(JwtLogin).apply(this,arguments))}babelHelpers.createClass(JwtLogin,[{key:"ready",/**
   * Ready life cycle
   */value:function ready(){babelHelpers.get(babelHelpers.getPrototypeOf(JwtLogin.prototype),"ready",this).call(this);// set jwt from local storage bin
this.jwt=localStorage.getItem(this.key);this.dispatchEvent(new CustomEvent("jwt-token",{bubbles:!0,cancelable:!0,composed:!0,detail:this.jwt}))}/**
   * Request a user login if we need one or log out
   */},{key:"toggleLogin",value:function toggleLogin(){// null is default, if we don't have anything go get one
if(null==this.jwt){this.$.loginrequest.generateRequest()}else{localStorage.removeItem(this.key);this.jwt=null;this.dispatchEvent(new CustomEvent("jwt-logged-in",{bubbles:!0,cancelable:!0,composed:!0,detail:!1}))}}/**
   * Login bridge to get a JWT and hang onto it
   */},{key:"loginResponse",value:function loginResponse(e){this.jwt=e.detail.response;if(null==this.jwt||""==this.jwt){this.dispatchEvent(new CustomEvent("jwt-logged-in",{bubbles:!0,cancelable:!0,composed:!0,detail:!1}))}else{// set the jwt into local storage so we can reference later
localStorage.setItem(this.key,this.jwt);this.dispatchEvent(new CustomEvent("jwt-token",{bubbles:!0,cancelable:!0,composed:!0,detail:this.jwt}));this.dispatchEvent(new CustomEvent("jwt-logged-in",{bubbles:!0,cancelable:!0,composed:!0,detail:!0}))}}}],[{key:"template",get:function get(){return(0,_polymerElement.html)(_templateObject_010cd5506d6a11e98e479150df0db4ca())}},{key:"tag",get:function get(){return"jwt-login"}},{key:"properties",get:function get(){return{/**
       * url
       */url:{type:String},/**
       * Key that contains the token in local storage
       */key:{type:String,value:"jwt"},/**
       * JSON Web token to securely pass around
       */jwt:{type:String,notify:!0}}}}]);return JwtLogin}(_polymerElement.PolymerElement);_exports.JwtLogin=JwtLogin;window.customElements.define(JwtLogin.tag,JwtLogin)});