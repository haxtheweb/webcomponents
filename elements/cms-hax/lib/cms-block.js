import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-spinner/paper-spinner.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils.js";
/**
 * `cms-block`
 * @customElement cms-block
 * `Render and process a  / block from a content management system.`
 */
class CMSBlock extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          min-width: 112px;
          min-height: 112px;
          transition: 0.6s all ease;
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
      <iron-ajax
        id="blockrequest"
        method="GET"
        params="[[bodyData]]"
        url="[[blockEndPoint]]"
        handle-as="json"
        last-response="{{blockData}}"
      ></iron-ajax>
      <paper-spinner active="[[loading]]"></paper-spinner>
      <span id="replacementcontent"><slot></slot></span>
    `;
  }
  static get tag() {
    return "cms-block";
  }
  static get properties() {
    return {
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
    };
  }
  /**
   * Generate body data.
   */
  _generateBodyData(blockModule, blockDelta) {
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
  }
  /**
   * Handle the response from the block processing endpoint
   */
  _handleblockResponse(newValue, oldValue) {
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
      wipeSlot(this);
      // now inject the content we got
      microTask.run(() => {
        let frag = document.createElement("span");
        frag.innerHTML = newValue.content;
        let newNode = frag.cloneNode(true);
        this.appendChild(newNode);
        setTimeout(() => {
          this.loading = false;
        }, 600);
      });
    }
  }
  /**
   * block end point changed
   */
  _blockChanged(newValue, oldValue) {
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
        microTask.run(() => {
          this.shadowRoot.querySelector("#blockrequest").generateRequest();
        });
      }
    }
  }
  /**
   * Attached to the DOM, now fire.
   */
  connectedCallback() {
    super.connectedCallback();
    if (
      typeof this.blockModule !== typeof undefined &&
      this.blockModule !== null &&
      this.blockModule !== ""
    ) {
      let slot = FlattenedNodesObserver.getFlattenedNodes(this);
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
          microTask.run(() => {
            this.shadowRoot.querySelector("#blockrequest").generateRequest();
          });
        }
      }
    }
  }
  static get haxProperties() {
    return {
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
          author: "ELMS:LN"
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
  }
  /**
   * Implements getHaxJSONSchema post processing callback.
   */
  postProcessgetHaxJSONSchema(schema) {
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
}
window.customElements.define(CMSBlock.tag, CMSBlock);
export { CMSBlock };