import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
Polymer({
  _template: html`
    <style is="custom-style">
      :host {
        display: block;
        width: 100%;
        position: relative;
        overflow: hidden;
      }
      .background-closer-image {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-indent: -9999px;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        opacity: .4;
        transition: all .6s linear;
      }
      .background-closer-image-wrap {
        position: absolute;
        background-color: rgba(0, 0, 0, .9);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        text-indent: -9999px;
        transition: all .6s linear;
        opacity: 1;
      }
      :host[active] .background-closer-image {
        opacity: .8;
      }
      :host[active] .background-closer-image-wrap {
        background-color: rgba(0, 0, 0, .2);
      }
      .inner {
        width: 100%;
        position: relative;
        z-index: 99;
        max-width: 640px;
        padding: 120px 0 90px;
        text-align: center;
        margin: 0 auto;
      }
      .blog-title {
        margin: 0;
        padding: 0 0 10px;
        font-size: 50px;
        text-align: center;
        font-weight: 700;
        letter-spacing: -2px;
        outline: 0;
        line-height: 50px;
        word-break: break-word;
        color: white;
        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);
      }
      .blog-description {
        margin: 0 0 50px;
        padding: 0 32px;
        font-size: 18px;
        line-height: 1.5;
        color: white;
        text-align: center;
        font-weight: 400;
        text-shadow: 0 1px 16px rgba(0,0,0,.5), 0 0 1px rgba(0,0,0,.5);
      }
      .back {
        display: inline-block;
        text-align: center;
        letter-spacing: -.02em;
        font-size: 15px;
        font-weight: 400;
        font-style: normal;
        text-decoration: none;
        cursor: pointer;
        height: 44px;
        background: #57ad68;
        color: white;
        vertical-align: middle;
        box-sizing: border-box;
        border-radius: 999em;
        line-height: 44px;
        padding: 0 18px;
      }
    </style>
    <div class="background-closer-image-wrap">
      <div class="background-closer-image" style\$="background-image: url([[manifest.metadata.image]])">
      </div>
    </div>
    <div class="inner">
      <h1 class="blog-title">[[manifest.title]]</h1>
      <h2 class="blog-description">[[manifest.description]]</h2>
      <paper-button id="backbutton" class="back" raised="[[active]]">Back to main site</paper-button>
    </div>
`,
  is: "simple-blog-footer",
  listeners: {
    "backbutton.tap": "_backButtonTap",
    mousedown: "_activate",
    mouseover: "_activate",
    mouseout: "_deactivate",
    focusin: "_activate",
    focusout: "_deactivate"
  },
  properties: {
    manifest: { type: Object },
    active: { type: Boolean, value: !1, reflectToAttribute: !0 }
  },
  _backButtonTap: function() {
    this.fire("active-item-reset", null);
  },
  _activate: function() {
    this.active = !0;
  },
  _deactivate: function() {
    this.active = !1;
  }
});
