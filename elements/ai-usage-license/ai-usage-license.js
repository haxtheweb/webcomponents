import { LitElement, html, css } from "lit"
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js"
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js"

const AIUL_API = "https://dmd-program.github.io/aiul/api/v1.json"

// Module-level API data cache — populated on first fetch
let _aiulData = null
let _aiulFetchPromise = null

/**
 * Fetch and cache the AIUL API data (v1).
 * Only one network request is made regardless of how many elements are on the page.
 * @returns {Promise<Object>} Resolves with the full v1 API payload.
 */
export function fetchAiulData() {
  if (!_aiulFetchPromise) {
    _aiulFetchPromise = globalThis
      .fetch(AIUL_API)
      .then((r) => r.json())
      .then((data) => {
        _aiulData = data
        return data
      })
  }
  return _aiulFetchPromise
}

/**
 * Seed the module-level cache with pre-loaded data.
 * Intended for use in tests so network requests can be avoided.
 * @param {Object} data - An object with the same shape as the v1 API response.
 */
export function setAiulDataCache(data) {
  _aiulData = data
  _aiulFetchPromise = Promise.resolve(data)
}

// Kick off the fetch as soon as the module loads so data is available quickly.
fetchAiulData()

/**
 * `ai-usage-license`
 * `A simple way of applying a semantically accurate AI usage license (AIUL) to work.`
 * @demo demo/index.html
 * @element ai-usage-license
 */
class AiUsageLicense extends SchemaBehaviors(DDDSuper(LitElement)) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          line-height: var(--ddd-line-height-140);
          background-color: var(--ai-usage-license-background-color);
        }
        :host:after {
          content: "AI Usage License";
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
        .license-link {
          font-style: italic;
        }
        a,
        a:any-link,
        a:-webkit-any-link {
          color: var(--ddd-theme-default-link);
          font-weight: var(--ddd-font-weight-bold);
        }
        .license-badge img {
          margin: 0 var(--ddd-spacing-2) var(--ddd-spacing-2) 0;
          height: var(--ddd-icon-3xl);
          vertical-align: middle;
        }
        .license-tag {
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-s);
          letter-spacing: 0.05em;
        }
        .license-description {
          margin-top: var(--ddd-spacing-2);
          font-size: var(--ddd-font-size-s);
        }
      `,
    ]
  }

  render() {
    return html`
      <div class="license-body">
        ${this.licenseImage
          ? html`
              <a
                class="license-badge"
                target="_blank"
                href="${this.licenseLink}"
                rel="noopener noreferrer"
                aria-label="${this.licenseName} - AI Usage License"
                ><img
                  loading="lazy"
                  alt="${this.licenseTag} - ${this.licenseName}"
                  src="${this.licenseImage}"
              /></a>
            `
          : ``}
        <span class="license-tag"
          ><a
            class="license-link"
            target="_blank"
            href="${this.licenseLink}"
            rel="noopener noreferrer"
            >${this.licenseTag}</a
          ></span
        >
        ${this.licenseName
          ? html`<span> &mdash; ${this.licenseName}</span>`
          : ``}
        ${this.licenseDescription
          ? html`<div class="license-description">${this.licenseDescription}</div>`
          : ``}
      </div>
    `
  }

  static get tag() {
    return "ai-usage-license"
  }

  static get properties() {
    return {
      ...super.properties,
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
       * License badge image URL.
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
    }
  }

  constructor() {
    super()
    this.license = null
    this.modifier = null
    this.licenseName = null
    this.licenseImage = null
    this.licenseLink = null
    this.licenseDescription = null
    this.licenseTag = null
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "license" || propName === "modifier") {
        this._licenseUpdated(this.license, this.modifier)
      }
    })
  }

  static get haxProperties() {
    // Build select options from the API cache when available.
    // By the time an author opens the HAX settings panel the fetch will have
    // resolved, so the options will be populated correctly.
    const licenseOptions = {}
    const modifierOptions = { "": "No modifier" }
    if (_aiulData) {
      for (const lic of _aiulData.licenses) {
        licenseOptions[lic.code] = lic.fullName
      }
      for (const mod of _aiulData.modifiers) {
        modifierOptions[mod.code] = mod.title
      }
    }
    return {
      canScale: false,
      canEditSource: true,
      gizmo: {
        title: "AI Usage License",
        description: "Display an AI Usage License (AIUL) badge for your work",
        icon: "hardware:memory",
        color: "blue",
        tags: [
          "Other",
          "content",
          "ai",
          "license",
          "aiul",
          "ai-usage",
          "attribution",
        ],
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
            options: licenseOptions,
            icon: "hardware:memory",
          },
          {
            property: "modifier",
            title: "Media Modifier",
            description:
              "Optional media domain modifier. Specifies the type of media this license applies to.",
            inputMethod: "select",
            options: modifierOptions,
            icon: "image:photo",
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
    }
  }

  /**
   * Fetch license and modifier data from the AIUL API then update reactive
   * properties so the element re-renders with the correct badge.
   */
  _licenseUpdated(license, modifier) {
    if (!license) return
    fetchAiulData().then((data) => {
      const licenseEntry = data.licenses.find((l) => l.code === license)
      if (!licenseEntry) return

      const modifierEntry = modifier
        ? data.modifiers.find((m) => m.code === modifier)
        : null

      // Build the full AIUL tag string (e.g. "AIUL-CD" or "AIUL-CD-IM")
      this.licenseTag = modifierEntry
        ? `AIUL-${license}-${modifier}`
        : `AIUL-${license}`

      this.licenseName = modifierEntry
        ? `${licenseEntry.fullName} / ${modifierEntry.title}`
        : licenseEntry.fullName

      this.licenseLink = modifierEntry
        ? `https://dmd-program.github.io/aiul/combinations/${license.toLowerCase()}-${modifier.toLowerCase()}.html`
        : licenseEntry.url

      if (modifierEntry) {
        // Look up the pre-generated combination image from the API
        const combo = data.combinations
          ? data.combinations.find(
              (c) => c.license.code === license && c.modifier.code === modifier,
            )
          : null
        this.licenseImage = combo ? combo.image : licenseEntry.image
      } else {
        this.licenseImage = licenseEntry.image
      }
    })
  }
}

globalThis.customElements.define(AiUsageLicense.tag, AiUsageLicense)
export { AiUsageLicense }
