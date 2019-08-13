/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

export const SchemaBehaviors = function(SuperClass) {
  return class extends SuperClass {
    static get properties() {
      let props = {
        /**
         * Unique Resource ID, generated when schemaMap processes.
         */
        schemaResourceID: {
          type: String,
          value: ""
        },
        /**
         * Schema Map for the element, used to generate a valid prefix on the fly
         */
        schemaMap: {
          type: Object,
          readOnly: true,
          value: {
            prefix: {
              oer: "http://oerschema.org/",
              schema: "http://schema.org/",
              dc: "http://purl.org/dc/terms/",
              foaf: "http://xmlns.com/foaf/0.1/",
              cc: "http://creativecommons.org/ns#",
              bib: "http://bib.schema.org"
            }
          },
          observer: "_schemaMapChanged"
        }
      };
      if (super.properties) {
        props = Object.assign(props, super.properties);
      }
      return props;
    }
    /**
     * Generate a uinque ID
     */
    generateResourceID() {
      function idPart() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return (
        "#" +
        idPart() +
        idPart() +
        "-" +
        idPart() +
        "-" +
        idPart() +
        "-" +
        idPart()
      );
    }
    /**
     * Notice the schema map has changed, reprocess attributes.
     */
    _schemaMapChanged(newValue, oldValue) {
      if (typeof newValue !== typeof undefined) {
        // use this to tie into schemaResourceID build
        this.schemaResourceID = this.getAttribute("resource");
        // if it still doesn't have one then we have to check
        if (this.schemaResourceID == "" || this.schemaResourceID == null) {
          this.schemaResourceID = this.generateResourceID();
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
