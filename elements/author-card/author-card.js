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
    // Set default accent and primary values
    this.accentColor = "blue";
    this.primaryColor = "blue";
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
      accentColor: { type: String, attribute: "accent-color", reflect: true },
      primaryColor: { type: String, attribute: "primary-color", reflect: true },
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
        
        /* Theme variables with light-dark support */
        --author-card-background: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-coalyGray));
        --author-card-color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
        --author-card-border: light-dark(var(--ddd-theme-default-limestoneGray), var(--ddd-theme-default-slateGray));
        --author-card-job-title-color: light-dark(var(--ddd-theme-default-slateGray), var(--ddd-theme-default-slateLight));
        --author-card-link-color: light-dark(var(--ddd-theme-default-link), var(--ddd-theme-default-linkLight));
        --author-card-link-hover-color: light-dark(var(--ddd-theme-default-linkHover), var(--ddd-theme-default-linkHoverLight));
        --author-card-border-radius: var(--ddd-radius-sm);
        --author-card-image-size: 64px;
      }

      /* Override for explicit dark mode */
      :host([dark]) {
        --author-card-background: var(--ddd-theme-default-coalyGray);
        --author-card-color: var(--ddd-theme-default-white);
        --author-card-border: var(--ddd-theme-default-slateGray);
        --author-card-job-title-color: var(--ddd-theme-default-slateLight);
        --author-card-link-color: var(--ddd-theme-default-linkLight);
        --author-card-link-hover-color: var(--ddd-theme-default-linkHoverLight);
      }

      /* Primary color for main border */
      :host([data-primary]) {
        --author-card-border: var(--ddd-theme-primary);
      }
      
      /* Accent color variations */
      :host([data-accent]) {
        --author-card-accent-border: var(--ddd-theme-accent);
      }

      .author {
        background: var(--author-card-background);
        color: var(--author-card-color);
        border-radius: var(--author-card-border-radius);
        border: var(--ddd-border-xs);
        border-color: var(--author-card-border);
        padding: var(--ddd-spacing-4);
      }

      /* Accent color styling */
      :host([data-accent]) .author {
        border-left: var(--ddd-border-lg);
        border-left-color: var(--ddd-theme-accent);
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
        color: var(--author-card-job-title-color);
        margin: 0 0 var(--ddd-spacing-2);
      }

      .bio {
        font-size: var(--ddd-font-size-sm);
        line-height: var(--ddd-lh-150);
        margin: 0 0 var(--ddd-spacing-2);
      }

      a.link {
        display: inline-flex;
        align-items: center;
        font-size: var(--ddd-font-size-sm);
        text-decoration: none;
        color: var(--author-card-link-color);
        transition: color 0.2s ease;
        background-color: transparent;
      }

      a.link:hover,
      a.link:focus {
        color: var(--author-card-link-hover-color);
        text-decoration: underline;
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