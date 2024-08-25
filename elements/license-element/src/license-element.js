/**
 * A list of licenses that we support the references for.
 */
export class licenseList {
  constructor(mode = "full") {
    // initial list, PR to add more
    let list = {
      by: {
        name: "Attribution",
        link: "https://creativecommons.org/licenses/by/4.0/",
        image: "https://i.creativecommons.org/l/by/4.0/88x31.png",
      },
      "by-sa": {
        name: "Attribution Share a like",
        link: "https://creativecommons.org/licenses/by-sa/4.0/",
        image: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png",
      },
      "by-nd": {
        name: "Attribution No derivatives",
        link: "https://creativecommons.org/licenses/by-nd/4.0/",
        image: "https://i.creativecommons.org/l/by-nd/4.0/88x31.png",
      },
      "by-nc": {
        name: "Attribution non-commercial",
        link: "https://creativecommons.org/licenses/by-nc/4.0/",
        image: "https://i.creativecommons.org/l/by-nc/4.0/88x31.png",
      },
      "by-nc-sa": {
        name: "Attribution non-commercial share a like",
        link: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        image: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
      },
      "by-nc-nd": {
        name: "Attribution Non-commercial No derivatives",
        link: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
        image: "https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png",
      },
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
  }
}

import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
/**
 * `license-element`
 * `A simple way of applying a semantically accurate license to work.`
 * @demo demo/index.html
 * @element license-element
 */
class LicenseElement extends SchemaBehaviors(DDDSuper(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          line-height: var(--ddd-line-height-140);
          background-color: var(--license-background-color);
        }
        :host:after {
          content: "License";
          position: relative;
          float: right;
          bottom: var(--ddd-spacing-9);
          right: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-ms);
          color: var(--ddd-theme-default-slateGray);
          font-style: italic;
        }
        .license-body {
          padding: var(--ddd-spacing-8);
          background-color: var(--ddd-theme-default-limestoneMaxLight);
          color: var(--ddd-theme-default-slateGray);
        }

