import { CMSBase } from "./cms-base.js";
/**
 * `cms-entity`
 * @element cms-entity
 * `Render and process a entity from a content management system.`
 */
class CMSEntity extends CMSBase {
  static get tag() {
    return "cms-entity";
  }
  constructor() {
    super();
    this._globalEndPointVar = "cmsentityEndPoint";
    this.entityType = "";
    this.entityId = "";
    this.entityDisplayMode = "";
    this.entityEndPoint = null;
    this.entityPrefix = "";
    this.entitySuffix = "";
  }
  static get properties() {
    return {
      entityType: {
        type: String,
        reflect: true,
      },
      entityId: {
        type: String,
        reflect: true,
      },
      entityDisplayMode: {
        type: String,
        reflect: true,
      },
      entityEndPoint: {
        type: String,
      },
      entityPrefix: {
        type: String,
      },
      entitySuffix: {
        type: String,
      },
    };
  }
  /**
   * Build request body data.
   */
  _buildBodyData() {
    if (
      this.entityType &&
      this.entityType !== "" &&
      this.entityId &&
      this.entityId !== ""
    ) {
      return {
        type: this.entityType,
        id: this.entityId,
        display_mode: this.entityDisplayMode,
      };
    }
    return null;
  }
  /**
   * Resolve endpoint.
   */
  _resolveEndPoint() {
    if (this.entityEndPoint) {
      return this.entityEndPoint;
    }
    if (typeof globalThis.cmsentityEndPoint !== typeof undefined) {
      return globalThis.cmsentityEndPoint;
    }
    return null;
  }
  updated(changedProperties) {
    if (
      changedProperties.has("entityType") ||
      changedProperties.has("entityId") ||
      changedProperties.has("entityDisplayMode")
    ) {
      this._doRequest();
    }
  }
  static get haxProperties() {
    return {
      canScale: true,
      canEditSource: true,
      gizmo: {
        title: "CMS Entity",
        description: "CMS entity rendered on the backend",
        icon: "places:spa",
        color: "light-blue",
        tags: ["Other", "elmsln", "cms", "block"],
        handles: [
          {
            type: "cmsentity",
            entity: "entity",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "entityType",
            title: "Type",
            description: "type from our CMS",
            inputMethod: "select",
            options: {
              node: "Node",
              user: "User",
              file: "File",
            },
            icon: "editor:title",
          },
          {
            property: "entityID",
            title: "ID",
            description: "id from our CMS",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "entityDisplayMode",
            title: "Display mode",
            description: "display mode from our CMS",
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
          "entity-data",
          "body-data",
          "hax-edit-mode",
          "entity-end-point",
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
        slot: "Edit this content",
      },
    };
    return schema;
  }
}
globalThis.customElements.define(CMSEntity.tag, CMSEntity);
export { CMSEntity };
