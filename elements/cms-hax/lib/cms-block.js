import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/paper-spinner/paper-spinner.js";
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
/**
`cms-block`
Render and process a  / block from a content management system.

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  is: "cms-block",
  behaviors: [HAXBehaviors.PropertiesBehaviors],
  properties: {
    /**
     * Loading state
     */
    loading: {
      type: Boolean,
      reflectToAttribute: true,
      value: false
    },
    /**
     * Module supplying the block
     */
    blockModule: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * A delta value relative to the module
     */
    blockDelta: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * block end point updated, change the way we do processing.
     */
    blockEndPoint: {
      type: String
    },
    /**
     * Body data which is just block with some encapsulation.
     */
    bodyData: {
      type: Object,
      computed: "_generateBodyData(blockModule, blockDelta)",
      observer: "_blockChanged"
    },
    /**
     * block data from the end point.
     */
    blockData: {
      type: String,
      observer: "_handleblockResponse"
    },
    /**
     * Prefix for the block to be processed
     */
    blockPrefix: {
      type: String,
      observer: "["
    },
    /**
     * Suffix for the block to be processed
     */
    blockSuffix: {
      type: String,
      observer: "]"
    }
  },
  /**
   * Generate body data.
   */
  _generateBodyData: function(blockModule, blockDelta) {
    if (
      blockModule !== null &&
      blockModule !== "" &&
      blockDelta !== null &&
      blockDelta !== ""
    ) {
      return {
        module: `${blockModule}`,
        delta: `${blockDelta}`
      };
    }
  },
  /**
   * Handle the response from the block processing endpoint
   */
  _handleblockResponse: function(newValue, oldValue) {
    if (newValue !== null && typeof newValue.content !== typeof undefined) {
      // store the text and url callbacks
      if (document.getElementById("cmstokenidtolockonto") != null) {
        document
          .getElementById("cmstokenidtolockonto")
          .setAttribute("href", newValue.editEndpoint);
        document.getElementById("cmstokenidtolockonto").innerHTML =
          newValue.editText;
      }
      // wipe our own slot here
      this.wipeSlot(dom(this));
      // now inject the content we got
      async.microTask.run(() => {
        let frag = document.createElement("span");
        frag.innerHTML = newValue.content;
        let newNode = frag.cloneNode(true);
        dom(this).appendChild(newNode);
        setTimeout(() => {
          this.loading = false;
        }, 600);
      });
    }
  },
  /**
   * wipe out the slot
   */
  wipeSlot: function(element) {
    while (element.firstChild !== null) {
      element.removeChild(element.firstChild);
    }
  },
  /**
   * block end point changed
   */
  _blockChanged: function(newValue, oldValue) {
    // ensure we have something and are not loading currently
    if (
      typeof newValue !== typeof undefined &&
      newValue !== "" &&
      !this.loading
    ) {
      // support going from a null element to a real one
      if (
        typeof this.blockEndPoint === typeof undefined &&
        typeof window.cmsblockEndPoint !== typeof undefined
      ) {
        this.blockEndPoint = window.cmsblockEndPoint;
      }
      if (this.blockEndPoint) {
        this.loading = true;
        async.microTask.run(() => {
          this.$.blockrequest.generateRequest();
        });
      }
    }
  },
  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    if (
      typeof this.blockModule !== typeof undefined &&
      this.blockModule !== null &&
      this.blockModule !== ""
    ) {
      let slot = dom(this).getEffectiveChildNodes();
      // only kick off request if there's nothing in it
      // if it has something in it that means we did some
      // remote rendering ahead of time
      if (slot.length === 0 && !this.loading) {
        // support for autoloading the block data needed for the request from globals
        if (
          typeof this.blockEndPoint === typeof undefined &&
          typeof window.cmsblockEndPoint !== typeof undefined
        ) {
          this.blockEndPoint = window.cmsblockEndPoint;
        }
        if (this.blockEndPoint) {
          this.loading = true;
          async.microTask.run(() => {
            this.$.blockrequest.generateRequest();
          });
        }
      }
    }
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "CMS Block",
        description: "CMS block rendered on the backend",
        icon: "image:crop-square",
        color: "light-blue",
        groups: ["CMS"],
        handles: [
          {
            type: "cmsblock",
            block: "block"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
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
        wipeSlot: true,
        unsetAttributes: [
          "loading",
          "block-data",
          "body-data",
          "block-end-point"
        ]
      }
    };
    this.setHaxProperties(props);
  },
  /**
   * Implements getHaxJSONSchema post processing callback.
   */
  postProcessgetHaxJSONSchema: function(schema) {
    schema.properties["__editThis"] = {
      type: "string",
      component: {
        name: "a",
        properties: {
          id: "cmstokenidtolockonto",
          href: "",
          target: "_blank"
        },
        slot: "Edit this block"
      }
    };
    return schema;
  }
});
