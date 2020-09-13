/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { generateResourceID } from "@lrnwebcomponents/utils/utils.js";
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
    }
    /**
     * Popular convention across libraries
     */
    static get properties() {
      return {
        ...super.properties,
        /**
         * Unique Resource ID, generated when schemaMap processes.
         */
        schemaResourceID: {
          type: String,
          attribute: "schema-resource-id",
        },
        /**
         * Schema Map for the element, used to generate a valid prefix on the fly
         * Props set for Polymer compatibility
         */
        schemaMap: {
          type: Object,
          readOnly: true,
          observer: "_schemaMapChanged",
        },
      };
    }
    /**
     * LitElement support
     */
    updated(changedProperties) {
      if (super.updated) {
        super.updated(changedProperties);
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
    _schemaMapChanged(newValue, oldValue) {
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
        for (var property in prefixes) {
          if (prefixes.hasOwnProperty(property)) {
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
