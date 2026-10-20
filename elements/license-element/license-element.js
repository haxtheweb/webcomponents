/**
 * A list of licenses that we support the references for.
 * `name` is the English label; elements that display it translate via
 * `this.t[tKey]` (see license-element / citation-element _licenseDisplayName)
 */
export class licenseList {
  constructor(mode = "full") {
    // initial list, PR to add more
    let list = {
      by: {
        name: "Attribution",
        tKey: "licenseBy",
        link: "https://creativecommons.org/licenses/by/4.0/",
        image: "https://i.creativecommons.org/l/by/4.0/88x31.png",
      },
      "by-sa": {
        name: "Attribution Share a like",
        tKey: "licenseBySa",
        link: "https://creativecommons.org/licenses/by-sa/4.0/",
        image: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png",
      },
      "by-nd": {
        name: "Attribution No derivatives",
        tKey: "licenseByNd",
        link: "https://creativecommons.org/licenses/by-nd/4.0/",
        image: "https://i.creativecommons.org/l/by-nd/4.0/88x31.png",
      },
      "by-nc": {
        name: "Attribution non-commercial",
        tKey: "licenseByNc",
        link: "https://creativecommons.org/licenses/by-nc/4.0/",
        image: "https://i.creativecommons.org/l/by-nc/4.0/88x31.png",
      },
      "by-nc-sa": {
        name: "Attribution non-commercial share a like",
        tKey: "licenseByNcSa",
        link: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
        image: "https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png",
      },
      "by-nc-nd": {
        name: "Attribution Non-commercial No derivatives",
        tKey: "licenseByNcNd",
        link: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
        image: "https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png",
      },
    };
    // support mutating the array into a select list
    if (mode == "select") {
      let select = {};
      for (let i in list) {
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
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
/**
 * `license-element`
 * `A simple way of applying a semantically accurate license to work.`
 * @demo demo/index.html
 * @element license-element
 */
class LicenseElement extends I18NMixin(SchemaBehaviors(DDDSuper(LitElement))) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          line-height: var(--ddd-lh-140);
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
        typeof="oer:SupportingMaterial"
        xmlns:cc="${this.licenseLink}"
        xmlns:dc="http://purl.org/dc/elements/1.1/"
      >
        <meta property="oer:name" content="${this.title}" />
        <meta property="oer:uri" content="${this.source}" />
        ${this.licenseImage
          ? html`
              <a
                class="big-license-link"
                target="_blank"
                href="${this.licenseLink}"
                rel="noopener noreferrer"
                ><img
                  loading="lazy"
                  alt="${this.t.licenseGraphic.replace(
                    "{license}",
                    () => (this._licenseDisplayName()),
                  )}"
                  src="${this.licenseImage}"
              /></a>
            `
          : ``}
        ${this._fillTemplate(
          this.license ? this.t.workByCreatorLicensed : this.t.workByCreator,
          {
            title: html`<a
              class="work-title license-link"
              rel="dc:type"
              href="${this.source}"
              property="dc:title"
              >${this.title}</a
            >`,
            creator: html`<span
              rel="cc:attributionURL"
              property="cc:attributionName"
              >${this.creator}</span
            >`,
            license: html`<a
              class="license-link"
              target="_blank"
              href="${this.licenseLink}"
              >${this._licenseDisplayName()}</a
            >`,
          },
        )} <span rel="dc:source" href="${this.source}"></span>
        ${this.hasMore
          ? html`
              <span
                >${this._fillTemplate(this.t.permissionsBeyondScope, {
                  link: html`<a
                    rel="cc:morePermissions"
                    target="_blank"
                    href="${this.moreLink}"
                    rel="noopener noreferrer"
                    >${this.moreLabel}</a
                  >`,
                })}</span
              >
            `
          : ``}
      </div>
    `;
  }

  /**
   * splits a translated sentence on {placeholders} and swaps in the
   * matching values (strings or templates) so links stay inside one string
   */
  _fillTemplate(str, values) {
    return str.split(/(\{[a-zA-Z]+\})/).map((part) => {
      const match = part.match(/^\{([a-zA-Z]+)\}$/);
      if (match && Object.prototype.hasOwnProperty.call(values, match[1])) {
        return values[match[1]];
      }
      return part;
    });
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
    this.t = this.t || {};
    this.t = {
      ...this.t,
      licenseGraphic: "{license} graphic",
      workByCreator: "{title} by {creator}",
      workByCreatorLicensed:
        "{title} by {creator} is licensed under a {license}.",
      permissionsBeyondScope:
        "Permissions beyond the scope of this license are available {link}.",
      author: "(author)",
      onTheLicensingDetailsPage: "on the licensing details page",
      licenseBy: "Attribution",
      licenseBySa: "Attribution Share a like",
      licenseByNd: "Attribution No derivatives",
      licenseByNc: "Attribution non-commercial",
      licenseByNcSa: "Attribution non-commercial share a like",
      licenseByNcNd: "Attribution Non-commercial No derivatives",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.licenseList = new licenseList();
    this.i18nDefault("creator", "author");
    this.source = null;
    this.i18nDefault("moreLabel", "onTheLicensingDetailsPage");
  }
  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive licenseName/licenseLink/licenseImage from license in willUpdate
    // so reactive sets batch into the current update cycle. Setting them in
    // updated() (via _licenseUpdated) scheduled a redundant second update
    // (Lit change-in-update warning).
    if (changedProperties.has("license")) {
      this._licenseUpdated(this.license);
    }
    // Derive hasMore from moreLink in the same cycle; the old updated()
    // wrote this.hasMode (a typo) so the more-permissions block never
    // rendered from a more-link change
    if (changedProperties.has("moreLink")) {
      this.hasMore = this._computeHasMore(this.moreLink);
    }
  }
  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: true,
      gizmo: {
        title: "License",
        description: "Provide a license for your work.",
        icon: "icons:copyright",
        color: "grey",
        tags: [
          "Other",
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
            description: "Title of the cited work.",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "source",
            title: "Source link",
            description: "Source URL for the licensed work.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
          },
          {
            property: "license",
            title: "License",
            description: "License applied to this work.",
            inputMethod: "select",
            options: new licenseList("select"),
            icon: "link",
          },
          {
            property: "creator",
            title: "Creator",
            description: "Creator or owner of this work.",
            inputMethod: "textfield",
            icon: "link",
          },
        ],
        advanced: [
          {
            property: "moreLink",
            title: "Source link",
            description: "Link to additional licensing details.",
            inputMethod: "textfield",
            validationType: "url",
          },
          {
            property: "moreLabel",
            title: "More label",
            description: "Label for additional licensing details.",
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
   * translated license name for display; custom licenseName values pass through
   */
  _licenseDisplayName() {
    const entry =
      this.license && new licenseList()[this.license]
        ? new licenseList()[this.license]
        : null;
    if (
      entry &&
      entry.tKey &&
      entry.name === this.licenseName &&
      this.t[entry.tKey]
    ) {
      return this.t[entry.tKey];
    }
    return this.licenseName;
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
globalThis.customElements.define(LicenseElement.tag, LicenseElement);
export { LicenseElement };
