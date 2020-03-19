import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/paper-spinner/paper-spinner.js";
import { wipeSlot } from "@lrnwebcomponents/utils/utils.js";
/**
 * `cms-entity`
 * @customElement cms-entity
 * `Render and process a  / entity from a content management system.`
 */
class CMSEntity extends PolymerElement {
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
        id="entityrequest"
        method="GET"
        params="[[bodyData]]"
        url="[[entityEndPoint]]"
        handle-as="json"
        last-response="{{entityData}}"
      ></iron-ajax>
      <paper-spinner active="[[loading]]"></paper-spinner>
      <span id="replacementcontent"><slot></slot></span>
    `;
  }
  static get tag() {
    return "cms-entity";
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
       * Type of entity to load
       */
      entityType: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * ID of the item to load
       */
      entityId: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * Display mode of the entity
       */
      entityDisplayMode: {
        type: String,
        reflectToAttribute: true
      },
      /**
       * entity end point updated, change the way we do processing.
       */
      entityEndPoint: {
        type: String
      },
      /**
       * Body data which is just entity with some encapsulation.
       */
      bodyData: {
        type: Object,
        computed: "_generateBodyData(entityType, entityId, entityDisplayMode)",
        observer: "_entityChanged"
      },
      /**
       * entity data from the end point.
       */
      entityData: {
        type: String,
        observer: "_handleEntityResponse"
      },
      /**
       * Prefix for the entity to be processed
       */
      entityPrefix: {
        type: String,
        observer: "["
      },
      /**
       * Suffix for the entity to be processed
       */
      entitySuffix: {
        type: String,
        observer: "]"
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
   * entity end point changed
   */
  _entityChanged(newValue, oldValue) {
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
        microTask.run(() => {
          this.shadowRoot.querySelector("#entityrequest").generateRequest();
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
      typeof this.entity !== typeof undefined &&
      this.entity !== null &&
      this.entity !== ""
    ) {
      let slot = FlattenedNodesObserver.getFlattenedNodes(this);
      // only kick off request if there's nothing in it
      // if it has something in it that means we did some
      // remote rendering ahead of time
      if (slot.length === 0 && !this.loading) {
        // support for autoloading the entity data needed for the request from globals
        if (
          typeof this.entityEndPoint === typeof undefined &&
          typeof window.cmsentityEndPoint !== typeof undefined
        ) {
          this.entityEndPoint = window.cmsentityEndPoint;
        }
        if (this.entityEndPoint) {
          this.loading = true;
          microTask.run(() => {
            this.shadowRoot.querySelector("#entityrequest").generateRequest();
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
