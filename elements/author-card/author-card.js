/**
 * Copyright 2025 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `author-card`
 * 
 * @demo index.html
 * @element author-card
 */
export class AuthorCard extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "author-card";
  }

  constructor() {
    super();
    this.name = "";
    this.title = "";
    this.description = "";
    this.image = "";
    this.profileUrl = "";
    this.socialLink = "";
    this.socialHandle = "";
    this.dark = false;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      visitProfile: "Visit profile",
      profileAlt: "Visit profile",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/author-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh", "pt", "bn", "ru", "fr", "ja"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      name: { type: String },
      title: { type: String },
      description: { type: String },
      image: { type: String },
      profileUrl: { type: String, attribute: "profile-url" },
      socialLink: { type: String, attribute: "social-link" },
      socialHandle: { type: String, attribute: "social-handle" },
      dark: { type: Boolean },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        margin: var(--ddd-spacing-4) 0;
        font-family: var(--ddd-font-primary);
        container-type: inline-size;
        
        /* Theme variables */
        --author-card-background: var(--ddd-theme-default-white);
        --author-card-color: var(--ddd-theme-default-coalyGray);
        --author-card-border-radius: var(--ddd-radius-sm);
        --author-card-image-size: 64px;
      }

      :host([dark]) {
        --author-card-background: var(--ddd-theme-default-coalyGray);
        --author-card-color: var(--ddd-theme-default-white);
      }

      .author {
        background: var(--author-card-background);
        color: var(--author-card-color);
        border-radius: var(--author-card-border-radius);
        border: var(--ddd-border-xs);
        padding: var(--ddd-spacing-4);
      }

      .inner {
        display: flex;
        gap: var(--ddd-spacing-4);
        align-items: flex-start;
      }

      .left {
        flex-shrink: 0;
      }

      .image {
        width: var(--author-card-image-size);
        height: var(--author-card-image-size);
        border-radius: 50%;
        object-fit: cover;
        display: block;
      }

      .right {
        flex: 1;
        min-width: 0;
      }

      .name {
        font-size: var(--ddd-font-size-ml);
        font-weight: var(--ddd-font-weight-medium);
        margin: 0 0 var(--ddd-spacing-1);
        color: inherit;
      }

      .job-title {
        font-size: var(--ddd-font-size-sm);
        color: var(--ddd-theme-default-slateGray);
        margin: 0 0 var(--ddd-spacing-2);
      }

      :host([dark]) .job-title {
        color: var(--ddd-theme-default-slateLight);
      }

      .bio {
        font-size: var(--ddd-font-size-sm);
        line-height: var(--ddd-lh-150);
        margin: 0 0 var(--ddd-spacing-2);
      }

      .link {
        display: inline-flex;
        align-items: center;
        font-size: var(--ddd-font-size-sm);
        text-decoration: none;
        color: var(--ddd-theme-default-link);
        transition: color 0.2s ease;
      }

      .link:hover,
      .link:focus {
        color: var(--ddd-theme-default-linkHover);
        text-decoration: underline;
      }

      :host([dark]) .link {
        color: var(--ddd-theme-default-linkLight);
      }

      :host([dark]) .link:hover,
      :host([dark]) .link:focus {
        color: var(--ddd-theme-default-linkHoverLight);
      }

      .profile-link {
        color: inherit;
        text-decoration: none;
      }

      .profile-link:hover,
      .profile-link:focus {
        text-decoration: underline;
      }

      /* Responsive behavior */
      @container (max-width: 320px) {
        .inner {
          flex-direction: column;
          text-align: center;
        }
        
        .image {
          align-self: center;
        }
      }
    `];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="author">
        <div class="inner">
          <div class="left">
            ${this.profileUrl ? html`<a href="${this.profileUrl}" class="profile-link">` : ''}
              ${this.image ? html`
                <img 
                  class="image" 
                  src="${this.image}" 
                  alt="${this.name}"
                  loading="lazy"
                />
              ` : ''}
            ${this.profileUrl ? html`</a>` : ''}
          </div>
          <div class="right">
            ${this.name ? html`
              ${this.profileUrl ? html`<a href="${this.profileUrl}" class="profile-link">` : ''}
                <p class="name">${this.name}</p>
              ${this.profileUrl ? html`</a>` : ''}
            ` : ''}
            
            ${this.title ? html`
              <p class="job-title">${this.title}</p>
            ` : ''}
            
            ${this.description ? html`
              <div class="bio">${this.description}</div>
            ` : ''}
            
            ${this.socialLink ? html`
              <a 
                class="link" 
                href="${this.socialLink}" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="${this.t.visitProfile} ${this.socialHandle || this.name}"
              >
                ${this.socialHandle || this.t.visitProfile} →
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(AuthorCard.tag, AuthorCard);