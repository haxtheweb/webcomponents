import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@polymer/iron-image/iron-image.js";
import "./node_modules/@polymer/paper-tooltip/paper-tooltip.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";
import "@lrnwebcomponents/lrnsys-layout/lrnsys-dialog.js";
import "./node_modules/@lrnwebcomponents/freezeframe/src/js/vendor/imagesloaded.pkgd.js";
import "./node_modules/@lrnwebcomponents/freezeframe/build/js/freezeframe.js";
Polymer({
  _template: html`
  <custom-style>
    <style>
      :host {
        display: block;
        --parallax-background-height: 300px;
        --parallax-background-image: url('');
      }

      .parallax-background {
        background: var(--parallax-background-image);
        background-attachment: fixed;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        height: var(--parallax-background-height);
        position:relative;
      }
      .hide-alt {
        position: absolute !important;
        clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
        clip: rect(1px, 1px, 1px, 1px);
        overflow: hidden;
        height: 1px;
      }
      .contain {
        min-width: 10em;
        min-height: 10em;
        width: 100%;
        margin: 1em;
        height: 100%;
      }
      .center {
        margin: auto;
        width: 80%;
        padding: 1em;
      }
      .ff-container {
        display: inline-block;
        position: relative;
        background: rgba(0, 0, 0, 0.5) url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHdpZHRoPSc1MHB4JyBoZWlnaHQ9JzUwcHgnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIiBjbGFzcz0idWlsLXNwaW4iPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg1MCA1MCkiPjxnIHRyYW5zZm9ybT0icm90YXRlKDApIHRyYW5zbGF0ZSgzNCAwKSI+PGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGZyb209IjEiIHRvPSIwLjEiIGJlZ2luPSIwcyIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIiBmcm9tPSIxLjUiIHRvPSIxIiBiZWdpbj0iMHMiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9jaXJjbGU+PC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDQ1KSB0cmFuc2xhdGUoMzQgMCkiPjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI4IiBmaWxsPSIjZmZmZmZmIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBmcm9tPSIxIiB0bz0iMC4xIiBiZWdpbj0iMC4xMnMiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgZnJvbT0iMS41IiB0bz0iMSIgYmVnaW49IjAuMTJzIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPjwvY2lyY2xlPjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSg5MCkgdHJhbnNsYXRlKDM0IDApIj48Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iOCIgZmlsbD0iI2ZmZmZmZiI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgZnJvbT0iMSIgdG89IjAuMSIgYmVnaW49IjAuMjVzIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGZyb209IjEuNSIgdG89IjEiIGJlZ2luPSIwLjI1cyIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L2NpcmNsZT48L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMTM1KSB0cmFuc2xhdGUoMzQgMCkiPjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI4IiBmaWxsPSIjZmZmZmZmIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBmcm9tPSIxIiB0bz0iMC4xIiBiZWdpbj0iMC4zN3MiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgZnJvbT0iMS41IiB0bz0iMSIgYmVnaW49IjAuMzdzIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPjwvY2lyY2xlPjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgxODApIHRyYW5zbGF0ZSgzNCAwKSI+PGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGZyb209IjEiIHRvPSIwLjEiIGJlZ2luPSIwLjVzIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGZyb209IjEuNSIgdG89IjEiIGJlZ2luPSIwLjVzIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPjwvY2lyY2xlPjwvZz48ZyB0cmFuc2Zvcm09InJvdGF0ZSgyMjUpIHRyYW5zbGF0ZSgzNCAwKSI+PGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjgiIGZpbGw9IiNmZmZmZmYiPjxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGZyb209IjEiIHRvPSIwLjEiIGJlZ2luPSIwLjYycyIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZT48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InNjYWxlIiBmcm9tPSIxLjUiIHRvPSIxIiBiZWdpbj0iMC42MnMiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9jaXJjbGU+PC9nPjxnIHRyYW5zZm9ybT0icm90YXRlKDI3MCkgdHJhbnNsYXRlKDM0IDApIj48Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iOCIgZmlsbD0iI2ZmZmZmZiI+PGFuaW1hdGUgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgZnJvbT0iMSIgdG89IjAuMSIgYmVnaW49IjAuNzVzIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0ic2NhbGUiIGZyb209IjEuNSIgdG89IjEiIGJlZ2luPSIwLjc1cyIgZHVyPSIxcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L2NpcmNsZT48L2c+PGcgdHJhbnNmb3JtPSJyb3RhdGUoMzE1KSB0cmFuc2xhdGUoMzQgMCkiPjxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSI4IiBmaWxsPSIjZmZmZmZmIj48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBmcm9tPSIxIiB0bz0iMC4xIiBiZWdpbj0iMC44N3MiIGR1cj0iMXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGU+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJzY2FsZSIgZnJvbT0iMS41IiB0bz0iMSIgYmVnaW49IjAuODdzIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSI+PC9hbmltYXRlVHJhbnNmb3JtPjwvY2lyY2xlPjwvZz48L2c+PC9zdmc+") center center no-repeat; }
    .ff-container .ff-image {
      z-index: 0;
      vertical-align: top;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0; }
      .ff-container .ff-image.ff-image-ready {
        opacity: 1; }
    .ff-container .ff-canvas {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 1;
      vertical-align: top;
      opacity: 0; }
      .ff-container .ff-canvas.ff-responsive {
        width: 100%; }
      .ff-container .ff-canvas.ff-canvas-ready {
        transition: opacity 300ms;
        opacity: 1; }
      .ff-container .ff-canvas.ff-canvas-active {
        transition: none;
        opacity: 0; }
    .ff-container.ff-responsive {
      width: 100%; }
      .ff-container.ff-responsive .ff-image {
        width: 100%; }
      .ff-container.ff-responsive .ff-canvas-ready {
        width: 100%; }
    </style>
  </custom-style>
    <template is="dom-if" if="{{matchDisplay('parallax', display)}}">
      <div class="parallax-background">
        <span class="hide-alt">[[alt]]</span>
      </div>
    </template>
    <template is="dom-if" if="{{matchDisplay('image', display)}}">
      <iron-image id="image" src\$="[[src]]" preload="" sizing="cover" width\$="[[width]]" height\$="[[height]]" alt\$="[[alt]]"></iron-image>
      <paper-tooltip for="image">
    [[alt]]
    </paper-tooltip>
    </template>
    <template is="dom-if" if="{{matchDisplay('lightbox', display)}}">
      <lrnsys-dialog alt\$="[[alt]]" header\$="[[title]]">
        <iron-image slot="button" src\$="[[src]]" preload="" sizing="contain" width\$="[[width]]" height\$="[[height]]" alt\$="[[alt]]"></iron-image>
        <iron-image slot="content" sizing="contain" class="contain" preload="" fade="" src\$="[[src]]"></iron-image>
      </lrnsys-dialog>
    </template>
    <template is="dom-if" if="{{matchDisplay('gif', display)}}">
      <iron-image id="image" slot="button" src\$="[[src]]" preload="" sizing="contain" width\$="[[width]]" height\$="[[height]]" alt\$="[[alt]]"></iron-image>
      <div class="container">
        <paper-button id="start" class="start blue"><iron-icon icon="av:play-arrow">Play</iron-icon></paper-button>
        <paper-button id="stop" class="stop red right"><iron-icon icon="av:stop">Play</iron-icon></paper-button>
      </div>
    </template>
`,
  is: "lrndesign-image",
  behaviors: [LRNBehaviors.DisplayBehaviors],
  properties: {
    src: { type: String, notify: !0, reflectToAttribute: !0 },
    alt: { type: String, notify: !0, reflectToAttribute: !0 },
    title: { type: String, notify: !0, reflectToAttribute: !0 },
    height: { type: String, notify: !0, reflectToAttribute: !0 },
    width: { type: String, notify: !0, reflectToAttribute: !0 }
  },
  ready: function() {
    let root = this;
    if ("parallax" == root.display) {
      Number.isNaN(parseInt(root.height)) ? "300" : parseInt(root.height);
      root.updateStyles({
        "--parallax-background-image": "url(" + root.src + ")",
        "--parallax-background-height": root.height + "px"
      });
    } else if ("gif" == root.display) {
      var animatedgif = new freezeframe("#image").freeze();
      root.shadowRoot
        .querySelector("#start")
        .$(".start")
        .click(function() {
          animatedgif.trigger();
        });
      $(".stop").click(function() {
        animatedgif.release();
      });
    }
  }
});
