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
$_documentContainer.innerHTML = `<dom-module id="cms-entity">
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
    <iron-ajax id="entityrequest" method="GET" params="[[bodyData]]" url="[[entityEndPoint]]" handle-as="json" last-response="{{entityData}}"></iron-ajax>
    <paper-spinner active="[[loading]]"></paper-spinner>
    <span id="replacementcontent"><slot></slot></span>
  </template>

  
</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "cms-entity",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    loading: { type: Boolean, reflectToAttribute: !0, value: !1 },
    entityType: { type: String, reflectToAttribute: !0 },
    entityId: { type: String, reflectToAttribute: !0 },
    entityDisplayMode: { type: String, reflectToAttribute: !0 },
    entityEndPoint: { type: String },
    bodyData: {
      type: Object,
      computed: "_generateBodyData(entityType, entityId, entityDisplayMode)",
      observer: "_entityChanged"
    },
    entityData: { type: String, observer: "_handleEntityResponse" },
    entityPrefix: { type: String, observer: "[" },
    entitySuffix: { type: String, observer: "]" }
  },
  _generateBodyData: function(entityType, entityId, entityDisplayMode) {
    if (
      null !== entityType &&
      "" !== entityType &&
      null !== entityId &&
      "" !== entityId
    ) {
      return {
        type: `${entityType}`,
        id: `${entityId}`,
        display_mode: `${entityDisplayMode}`
      };
    }
  },
  _handleEntityResponse: function(newValue, oldValue) {
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
  _entityChanged: function(newValue, oldValue) {
    if (typeof newValue !== typeof void 0 && "" !== newValue && !this.loading) {
      if (
        typeof this.entityEndPoint === typeof void 0 &&
        typeof window.cmsentityEndPoint !== typeof void 0
      ) {
        this.entityEndPoint = window.cmsentityEndPoint;
      }
      if (this.entityEndPoint) {
        this.loading = !0;
        async.microTask.run(() => {
          this.$.entityrequest.generateRequest();
        });
      }
    }
  },
  attached: function() {
    if (
      typeof this.entity !== typeof void 0 &&
      null !== this.entity &&
      "" !== this.entity
    ) {
      let slot = dom(this).getEffectiveChildNodes();
      if (0 === slot.length && !this.loading) {
        if (
          typeof this.entityEndPoint === typeof void 0 &&
          typeof window.cmsentityEndPoint !== typeof void 0
        ) {
          this.entityEndPoint = window.cmsentityEndPoint;
        }
        if (this.entityEndPoint) {
          this.loading = !0;
          async.microTask.run(() => {
            this.$.entityrequest.generateRequest();
          });
        }
      }
    }
    let props = {
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "CMS Entity",
        description: "CMS entity rendered on the backend",
        icon: "places:spa",
        color: "light-blue",
        groups: ["CMS"],
        handles: [{ type: "cmsentity", entity: "entity" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "entityType",
            title: "Type",
            description: "type from our CMS",
            inputMethod: "select",
            options: { node: "Node", user: "User", file: "File" },
            icon: "editor:title"
          },
          {
            property: "entityID",
            title: "ID",
            description: "id from our CMS",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "entityDisplayMode",
            title: "Display mode",
            description: "display mode from our CMS",
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
          "entity-data",
          "body-data",
          "entity-end-point"
        ]
      }
    };
    this.setHaxProperties(props);
  },
  postProcessgetHaxJSONSchema: function(schema) {
    schema.properties.__editThis = {
      type: "string",
      component: {
        name: "a",
        properties: { id: "cmstokenidtolockonto", href: "", target: "_blank" },
        slot: "Edit this content"
      }
    };
    return schema;
  }
});
