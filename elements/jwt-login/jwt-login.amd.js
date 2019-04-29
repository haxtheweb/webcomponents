define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@polymer/iron-ajax/iron-ajax.js"],function(_exports,_polymerLegacy,_ironAjax){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.JwtLogin=void 0;function _templateObject_d3da1b906a8211e9a52e33478c724647(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        visibility: hidden;\n      }\n    </style>\n    <iron-ajax\n      id=\"loginrequest\"\n      method=\"GET\"\n      url=\"[[url]]\"\n      handle-as=\"json\"\n      on-response=\"loginResponse\"\n    >\n    </iron-ajax>\n  "]);_templateObject_d3da1b906a8211e9a52e33478c724647=function _templateObject_d3da1b906a8211e9a52e33478c724647(){return data};return data}/**
`jwt-login`
a simple element to check for and fetch JWTs

* @demo demo/index.html

@microcopy - the mental model for this element
- jwt - a json web token which is an encrypted security token to talk

*/var JwtLogin=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_d3da1b906a8211e9a52e33478c724647()),is:"jwt-login",properties:{/**
     * url
     */url:{type:String},/**
     * Key that contains the token in local storage
     */key:{type:String,value:"jwt"},/**
     * JSON Web token to securely pass around
     */jwt:{type:String,notify:!0}},/**
   * Ready life cycle
   */ready:function ready(){// set jwt from local storage bin
this.jwt=localStorage.getItem(this.key);this.fire("jwt-token",this.jwt)},/**
   * Request a user login if we need one or log out
   */toggleLogin:function toggleLogin(){// null is default, if we don't have anything go get one
if(null==this.jwt){this.$.loginrequest.generateRequest()}else{localStorage.removeItem(this.key);this.jwt=null;this.fire("jwt-logged-in",!1)}},/**
   * Login bridge to get a JWT and hang onto it
   */loginResponse:function loginResponse(e){this.jwt=e.detail.response;if(null==this.jwt||""==this.jwt){this.fire("jwt-logged-in",!1)}else{// set the jwt into local storage so we can reference later
localStorage.setItem(this.key,this.jwt);this.fire("jwt-token",this.jwt);this.fire("jwt-logged-in",!0)}}});_exports.JwtLogin=JwtLogin});