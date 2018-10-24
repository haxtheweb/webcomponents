import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 `citation-element`
 An element dedicated to presenting and managing a correct citation on the web
 both visually as well as semantically with simple inputs.

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        color: var('--license-text-color');
      }
      :host[display-method="footnote"] {
        visibility: hidden;
        opacity: 0;
      }
      :host[display-method="popup"] {
        display: block;
      }
      .license-link {
        font-size: 1em;
        line-height: 1em;
        font-style: italic;
      }
      .citation-date {
        font-size: 1em;
        line-height: 1em;
        font-style: italic;
      }
      .license-link img {
        height: 1em;
        min-width: 1em;
        margin-right: .5em;
      }
    </style>
    <!-- Link the license for the course -->
    <link about\$="[[relatedResource]]" property="cc:license" content\$="[[licenseLink]]">
    <meta about\$="[[relatedResource]]" property="cc:attributionUrl" content\$="[[source]]">
    <meta about\$="[[relatedResource]]" property="cc:attributionName" typeof="oer:Text" content\$="[[title]]">
    <meta rel="cc:license" href\$="[[licenseLink]]" content\$="License: [[licenseName]]">
    <link rel="license" typeof="resource" src="[[source]]">
    <cite><a target="_blank" href="[[source]]">[[title]]</a> by [[creator]], licensed under <a class="license-link" target="_blank" href="[[licenseLink]]"><img alt="[[licenseName]] graphic" src="[[licenseImage]]" hidden&="[[!licenseImage]]">[[licenseName]]</a>. Accessed <span class="citation-date">[[date]]</span>.</cite>
`,

  is: "citation-element",

  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * Title of the work.
     */
    title: {
      type: String
    },
    /**
     * License scope
     */
    scope: {
      type: String,
      value: "sibling",
      observer: "_scopeChanged"
    },
    /**
     * How to present the citation on the interface.
     * Can be popup, footnote, or default behavior which is visible
     */
    displayMethod: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * Person or group that owns / created the work.
     */
    creator: {
      type: String
    },
    /**
     * Original Source of the work in question
     */
    source: {
      type: String
    },
    /**
     * Date the work was accessed.
     */
    date: {
      type: String
    },
    /**
     * License name, calculated or supplied by the end user if we don't have them.
     */
    licenseName: {
      type: String
    },
    /**
     * License link for more details
     */
    licenseLink: {
      type: String
    },
    /**
     * License short hand. Options cc0,
     */
    license: {
      type: String,
      observer: "_licenseUpdated"
    }
  },

  /**
   * Notice scope change.
   */
  _scopeChanged: function(newValue, oldValue) {
    // make sure we actually have a sibling first
    if (
      newValue === "sibling" &&
      Polymer.dom(this).previousElementSibling !== null
    ) {
      // find the sibling element in the DOM and associate to it's resource ID
      // also generate a resource ID if it doesn't have one
      if (Polymer.dom(this).previousElementSibling.getAttribute("resource")) {
        this.relatedResource = Polymer.dom(
          this
        ).previousElementSibling.getAttribute("resource");
      } else {
        let uuid = this.generateResourceID();
        this.relatedResource = uuid;
        Polymer.dom(this).previousElementSibling.setAttribute("resource", uuid);
      }
      // set prefix on the main element itself
      Polymer.dom(this).previousElementSibling.setAttribute(
        "prefix",
        this.getAttribute("prefix")
      );
    } else if (newValue === "parent") {
      // find the parent and associate to it's resource ID, if it doesn't have one
      // then let's make one dynamically
      if (Polymer.dom(this).parentNode.getAttribute("resource")) {
        this.relatedResource = Polymer.dom(this).parentNode.getAttribute(
          "resource"
        );
      } else {
        let uuid = this.generateResourceID();
        this.relatedResource = uuid;
        Polymer.dom(this).parentNode.setAttribute("resource", uuid);
      }
      // set prefix on the main element itself
      Polymer.dom(this).parentNode.setAttribute(
        "prefix",
        this.getAttribute("prefix")
      );
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Citation",
        description: "A basic citation element with 3 presentation modes",
        icon: "editor:title",
        color: "grey",
        groups: ["Content", "Text", "Copyright"],
        handles: [
          {
            type: "citation",
            source: "source",
            title: "title",
            author: "creator",
            license: "license",
            accessDate: "date"
          },
          {
            type: "inline",
            text: "title"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the work being cited.",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the work being cited.",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "source",
            title: "Source link",
            description: "The source url for the element this is citing.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url"
          },
          {
            property: "date",
            title: "Date accessed",
            description: "The date this was accessed.",
            inputMethod: "textfield",
            icon: "link"
          },
          {
            property: "scope",
            title: "Scope",
            description: "Scope of what to cite.",
            inputMethod: "select",
            options: {
              sibling: "Sibling element",
              parent: "Parent element"
            },
            icon: "code"
          },
          {
            property: "license",
            title: "License",
            description: "The source url for the element this is citing.",
            inputMethod: "select",
            options: this.licenseList("select"),
            icon: "link"
          },
          {
            property: "creator",
            title: "Creator",
            description: "Who made or owns this.",
            inputMethod: "textfield",
            icon: "link"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * A list of licenses that we support the references for.
   */
  licenseList: function(mode = "full") {
    // initial list, PR to add more
    let list = {
      by: {
        name: "Attribution",
        link: "https://creativecommons.org/licenses/by/4.0/",
        image: "https://i.creativecommons.org/l/by/4.0/88x31.png"
      },
      "by-sa": {
        name: "Attribution Share a like",
        link: "https://creativecommons.org/licenses/by-sa/4.0/",
        image: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png"
      },
      "by-nd": {
        name: "Attribution No derivatives",
        link: "https://creativecommons.org/licenses/by-nd/4.0/",
        image: "https://i.creativecommons.org/l/by-nd/4.0/88x31.png"
      },
      "by-nc": {
        name: "Attribution non-commercial",
        link: "https://creativecommons.org/licenses/by-nc/4.0/",
        image: "https://i.creativecommons.org/l/by-nc/4.0/88x31.png"
      },
      "by-nc-sa": {
        name: "Attribution non-commercial share a like",
        link: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        image: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png"
      },
      "by-nc-nd": {
        name: "Attribution Non-commercial No derivatives",
        link: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
        image: "https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png"
      }
    };
    // support mutating the array into a select list
    if (mode == "select") {
      var select = {};
      for (var i in list) {
        select[i] = list[i].name;
      }
      return select;
    }
    return list;
  },

  /**
   * License was updated, time to update license name and link.
   */
  _licenseUpdated: function(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      var list = this.licenseList();
      if (typeof list[newValue] !== typeof undefined) {
        this.licenseName = list[newValue].name;
        this.licenseLink = list[newValue].link;
        this.licenseImage = list[newValue].image;
      }
    }
  }
});
