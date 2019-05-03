import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";/**
 * `jwt-login`
 * `a simple element to check for and fetch JWTs`
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - jwt - a json web token which is an encrypted security token to talk
 */class JwtLogin extends PolymerElement{static get template(){return html`
    <style>
      :host {
        visibility: hidden;
      }
    </style>
    <iron-ajax
      id="loginrequest"
      method="GET"
      url="[[url]]"
      handle-as="json"
      on-response="loginResponse"
    >
    </iron-ajax>`}static get tag(){return"jwt-login"}static get properties(){return{/**
       * url
       */url:{type:String},/**
       * Key that contains the token in local storage
       */key:{type:String,value:"jwt"},/**
       * JSON Web token to securely pass around
       */jwt:{type:String,notify:!0}}}/**
   * Ready life cycle
   */ready(){super.ready();// set jwt from local storage bin
this.jwt=localStorage.getItem(this.key);this.dispatchEvent(new CustomEvent("jwt-token",{bubbles:!0,cancelable:!0,composed:!0,detail:this.jwt}))}/**
   * Request a user login if we need one or log out
   */toggleLogin(){// null is default, if we don't have anything go get one
if(null==this.jwt){this.$.loginrequest.generateRequest()}else{localStorage.removeItem(this.key);this.jwt=null;this.dispatchEvent(new CustomEvent("jwt-logged-in",{bubbles:!0,cancelable:!0,composed:!0,detail:!1}))}}/**
   * Login bridge to get a JWT and hang onto it
   */loginResponse(e){this.jwt=e.detail.response;if(null==this.jwt||""==this.jwt){this.dispatchEvent(new CustomEvent("jwt-logged-in",{bubbles:!0,cancelable:!0,composed:!0,detail:!1}))}else{// set the jwt into local storage so we can reference later
localStorage.setItem(this.key,this.jwt);this.dispatchEvent(new CustomEvent("jwt-token",{bubbles:!0,cancelable:!0,composed:!0,detail:this.jwt}));this.dispatchEvent(new CustomEvent("jwt-logged-in",{bubbles:!0,cancelable:!0,composed:!0,detail:!0}))}}}window.customElements.define(JwtLogin.tag,JwtLogin);export{JwtLogin};