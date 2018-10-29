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
$_documentContainer.innerHTML = `<dom-module id="cms-token">
    <template strip-whitespace="">
        <style>
            :host {
                display: inline;
                min-width: 112px;
                min-height: 112px;
                transition: .6s all ease;
                background-color: transparent;
            }

            paper-spinner {
                transition: .6s all ease;
                position: absolute;
                visibility: hidden;
                display: none;
                opacity: 0;
                height: 0;
                width: 0;
            }

            #replacementcontent {
                transition: .6s all ease;
                visibility: visible;
                opacity: 1;
                height: auto;
                width: auto;
            }

            :host[loading] {
                text-align: center;
            }

            :host[loading] paper-spinner {
                visibility: visible;
                opacity: 1;
                position: relative;
                height: 80px;
                width: 80px;
                padding: 16px;
                display: flex;
            }

            :host[loading] #replacementcontent {
                opacity: 0;
                visibility: hidden;
                height: 0;
                width: 0;
            }
        </style>
        <iron-ajax id="tokenrequest" method="GET" params="[[bodyData]]" url="[[tokenEndPoint]]" handle-as="json" last-response="{{tokenData}}"></iron-ajax>
        <paper-spinner active="[[loading]]"></paper-spinner>
        <span id="replacementcontent">
            <slot></slot>
        </span>
    </template>

    
</dom-module>`;
document.head.appendChild($_documentContainer);
Polymer({
  is: "cms-token",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    loading: { type: Boolean, reflectToAttribute: !0, value: !1 },
    token: { type: String, reflectToAttribute: !0 },
    tokenEndPoint: { type: String },
    bodyData: {
      type: Object,
      computed: "_generateBodyData(token, _clickInvoked)",
      observer: "_tokenChanged"
    },
    _clickInvoked: { type: String, value: !1 },
    tokenData: { type: String, observer: "_handleTokenResponse" },
    tokenPrefix: { type: String, value: "[" },
    tokenSuffix: { type: String, value: "]" },
    _displayMode: {
      type: String,
      value: "full",
      observer: "_displayModeChanged"
    }
  },
  _displayModeChanged: function(newValue, oldValue) {
    if (
      typeof newValue !== typeof void 0 &&
      "" != newValue &&
      typeof this.token !== typeof void 0
    ) {
      this.token = this.token.replace(oldValue, newValue);
    }
  },
  _generateBodyData: function(token, $editingState) {
    if (null !== token && "" !== token) {
      let tokenPrefix = this.tokenPrefix,
        tokenSuffix = this.tokenSuffix;
      return {
        token: `${tokenPrefix}${token}${tokenSuffix}`,
        cachedResponse: $editingState
      };
    }
  },
  _handleTokenResponse: function(newValue) {
    if (null !== newValue && typeof newValue.content !== typeof void 0) {
      if (null != document.getElementById("cmstokenidtolockonto")) {
        document
          .getElementById("cmstokenidtolockonto")
          .setAttribute("href", newValue.editEndpoint);
        document.getElementById("cmstokenidtolockonto").innerHTML =
          newValue.editText;
        document
          .getElementById("cmstokenidtolockonto")
          .addEventListener("click", this.__tokenClicked.bind(this));
      }
      this.wipeSlot(dom(this));
      async.microTask.run(() => {
        let template = document.createElement("template");
        template.innerHTML = newValue.content;
        dom(this).appendChild(document.importNode(template.content, !0));
        this.loading = !1;
      });
    }
  },
  wipeSlot: function(element) {
    while (null !== element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },
  _tokenChanged: function(newValue) {
    if (typeof newValue !== typeof void 0 && "" !== newValue && !this.loading) {
      if (
        typeof this.tokenEndPoint === typeof void 0 &&
        typeof window.cmstokenEndPoint !== typeof void 0
      ) {
        this.tokenEndPoint = window.cmstokenEndPoint;
      }
      if (this.tokenEndPoint) {
        this.loading = !0;
        async.microTask.run(() => {
          this.$.tokenrequest.generateRequest();
        });
      }
    }
  },
  _windowVisibilityChanged: function() {
    if (!this.loading && this._clickInvoked) {
      this.$.tokenrequest.generateRequest();
      this._clickInvoked = !1;
    }
  },
  __tokenClicked: function() {
    this._clickInvoked = !0;
  },
  detached: function() {
    document.removeEventListener(
      "visibilitychange",
      this._windowVisibilityChanged.bind(this)
    );
  },
  attached: function() {
    document.addEventListener(
      "visibilitychange",
      this._windowVisibilityChanged.bind(this)
    );
    if (
      typeof this.token !== typeof void 0 &&
      null !== this.token &&
      "" !== this.token
    ) {
      let slot = dom(this).getEffectiveChildNodes();
      if (0 === slot.length && !this.loading) {
        if (
          typeof this.tokenEndPoint === typeof void 0 &&
          typeof window.cmstokenEndPoint !== typeof void 0
        ) {
          this.tokenEndPoint = window.cmstokenEndPoint;
        }
        if (this.tokenEndPoint) {
          this.loading = !0;
          async.microTask.run(() => {
            this.$.tokenrequest.generateRequest();
          });
        }
      }
    }
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "CMS Token",
        description: "CMS token rendered on the backend",
        icon: "icons:code",
        color: "light-blue",
        groups: ["CMS"],
        handles: [{ type: "cmstoken", token: "token" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "token",
            title: "Token",
            description: "Token from our CMS",
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
          "token-data",
          "body-data",
          "token-end-point"
        ]
      }
    });
  },
  postProcessgetHaxJSONSchema: function(schema) {
    let href = "",
      slot = "Edit";
    if (typeof this.tokenData !== typeof void 0) {
      href = this.tokenData.editEndpoint;
      slot = this.tokenData.editText;
      for (var i in this.tokenData.schema) {
        schema.properties[i] = this.tokenData.schema[i];
      }
    }
    schema.properties.__editThis = {
      type: "string",
      component: {
        name: "a",
        properties: {
          id: "cmstokenidtolockonto",
          href: href,
          target: "_blank"
        },
        slot: slot
      }
    };
    return schema;
  }
});
