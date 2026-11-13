/**
 * Copyright 2026 The Pennsylvania State University
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";

/**
 * `ai-usage-license`
 * `A simple way of applying a semantically accurate AI usage license (AIUL) to work.`
 *
 * @demo index.html
 * @element ai-usage-license
 */
class AiUsageLicense extends SchemaBehaviors(I18NMixin(DDDSuper(LitElement))) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          line-height: var(--ddd-lh-140);
          background-color: var(--ai-usage-license-background-color);
        }
        /* "AI Usage License" uses the DDD eyebrow pattern (navigation
           font, bold, uppercase) as the first line of the card; real
           text so it is translated and read in order */
        .license-label {
          display: block;
          margin: 0 0 var(--ddd-spacing-3);
          font-family: var(--ddd-eyebrow-font-family);
          font-size: var(--ddd-eyebrow-font-size);
          font-weight: var(--ddd-eyebrow-font-weight);
          letter-spacing: var(--ddd-eyebrow-letter-spacing);
          line-height: var(--ddd-eyebrow-line-height);
          text-transform: var(--ddd-eyebrow-text-transform);
          color: var(--ddd-eyebrow-color);
        }
        /* light-dark() follows the page or theme color scheme (DDD sets
           light dark on :root, body.dark-mode forces dark) */
        .license-body {
          padding: var(--ddd-spacing-6) var(--ddd-spacing-8);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneMaxLight)
          );
        }
        a,
        a:any-link,
        a:-webkit-any-link {
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
          font-weight: var(--ddd-font-weight-bold);
        }
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        /* one link: the DDD badge followed by the license name, so the
           tag is shown once and the link text matches license-element */
        .license-badge {
          display: inline-flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1) var(--ddd-spacing-3);
          max-width: 100%;
          text-decoration: none;
        }
        .license-badge:hover .license-link,
        .license-badge:focus-visible .license-link {
          text-decoration: underline;
        }
        .license-link {
          font-style: italic;
          text-decoration: underline;
        }
        /* the AIUL code drawn with DDD tokens in place of the third-party
           badge art: navy outline in light, pugh blue in dark */
        .license-chip {
          display: inline-flex;
          align-items: stretch;
          border: var(--ddd-border-sm);
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-pughBlue)
          );
          border-radius: var(--ddd-radius-xs);
          overflow: hidden;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-style: normal;
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          white-space: nowrap;
        }
        .license-tag,
        .license-modifier {
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
        }
        .license-tag {
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .license-modifier {
          background-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-pughBlue)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
        }
        .license-description {
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-4xs);
        }
      `,
    ];
  }

  render() {
    const badge = this._badgeParts();
    return html`
      <meta property="oer:uri" content="${this.uri || this.licenseLink}" />
      <div class="license-body">
        <p class="license-label">${this.t.aiUsageLicense}</p>
        ${
          this.licenseTag
            ? html`<a
                class="license-badge"
                target="_blank"
                href="${this.licenseLink}"
                rel="noopener noreferrer"
                aria-label="${this.t.licenseNameLabel.replace("{license}", () =>
                  `${this.licenseTag} ${this.licenseName || ""}`.trim(),
                )}"
                ><span class="license-chip"
                  ><span class="license-tag">${badge.tag}</span>${
                    badge.modifier
                      ? html`<span class="license-modifier"
                          >${badge.modifier}</span
                        >`
                      : ``
                  }</span
                >${
                  this.licenseName
                    ? html`<span class="license-link"
                        >${this.licenseName}</span
                      >`
                    : ``
                }</a
              >`
            : ``
        }
        ${
          this.licenseDescription
            ? html`<div class="license-description">
                ${this.licenseDescription}
              </div>`
            : ``
        }
      </div>
    `;
  }

  /**
   * Split licenseTag ("AIUL-CD" or "AIUL-CD-IM") into the license part and
   * the media modifier part drawn as the two halves of the badge.
   */
  _badgeParts() {
    const tag = this.licenseTag || "";
    const suffix = this.modifier ? `-${this.modifier}` : "";
    if (suffix && tag.endsWith(suffix) && tag.length > suffix.length) {
      return { tag: tag.slice(0, -suffix.length), modifier: this.modifier };
    }
    return { tag: tag, modifier: null };
  }

  static get tag() {
    return "ai-usage-license";
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      /**
       * License code shorthand, e.g. "NA", "WA", "CD", "TC", "DP", "IU".
       */
      license: {
        type: String,
      },
      /**
       * Optional media modifier code, e.g. "3D", "AU", "CO", "IM", "MX", "TR", "VD", "WR".
       */
      modifier: {
        type: String,
      },
      /**
       * Full license name, calculated from the license property.
       */
      licenseName: {
        type: String,
        attribute: "license-name",
      },
      /**
       * URL of the official AIUL badge art for this license. Kept as data
       * for integrations; the element draws its own DDD badge instead.
       */
      licenseImage: {
        type: String,
        attribute: "license-image",
      },
      /**
       * License details link.
       */
      licenseLink: {
        type: String,
        attribute: "license-link",
      },
      /**
       * License description text.
       */
      licenseDescription: {
        type: String,
        attribute: "license-description",
      },
      /**
       * The full AIUL tag code, e.g. "AIUL-NA" or "AIUL-CD-IM".
       */
      licenseTag: {
        type: String,
        attribute: "license-tag",
      },
      /**
       * OER Schema: URI for the AI Usage License (AIUL) reference page/code.
       * Falls back to licenseLink when not explicitly set.
       * NOTE: The v1.2.0 aiUsageConstraint property (domain [Task]) is not
       * emitted here because this element is a SupportingMaterial badge,
       * not a Task. aiUsageConstraint resolves once the vocab is integrated.
       */
      uri: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      aiUsageLicense: "AI Usage License",
      licenseNameLabel: "{license} - AI Usage License",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/ai-usage-license.en.json", import.meta.url).href +
        "/../",
    });
    this.typeof = "oer:SupportingMaterial";
    this.license = null;
    this.modifier = null;
    this.licenseName = null;
    this.licenseImage = null;
    this.licenseLink = null;
    this.licenseDescription = null;
    this.licenseTag = null;
    this.uri = null;
    this.__aiulDataPromise = null;
    this._setAIULData();
  }

  async _setAIULData() {
    // Fetch the AIUL license and modifier data once and cache it.
    if (this._aiulData) {
      return this._aiulData;
    }
    if (!this.__aiulDataPromise) {
      this.__aiulDataPromise = fetch(
        new URL("./lib/v1.json", import.meta.url).href,
      )
        .then((r) => r.json())
        .then((data) => {
          this._aiulData = data;
          return data;
        })
        .catch((e) => {
          console.warn(e);
          return null;
        });
    }
    return this.__aiulDataPromise;
  }

  _getHaxSelectOptions() {
    let licenseOptions = {};
    let modifierOptions = { "": "No modifier" };
    if (this._aiulData && this._aiulData.licenses && this._aiulData.modifiers) {
      for (const lic of this._aiulData.licenses) {
        licenseOptions[lic.code] = lic.fullName;
      }
      for (const mod of this._aiulData.modifiers) {
        modifierOptions[mod.code] = mod.title;
      }
    }
    return {
      licenseOptions,
      modifierOptions,
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "license" || propName === "modifier") {
        this._licenseUpdated(this.license, this.modifier);
      }
    });
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }

  /**
   * @see haxHooks: gizmoRegistration
   * Register haxProperties locales so the HAX editor UI can be translated
   */
  haxgizmoRegistration(_store) {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: `ai-usage-license.haxProperties`,
          localesPath: new URL(`./locales`, import.meta.url).href,
        },
      }),
    );
  }

  async haxsetupActiveElementForm(props) {
    await this._setAIULData();
    const options = this._getHaxSelectOptions();
    props.settings.configure.forEach((attr, index) => {
      if (attr.property === "license") {
        props.settings.configure[index].options = options.licenseOptions;
      }
      if (attr.property === "modifier") {
        props.settings.configure[index].options = options.modifierOptions;
      }
    });
  }

  static get haxProperties() {
    return {
      canScale: false,
      canEditSource: true,
      gizmo: {
        title: "AI Usage License",
        description: "Display an AI Usage License (AIUL) badge for your work",
        icon: "hardware:memory",
        color: "grey",
        tags: ["Content", "ai", "license", "aiul", "ai-usage", "attribution"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "license",
            title: "License",
            description:
              "The AI usage license level for this work. See https://dmd-program.github.io/aiul/ for details.",
            inputMethod: "select",
            options: {},
            icon: "hardware:memory",
          },
          {
            property: "modifier",
            title: "Media Modifier",
            description:
              "Optional media domain modifier. Specifies the type of media this license applies to.",
            inputMethod: "select",
            options: {
              "": "No modifier",
            },
            icon: "image:photo",
          },
          {
            property: "uri",
            title: "AIUL URI (OER Schema)",
            description:
              "OER Schema: URI for the AI Usage License reference page. Auto-populated from the license link when not set.",
            inputMethod: "textfield",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "ai-usage-license",
          properties: {
            license: "CD",
            modifier: "IM",
          },
          content: "",
        },
      ],
    };
  }

  /**
   * Fetch license and modifier data from the AIUL API then update reactive
   * properties so the element re-renders with the correct badge.
   */
  async _licenseUpdated(license, modifier) {
    if (!license) return;
    await this._setAIULData();
    if (
      !this._aiulData ||
      !this._aiulData.licenses ||
      !this._aiulData.modifiers
    ) {
      return;
    }
    const licenseEntry = this._aiulData.licenses.find(
      (l) => l.code === license,
    );
    if (!licenseEntry) return;
    const modifierEntry = modifier
      ? this._aiulData.modifiers.find((m) => m.code === modifier)
      : null;

    // Build the full AIUL tag string (e.g. "AIUL-CD" or "AIUL-CD-IM")
    this.licenseTag = modifierEntry
      ? `AIUL-${license}-${modifier}`
      : `AIUL-${license}`;

    this.licenseName = modifierEntry
      ? `${licenseEntry.fullName} / ${modifierEntry.title}`
      : licenseEntry.fullName;

    this.licenseLink = modifierEntry
      ? `https://dmd-program.github.io/aiul/combinations/${license.toLowerCase()}-${modifier.toLowerCase()}.html`
      : licenseEntry.url;

    if (modifierEntry) {
      // Look up the pre-generated combination image from the API
      const combo = this._aiulData.combinations
        ? this._aiulData.combinations.find(
            (c) => c.license.code === license && c.modifier.code === modifier,
          )
        : null;
      this.licenseImage = combo ? combo.image : licenseEntry.image;
    } else {
      this.licenseImage = licenseEntry.image;
    }
  }
}

globalThis.customElements.define(AiUsageLicense.tag, AiUsageLicense);
export { AiUsageLicense };
