import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { licenseList } from "@lrnwebcomponents/license-element/license-element.js";
/**
 * `citation-element`
 * An element dedicated to presenting and managing a correct citation on the web
 * both visually as well as semantically with simple inputs.
 * @demo demo/index.html
 */
class CitationElement extends SchemaBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          color: var(--license-text-color);
        }
        :host([display-method="footnote"]) {
          visibility: hidden;
          opacity: 0;
        }
        :host([display-method="popup"]) {
          display: block;
        }
        .license-link {
          font-size: 16px;
          line-height: 16px;
          font-style: italic;
        }
        .citation-date {
          font-size: 16px;
          line-height: 16px;
          font-style: italic;
        }
        .license-link img {
          height: 16px;
          min-width: 16px;
          margin-right: 8px;
        }
      </style>
      <meta
        about\$="[[relatedResource]]"
        property="cc:attributionUrl"
        content\$="[[source]]"
      />
      <meta
        about\$="[[relatedResource]]"
        property="cc:attributionName"
        typeof="oer:Text"
        content\$="[[title]]"
      />
      <meta
        rel="cc:license"
        href\$="[[licenseLink]]"
        content\$="License: [[licenseName]]"
      />
      <cite
        ><a target="_blank" href="[[source]]">[[title]]</a> by [[creator]],
        licensed under
        <a class="license-link" target="_blank" href="[[licenseLink]]"
          ><img
            alt="[[licenseName]] graphic"
            src="[[licenseImage]]"
            hidden&="[[!licenseImage]]"
          />[[licenseName]]</a
        >. Accessed <span class="citation-date">[[date]]</span>.</cite
      >
    `;
  }

  static get tag() {
    return "citation-element";
  }

  static get properties() {
    return {
      ...super.properties,

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
      },
      /**
       * About link for semantic meaning
       */
      _aboutLink: {
        type: Object,
        computed: "_generateAboutLink(relatedResource, licenseLink)"
      },
      /**
       * License link object for semantic meaning
       */
      _licenseLink: {
        type: Object,
        computed: "_generateLicenseLink(source)"
      }
    };
  }
  /**
   * Generate a license link whenever we have a source
   * @param {href} source
   */
  _generateLicenseLink(source) {
    // remove existing if this is moving around
    if (this._licenseLink) {
      document.head.removeChild(this._licenseLink);
    }
    let link = document.createElement("link");
    link.setAttribute("typeof", "resource");
    link.setAttribute("rel", "license");
    link.setAttribute("src", source);

    document.head.appendChild(link);
    return link;
  }
  /**
   * Generate an about link whenever we have a related resource and license link
   * @param {uuid / id} relatedResource
   * @param {href} licenseLink
   */
  _generateAboutLink(relatedResource, licenseLink) {
    // remove existing if this is moving around
    if (this._aboutLink) {
      document.head.removeChild(this._aboutLink);
    }
    let link = document.createElement("link");
    link.setAttribute("about", relatedResource);
    link.setAttribute("property", "cc:license");
    link.setAttribute("content", licenseLink);
    document.head.appendChild(link);
    return link;
  }
  /**
   * Notice scope change.
   */
  _scopeChanged(newValue, oldValue) {
    // make sure we actually have a sibling first
    if (newValue === "sibling" && this.previousElementSibling !== null) {
      // find the sibling element in the DOM and associate to it's resource ID
      // also generate a resource ID if it doesn't have one
      if (this.previousElementSibling.getAttribute("resource")) {
        this.relatedResource = this.previousElementSibling.getAttribute(
          "resource"
        );
      } else {
        let uuid = this.generateResourceID();
        this.relatedResource = uuid;
        this.previousElementSibling.setAttribute("resource", uuid);
      }
      // set prefix on the main element itself
      this.previousElementSibling.setAttribute(
        "prefix",
        this.getAttribute("prefix")
      );
    } else if (newValue === "parent") {
      // find the parent and associate to it's resource ID, if it doesn't have one
      // then let's make one dynamically
      if (this.parentNode.getAttribute("resource")) {
        this.relatedResource = this.parentNode.getAttribute("resource");
      } else {
        let uuid = this.generateResourceID();
        this.relatedResource = uuid;
        this.parentNode.setAttribute("resource", uuid);
      }
      // set prefix on the main element itself
      this.parentNode.setAttribute("prefix", this.getAttribute("prefix"));
    }
  }

  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return {
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
          }
        ],
        meta: {
          author: "ELMS:LN"
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
            options: new licenseList("select"),
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
  }

  /**
   * License was updated, time to update license name and link.
   */
  _licenseUpdated(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      var list = new licenseList();
      if (typeof list[newValue] !== typeof undefined) {
        this.licenseName = list[newValue].name;
        this.licenseLink = list[newValue].link;
        this.licenseImage = list[newValue].image;
      }
    }
  }
}
window.customElements.define(CitationElement.tag, CitationElement);
export { CitationElement };
