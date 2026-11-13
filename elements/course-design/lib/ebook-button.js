/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import { CourseDesignLinkRowStyles } from "./course-design-link-row-styles.js";

export class EbookButton extends I18NMixin(LitElement) {
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected so it is also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
      link: { type: String },
      title: { type: String },
      icon: { type: String },
    };
  }

  static get haxProperties() {
    return {
      canScale: false,

      canEditSource: false,
      gizmo: {
        title: "Ebook button",
        description: "A button that links to an Ebook.",
        icon: "icons:book",
        color: "blue",
        tags: ["Instructional", "link", "ebook", "book"],
        handles: [
          {
            type: "link",
            source: "link",
            title: "title",
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
            description: "The title of the button.",
            inputMethod: "textfield",
            icon: "editor:title",
          },
          {
            property: "link",
            title: "Link",
            description: "The link to redirect to on click.",
            inputMethod: "haxupload",
            icon: "editor:insert-link",
          },
          {
            property: "icon",
            title: "Icon",
            description: "Icon to represent this link",
            inputMethod: "iconpicker",
            icon: "editor:insert-link",
          },
        ],
        advanced: [],
      },
      demoSchema: [
        {
          tag: "ebook-button",
          properties: {
            title: "Access Ebook",
            icon: "icons:book",
          },
          content: "",
        },
      ],
    };
  }

  constructor() {
    super();
    this.t = this.t || {};
    this.t = {
      ...this.t,
      reading: "Reading",
      ebook: "Ebook",
      opensInNewTab: "Opens in a new tab",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    this.typeof = "oer:ReferencedMaterial";
    this.link = "";
    this.title = "";
    this.icon = "icons:book";
  }
  static get styles() {
    return [
      CourseDesignLinkRowStyles,
      css`
        :host {
          --link-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .title {
          color: var(--link-color);
        }
        /* the forward arrow points along the reading direction */
        :host(:dir(rtl)) .action.forward simple-icon-lite {
          transform: scaleX(-1);
        }
      `,
    ];
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   */
  haxactiveElementChanged(el, val) {
    if (val) {
      this._haxstate = val;
    }
  }
  /**
   * Set a flag to test if we should block link clicking on the entire card
   * otherwise when editing in hax you can't actually edit it bc its all clickable.
   * if editMode goes off this helps ensure we also become clickable again
   */
  haxeditModeChanged(val) {
    this._haxstate = val;
  }
  /**
   * special support for HAX since the whole card is selectable
   */
  _clickLink(e) {
    if (this._haxstate) {
      // do not do default
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
  /**
   * Where the link opens; the ebook always opens in a new tab
   */
  get target() {
    return "_blank";
  }
  /**
   * Trailing icon that says where a click goes: out to a new tab, or on
   * to the linked page
   */
  get endIcon() {
    return this.target === "_blank"
      ? "icons:open-in-new"
      : "icons:arrow-forward";
  }
  render() {
    return html`
      <div id="button-wrapper">
        <a
          id="book"
          class="link-row"
          property="oer:uri"
          href="${this.link}"
          target="${this.target}"
          rel="noopener noreferrer"
          @click="${this._clickLink}"
        >
          <span class="tile" aria-hidden="true"
            ><simple-icon-lite
              icon="${this.icon || "icons:book"}"
              aria-hidden="true"
            ></simple-icon-lite
          ></span>
          <span class="text">
            <span class="eyebrow">${this.t.reading} · ${this.t.ebook}</span>
            <span class="title" property="oer:name">${this.title}</span>
          </span>
          <span class="action ${this.target === "_blank" ? "" : "forward"}"
            ><simple-icon-lite
              icon="${this.endIcon}"
              aria-hidden="true"
            ></simple-icon-lite
            ><span class="tip">${this.t.opensInNewTab}</span></span
          >
        </a>
      </div>
    `;
  }
  static get tag() {
    return "ebook-button";
  }
}
globalThis.customElements.define(EbookButton.tag, EbookButton);