        :host([display-method="footnote"]) {
          visibility: hidden;
          opacity: 0;
        }
        :host([display-method="popup"]) {
          display: block;
        }
        .license-link {
          font-style: italic;
        }
        a,
        a:any-link,
        a:-webkit-any-link {
          color: var(--ddd-theme-default-link);
          font-weight: var(--ddd-font-weight-bold);
        }
        .big-license-link img {
          margin-right: 0 var(--ddd-spacing-2) var(--ddd-spacing-2) 0;
          width: var(--ddd-icon-3xl);
          height: var(--ddd-icon-xs);
          vertical-align: middle;
        }
        .work-title {
          font-weight: bold;
        }
      `,
    ];
  }
  render() {
    return html`
      <meta
        rel="cc:license"
        href="${this.licenseLink}"
        content="License: ${this.licenseName}"
      />
      <div
        class="license-body"
        xmlns:cc="${this.licenseLink}"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
      >
        ${this.licenseImage
          ? html`
              <a
                class="big-license-link"
                target="_blank"
                href="${this.licenseLink}"
                rel="noopener noreferrer"
                ><img
                  loading="lazy"
                  alt="${this.licenseName} graphic"
                  src="${this.licenseImage}"
              /></a>
            `
          : ``}
        <a
          class="work-title license-link"
          rel="dc:type"
          href="${this.source}"
          property="dc:title"
          >${this.title}</a
        >
        by
        <span rel="cc:attributionURL" property="cc:attributionName"
          >${this.creator}</span
        >
        ${this.license
          ? html`is licensed under a
              <a class="license-link" target="_blank" href="${this.licenseLink}"
                >${this.licenseName}</a
              >.`
          : ``} <span rel="dc:source" href="${this.source}"></span>
        ${this.hasMore
          ? html`
              <span
                >Permissions beyond the scope of this license are available
                <a
                  rel="cc:morePermissions"
                  target="_blank"
                  href="${this.moreLink}"
                  rel="noopener noreferrer"
                  >${this.moreLabel}</a
                >.</span
              >
            `
          : ``}
      </div>
    `;
  }

  static get tag() {
    return "license-element";
  }
  static get properties() {
    return {
      ...super.properties,
      /**
       * Title of the work.
       */
      title: {
        type: String,
      },
      /**
       * Person or group that owns / created the work.
       */
      creator: {
        type: String,
      },
      /**
       * Original Source of the work in question
       */
      source: {
        type: String,
      },
      /**
       * License name, calculated or supplied by the end user if we don't have them.
       */
      licenseName: {
        type: String,
        attribute: "license-name",
      },
      licenseImage: {
        type: String,
        attribute: "license-image",
      },
      /**
       * License link for more details
       */
      licenseLink: {
        type: String,
        attribute: "license-link",
      },
      /**
       * License short hand. Options cc0,
       */
      license: {
        type: String,
      },
      /**
       * More details label
       */
      moreLabel: {
        type: String,
        attribute: "more-label",
      },
      /**
       * More details link
       */
      moreLink: {
        type: String,
        attribute: "more-link",
      },
      /**
       * See if we have more things to point to
       */
      hasMore: {
        type: Boolean,
        attribute: "has-more",
      },
    };
  }
  constructor() {
    super();
    this.licenseList = new licenseList();
    this.creator = "(author)";
    this.source = null;
    this.moreLabel = "on the licensing details page";
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "license") {
        this._licenseUpdated(this[propName]);
      }
      if (propName == "moreLink") {
        this.hasMode = this._computeHasMore(this.moreLink);
      }
    });
  }
  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: true,
      gizmo: {
        title: "License",
        description: "Provide a license for you rwork",
        icon: "icons:copyright",
        color: "grey",
        tags: [
          "Authoring",
          "content",
          "copyright",
          "license",
          "cc0",
          "cc-by",
          "cc-by-sa",
          "cc-by-nd",
          "cc-by-nc",
          "cc-by-nc-sa",
          "cc-by-nc-nd",
          "citation",
        ],
        handles: [
          {
            type: "license",
            source: "source",
            title: "title",
            author: "creator",
            license: "license",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the work being cited.",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "source",
            title: "Source link",
            description: "The source url for the element this is citing.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
          },
          {
            property: "license",
            title: "License",
            description: "The source url for the element this is citing.",
            inputMethod: "select",
            options: new licenseList("select"),
            icon: "link",
          },
          {
            property: "creator",
            title: "Creator",
            description: "Who made or owns this.",
            inputMethod: "textfield",
            icon: "link",
          },
        ],
        advanced: [
          {
            property: "moreLink",
            title: "Source link",
            description: "Link to additional licensing details",
            inputMethod: "textfield",
            validationType: "url",
          },
          {
            property: "moreLabel",
            title: "more label",
            description: "Label for more licensing details",
            inputMethod: "textfield",
          },
        ],
      },
      demoSchema: [
        {
          tag: "license-element",
          properties: {
            title: "Wonderland",
            creator: "Mad Hatter",
            source: "https://haxtheweb.org/",
            license: "by",
          },
          content: "",
        },
      ],
    };
  }
  /**
   * Calculate if we should show the advanced details area
   */
  _computeHasMore(link) {
    // only show if there's a link supplied for additional details
    if (typeof link !== typeof undefined && link !== "") {
      return true;
    }
    return false;
  }
  /**
   * License was updated, time to update license name and link.
   */
  _licenseUpdated(newValue) {
    if (
      typeof newValue !== typeof undefined &&
      typeof this.licenseList[newValue] !== typeof undefined
    ) {
      this.licenseName = this.licenseList[newValue].name;
      this.licenseLink = this.licenseList[newValue].link;
      this.licenseImage = this.licenseList[newValue].image;
    }
  }
}
customElements.define(LicenseElement.tag, LicenseElement);
export { LicenseElement };
