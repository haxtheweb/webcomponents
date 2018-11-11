import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "../node_modules/@polymer/paper-card/paper-card.js";
import "../node_modules/@polymer/iron-image/iron-image.js";
import "../node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";
import "../node_modules/@polymer/iron-icon/iron-icon.js";
Polymer({
  _template: html`
    <style include="materializecss-styles"></style>
    <style>
       :host {
        display: inline-flex;
      }
      :host([size="micro"]) {
        transform: scale(.5);
      }
      :host([size="small"]) {
        transform: scale(.8);
      }

      paper-card {
        border-radius: 4px;
        margin: 0;
        width: 100%;
      }

      .card-actions {
        background-color: #f5f5f5;
        border-radius: 0 0 4px 4px;
        padding: 0 8px;
      }
      .card-actions .card-action-details{
        display: inline-block;
        vertical-align: middle;
        vertical-align: -webkit-baseline-middle;
        width: 80%;
      }
      #avatar {
        display: inline-block;
        vertical-align: text-top;
        transform: scale(.8);
      }

      .card-control-height {
        height: 240px;
      }

      [elevation="0"] {
        border: solid 1px #EEEEEE;
      }

      .text-right {
        text-align: right;
      }

      .text-left {
        text-align: left;
      }

      .name, .title {
        color: #222;
        font-size: 12.8px;
        font-weight: 600;
        line-height: 20px;
        padding: 0 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 8px;
      }

      .title {
        font-size: 11.2px;
        font-weight: 400;
      }

      .divider {
        height: 1px;
        width: 100%;
        background: #efefef;
      }

      .course-icon {
        --iron-icon-height: 100%;
        --iron-icon-width: 100%;
        overflow: hidden;
        color: grey;
      }
      .course-icon:hover,
      .course-icon:focus {
        color: black;
      }

      .center {
        margin: auto;
        width: 80%;
        padding: 16px;
      }

      .link {
        font-size: 16px;
        line-height: 16px;
      }

      .course-info {
        width: 100%;
      }
      .course-preview {
        height: 160px;
      }
      lrndesign-avatar {
        margin: -16px 8px 0 0;
        position: absolute;
        right: 0;
      }

      .card-content {
        padding: 0;
        margin: 0;
        overflow: hidden;
      }

      .inline {
        display: inline;
      }

    </style>
    <paper-card elevation="[[elevation]]">
      <div class="card-content card-control-height card-control-center">
        <div class="course-preview">
          <iron-icon class="course-icon" icon="[[icon]]" hidden\$="[[!icon]]"></iron-icon>
          <iron-image style="width:100%; height:100%; background-color: lightgray;" sizing="cover" preload="" fade="" src="[[image]]" hidden\$="[[!image]]"></iron-image>
        </div>
        <lrndesign-avatar label="[[name]]" jdenticon="" color="[[color]] darken-4">
        </lrndesign-avatar>
        <div class="course-info">
          <div class="divider"></div>
          <div class="name">[[name]]</div>
          <div class="title">[[title]]</div>
        </div>
      </div>
      <div class="card-actions" hidden="">
        <div class="card-action-details">
        </div>
      </div>
    </paper-card>
`,
  is: "lrnapp-cis-course-card",
  listeners: { mouseenter: "_mouseEnter", mouseleave: "_mouseLeave" },
  properties: {
    size: { type: String },
    image: { type: String },
    icon: { type: String, value: !1 },
    name: { type: String, value: "" },
    title: { type: String, value: "" },
    color: { type: String, value: "grey" },
    elevation: { type: Number, value: 1, reflectToAttribute: !0 }
  },
  _mouseEnter: function() {
    this.__oldElevation = this.elevation;
    if (5 < this.elevation + 2) {
      this.elevation = 5;
    } else {
      this.elevation += 2;
    }
  },
  _mouseLeave: function() {
    this.elevation = this.__oldElevation;
  }
});
