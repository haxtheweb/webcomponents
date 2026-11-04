/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { generateResourceID } from "@haxtheweb/utils/lib/ids.js";
export const SchemaBehaviors = function (SuperClass) {
  return class extends SuperClass {
    /**
     * HTMLElement
     */
    constructor() {
      super();
      this.schemaResourceID = "";
      this.schemaMap = {
        prefix: {
          oer: "http://oerschema.org/",
          schema: "http://schema.org/",
          dc: "http://purl.org/dc/terms/",
          foaf: "http://xmlns.com/foaf/0.1/",
          cc: "http://creativecommons.org/ns#",
          bib: "http://bib.schema.org",
        },
      };
      // the resource the markup gave this element, if any, before
      // _schemaMapChanged can generate one (see connectedCallback). An
      // upgraded element already has its attributes here; one the parser
      // creates gets them after the constructor, so it is read on connect.
      if (this.hasAttribute("resource")) {
        this._xapiAuthoredResource = this.getAttribute("resource") || "";
      }
    }
    /**
     * Record, once, whether `resource` came from the markup (authored or
     * saved by HAX) as `_xapiAuthoredResource` ("" when it did not). The
     * first update, which is where a missing resource is generated, only
     * runs after connecting, so this always sees the markup value. Learner
     * data (@haxtheweb/user-action/lib/xapi.js activityKey) uses it so an
     * id generated during this page load never names an activity.
     */
    connectedCallback() {
      if (this._xapiAuthoredResource === undefined) {
        this._xapiAuthoredResource = this.getAttribute("resource") || "";
      }
      if (super.connectedCallback) {
        super.connectedCallback();
      }
    }
    /**
     * Popular convention across libraries
     */
    static get properties() {
      return {
        ...super.properties,
        /**
         * Schema Map for the element, used to generate a valid prefix on the fly
         */
        schemaMap: {
          type: Object,
        },
      };
    }
    /**
     * LitElement support; react in willUpdate so consumers that declare
     * schemaResourceID reactively (e.g. media-image) batch the set into the
     * current update cycle instead of scheduling a second one (Lit
     * change-in-update warning)
     */
    willUpdate(changedProperties) {
      if (super.willUpdate) {
        super.willUpdate(changedProperties);
      }
      changedProperties.forEach((oldValue, propName) => {
        if (propName == "schemaMap") {
          this._schemaMapChanged(this[propName], oldValue);
        }
      });
    }
    /**
     * Notice the schema map has changed, reprocess attributes.
     */
    _schemaMapChanged(newValue, _oldValue) {
      if (typeof newValue !== typeof undefined) {
        // use this to tie into schemaResourceID build
        this.schemaResourceID = this.getAttribute("resource");
        // if it still doesn't have one then we have to check
        if (
          this.schemaResourceID == "" ||
          this.schemaResourceID == null ||
          this.schemaResourceID == "null"
        ) {
          this.schemaResourceID = generateResourceID();
          this.setAttribute("resource", this.schemaResourceID);
        }
        let prefixes = newValue.prefix;
        let prefix = "";
        // build prefix string
        for (let property in prefixes) {
          if (Object.prototype.hasOwnProperty.call(prefixes, property)) {
            prefix += property + ":" + prefixes[property] + " ";
          }
        }
        // set prefix on the main element itself
        if (prefix != "") {
          this.setAttribute("prefix", prefix);
        }
      }
    }
  };
};
