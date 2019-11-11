import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { OERSchema } from "@lrnwebcomponents/oer-schema/lib/oerschema.js";
import "@lrnwebcomponents/hax-iconset/hax-iconset.js";
/**
 * `oer-schema`
 * `A LRN element to wrap an oer schema prefix onto materials.`
 * @demo demo/index.html
 */
class OerSchemaElement extends SchemaBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }
      </style>
      <span property\$="oer:[[oerProperty]]"> <slot></slot> [[text]] </span>
    `;
  }
  static get tag() {
    return "oer-schema";
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Text to wire into the middle of the element.
       * This is easier to manage then slotted data though
       * this supports both methods.
       */
      text: {
        type: String,
        value: ""
      },
      /**
       * Property value for this oer resource
       */
      oerProperty: {
        type: String,
        value: "name"
      },
      /**
       * Property value for this oer resource
       */
      typeof: {
        type: String,
        value: "Resource"
      },
      /**
       * Related Resource ID
       */
      relatedResource: {
        type: String
      },
      /**
       * License link object for semantic meaning
       */
      _OERLink: {
        type: Object,
        computed: "_generateforComponentLink(relatedResource)"
      }
    };
  }
  static get haxProperties() {
    let oerSchema = new OERSchema();
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Schema",
        description: "Schematized element area",
        icon: "hax:oerschema",
        color: "blue",
        groups: ["Instructional"],
        handles: [
          {
            type: "inline",
            text: "text"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            slot: "",
            title: "Text",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            slot: "",
            title: "Text",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "typeof",
            title: "Schema typeof",
            inputMethod: "select",
            allowNull: true,
            options: oerSchema.types
          },
          {
            property: "oerProperty",
            title: "Schema property",
            description: "The OER Schema property this represents",
            inputMethod: "select",
            allowNull: true,
            options: {
              name: "name",
              additionalType: "additionalType",
              description: "description",
              image: "image",
              mainEntityOfPage: "mainEntityOfPage",
              sameAs: "sameAs",
              uri: "uri"
            }
          },
          {
            property: "relatedResource",
            title: "Related resource",
            description: "A reference to the related Schema resource",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      },
      saveOptions: {
        unsetAttributes: ["_oerlink"]
      }
    };
  }
  _generateforComponentLink(source) {
    // remove existing if this is moving around
    if (this._OERLink) {
      document.head.removeChild(this._OERLink);
    }
    let link = document.createElement("link");
    link.setAttribute("property", "oer:forComponent");
    link.setAttribute("content", this.relatedResource);
    document.head.appendChild(link);
    return link;
  }
}
window.customElements.define(OerSchemaElement.tag, OerSchemaElement);
export { OerSchemaElement };
