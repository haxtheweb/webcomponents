import { CMSBase } from "./cms-base.js";
/**
 * `cms-views`
 * @element cms-views
 * `Render and process a views from a content management system.`
 */
class CMSViews extends CMSBase {
  static get tag() {
    return "cms-views";
  }
  constructor() {
    super();
    this._globalEndPointVar = "cmsviewsEndPoint";
    this.viewsName = "";
    this.viewsDisplay = "";
    this.viewsEndPoint = null;
    this.viewsPrefix = "";
    this.viewsSuffix = "";
  }
  static get properties() {
    return {
      viewsName: {
        type: String,
        reflect: true,
      },
      viewsDisplay: {
        type: String,
        reflect: true,
      },
      viewsEndPoint: {
        type: String,
      },
      viewsPrefix: {
        type: String,
      },
      viewsSuffix: {
        type: String,
      },
    };
  }
  /**
   * Build request body data.
   */
  _buildBodyData() {
    if (this.viewsName && this.viewsName !== "") {
      return {
        name: this.viewsName,
        display: this.viewsDisplay,
      };
    }
    return null;
  }
  /**
   * Resolve endpoint.
   */
  _resolveEndPoint() {
    if (this.viewsEndPoint) {
      return this.viewsEndPoint;
    }
    if (typeof globalThis.cmsviewsEndPoint !== typeof undefined) {
      return globalThis.cmsviewsEndPoint;
    }
    return null;
  }
  updated(changedProperties) {
    if (
      changedProperties.has("viewsName") ||
      changedProperties.has("viewsDisplay")
    ) {
      this._doRequest();
    }
  }
  static get haxProperties() {
    return {
      canScale: true,
      canEditSource: true,
      gizmo: {
        title: "CMS View",
        description: "CMS views rendered on the backend",
        icon: "icons:view-module",
        color: "light-blue",
        tags: ["Other", "elmsln", "cms", "block"],
        handles: [
          {
            type: "cmsviews",
            views: "views",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "viewsName",
            title: "Name",
            description: "Name of the view from our CMS",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "viewsDisplay",
            title: "Display",
            description: "Display within that view from our CMS",
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
          "views-data",
          "body-data",
          "hax-edit-mode",
          "views-end-point",
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
        slot: "Edit this view",
      },
    };
    return schema;
  }
}
globalThis.customElements.define(CMSViews.tag, CMSViews);
export { CMSViews };
