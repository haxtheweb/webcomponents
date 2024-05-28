/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { HAXCMSRememberRoute } from "@haxtheweb/haxcms-elements/lib/core/utils/HAXCMSRememberRoute.js";
import { DDDSuper } from "../d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-region.js";

// a "blank" theme that allows for production of a brochure design by reading off of the page-sections used
class DDDBrochureTheme extends HAXCMSRememberRoute(
  DDDSuper(HAXCMSLitElementTheme),
) {
  constructor() {
    super();
    this.sectionLoad = false;
    this._observer = new MutationObserver((mutations) => {
      this.sectionLoad = true;
    });
    this._observer.observe(this, {
      childList: true,
    });
    autorun((reaction) => {
      if (store && store.location && store.location.pathname) {
        this.activePathName = toJS(store.location.pathname);
      }
    });
  }
  getSections() {
    const sections = this.querySelectorAll("page-section");
    let items = [];
    sections.forEach((section) => {
      items.push({
        id: section.getAttribute("id") || section.cleanAnchor(section.anchor), // shouldn't be possible but could be timing thing
        label: section.anchor,
      });
    });
    return items;
  }
  render() {
    return html`
      <header itemtype="http://schema.org/WPHeader">
        <div class="logo-wrapper">
          <site-region name="header"></site-region>
        </div>
        <nav
          class="menu"
          .part="site-nav ${this.editMode ? `edit-mode-active` : ``}"
          itemtype="http://schema.org/SiteNavigationElement"
        >
          ${this.getSections(this.sectionLoad).map(
            (section) => html`
              <a
                href="${this.activePathName}#${section.id}"
                tabindex="-1"
                class="menu-item"
                ><button data-target="${section.id}">
                  ${section.label}
                </button></a
              >
            `,
          )}
        </nav>
      </header>
      <main>
        <article id="contentcontainer">
          <section id="slot">
            <slot></slot>
          </section>
        </article>
      </main>
      <footer
        itemtype="http://schema.org/WPFooter"
        .part="site-nav ${this.editMode ? `edit-mode-active` : ``}"
      >
        <div class="footer-inner">
          <div class="footer-logo">
            <site-region name="footerSecondary"></site-region>
          </div>
          <div class="footer-left">
            <site-region name="footerPrimary"></site-region>
          </div>
        </div>
        <scroll-button
          .part="${this.editMode ? `edit-mode-active` : ``}"
          id="top"
          label="Top"
        ></scroll-button>
      </footer>
    `;
  }
  static get properties() {
    return {
      ...super.properties,
      sectionLoad: { type: Boolean },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // flag that just forces menu to reprocess
    if (changedProperties.has("sectionLoad") && this.sectionLoad) {
      this.sectionLoad = false;
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    globalThis.document.body.style.setProperty("--haxcms-color", "white");
    // in-case coming from a theme that undoes this
    globalThis.document.body.style.overflow = "auto";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host([edit-mode]) {
          opacity: 1;
          margin: 0px 350px; /** helps when editing to see spacing */
        }
        :host([hidden]) {
          display: none;
        }
        [hidden] {
          display: none !important;
        }

        .menu {
          display: flex;
          flex-direction: row;
          justify-content: flex-end;
          width: 100%;
          margin-right: var(--ddd-spacing-25);
          margin-top: var(--ddd-spacing-2);
        }

        .menu .menu-item {
          display: flex;
          text-decoration: none;
          height: fit-content;
          transition: all 0.3s ease-in-out;
        }

        .menu .menu-item button {
          margin: 0 var(--ddd-spacing-4);
          cursor: pointer;
          text-decoration: none;
          padding: var(--ddd-spacing-2) var(--ddd-spacing-4);
          font-size: var(--ddd-font-size-xs);
          background-color: transparent;
          color: var(--primary-color-3);
          border: 0;
          height: var(--ddd-spacing-16);
          transition: all 0.3s ease-in-out;
        }

        .menu .menu-item button:hover,
        .menu .menu-item button:focus {
          color: var(--secondary-color-1);
          background-color: var(--primary-color-1);
          text-decoration: underline;
        }

        #top {
          position: fixed;
          right: 0;
          bottom: var(--ddd-spacing-30);
          z-index: 10000;
          --simple-icon-width: var(--ddd-icon-md);
          --simple-icon-height: var(--ddd-icon-md);
          --simple-icon-button-border-radius: none;
        }

        @media (max-width: 1400px) {
          .menu {
            margin-right: 0px;
            margin-top: var(--ddd-spacing-1);
          }
          .menu .menu-item button {
            margin: 0px var(--ddd-spacing-1);
          }
        }

        @media (max-width: 1200px) {
          .menu .menu-item button {
            font-size: var(--ddd-font-size-3xs);
          }
        }

        @media (max-width: 1000px) {
          .menu .menu-item button {
            padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          }
        }

        @media (max-width: 768px) {
          #top {
            display: none;
          }
          .menu .menu-item button {
            margin: 0px var(--ddd-spacing-1);
            padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
            font-size: var(--ddd-font-size-4xs);
            height: var(--ddd-spacing-12);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
          }
        }
        /**
        * Hide the slotted content during edit mode. This must be here to work.
        */
        :host([edit-mode]) #slot {
          display: none;
        }
        #slot {
          min-height: 50vh;
        }
        :host {
          display: block;
          margin: 0px;
        }
      `,
    ];
  }
  static get tag() {
    return "ddd-brochure-theme";
  }
}
globalThis.customElements.define(DDDBrochureTheme.tag, DDDBrochureTheme);
export { DDDBrochureTheme };
