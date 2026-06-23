/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDVariables } from "@haxtheweb/d-d-d/lib/DDDStyles.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

/**
 * `resume-theme`
 * A single-page résumé theme for HAXcms, inspired by https://demo-resume.netlify.app/
 * @demo index.html
 * @element resume-theme
 */
export class ResumeTheme extends DDDSuper(HAXCMSLitElementTheme) {

  static get tag() {
    return "resume-theme";
  }

  constructor() {
    super();
    this.siteTitle = "";
    this.siteDescription = "";
    this.authorName = "";
    this.authorImage = "";
    this.authorEmail = "";
    this.authorPhone = "";
    this.authorLocation = "";
    this.authorWebsite = "";
    this.authorWebsite2 = "";
    this.authorSocialLink = "";
    this.authorSocialLink2 = "";
    this.manifest = {};
    this.activeItem = {};
    this.__disposer = this.__disposer || [];

    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          this.manifest = _mobx_val_0;
          if (this.manifest && this.manifest.metadata) {
            const site = this.manifest.metadata.site || {};
            const author = this.manifest.metadata.author || {};
            this.siteTitle = site.name || "";
            this.siteDescription = site.description || "";
            this.authorName = author.name || site.name || "";
            this.authorImage = author.image || "";
            this.authorEmail = author.email || "";
            this.authorPhone = author.phone || "";
            this.authorLocation = author.location || "";
            this.authorWebsite = author.website || "";
            this.authorWebsite2 = author.website2 || "";
            this.authorSocialLink = author.socialLink || "";
            this.authorSocialLink2 = author.socialLink2 || "";
          }
        });
      }),
    );
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.activeItem);
        Promise.resolve().then(() => {
          this.activeItem = _mobx_val_0;
        });
      }),
    );
  }

  static get properties() {
    return {
      ...super.properties,
      siteTitle: { type: String },
      siteDescription: { type: String },
      authorName: { type: String },
      authorImage: { type: String },
      authorEmail: { type: String },
      authorPhone: { type: String },
      authorLocation: { type: String },
      authorWebsite: { type: String },
      authorWebsite2: { type: String },
      authorSocialLink: { type: String },
      authorSocialLink2: { type: String },
      manifest: { type: Object },
      activeItem: { type: Object },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDVariables,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-primary);
          color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
          background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-potentialMidnight));
          min-height: 100vh;
          overflow-x: hidden;
        }

        .resume-layout {
          display: flex;
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        .sidebar {
          width: 30%;
          min-width: 280px;
          max-width: 400px;
          background-color: light-dark(var(--ddd-theme-default-nittanyNavy), var(--ddd-theme-default-navy80));
          color: var(--ddd-theme-default-white);
          padding: var(--ddd-spacing-12) var(--ddd-spacing-8) var(--ddd-spacing-12) var(--ddd-spacing-8);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          flex-shrink: 0;
          overflow: visible;
        }

        .avatar-wrapper {
          position: relative;
          width: 180px;
          height: 180px;
          margin-bottom: var(--ddd-spacing-6);
          z-index: 10;
          align-self: center;
        }

        .avatar-wrapper::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          border-radius: var(--ddd-radius-circle);
          border: 3px solid var(--ddd-theme-default-white);
          background: transparent;
          z-index: -1;
        }

        .avatar-wrapper::after {
          content: '';
          position: absolute;
          top: -14px;
          left: -14px;
          right: -14px;
          bottom: -14px;
          border-radius: var(--ddd-radius-circle);
          border: 1px solid var(--ddd-theme-default-pughBlue);
          background: transparent;
          opacity: 0.5;
          z-index: -2;
        }

        .avatar {
          display: block;
          width: 180px;
          height: 180px;
          border-radius: var(--ddd-radius-circle);
          object-fit: cover;
          border: 5px solid var(--ddd-theme-default-white);
          box-shadow: var(--ddd-boxShadow-sm);
          background-color: var(--ddd-theme-default-limestoneLight);
        }

        .avatar-placeholder {
          width: 180px;
          height: 180px;
          border-radius: var(--ddd-radius-circle);
          background-color: var(--ddd-theme-default-limestoneLight);
          border: 5px solid var(--ddd-theme-default-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--ddd-font-size-3xl);
          color: var(--ddd-theme-default-nittanyNavy);
          font-weight: var(--ddd-font-weight-bold);
          text-transform: uppercase;
          box-shadow: var(--ddd-boxShadow-sm);
        }

        .name {
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-2xl);
          font-weight: var(--ddd-font-weight-bold);
          margin: var(--ddd-spacing-4) 0 var(--ddd-spacing-2) 0;
          color: var(--ddd-theme-default-white);
          line-height: 1.2;
        }

        .subtitle {
          font-size: var(--ddd-font-size-s);
          color: var(--ddd-theme-default-pughBlue);
          margin-bottom: var(--ddd-spacing-8);
          font-weight: var(--ddd-font-weight-medium);
        }

        .contact-ring {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--ddd-spacing-3);
          margin-top: var(--ddd-spacing-4);
          padding: var(--ddd-spacing-4) 0;
        }

        .contact-ring::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 260px;
          height: 260px;
          border-radius: var(--ddd-radius-circle);
          border: 1px dashed var(--ddd-theme-default-beaver70);
          opacity: 0.3;
          pointer-events: none;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-xs);
          color: var(--ddd-theme-default-white);
          word-break: break-word;
          width: 100%;
          justify-content: flex-start;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-rounded);
          transition: background-color 0.2s ease;
        }

        .contact-item:hover {
          background-color: var(--ddd-theme-default-beaver70);
        }

        .contact-item a {
          color: var(--ddd-theme-default-white);
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .contact-item a:hover {
          color: var(--ddd-theme-default-pughBlue);
          text-decoration: underline;
        }

        .contact-icon {
          width: 36px;
          height: 36px;
          border-radius: var(--ddd-radius-circle);
          background-color: var(--ddd-theme-default-beaver70);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .contact-icon simple-icon-lite {
          --simple-icon-width: 18px;
          --simple-icon-height: 18px;
          color: var(--ddd-theme-default-pughBlue);
        }

        .contact-text {
          text-align: left;
          flex: 1;
        }

        .main-content {
          flex: 1;
          padding: var(--ddd-spacing-12) var(--ddd-spacing-10) var(--ddd-spacing-12) var(--ddd-spacing-16);
          background-color: light-dark(var(--ddd-theme-default-white), var(--ddd-theme-default-potentialMidnight));
          position: relative;
          z-index: 1;
        }

        .main-content h2,
        .main-content ::slotted(h2) {
          font-family: var(--ddd-font-secondary);
          font-size: var(--ddd-font-size-xl);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(var(--ddd-theme-default-nittanyNavy), var(--ddd-theme-default-white));
          margin: var(--ddd-spacing-8) 0 var(--ddd-spacing-4) 0;
          padding-bottom: var(--ddd-spacing-2);
          border-bottom: 2px solid light-dark(var(--ddd-theme-default-pughBlue), var(--ddd-theme-default-beaver70));
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .main-content h2:first-child,
        .main-content ::slotted(h2:first-child) {
          margin-top: 0;
        }

        .main-content h3,
        .main-content ::slotted(h3) {
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-bold);
          color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-white));
          margin: var(--ddd-spacing-6) 0 var(--ddd-spacing-2) 0;
        }

        .main-content p,
        .main-content ::slotted(p) {
          font-size: var(--ddd-theme-body-font-size);
          line-height: 1.7;
          color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-limestoneLight));
          margin: 0 0 var(--ddd-spacing-4) 0;
        }

        .main-content ul,
        .main-content ::slotted(ul) {
          margin: 0 0 var(--ddd-spacing-4) var(--ddd-spacing-6);
          padding: 0;
          list-style-type: disc;
        }

        .main-content li,
        .main-content ::slotted(li) {
          font-size: var(--ddd-theme-body-font-size);
          line-height: 1.7;
          color: light-dark(var(--ddd-theme-default-coalyGray), var(--ddd-theme-default-limestoneLight));
          margin-bottom: var(--ddd-spacing-2);
        }

        .main-content a,
        .main-content ::slotted(a) {
          color: light-dark(var(--ddd-theme-default-beaverBlue), var(--ddd-theme-default-pughBlue));
          text-decoration: none;
          font-weight: var(--ddd-font-weight-bold);
        }

        .main-content a:hover,
        .main-content ::slotted(a:hover) {
          text-decoration: underline;
        }

        @media (max-width: 960px) {
          .resume-layout {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            max-width: 100%;
            padding: var(--ddd-spacing-8) var(--ddd-spacing-6);
          }
          .avatar-wrapper {
            margin-top: 0;
          }
          .main-content {
            padding: var(--ddd-spacing-8) var(--ddd-spacing-6);
          }
        }

        @media print {
          .resume-layout {
            display: block;
          }
          .sidebar {
            width: 100%;
            max-width: 100%;
            background-color: var(--ddd-theme-default-nittanyNavy) !important;
            color: var(--ddd-theme-default-white) !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .main-content {
            width: 100%;
            padding: var(--ddd-spacing-6);
          }
          .contact-ring::before {
            display: none;
          }
        }
      `,
    ];
  }

  socialLinkIcon(url) {
    if (!url) return 'icons:launch';
    const lower = url.toLowerCase();
    if (lower.includes('linkedin.com')) return 'mdi-social:linkedin';
    if (lower.includes('github.com') || lower.includes('gitlab.com')) return 'mdi-social:github-circle';
    if (lower.includes('twitter.com') || lower.includes('x.com') || lower.includes('t.co')) return 'mdi-social:twitter';
    if (lower.includes('facebook.com') || lower.includes('fb.me')) return 'mdi-social:facebook';
    if (lower.includes('instagram.com')) return 'mdi-social:instagram';
    if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'mdi-social:youtube';
    if (lower.includes('tiktok.com')) return 'mdi-social:tiktok';
    return 'icons:launch';
  }

  socialLinkLabel(url) {
    if (!url) return 'Link';
    const lower = url.toLowerCase();
    if (lower.includes('linkedin.com')) return 'LinkedIn';
    if (lower.includes('github.com')) return 'GitHub';
    if (lower.includes('gitlab.com')) return 'GitLab';
    if (lower.includes('twitter.com') || lower.includes('x.com')) return 'X / Twitter';
    if (lower.includes('facebook.com')) return 'Facebook';
    if (lower.includes('instagram.com')) return 'Instagram';
    if (lower.includes('youtube.com')) return 'YouTube';
    if (lower.includes('tiktok.com')) return 'TikTok';
    return 'Social';
  }

  renderSocialLink(url) {
    if (!url) return '';
    return html`
      <div class="contact-item" part="contact-item">
        <div class="contact-icon"><simple-icon-lite icon="${this.socialLinkIcon(url)}"></simple-icon-lite></div>
        <div class="contact-text"><a href="${url}" target="_blank" rel="noopener noreferrer" part="contact-link">${this.socialLinkLabel(url)}</a></div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="resume-layout">
        <aside class="sidebar" part="sidebar">
          <div class="avatar-wrapper" part="avatar-wrapper">
            ${this.authorImage
              ? html`<img class="avatar" src="${this.authorImage}" alt="${this.authorName}" part="avatar" />`
              : html`<div class="avatar-placeholder" part="avatar" aria-label="${this.authorName}">
                  ${this.authorName
                    ? this.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    : "R"}
                </div>`}
          </div>
          <h1 class="name" part="name">${this.authorName}</h1>
          <p class="subtitle" part="subtitle">${this.siteDescription}</p>

          <div class="contact-ring" part="contact-ring">
            ${this.authorEmail
              ? html`<div class="contact-item" part="contact-item">
                  <div class="contact-icon"><simple-icon-lite icon="icons:mail"></simple-icon-lite></div>
                  <div class="contact-text"><a href="mailto:${this.authorEmail}" part="contact-link">${this.authorEmail}</a></div>
                </div>`
              : ""}
            ${this.authorPhone
              ? html`<div class="contact-item" part="contact-item">
                  <div class="contact-icon"><simple-icon-lite icon="icons:phone"></simple-icon-lite></div>
                  <div class="contact-text"><a href="tel:${this.authorPhone}" part="contact-link">${this.authorPhone}</a></div>
                </div>`
              : ""}
            ${this.authorLocation
              ? html`<div class="contact-item" part="contact-item">
                  <div class="contact-icon"><simple-icon-lite icon="icons:room"></simple-icon-lite></div>
                  <div class="contact-text"><span part="contact-text">${this.authorLocation}</span></div>
                </div>`
              : ""}
            ${this.authorWebsite
              ? html`<div class="contact-item" part="contact-item">
                  <div class="contact-icon"><simple-icon-lite icon="icons:language"></simple-icon-lite></div>
                  <div class="contact-text"><a href="${this.authorWebsite}" target="_blank" rel="noopener noreferrer" part="contact-link">${this.authorWebsite.replace(/^https?:\/\//, "")}</a></div>
                </div>`
              : ""}
            ${this.authorWebsite2
              ? html`<div class="contact-item" part="contact-item">
                  <div class="contact-icon"><simple-icon-lite icon="icons:language"></simple-icon-lite></div>
                  <div class="contact-text"><a href="${this.authorWebsite2}" target="_blank" rel="noopener noreferrer" part="contact-link">${this.authorWebsite2.replace(/^https?:\/\//, "")}</a></div>
                </div>`
              : ""}
            ${this.renderSocialLink(this.authorSocialLink)}
            ${this.renderSocialLink(this.authorSocialLink2)}
          </div>
        </aside>
        <main class="main-content" part="main-content" role="main">
          <section id="contentcontainer">
            <div id="slot">
              <slot></slot>
            </div>
          </section>
        </main>
      </div>
    `;
  }

  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(ResumeTheme.tag, ResumeTheme);
