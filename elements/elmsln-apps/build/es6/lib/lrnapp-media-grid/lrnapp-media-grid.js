import {
  html,
  Polymer
} from "../../node_modules/@polymer/polymer/polymer-legacy.js";
import "../../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../../node_modules/@polymer/iron-scroll-threshold/iron-scroll-threshold.js";
import "../../node_modules/@polymer/iron-list/iron-list.js";
import "../../node_modules/@polymer/paper-button/paper-button.js";
import "../../node_modules/@polymer/iron-image/iron-image.js";
import "../../node_modules/@polymer/paper-dialog/paper-dialog.js";
import "../../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js";
import "../../node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        display: block;
      }
      paper-button {
        padding: 0;
        margin: 0;
        min-width: 1rem;
      }
      #details {
        opacity: 0.5;
        position: absolute;
        bottom: 0;
        right: 0;
        margin: 0 1rem 0 0;
        background-color: white;
        padding: 0.5em;
      }
      #details:hover {
        opacity: 1;
      }
      #details span {
        font-size: 0.6em;
        font-weight: normal;
      }
      #details .comment-on-work {
        font-size: 0.8em;
        background-color: white;
      }
    </style>
    <iron-ajax
      id="ajax"
      url="[[sourcePath]]"
      params=""
      handle-as="json"
      last-response="{{images}}"
    ></iron-ajax>
    <iron-scroll-threshold on-lower-threshold="_loadMoreData" id="threshold">
      <iron-list grid items="[[_toArray(images.data)]]" as="image">
        <template>
          <paper-button>
            <iron-image
              preload=""
              title="{{image.filename}}"
              alt="{{image.alt}}"
              src="{{image.src}}"
              height="{{image.height}}"
              width="{{image.width}}"
            ></iron-image>
          </paper-button>
        </template>
      </iron-list>
    </iron-scroll-threshold>
    <paper-dialog
      id="dialog"
      entry-animation="scale-up-animation"
      exit-animation="fade-out-animation"
    >
      <paper-dialog-scrollable id="dialogResponse">
        <iron-image src$="[[activeImage]]"></iron-image>
        <div id="details">
          <div class="title">
            <span>Title:</span> <span>[[activeTitle]]</span>
          </div>
          <div class="comment-on-work">
            <a href$="[[activeUrl]]">
              <paper-button raised="">View media</paper-button>
            </a>
          </div>
        </div>
      </paper-dialog-scrollable>
    </paper-dialog>
  `,
  is: "lrnapp-media-grid",
  listeners: { click: "_triggerDialog" },
  properties: {
    sourcePath: { type: String, notify: !0 },
    images: { type: Array, notify: !0 },
    activeImage: { type: String, reflectToAttribute: !0, notify: !0 },
    activeTitle: { type: String, reflectToAttribute: !0, notify: !0 },
    activeUrl: { type: String, reflectToAttribute: !0, notify: !0 }
  },
  _triggerDialog: function(e) {
    if ("IMG" == e.target.nextElementSibling.nodeName) {
      this.activeImage = e.target.nextElementSibling.src;
      this.activeTitle = e.target.parentElement.title;
      this.activeUrl = e.target.parentElement.openUrl;
      this.shadowRoot.querySelector("#dialog").toggle();
    }
  },
  _loadMoreData: function(e) {
    this.shadowRoot.querySelector("#ajax").generateRequest();
    this.shadowRoot.querySelector("#threshold").clearTriggers();
  },
  _toArray: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  }
});
