import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";

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
            inputMethod: "textfield",
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
      css`
        :host {
          display: block;
          --link-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        /* single link row shared with worksheet-download: icon tile,
           eyebrow label, bold title and a trailing affordance */
        #book {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3);
          min-height: var(--ddd-spacing-12);
          padding-block: var(--ddd-spacing-2);
          padding-inline: var(--ddd-spacing-4) var(--ddd-spacing-3);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-md);
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-primary);
          text-decoration: none;
          text-transform: none;
          transition: border-color var(--ddd-duration-normal, 0.3s) ease-in-out;
        }
        #book:hover {
          border-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          cursor: pointer;
        }
        #book:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .tile {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-sm);
          height: var(--ddd-icon-sm);
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-skyMaxLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
        }
        .tile simple-icon-lite {
          /* DDD icon sizing variables size the icon and its svg */
          --simple-icon-height: var(--ddd-icon-3xs);
          --simple-icon-width: var(--ddd-icon-3xs);
        }
        .text {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
        }
        .eyebrow {
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        :host(:lang(ar)) .eyebrow,
        :host(:lang(fa)) .eyebrow,
        :host(:lang(he)) .eyebrow,
        :host(:lang(ur)) .eyebrow {
          letter-spacing: 0;
        }
        .title {
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-140);
          color: var(--link-color);
          overflow-wrap: anywhere;
        }
        .end {
          flex: none;
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-linkLight)
          );
          --simple-icon-height: var(--ddd-icon-4xs);
          --simple-icon-width: var(--ddd-icon-4xs);
        }
        :host(:dir(rtl)) .end {
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
  render() {
    return html`
      <div id="button-wrapper">
        <a
          id="book"
          property="oer:uri"
          href="${this.link}"
          target="_blank"
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
          <simple-icon-lite
            class="end"
            icon="icons:chevron-right"
            aria-hidden="true"
          ></simple-icon-lite>
        </a>
      </div>
    `;
  }
  static get tag() {
    return "ebook-button";
  }
}
globalThis.customElements.define(EbookButton.tag, EbookButton);
