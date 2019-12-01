import { LitElement, html, css } from "lit-element/lit-element.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `cms-block`
 * `Render and process a  / block from a content management system.`
 * @customElement cms-block
 */
class CMSBlock extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          min-width: 112px;
          min-height: 112px;
          transition: 0.6s all ease;
          background-color: transparent;
        }
        #replacementcontent {
          visibility: visible;
          opacity: 1;
        }
        :host([loading]) {
          text-align: center;
        }
        :host([loading]) #replacementcontent {
          opacity: 0;
          visibility: hidden;
        }
      `
    ];
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <iron-ajax
        id="blockrequest"
        method="GET"
        url="${this.blockEndPoint}"
        handle-as="json"
        @last-response-changed="${this.blockDataChanged}"
      ></iron-ajax>
      ${this.loading
        ? html`
            <hexagon-loader
              item-count="4"
              loading
              size="small"
            ></hexagon-loader>
          `
        : html``}
      <span id="replacementcontent"><slot></slot></span>
    `;
  }
  blockDataChanged(e) {
    this._handleblockResponse(e.detail.value);
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
        reflect: true
      },
      /**
       * Module supplying the block
       */
      blockModule: {
        type: String,
        reflect: true,
        attribute: "block-module"
      },
      /**
       * A delta value relative to the module
       */
      blockDelta: {
        type: String,
        reflect: true,
        attribute: "block-delta"
      },
      /**
       * block end point updated, change the way we do processing.
       */
      blockEndPoint: {
        type: String,
        attribute: "block-end-point"
      },
      /**
       * Body data which is just block with some encapsulation.
       */
      bodyData: {
        type: Object
      },
      /**
       * Prefix for the block to be processed
       */
      blockPrefix: {
        type: String,
        attribute: "block-prefix"
      },
      /**
       * Suffix for the block to be processed
       */
      blockSuffix: {
        type: String,
        attribute: "block-suffix"
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
  _handleblockResponse(newValue) {
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
      let frag = document.createElement("span");
      frag.innerHTML = newValue.content;
      let newNode = frag.cloneNode(true);
      this.appendChild(newNode);
      this.loading = false;
    }
  }
  /**
   * block end point changed
   */
  _blockChanged(newValue) {
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
        this.shadowRoot.querySelector("#blockrequest").body = newValue;
        this.shadowRoot.querySelector("#blockrequest").generateRequest();
      }
    }
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.loading = false;
    this.blockPrefix = "[";
    this.blockSuffix = "]";
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["blockModule", "blockDelta"].includes(propName)) {
        this.bodyData = this._generateBodyData(
          this.blockModule,
          this.blockDelta
        );
      }
      if (propName == "bodyData") {
        this._blockChanged(this[propName]);
      }
    });
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
