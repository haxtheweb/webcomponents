import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "../node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "../node_modules/@polymer/polymer/lib/utils/async.js";
import "../node_modules/@polymer/iron-ajax/iron-ajax.js";
import "../node_modules/@polymer/paper-spinner/paper-spinner.js";
import "../node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="cms-views">
  <template strip-whitespace="">
    <style>
      :host {
        display: block;
        min-width: 112px;
        min-height: 112px;
        transition: .6s all ease;
        background-color: transparent;
      }
      paper-spinner {
        visibility: hidden;
        opacity: 0;
        height: 80px;
        width: 80px;
        padding: 16px;
      }
      #replacementcontent {
        visibility: visible;
        opacity: 1;
      }
      :host([loading]) {
        text-align: center;
      }
      :host([loading]) paper-spinner {
        visibility: visible;
        opacity: 1;
      }
      :host([loading]) #replacementcontent {
        opacity: 0;
        visibility: hidden;
      }
    </style>
    <iron-ajax id="viewsrequest" method="GET" params="[[bodyData]]" url="[[viewsEndPoint]]" handle-as="json" last-response="{{viewsData}}"></iron-ajax>
    <paper-spinner active="[[loading]]"></paper-spinner>
    <span id="replacementcontent"><slot></slot></span>
  </template>

  
</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "cms-views",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    loading: { type: Boolean, reflectToAttribute: !0, value: !1 },
    viewsName: { type: String, reflectToAttribute: !0 },
    viewsDisplay: { type: String, reflectToAttribute: !0 },
    viewsEndPoint: { type: String },
    bodyData: {
      type: Object,
      computed: "_generateBodyData(viewsName, viewsDisplay)",
      observer: "_viewsChanged"
    },
    viewsData: { type: String, observer: "_handleviewsResponse" },
    viewsPrefix: { type: String, observer: "[" },
    viewsSuffix: { type: String, observer: "]" }
  },
  _generateBodyData: function(name, display) {
    if (null !== name && "" !== name) {
      return { name: `${name}`, display: `${display}` };
    }
  },
  _handleviewsResponse: function(newValue) {
    if (null !== newValue && typeof newValue.content !== typeof void 0) {
      if (null != document.getElementById("cmstokenidtolockonto")) {
        document
          .getElementById("cmstokenidtolockonto")
          .setAttribute("href", newValue.editEndpoint);
        document.getElementById("cmstokenidtolockonto").innerHTML =
          newValue.editText;
      }
      this.wipeSlot(dom(this));
      async.microTask.run(() => {
        let frag = document.createElement("span");
        frag.innerHTML = newValue.content;
        let newNode = frag.cloneNode(!0);
        dom(this).appendChild(newNode);
        setTimeout(() => {
          this.loading = !1;
        }, 600);
      });
    }
  },
  wipeSlot: function(element) {
    while (null !== element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },
  _viewsChanged: function(newValue) {
    if (typeof newValue !== typeof void 0 && "" !== newValue && !this.loading) {
      if (
        typeof this.viewsEndPoint === typeof void 0 &&
        typeof window.cmsviewsEndPoint !== typeof void 0
      ) {
        this.viewsEndPoint = window.cmsviewsEndPoint;
      }
      if (this.viewsEndPoint) {
        this.loading = !0;
        async.microTask.run(() => {
          this.$.viewsrequest.generateRequest();
        });
      }
    }
  },
  attached: function() {
    if (
      typeof this.viewsName !== typeof void 0 &&
      null !== this.viewsName &&
      "" !== this.viewsName
    ) {
      let slot = dom(this).getEffectiveChildNodes();
      if (0 === slot.length && !this.loading) {
        if (
          typeof this.viewsEndPoint === typeof void 0 &&
          typeof window.cmsviewsEndPoint !== typeof void 0
        ) {
          this.viewsEndPoint = window.cmsviewsEndPoint;
        }
        if (this.viewsEndPoint) {
          this.loading = !0;
          async.microTask.run(() => {
            this.$.viewsrequest.generateRequest();
          });
        }
      }
    }
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "CMS View",
        description: "CMS views rendered on the backend",
        icon: "icons:view-module",
        color: "light-blue",
        groups: ["CMS"],
        handles: [{ type: "cmsviews", views: "views" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "viewsName",
            title: "Name",
            description: "Name of the view from our CMS",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "viewsDisplay",
            title: "Display",
            description: "Display within that view from our CMS",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      },
      saveOptions: {
        wipeSlot: !0,
        unsetAttributes: [
          "loading",
          "views-data",
          "body-data",
          "views-end-point"
        ]
      }
    });
  },
  postProcessgetHaxJSONSchema: function(schema) {
    schema.properties.__editThis = {
      type: "string",
      component: {
        name: "a",
        properties: { id: "cmstokenidtolockonto", href: "", target: "_blank" },
        slot: "Edit this view"
      }
    };
    return schema;
  }
});
