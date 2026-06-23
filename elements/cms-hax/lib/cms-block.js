import { CMSBase } from "./cms-base.js";
/**
 * `cms-block`
 * @element cms-block
 * `Render and process a block from a content management system.`
 */
class CMSBlock extends CMSBase {
  static get tag() {
    return "cms-block";
  }
  constructor() {
    super();
    this._globalEndPointVar = "cmsblockEndPoint";
    this.blockModule = "";
    this.blockDelta = "";
    this.blockEndPoint = null;
    this.blockPrefix = "";
    this.blockSuffix = "";
  }
  static get properties() {
    return {
      blockModule: {
        type: String,
        reflect: true,
      },
      blockDelta: {
        type: String,
        reflect: true,
      },
      blockEndPoint: {
        type: String,
      },
      blockPrefix: {
        type: String,
      },
      blockSuffix: {
        type: String,
      },
    };
  }
  /**
   * Build request body data.
   */
  _buildBodyData() {
    if (
      this.blockModule &&
      this.blockModule !== "" &&
      this.blockDelta &&
      this.blockDelta !== ""
    ) {
      return {
        module: this.blockModule,
        delta: this.blockDelta,
      };
    }
    return null;
  }
  /**
   * Resolve endpoint.
   */
  _resolveEndPoint() {
    if (this.blockEndPoint) {
      return this.blockEndPoint;
    }
    if (typeof globalThis.cmsblockEndPoint !== typeof undefined) {
      return globalThis.cmsblockEndPoint;
    }
    return null;
  }
  updated(changedProperties) {
    if (
      changedProperties.has("blockModule") ||
      changedProperties.has("blockDelta")
    ) {
      this._doRequest();
    }
  }
  static get haxProperties() {
    return {
      canScale: true,
      canEditSource: true,
      gizmo: {
        title: "CMS Block",
        description: "CMS block rendered on the backend",
        icon: "image:crop-square",
        color: "light-blue",
        tags: ["Other", "elmsln", "cms", "block"],
        handles: [
          {
            type: "cmsblock",
            block: "block",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "blockModule",
            title: "Module",
            description: "Module to load from our CMS",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "blockDelta",
            title: "Delta",
            description: "Delta of the block to load from our CMS",
            inputMethod: "textfield",
            icon: "editor:title",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        wipeSlot: true,
        unsetAttributes: [
          "loading",
          "block-data",
          "body-data",
          "hax-edit-mode",
          "block-end-point",
        ],
      },
    };
  }
  postProcessgetHaxJSONSchema(schema) {
    schema.properties["__editThis"] = {
      type: "string",
      component: {
        name: "a",
        properties: {
          id: "cmstokenidtolockonto",
          href: "",
          target: "_blank",
        },
        slot: "Edit this block",
      },
    };
    return schema;
  }
}
globalThis.customElements.define(CMSBlock.tag, CMSBlock);
export { CMSBlock };
