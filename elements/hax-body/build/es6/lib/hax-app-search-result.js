import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-image/iron-image.js";
import "../node_modules/@polymer/paper-button/paper-button.js";
import "../node_modules/@polymer/paper-styles/paper-styles.js";
import "../node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-flex;
        width: 50%;
        background-color: transparent;
        color: #ffffff;
      }
      paper-button.button {
        margin: 0;
        padding: 7px;
        height: 168px;
        border-radius: 0;
        width: 100%;
        border: 2px solid #CCCCCC;
        justify-content: flex-start;
        background-color: transparent;
        background-image: none;
        color: #ffffff;
        text-align: unset;
        display: flex;
      }
      paper-button:hover,
      paper-button:focus,
      paper-button:active {
        border: 2px solid var(--simple-colors-light-green-background1);
        background-color:rgba(0, 0, 0, .7);
      }
      .detail-wrapper {
        padding: 0 8px;
        display: inline-block;
        height: 100%;
        width: calc(80% - 16px);
        overflow: hidden;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
      }
      .title {
        font-size: 16px;
        font-weight: bold;
        text-transform: none;
        padding-bottom: 4px;
      }
      .details {
        height: 100px;
        overflow: hidden;
        font-size: 12px;
        line-height: 16px;
        padding: 0;
        margin: 0;
        text-transform: none;
      }
      .image {
        display: inline-flex;
        height: 152px;
        width: 20%;
        background-color: lightgray;
      }
      @media screen and (max-width: 1000px) {
        :host {
          width: 100%;
        }
        .title {
          font-size: 12px;
        }
        .image {
          min-width: 160px;
          width: 160px;
        }
        .details {
          font-size: 10px;
        }
      }
      @media screen and (max-width: 600px) {
        .details {
          font-size: 8px;
        }
      }
    </style>

    <paper-button on-tap="_itemSelected" class="button">
      <iron-image alt="" class="image" src="[[resultData.image]]" preload="" fade="" sizing="cover"></iron-image>
      <div class="detail-wrapper">
        <div class="title">[[resultData.title]]</div>
        <div class="details">[[resultData.details]]</div>
      </div>
    </paper-button>
`,
  is: "hax-app-search-result",
  behaviors: [simpleColorsBehaviors],
  properties: { resultData: { type: Object } },
  _itemSelected: function() {
    var map = this.resultData.map,
      gizmoType = this.resultData.type;
    if (
      (null === gizmoType || "" === gizmoType) &&
      typeof map.source !== typeof void 0
    ) {
      gizmoType = window.HaxStore.guessGizmoType(map.source);
    }
    let haxElements = window.HaxStore.guessGizmo(gizmoType, map);
    if (0 < haxElements.length) {
      if (1 === haxElements.length) {
        if (typeof haxElements[0].tag !== typeof void 0) {
          window.HaxStore.write("activeHaxElement", haxElements[0], this);
        }
      } else {
        window.HaxStore.instance.haxAppPicker.presentOptions(
          haxElements,
          gizmoType,
          "How would you like to display this " + gizmoType + "?",
          "gizmo"
        );
      }
    } else {
      window.HaxStore.toast("Sorry, I don't know how to handle that link yet.");
    }
  }
});
