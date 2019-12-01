import { LitElement, html, css } from "lit-element/lit-element.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils.js";
import "@polymer/iron-ajax/iron-ajax.js";
/**
 * `cms-entity`
 * @customElement cms-entity
 * `Render and process a  / entity from a content management system.`
 */
class CMSEntity extends LitElement {
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
  render() {
    return html`
      <iron-ajax
        id="entityrequest"
        method="GET"
        url="${this.entityEndPoint}"
        handle-as="json"
        @last-response-changed="${this.entityDataChanged}"
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
  entityDataChanged(e) {
    this.entityData = e.detail.value;
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.loading = false;
    this.entityPrefix = "[";
    this.entitySuffix = "]";
    import("@lrnwebcomponents/hexagon-loader/hexagon-loader.js");
  }
  static get tag() {
    return "cms-entity";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["entityType", "entityId", "entityDisplayMode"].includes(propName)) {
        this.bodyData = this._generateBodyData(
          this.entityType,
          this.entityId,
          this.entityDisplayMode
        );
      }
      if (propName == "bodyData") {
        this._entityChanged(this[propName]);
      }
      if (propName == "entityData") {
        this._handleEntityResponse(this[propName]);
      }
    });
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
       * Type of entity to load
       */
      entityType: {
        type: String,
        reflect: true,
        attribute: "entity-type"
      },
      /**
       * ID of the item to load
       */
      entityId: {
        type: String,
        reflect: true,
        attribute: "entity-id"
      },
      /**
       * Display mode of the entity
       */
      entityDisplayMode: {
        type: String,
        reflect: true,
        attribute: "entity-display-mode"
      },
      /**
       * entity end point updated, change the way we do processing.
       */
      entityEndPoint: {
        type: String,
        attribute: "entity-end-point"
      },
      /**
       * Prefix for the entity to be processed
       */
      entityPrefix: {
        type: String,
        attribute: "entity-prefix"
      },
      /**
       * Suffix for the entity to be processed
       */
      entitySuffix: {
        type: String,
        attribute: "entity-suffix"
      },
      /**
       * Body data which is just entity with some encapsulation.
       */
      bodyData: {
        type: Object
      },
      /**
       * entity data from the end point.
       */
      entityData: {
        type: String,
        attribute: "entity-data"
      }
    };
  }
  /**
   * Generate body data.
   */
  _generateBodyData(entityType, entityId, entityDisplayMode) {
    if (
      entityType !== null &&
      entityType !== "" &&
      entityId !== null &&
      entityId !== ""
    ) {
      return {
        type: `${entityType}`,
        id: `${entityId}`,
        display_mode: `${entityDisplayMode}`
      };
    }
  }
  /**
   * Handle the response from the entity processing endpoint
   */
  _handleEntityResponse(newValue, oldValue) {
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
   * entity end point changed
   */
  _entityChanged(newValue) {
    // ensure we have something and are not loading currently
    if (
      typeof newValue !== typeof undefined &&
      newValue !== "" &&
      !this.loading
    ) {
      // support going from a null element to a real one
      if (
        typeof this.entityEndPoint === typeof undefined &&
        typeof window.cmsentityEndPoint !== typeof undefined
      ) {
        this.entityEndPoint = window.cmsentityEndPoint;
      }
      if (this.entityEndPoint) {
        this.loading = true;
        this.shadowRoot.querySelector("#entityrequest").body = newValue;
        this.shadowRoot.querySelector("#entityrequest").generateRequest();
      }
    }
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "CMS Entity",
        description: "CMS entity rendered on the backend",
        icon: "places:spa",
        color: "light-blue",
        groups: ["CMS"],
        handles: [
          {
            type: "cmsentity",
            entity: "entity"
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
            property: "entityType",
            title: "Type",
            description: "type from our CMS",
            inputMethod: "select",
            options: {
              node: "Node",
              user: "User",
              file: "File"
            },
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
        wipeSlot: true,
        unsetAttributes: [
          "loading",
          "entity-data",
          "body-data",
          "entity-end-point"
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
        slot: "Edit this content"
      }
    };
    return schema;
  }
}
window.customElements.define(CMSEntity.tag, CMSEntity);
export { CMSEntity };
