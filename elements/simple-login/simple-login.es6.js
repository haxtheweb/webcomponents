/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/paper-input/paper-input.js";import"./node_modules/@polymer/paper-progress/paper-progress.js";import"./node_modules/@polymer/paper-styles/shadow.js";import"./node_modules/@polymer/paper-styles/typography.js";import"./node_modules/@polymer/paper-styles/color.js";/**
 * `simple-login`
 * `a simple login form`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class SimpleLogin extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}

#loginform {
    width: var(--login-form-width, 450px);
    height: var(--login-form-height, auto);
    --simple-camera-snap-color: var(--login-form-color, #36bed4);
    --simple-camera-snap-error: var(--login-form-error, red);
    --simple-camera-snap-width: var(--login-form-image-width, 200px);
    --simple-camera-snap-height: var(--login-form-image-height, 200px);
    --simple-camera-snap-background: var(--login-form-background, white);
    --simple-camera-snap-border-radius: var(--login-form-image-bnorder-radius,100%);
    @apply --shadow-elevation-12dp;
    @apply --login-form;
}

#loginformcontent {
    padding: var(--login-form-padding, 48px);
}

#loginformcontent>* {
    margin-top: var(--login-form-margin-top, var(--login-form-margin, 8px));
    margin-bottom: var(--login-form-margin-bottom, var(--login-form-margin, 8px));
}

#loginbtn,
#buttons ::slotted(paper-button) {
    margin-top: 24px;
    background-color: var(--login-btn-background-color, var(--login-form-color, var(--paper-indigo-500)));
    color: var(--login-btn-text-color, var(--login-form-background, white));
    --paper-button-raised-keyboard-focus: {
        background-color: var(--login-btn-raised-background-color, var(--paper-pink-a200)) !important;
        color: var(--login-btn-text-color, var(--login-form-background, white)) !important;
    };
    @apply --login-btn;
}

#loginbtn[disabled] {
    background-color: var(--login-btn-disabled-background-color, var(--paper-indigo-100));
}

h1 {
    @apply --paper-font-display1;
    margin: 0;
    @apply --login-title;
}

h2 {
    @apply --paper-font-title;
    margin: 0;
    @apply --login-subtitle;
}

paper-progress {
    width: 100%;
}

::slotted(simple-login-avatar) {
  margin: 0 auto;
}

#errormsg {
    margin-top: 16px;
    color: var(--login-error-label-color, var(--error-color));
    @apply --paper-font-menu;
}</style>
<div id="loginform">
  <paper-progress disabled="[[!loading]]" indeterminate></paper-progress>
  <div id="loginformcontent">
    <h1>[[title]]</h1>
    <h2>[[subtitle]]</h2>
    <div id="errormsg">[[errorMsg]]</div>
    <slot></slot>
    <paper-input id="userinput" value="{{username}}" disabled="[[loading]]" type="text" label="[[userInputLabel]]"
      required error-message="[[userInputErrMsg]]"></paper-input>
    <paper-input id="passinput" value="{{password}}" disabled="[[loading]]" type="password"
      label="[[passwordInputLabel]]" required error-message="[[passwordInputErrMsg]]"></paper-input>
    <paper-button on-click="_login" disabled="[[loading]]" id="loginbtn" raised class="indigo">[[loginBtnText]]
    </paper-button>
    <span id="buttons"><slot name="buttons"></slot></span>
  </div>
</div>`}// properties available to the custom element for data binding
static get properties(){let props={/**
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
   */loginBtnText:{type:String,value:"Login"}};if(super.properties){props=Object.assign(props,super.properties)}return props}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"simple-login"}/**
   * constructor
   */constructor(){super();afterNextRender(this,function(){this.shadowRoot.querySelector("#loginform").addEventListener("keypress",this._keyPressLogin.bind(this))})}/**
   * life cycle
   */disconnectedCallback(){this.shadowRoot.querySelector("#loginform").removeEventListener("keypress",this._keyPressLogin.bind(this));super.disconnectedCallback()}/**
   * Key pressed for the login
   */_keyPressLogin(e){if(13==e.keyCode){//Enter
this._login();return!1}}/**
   * Login
   */_login(){if(this.shadowRoot.querySelector("#userinput").validate()&&this.shadowRoot.querySelector("#passinput").validate()){this.dispatchEvent(new CustomEvent("simple-login-login",{cancelable:!0,bubbles:!0,composed:!0,detail:{u:this.shadowRoot.querySelector("#userinput").value,p:this.shadowRoot.querySelector("#passinput").value}}))}}}window.customElements.define(SimpleLogin.tag,SimpleLogin);export{SimpleLogin};