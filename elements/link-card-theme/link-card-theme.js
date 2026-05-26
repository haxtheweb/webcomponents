/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { css, html } from "lit";
import { ifDefined } from "lit/directives/if-defined.js";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSThemeParts } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSThemeParts.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDVariables,
  DDDPaletteStyles,
} from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";

/**
 * @title Link Card
 * `Single-page profile + link hub theme for HAXcms`
 * @haxcms-theme-priority -6
 * @haxcms-theme-category Website
 * @demo index.html
 * @element link-card-theme
 */
export class LinkCardTheme extends HAXCMSThemeParts(
  DDDSuper(HAXCMSLitElementTheme),
) {
  static get tag() {
    return "link-card-theme";
  }

  constructor() {
    super();
    this.manifest = {};
    this.linkItems = [];
    this.socialItems = [];
    this.profileImage = "";
    this.profileName = "My profile";
    this.profileDescription = "";
    const storedPalette = UserScaffoldInstance.readMemory("HAXCMSSitePalette");
    this.dataPalette =
      storedPalette === null || storedPalette === ""
        ? "0"
        : String(storedPalette);
    this.__disposer = this.__disposer || [];
    this.__disposer.push(
      autorun(() => {
        this.manifest = toJS(store.manifest) || {};
        this._syncManifestData();
      }),
    );
  }

  static get properties() {
    return {
      ...super.properties,
      manifest: { type: Object },
      linkItems: { type: Array },
      socialItems: { type: Array },
      profileImage: { type: String, attribute: "profile-image" },
      profileName: { type: String, attribute: "profile-name" },
      profileDescription: { type: String, attribute: "profile-description" },
      dataPalette: { type: String, reflect: true, attribute: "data-palette" },
    };
  }

  static get styles() {
    return [
      DDDVariables,
      DDDPaletteStyles,
      super.styles,
      css`
        :host {
          display: block;
          min-height: 100vh;
          --link-card-shell-bg: var(--ddd-palette-color-2);
          --link-card-shell-text: #000000;
          --link-card-card-bg: var(--ddd-theme-default-white);
          --link-card-card-text: #000000;
          --link-card-button-bg: var(--ddd-palette-color-1);
          --link-card-button-hover-bg: var(--ddd-palette-color-3);
          --link-card-button-text: light-dark(black, white);
          --link-card-button-hover-text: var(--link-card-button-text);
          --link-card-outline: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-palette-color-5)
          );
        }
        @media (prefers-color-scheme: dark) {
          :host {
            --link-card-shell-bg: var(--ddd-palette-color-6);
            --link-card-shell-text: #ffffff;
            --link-card-card-bg: var(--ddd-theme-default-coalyGray);
            --link-card-card-text: #ffffff;
            --link-card-button-bg: var(--ddd-palette-color-7);
            --link-card-button-hover-bg: var(--ddd-palette-color-5);
            --link-card-button-hover-text: var(--link-card-button-text);
          }
        }
        :host([dark-mode]) {
          --link-card-shell-bg: var(--ddd-palette-color-6);
          --link-card-shell-text: #ffffff;
          --link-card-card-bg: var(--ddd-theme-default-coalyGray);
          --link-card-card-text: #ffffff;
          --link-card-button-bg: var(--ddd-palette-color-7);
          --link-card-button-hover-bg: var(--ddd-palette-color-5);
          --link-card-button-hover-text: var(--link-card-button-text);
        }
        :host([data-palette="0"]),
        :host([data-palette="1"]),
        :host([data-palette="2"]),
        :host([data-palette="3"]),
        :host([data-palette="5"]),
        :host([data-palette="8"]),
        :host([data-palette="11"]),
        :host([data-palette="15"]) {
          --link-card-button-hover-text: light-dark(white, black);
        }
        :host([data-palette="10"]) {
          --link-card-button-hover-text: white;
        }

        .theme-shell {
          min-height: 100vh;
          padding: var(--ddd-spacing-8) var(--ddd-spacing-4);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-6);
          background-color: var(--link-card-shell-bg);
          color: var(--link-card-shell-text);
        }
        .card {
          width: min(100%, 620px);
          border: var(--ddd-border-sm) solid var(--link-card-outline);
          border-radius: var(--ddd-radius-xl);
          box-shadow: var(--ddd-boxShadow-sm);
          padding: var(--ddd-spacing-8) var(--ddd-spacing-6);
          box-sizing: border-box;
          background-color: var(--link-card-card-bg);
          color: var(--link-card-card-text);
          text-align: center;
        }
        .profile-image {
          width: var(--ddd-spacing-30);
          height: var(--ddd-spacing-30);
          object-fit: cover;
          object-position: center;
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-sm) solid var(--link-card-outline);
          box-shadow: var(--ddd-boxShadow-xs);
        }
        .profile-image-fallback {
          width: var(--ddd-spacing-30);
          height: var(--ddd-spacing-30);
          margin: 0 auto;
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-sm) solid var(--link-card-outline);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--link-card-card-text);
        }
        .profile-image-fallback simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-3xl);
          --simple-icon-height: var(--ddd-icon-3xl);
        }
        h1 {
          margin: var(--ddd-spacing-4) 0 var(--ddd-spacing-2);
          font-size: clamp(
            var(--ddd-font-size-l),
            5vw,
            var(--ddd-font-size-xl)
          );
          font-family: var(--ddd-font-navigation, sans-serif);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1.2;
        }
        .description {
          margin: 0 0 var(--ddd-spacing-5);
          font-size: var(--ddd-font-size-s);
          line-height: 1.5;
          color: var(--link-card-card-text);
        }
        .primary-links {
          display: grid;
          gap: var(--ddd-spacing-3);
        }
        .link-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: var(--ddd-spacing-3) var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-pill);
          border: var(--ddd-border-sm) solid var(--link-card-outline);
          font-size: var(--ddd-font-size-s);
          font-family: var(--ddd-font-navigation, sans-serif);
          font-weight: var(--ddd-font-weight-bold);
          text-decoration: none;
          color: var(--link-card-button-text);
          background-color: var(--link-card-button-bg);
          box-shadow: var(--ddd-boxShadow-xs);
          transition:
            transform 0.2s ease,
            background-color 0.2s ease;
        }
        .link-button:hover,
        .link-button:focus-visible {
          transform: translateY(-1px);
          background-color: var(--link-card-button-hover-bg);
          color: var(--link-card-button-hover-text);
          text-decoration: none;
        }
        .link-button:focus-visible,
        .social-link:focus-visible,
        .palette-picker:focus-visible {
          outline: var(--ddd-border-sm) solid
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-keystoneYellow)
            );
          outline-offset: var(--ddd-spacing-1);
        }
        .empty-state {
          margin: var(--ddd-spacing-2) 0 0;
          font-size: var(--ddd-font-size-xs);
          line-height: 1.5;
        }
        .social-links {
          list-style: none;
          margin: var(--ddd-spacing-6) 0 0;
          padding: 0;
          display: flex;
          justify-content: center;
          gap: var(--ddd-spacing-3);
        }
        .social-link {
          width: var(--ddd-spacing-9);
          height: var(--ddd-spacing-9);
          border-radius: var(--ddd-radius-circle);
          border: var(--ddd-border-sm) solid var(--link-card-outline);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: var(--link-card-button-text);
          background-color: var(--link-card-button-bg);
          box-shadow: var(--ddd-boxShadow-xs);
          transition: background-color 0.2s ease;
        }
        .social-link:hover,
        .social-link:focus-visible {
          background-color: var(--link-card-button-hover-bg);
          color: var(--link-card-button-hover-text);
        }
        .social-link simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-sm);
          --simple-icon-height: var(--ddd-icon-sm);
        }
        .palette-picker {
          --simple-icon-button-border-radius: var(--ddd-radius-circle);
          --simple-icon-button-border: var(--ddd-border-sm) solid
            var(--link-card-outline);
          --simple-icon-button-color: var(--link-card-button-text);
          --simple-icon-button-background: var(--link-card-button-bg);
        }
        #contentcontainer {
          width: min(100%, 620px);
          box-sizing: border-box;
          border: var(--ddd-border-sm) dashed var(--link-card-outline);
          border-radius: var(--ddd-radius-md);
          padding: var(--ddd-spacing-4);
          background-color: var(--link-card-card-bg);
          color: var(--link-card-card-text);
        }
        .contrast-color-resolver {
          position: absolute;
          width: 0;
          height: 0;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
        }
        :host(:not([edit-mode])) #contentcontainer {
          display: none;
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has("dataPalette")) {
      UserScaffoldInstance.writeMemory(
        "HAXCMSSitePalette",
        this.dataPalette,
        "long",
      );
    }
  }

  _itemOrder(item) {
    if (!item || typeof item.order === "undefined" || item.order === null) {
      return 0;
    }
    const parsed = Number(item.order);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  _itemHidden(item) {
    if (!item || !item.metadata) {
      return false;
    }
    if (item.metadata.hideInMenu === true) {
      return true;
    }
    if (item.metadata.published === false) {
      return true;
    }
    return false;
  }

  _isExternalHref(href) {
    if (!href) {
      return false;
    }
    return /^https?:\/\//i.test(href);
  }

  _resolveItemHref(item) {
    if (!item) {
      return "";
    }
    let href = "";
    if (item.metadata && item.metadata.linkUrl) {
      href = `${item.metadata.linkUrl}`.trim();
    }
    if (href === "" && item.slug) {
      href = `${item.slug}`.trim();
    }
    if (href === "" && item.location) {
      href = `${item.location}`.trim();
    }
    return href;
  }

  _resolveTarget(item, href) {
    const allowedTargets = ["_self", "_blank", "_parent", "_top"];
    if (
      item &&
      item.metadata &&
      item.metadata.linkTarget &&
      allowedTargets.includes(item.metadata.linkTarget)
    ) {
      return item.metadata.linkTarget;
    }
    if (this._isExternalHref(href)) {
      return "_blank";
    }
    return "_self";
  }

  _detectSocialType(href) {
    if (!this._isExternalHref(href)) {
      return "";
    }
    const normalizedHref = href.toLowerCase();
    if (normalizedHref.indexOf("linkedin.com") !== -1) {
      return "linkedin";
    }
    if (
      normalizedHref.indexOf("x.com") !== -1 ||
      normalizedHref.indexOf("twitter.com") !== -1
    ) {
      return "x";
    }
    return "";
  }

  _socialIcon(type) {
    if (type === "linkedin") {
      return "mdi-social:linkedin";
    }
    return "mdi-social:twitter";
  }

  _socialLabel(type) {
    if (type === "linkedin") {
      return "LinkedIn";
    }
    return "X";
  }

  _socialAriaLabel(item) {
    const platform = this._socialLabel(item.socialType);
    if (item.title) {
      return `${item.title} on ${platform}`;
    }
    return `Open ${platform}`;
  }

  _syncManifestData() {
    const manifest =
      this.manifest && typeof this.manifest === "object" ? this.manifest : {};
    const metadata =
      manifest.metadata && typeof manifest.metadata === "object"
        ? manifest.metadata
        : {};
    const theme =
      metadata.theme && typeof metadata.theme === "object" ? metadata.theme : {};
    const variables =
      theme.variables && typeof theme.variables === "object"
        ? theme.variables
        : {};
    const author =
      metadata.author && typeof metadata.author === "object"
        ? metadata.author
        : {};
    const site =
      metadata.site && typeof metadata.site === "object" ? metadata.site : {};
    const items = Array.isArray(manifest.items) ? manifest.items : [];

    if (
      typeof variables.palette !== "undefined" &&
      variables.palette !== null &&
      `${variables.palette}`.trim() !== ""
    ) {
      this.dataPalette = `${variables.palette}`.trim();
    }

    this.profileName = manifest.title
      ? manifest.title
      : author.name
        ? author.name
        : site.name
          ? site.name
          : "My profile";
    this.profileDescription = manifest.description ? manifest.description : "";
    this.profileImage = variables.image
      ? variables.image
      : author.image
        ? author.image
        : site.logo
          ? site.logo
          : "";

    const topLevelVisible = items
      .filter((item) => item && item.parent === null && !this._itemHidden(item))
      .sort((a, b) => this._itemOrder(a) - this._itemOrder(b));

    const linkItems = [];
    const socialItems = [];
    topLevelVisible.forEach((item) => {
      const href = this._resolveItemHref(item);
      if (!href) {
        return;
      }
      const target = this._resolveTarget(item, href);
      const socialType = this._detectSocialType(href);
      const payload = {
        title: item.title ? item.title : href,
        href,
        target,
        rel: target === "_blank" ? "noopener noreferrer" : null,
        socialType,
      };
      if (socialType) {
        socialItems.push(payload);
      } else {
        linkItems.push(payload);
      }
    });

    this.linkItems = linkItems;
    this.socialItems = socialItems;
  }

  togglePalette() {
    let paletteValue = Number(this.dataPalette);
    if (Number.isNaN(paletteValue)) {
      paletteValue = 0;
    }
    paletteValue += 1;
    if (paletteValue > 11) {
      paletteValue = 0;
    }
    this.dataPalette = `${paletteValue}`;
  }

  testEditMode(e) {
    if (this.editMode) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    } else {
      e.currentTarget.blur();
    }
  }

  render() {
    const profileAlt = this.profileName
      ? `${this.profileName} profile image`
      : "Profile image";
    const profileLabel = this.profileName ? this.profileName : "Link card profile";
    return html`
      <div class="theme-shell">
        <span class="contrast-color-resolver" aria-hidden="true"></span>
        <simple-icon-button-lite
          class="palette-picker"
          icon="image:style"
          label="Change palette"
          title="Change palette"
          @click="${this.togglePalette}"
        ></simple-icon-button-lite>
        <main class="card" role="main" aria-label="${profileLabel}">
          ${this.profileImage
            ? html`<img
                class="profile-image"
                src="${this.profileImage}"
                alt="${profileAlt}"
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              />`
            : html`<div class="profile-image-fallback" aria-hidden="true">
                <simple-icon-lite icon="account-circle"></simple-icon-lite>
              </div>`}
          <h1>${this.profileName}</h1>
          ${this.profileDescription
            ? html`<p class="description">${this.profileDescription}</p>`
            : ``}
          <nav class="primary-links" aria-label="Primary links">
            ${this.linkItems.length > 0
              ? this.linkItems.map(
                  (item) => html`<a
                    class="link-button"
                    href="${item.href}"
                    target="${item.target}"
                    rel="${ifDefined(item.rel)}"
                    @click="${this.testEditMode}"
                    >${item.title}</a
                  >`,
                )
              : html`<p class="empty-state">
                  Add top-level menu items in site.json to render link buttons.
                </p>`}
          </nav>
          ${this.socialItems.length > 0
            ? html`<ul class="social-links" aria-label="Social links">
                ${this.socialItems.map(
                  (item) => html`<li>
                    <a
                      class="social-link"
                      href="${item.href}"
                      target="${item.target}"
                      rel="${ifDefined(item.rel)}"
                      @click="${this.testEditMode}"
                      aria-label="${this._socialAriaLabel(item)}"
                    >
                      <simple-icon-lite
                        icon="${this._socialIcon(item.socialType)}"
                      ></simple-icon-lite>
                    </a>
                  </li>`,
                )}
              </ul>`
            : ``}
        </main>
        <div id="contentcontainer">
          <div id="slot"><slot></slot></div>
        </div>
      </div>
    `;
  }

  disconnectedCallback() {
    if (this.__disposer) {
      this.__disposer.forEach((disposer) => {
        if (typeof disposer === "function") {
          disposer();
        }
      });
      this.__disposer = [];
    }
    if (this.__darkModeMediaQuery) {
      if (this.__darkModeMediaQuery.removeEventListener) {
        this.__darkModeMediaQuery.removeEventListener(
          "change",
          this.__onColorSchemeChange,
        );
      } else if (this.__darkModeMediaQuery.removeListener) {
        this.__darkModeMediaQuery.removeListener(this.__onColorSchemeChange);
      }
    }
    super.disconnectedCallback();
  }
}

globalThis.customElements.define(LinkCardTheme.tag, LinkCardTheme);