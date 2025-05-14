/**
 * Copyright 2025 Alexander Manbeck
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";

/**
 * `link-preview-card`
 *
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(LitElement) {
  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.image = "";
    this.link = "";
    this.href = "";
    this.loadingState = false;
    this.themeColor = "";
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      description: { type: String },
      image: { type: String },
      link: { type: String },
      href: { type: String },
      loadingState: {
        type: Boolean,
        reflect: true,
        attribute: "loading-state",
      },
      themeColor: { type: String, reflect: true, attribute: "theme-color" },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(--ddd-font-navigation);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-2);
        }
        .card {
          border: var(--ddd-border-md);
          padding: var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-xs);
          transition: border-color 0.3s ease-in-out;
        }
        :host(:focus-within) .card,
        :host(:hover) .card {
          border-color: var(--theme-color, var(--ddd-theme-primary));
        }
        .card .title {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-xs);
          color: var(--ddd-theme-primary);
        }
        .card a {
          font-size: var(--ddd-font-size-4xs);
          color: var(--ddd-theme-primary);
        }
        .card p {
          font-size: var(--ddd-font-size-4xs);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }
        .loader {
          border: var(--ddd-spacing-4) solid var(--ddd-accent-1);
          border-top: var(--ddd-spacing-4) solid var(--ddd-primary-1);
          border-radius: 50%;
          width: var(--ddd-spacing-6);
          height: var(--ddd-spacing-6);
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 600px) {
          :host {
            max-width: 100%;
            padding: var(--ddd-spacing-3);
          }
        }

        .image {
          display: inline-block;
          background-color: var(--ddd-accent-1);
        }
        .image img {
          height: auto;
          width: var(--ddd-spacing-20);
          margin: 0 auto;
          display: block;
        }
        .details {
          display: inline-block;
          width: 78%;
          vertical-align: top;
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper">
        ${this.loadingState ? html`<div class="loader"></div>` : ""}
        <div class="card" style="--theme-color:${this.themeColor}">
          <div class="image">
            ${this.image
              ? html`<img
                  src="${this.image}"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  fetchpriority="low"
                />`
              : ""}
          </div>
          <div class="details">
            <a href="${this.link}" target="_blank" rel="noopener noreferrer">
              <div class="title">${this.title || "No preview available"}</div>
              <div class="link">${this.link}</div>
            </a>
            <p>${this.description}</p>
          </div>
        </div>
      </div>
    `;
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("href") && this.href) {
      this.fetchData(this.href);
    }
  }

  async fetchData(src) {
    // enable core services, though should be available
    const MicroFrontendRegistry =
      globalThis.MicroFrontendRegistry.requestAvailability();
    await import(
      "@haxtheweb/micro-frontend-registry/lib/microServices.js"
    ).then((e) => {
      MicroFrontendRegistry.enableServices(["core"]);
    });
    this.loadingState = true;
    try {
      let data = await MicroFrontendRegistry.call("@core/websiteMetadata", {
        q: src,
      });

      this.title =
        data.data["og:title"] || data.data["title"] || "No title available";
      this.description = this.truncateText(
        data.data["og:description"] ||
          data.data["description"] ||
          "No description available",
        250,
      );
      this.image = data.data["og:image"] || data.data["image"] || "";
      if (this.image && !this.isValidURL(this.image)) {
        if (data.data["og:url"]) {
          this.image = data.data["og:url"] + this.image;
        }
      }
      this.link = data.data["og:url"] || data.data["url"] || link;
      this.themeColor =
        data.data?.["theme-color"]?.trim() || this.getThemeColor(link);
    } catch (error) {
      console.error("Error fetching data:", error);
      this.title = "No preview available";
      this.description = "";
      this.link = link;
      this.image = "";
      this.themeColor = this.getThemeColor();
    } finally {
      this.loadingState = false;
    }
  }

  isValidURL(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  truncateText(text, maxLength) {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  }

  getThemeColor(link) {
    try {
      const hostname = new URL(link).hostname;
      if (hostname.endsWith("psu.edu")) {
        return "var(--ddd-primary-2)";
      }
    } catch (error) {
      console.warn("Invalid URL format:", link);
    }

    const randomNum = Math.floor(Math.random() * 26);
    return `var(--ddd-primary-${randomNum})`;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);
