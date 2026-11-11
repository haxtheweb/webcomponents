import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import { licenseList } from "@haxtheweb/license-element/license-element.js";
import { generateResourceID } from "@haxtheweb/utils/lib/ids.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `citation-element`
 * An element dedicated to presenting and managing a correct citation on the web
 * both visually as well as semantically with simple inputs.
 * @demo demo/index.html
 * @element citation-element
 */
class CitationElement extends I18NMixin(SchemaBehaviors(DDDSuper(LitElement))) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        /* footnote mode collapses fully; the RDFa meta elements and the
           document head links are still written */
        :host([display-method="footnote"]) {
          display: none;
        }
        :host([display-method="popup"]) {
          display: block;
        }
        .source-line {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-3);
          margin-bottom: var(--ddd-spacing-2);
          padding-top: var(--ddd-spacing-3);
          border-top: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-150);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          margin-top: var(--ddd-spacing-0);
          border-radius: var(--ddd-radius-circle);
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        cite {
          display: block;
          flex: 1 1 auto;
          min-width: 0;
          font-style: normal;
          overflow-wrap: anywhere;
        }
        a {
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          font-weight: var(--ddd-font-weight-bold);
          text-decoration: none;
        }
        a:hover,
        a:focus-visible {
          text-decoration: underline;
        }
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* the licence link is regular weight, so an underline (not colour
           alone) tells it apart from the muted text around it */
        a.license-link {
          font-weight: var(--ddd-font-weight-regular);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 0.2em;
        }
        .license-link img {
          margin-inline-end: var(--ddd-spacing-1);
          vertical-align: middle;
        }
        .license-badge {
          display: inline-flex;
          align-items: center;
          margin-inline-end: var(--ddd-spacing-1);
          padding: 0 var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-150);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          vertical-align: baseline;
        }
      `,
    ];
  }
  /**
   * LitElement render
   */
  render() {
    const showImage = Boolean(this.licenseImage) && !this._licenseImageFailed;
    const badge = showImage ? "" : this._licenseBadgeText();
    return html`
      <meta
        about="${this.relatedResource}"
        property="cc:attributionUrl"
        content="${this.source}"
      />
      <meta
        about="${this.relatedResource}"
        property="cc:attributionName"
        typeof="${this.typeof}"
        content="${this.title}"
      />
      <meta
        about="${this.relatedResource}"
        property="oer:uri"
        content="${this.source}"
      />
      <meta
        rel="cc:license"
        href="${this.licenseLink}"
        content="License: ${this.licenseName}"
      />
      <div class="source-line">
        <span class="chip" aria-hidden="true"
          ><simple-icon-lite icon="editor:format-quote"></simple-icon-lite
        ></span>
        <cite
          >${this._fillTemplate(
            this.licenseName
              ? this.t.citationWithLicense
              : this.t.citationWithoutLicense,
            {
              title: html`<a
                target="_blank"
                rel="noopener noreferrer"
                class="title-link"
                href="${this.source}"
                property="oer:name"
                content="${this.title}"
                >${this.title}</a
              >`,
              creator: this.creator,
              license: html`<a
                class="license-link"
                rel="noopener noreferrer"
                target="_blank"
                href="${this.licenseLink}"
                ><img
                  loading="lazy"
                  alt="${this.t.licenseGraphic.replace("{license}", () =>
                    this._licenseDisplayName(),
                  )}"
                  src="${this.licenseImage}"
                  ?hidden="${!showImage}"
                  width="44px"
                  height="16px"
                  @error="${this._licenseImageError}"
                />${
                  badge ? html`<span class="license-badge">${badge}</span>` : ""
                }${this._licenseDisplayName()}</a
              >`,
              date: html`<span class="access-date">${this.date}</span>`,
            },
          )}</cite
        >
      </div>
    `;
  }
  /**
   * the licence graphic failed to load; show the text badge instead of a
   * broken image
   */
  _licenseImageError() {
    if (this.licenseImage) {
      this._licenseImageFailed = true;
    }
  }
  /**
   * short text for the licence badge shown when there is no licence
   * graphic, e.g. "CC BY" or "CC0"; empty when the licence is unknown
   */
  _licenseBadgeText() {
    const code = typeof this.license === "string" ? this.license.trim() : "";
    const entry = code ? new licenseList()[code] : null;
    if (!entry) {
      return "";
    }
    if (entry.group === "creative-commons") {
      return "CC " + code.toUpperCase();
    }
    if (code === "pdm") {
      return "PD";
    }
    return code.toUpperCase();
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
  /**
   * convention
   */
  static get tag() {
    return "citation-element";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      citationWithLicense:
        "{title} by {creator}, licensed under {license}. Accessed {date}.",
      citationWithoutLicense: "{title} by {creator}. Accessed {date}.",
      licenseGraphic: "{license} graphic",
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
    this.scope = "sibling";
    this.source = "";
    this.typeof = "oer:ReferencedMaterial";
  }
  /**
   * LitElement properties changed
   */
  willUpdate(changedProperties) {
    if (super.willUpdate) super.willUpdate(changedProperties);
    // Derive relatedResource from scope, and licenseName/licenseLink/
    // licenseImage from license, in willUpdate so reactive sets batch
    // into the current update cycle. Setting them in updated() scheduled
    // a redundant second update (Lit change-in-update warning). The DOM
    // side-effects of _scopeChanged (setAttribute on siblings/parents)
    // are safe pre-render since the element is connected by willUpdate.
    if (changedProperties.has("scope")) {
      this._scopeChanged(this.scope);
    }
    if (changedProperties.has("license")) {
      this._licenseUpdated(this.license);
    }
    // a new licence graphic gets a fresh chance to load
    if (
      changedProperties.has("licenseImage") ||
      changedProperties.has("license")
    ) {
      this._licenseImageFailed = false;
    }
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (["relatedResource", "licenseLink"].includes(propName)) {
        this._aboutLink = this._generateAboutLink(
          this.relatedResource,
          this.licenseLink,
        );
      }
      if (propName == "source") {
        this._licenseLink = this._generateLicenseLink(this.source);
      }
    });
  }
  /**
   * LitElement / popular convention
   */
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
       * License scope
       */
      scope: {
        type: String,
      },
      /**
       * How to present the citation on the interface.
       * Can be popup, footnote, or default behavior which is visible
       */
      displayMethod: {
        type: String,
        reflect: true,
        attribute: "display-method",
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
       * Date the work was accessed.
       */
      date: {
        type: String,
      },
      /**
       * License name, calculated or supplied by the end user if we don't have them.
       */
      licenseName: {
        type: String,
        attribute: "license-name",
      },
      /**
       * License link for more details
       */
      licenseLink: {
        type: String,
        attribute: "license-link",
      },
      /**
       * License image URL, calculated when a known license is applied.
       */
      licenseImage: {
        type: String,
        attribute: "license-image",
      },
      /**
       * License short hand. Options cc0,
       */
      license: {
        type: String,
      },
      /**
       * OER Schema class for the cited work (default oer:ReferencedMaterial).
       * Authors can override via the HAX editor to use a more specific OER class.
       */
      typeof: {
        type: String,
      },
      /**
       * Related resource id used to bind the citation to a sibling or parent.
       * Calculated by `_scopeChanged`; declared here so reactive updates and
       * `updated()` react to it via Lit.
       */
      relatedResource: {
        type: String,
        attribute: "related-resource",
      },
      /**
       * the licence graphic failed to load, so the text badge shows
       */
      _licenseImageFailed: {
        type: Boolean,
        state: true,
      },
    };
  }
  /**
   * Generate a license link whenever we have a source
   * @param {href} source
   */
  _generateLicenseLink(source) {
    // remove existing if this is moving around
    if (this._licenseLink) {
      globalThis.document.head.removeChild(this._licenseLink);
    }
    let link = globalThis.document.createElement("link");
    link.setAttribute("typeof", "resource");
    link.setAttribute("rel", "license");
    link.setAttribute("src", source);

    globalThis.document.head.appendChild(link);
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
      globalThis.document.head.removeChild(this._aboutLink);
    }
    let link = globalThis.document.createElement("link");
    link.setAttribute("about", relatedResource);
    link.setAttribute("property", "cc:license");
    link.setAttribute("content", licenseLink);
    globalThis.document.head.appendChild(link);
    return link;
  }
  /**
   * Notice scope change.
   */
  _scopeChanged(newValue) {
    // make sure we actually have a sibling first
    if (newValue === "sibling" && this.previousElementSibling) {
      // find the sibling element in the DOM and associate to it's resource ID
      // also generate a resource ID if it doesn't have one
      if (this.previousElementSibling.getAttribute("resource")) {
        this.relatedResource =
          this.previousElementSibling.getAttribute("resource");
      } else {
        let uuid = generateResourceID();
        this.relatedResource = uuid;
        this.previousElementSibling.setAttribute("resource", uuid);
      }
      // set prefix on the main element itself
      this.previousElementSibling.setAttribute(
        "prefix",
        this.getAttribute("prefix"),
      );
    } else if (newValue === "parent") {
      // find the parent and associate to it's resource ID, if it doesn't have one
      // then let's make one dynamically
      if (this.parentNode.getAttribute("resource")) {
        this.relatedResource = this.parentNode.getAttribute("resource");
      } else {
        let uuid = generateResourceID();
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
      canEditSource: true,
      gizmo: {
        title: "Citation",
        description: "Citation element with three presentation modes.",
        icon: "editor:title",
        color: "grey",
        tags: [
          "Text",
          "content",
          "citation",
          "reference",
          "cc0",
          "cc-by",
          "cc-by-sa",
          "cc-by-nd",
          "cc-by-nc",
          "cc-by-nc-sa",
          "cc-by-nc-nd",
        ],
        handles: [
          {
            type: "citation",
            source: "source",
            title: "title",
            author: "creator",
            license: "license",
            accessDate: "date",
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
            description: "Source URL for the cited work.",
            inputMethod: "textfield",
            icon: "link",
            validationType: "url",
          },
          {
            property: "date",
            title: "Date accessed",
            description: "Date the source was accessed.",
            inputMethod: "textfield",
            icon: "link",
          },
          {
            property: "scope",
            title: "Scope",
            description: "Element scope to cite.",
            inputMethod: "select",
            options: {
              sibling: "Sibling element",
              parent: "Parent element",
            },
            icon: "code",
          },
          {
            property: "license",
            title: "License",
            description: "License for the cited work.",
            inputMethod: "select",
            options: new licenseList("select"),
            icon: "link",
          },
          {
            property: "creator",
            title: "Creator",
            description: "Creator or owner of the cited work.",
            inputMethod: "textfield",
            icon: "link",
          },
          {
            property: "typeof",
            title: "OER Schema type",
            description:
              "OER Schema class for this citation. Defaults to oer:ReferencedMaterial; override only with a valid OER class (e.g. oer:SupportingMaterial).",
            inputMethod: "textfield",
            icon: "code",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "citation-element",
          properties: {
            creator: "Cool Joe",
            license: "by",
            title: "Te Futr Da Biz",
            source: "https://duckduckgo.com/",
            date: "03/07/2020",
          },
          content: "",
        },
      ],
    };
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
    if (typeof newValue !== typeof undefined) {
      let list = new licenseList();
      if (typeof list[newValue] !== typeof undefined) {
        this.licenseName = list[newValue].name;
        this.licenseLink = list[newValue].link;
        this.licenseImage = list[newValue].image;
      }
    }
  }
}
globalThis.customElements.define(CitationElement.tag, CitationElement);
export { CitationElement };
