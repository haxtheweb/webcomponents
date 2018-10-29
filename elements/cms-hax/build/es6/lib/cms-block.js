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
$_documentContainer.innerHTML = `<dom-module id="cms-block">
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
      :host[loading] {
        text-align: center;
      }
      :host[loading] paper-spinner {
        visibility: visible;
        opacity: 1;
      }
      :host[loading] #replacementcontent {
        opacity: 0;
        visibility: hidden;
      }
    </style>
    <iron-ajax id="blockrequest" method="GET" params="[[bodyData]]" url="[[blockEndPoint]]" handle-as="json" last-response="{{blockData}}"></iron-ajax>
    <paper-spinner active="[[loading]]"></paper-spinner>
    <span id="replacementcontent"><slot></slot></span>
  </template>

  
</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "cms-block",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    loading: { type: Boolean, reflectToAttribute: !0, value: !1 },
    blockModule: { type: String, reflectToAttribute: !0 },
    blockDelta: { type: String, reflectToAttribute: !0 },
    blockEndPoint: { type: String },
    bodyData: {
      type: Object,
      computed: "_generateBodyData(blockModule, blockDelta)",
      observer: "_blockChanged"
    },
    blockData: { type: String, observer: "_handleblockResponse" },
    blockPrefix: { type: String, observer: "[" },
    blockSuffix: { type: String, observer: "]" }
  },
  _generateBodyData: function(blockModule, blockDelta) {
    if (
      null !== blockModule &&
      "" !== blockModule &&
      null !== blockDelta &&
      "" !== blockDelta
    ) {
      return { module: `${blockModule}`, delta: `${blockDelta}` };
    }
  },
  _handleblockResponse: function(newValue) {
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
  _blockChanged: function(newValue) {
    if (typeof newValue !== typeof void 0 && "" !== newValue && !this.loading) {
      if (
        typeof this.blockEndPoint === typeof void 0 &&
        typeof window.cmsblockEndPoint !== typeof void 0
      ) {
        this.blockEndPoint = window.cmsblockEndPoint;
      }
      if (this.blockEndPoint) {
        this.loading = !0;
        async.microTask.run(() => {
          this.$.blockrequest.generateRequest();
        });
      }
    }
  },
  attached: function() {
    if (
      typeof this.blockModule !== typeof void 0 &&
      null !== this.blockModule &&
      "" !== this.blockModule
    ) {
      let slot = dom(this).getEffectiveChildNodes();
      if (0 === slot.length && !this.loading) {
        if (
          typeof this.blockEndPoint === typeof void 0 &&
          typeof window.cmsblockEndPoint !== typeof void 0
        ) {
          this.blockEndPoint = window.cmsblockEndPoint;
        }
        if (this.blockEndPoint) {
          this.loading = !0;
          async.microTask.run(() => {
            this.$.blockrequest.generateRequest();
          });
        }
      }
    }
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "CMS Block",
        description: "CMS block rendered on the backend",
        icon: "image:crop-square",
        color: "light-blue",
        groups: ["CMS"],
        handles: [{ type: "cmsblock", block: "block" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "blockModule",
            title: "Module",
            description: "Module to load from our CMS",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "blockDelta",
            title: "Delta",
            description: "Delta of the block to load from our CMS",
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
          "block-data",
          "body-data",
          "block-end-point"
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
        slot: "Edit this block"
      }
    };
    return schema;
  }
});
