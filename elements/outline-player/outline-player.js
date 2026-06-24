import { html, css } from "lit";
import { HAXCMSLitElementTheme } from "@haxtheweb/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { SimpleColorsSuper } from "@haxtheweb/simple-colors/simple-colors.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@haxtheweb/simple-icon/simple-icon.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { LTIResizingMixin } from "@haxtheweb/haxcms-elements/lib/core/utils/LTIResizingMixin.js";
/**
 * @title Outline Player
 * @element outline-player
 * `A basic outline presentation`
 *
 * @haxcms-theme-hidden true
 * @demo demo/index.html
 */
class OutlinePlayer extends LTIResizingMixin(
  SimpleColorsSuper(DDDSuper(HAXCMSLitElementTheme)),
) {
  /**
   * LitElement style render
   */
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          color: light-dark(black, var(--ddd-accent-6));
          display: block;
          position: relative;
          overflow: hidden;
          --outline-player-min-height: 100vh;
          --app-drawer-width: 300px;
          --outline-player-dark: #111111;
          --outline-player-light: #f8f8f8;
          background-color: light-dark(
            var(--outline-player-light),
            var(--outline-player-dark)
          );
        }

        simple-icon-button-lite:not(:defined),
        site-breadcrumb:not(:defined),
        site-rss-button:not(:defined),
        site-print-button:not(:defined),
        site-menu-button:not(:defined),
        site-modal:not(:defined),
        site-git-corner:not(:defined),
        site-menu-button:not(:defined) {
          display: none;
        }

        :host([closed]) {
          --app-drawer-width: 0px;
        }

        :host,
        :host * ::slotted(*) {
          line-height: 1.8;
        }
        :host ul,
        :host * ::slotted(ul),
        :host ol,
        :host * ::slotted(ol) {
          padding-left: 20px;
          margin-left: 20px;
        }
        :host ul,
        :host * ::slotted(ul) {
          list-style-type: disc;
        }
        :host li,
        :host * ::slotted(li) {
          margin-bottom: 6px;
        }

        .layout {
          display: flex;
          min-height: 100vh;
          min-height: -moz-available; /* WebKit-based browsers will ignore this. */
          min-height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
          min-height: fill-available;
          /* if the user has set a specific value then override the defaults */
          min-height: var(--outline-player-min-height);
        }
        .content {
          flex: 1;
          min-width: 0;
        }
        .scrim {
          display: none;
        }

        outline-player-navigation {
          --outline-player-dark: var(--outline-player-dark);
        }

        div[main-title] {
          margin-left: 8px;
          font-size: 16px;
          line-height: 22px;
          overflow-wrap: break-word;
          text-overflow: ellipsis;
          display: inline-block;
          word-break: break-word;
        }
        #content {
          padding: 8px 8px 8px 64px;
        }

        /* Required for HAX */
        :host([edit-mode]) #slot {
          display: none !important;
        }
        :host([edit-mode]) #contentcontainer {
          padding: 32px 8px 8px 8px;
        }
        #contentcontainer {
          max-width: 840px;
          display: block;
          margin: 40px;
          padding: 0 16px 16px 16px;
          flex: none;
          transition: 0.5s opacity ease-in-out;
          background-color: light-dark(
            #ffffff,
            var(--ddd-primary-4)
          );
          color: inherit;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
        }
        #contentcontainer h-a-x {
          margin: 0;
        }
        site-menu-button {
          display: inline-flex;
        }
        site-print-button {
          display: inline-flex;
        }
        site-active-title {
          --site-active-title-margin: 0px;
          --site-active-title-padding: 0px;
          margin: 0 0 0 24px;
          padding: 0;
          display: block;
        }
        @media screen and (max-width: 640px) {
          #content {
            padding: 8px 8px 8px 8px;
          }
        }
        .drawer {
          width: var(--app-drawer-width, 300px);
          flex-shrink: 0;
          overflow-y: auto;
          box-shadow: 0 0 6px -3px var(--outline-player-dark);
          z-index: 1000000;
          transition: width 0.3s ease;
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          height: 100vh;
        }
        @media (max-width: 640px) {
          .drawer {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 300px;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            height: 100vh;
            overflow-y: auto;
          }
          .drawer.opened {
            transform: translateX(0);
          }
          .scrim {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 999999;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
          }
          .scrim.opened {
            opacity: 1;
            pointer-events: auto;
          }
        }
        .nav-btns {
          display: flex;
        }
        .nav-btns site-menu-button,
        .nav-btns site-print-button,
        .nav-btns site-modal,
        .nav-btns simple-icon-button-lite {
          display: inline-flex;
          height: 32px;
          width: 32px;
          margin: 0 16px;
          padding: 0;
          color: light-dark(var(--ddd-primary-4), var(--ddd-accent-6));
        }
        site-menu {
          height: calc(100vh - 50px);
          --site-menu-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --site-menu-active-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --site-menu-item-active-item-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          color: light-dark(black, var(--ddd-accent-6));
          --map-menu-item-a-active-background-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --map-menu-item-a-active-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          --map-menu-item-icon-active-color: light-dark(
            var(--ddd-primary-4),
            var(--ddd-accent-6)
          );
          --site-menu-container-background-color: light-dark(
            var(--ddd-accent-6),
            var(--ddd-primary-4)
          );
          font-family: var(--ddd-font-navigation);
          font-weight: var(--ddd-font-weight-light);
          --site-menu-font-size: var(--ddd-font-size-3xs);
        }
        @media (min-width: 641px) {
          :host([is-logged-in]) .drawer {
            top: -70px;
          }
        }
        site-menu-button {
          --site-menu-button-button-hover-background-color: rgba(0, 0, 0, 0.2);
        }
        site-breadcrumb {
          display: block;
          margin: 24px 24px 0;
        }
        :host([responsive-size="xs"]) site-breadcrumb,
        :host([responsive-size="sm"]) site-breadcrumb {
          display: none;
        }
        :host([responsive-size="xs"]) site-git-corner {
          display: none;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "outline-player";
  }
  /**
   * HTMLElement
   */
  HAXCMSGlobalStyleSheetContent() {
    return [
      ...super.HAXCMSGlobalStyleSheetContent(),
      css`
        body.dark-mode outline-player {
          background-color: var(--outline-player-dark);
          color: var(--ddd-accent-6);
        }
        body.dark-mode outline-player #contentcontainer {
          background-color: var(--ddd-primary-4);
          color: var(--ddd-accent-6);
        }
        body.dark-mode outline-player .nav-btns site-menu-button,
        body.dark-mode outline-player .nav-btns site-print-button,
        body.dark-mode outline-player .nav-btns site-modal,
        body.dark-mode outline-player .nav-btns simple-icon-button-lite {
          color: var(--ddd-accent-6);
        }
        body.dark-mode outline-player site-breadcrumb {
          --site-breadcrumb-color: var(--ddd-theme-default-linkLight);
          --site-breadcrumb-last-color: var(--ddd-accent-6);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.__disposer = [];
    this.closed = false;
    this.opened = true;
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-breadcrumb.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/navigation/site-menu-button.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-print-button.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-title.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-active-title.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/active-item/site-git-corner.js"
    );
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/layout/site-modal.js"
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this._narrowMQ = window.matchMedia("(max-width: 640px)");
    this._narrowHandler = (e) => this._narrowChanged(e);
    this._narrowMQ.addEventListener("change", this._narrowHandler);
    this._narrowChanged(this._narrowMQ);
  }

  disconnectedCallback() {
    if (this._narrowMQ && this._narrowHandler) {
      this._narrowMQ.removeEventListener("change", this._narrowHandler);
    }
    super.disconnectedCallback();
  }

  /**
   * Delay importing site-search until we click to open it directly
   */
  siteModalClick(e) {
    // prettier-ignore
    import(
      "@haxtheweb/haxcms-elements/lib/ui-components/site/site-search.js"
    ).then((m) => {
      // weird looking but forces focus when it opens the search form
      globalThis.SimpleModal.requestAvailability().querySelector("site-search").shadowRoot.querySelector("simple-fields-field").focus();
    });
  }
  // render function
  render() {
    return html`
      <site-git-corner part="git-corner-btn"></site-git-corner>
      <div class="layout">
        <nav>
          <div class="drawer ${this.opened ? 'opened' : ''} ${this.closed ? 'closed' : ''}" id="drawer">
            <site-menu></site-menu>
          </div>
        </nav>
        <div class="scrim ${this.opened ? 'opened' : ''}" @click="${this._closeDrawer}"></div>
        <div id="content">
          <header>
            <div class="nav-btns">
              <simple-icon-button-lite
                icon="menu"
                @click="${this._toggleMenu}"
              ></simple-icon-button-lite>
              <site-modal
                @site-modal-click="${this.siteModalClick}"
                ?disabled="${this.editMode}"
                id="searchmodalbtn"
                icon="icons:search"
                title="Search site"
                button-label="Search"
                part="search-btn"
              >
                <site-search></site-search>
              </site-modal>
              <site-print-button part="print-btn"></site-print-button>
              <site-menu-button
                type="prev"
                position="bottom"
              ></site-menu-button>
              <site-menu-button
                type="next"
                position="bottom"
              ></site-menu-button>
            </div>
            <site-breadcrumb part="page-breadcrumb"></site-breadcrumb>
            <site-active-title part="page-title"></site-active-title>
            <div><slot name="title"></slot></div>
          </header>
          <main>
            <article id="contentcontainer">
              <section id="slot"><slot></slot></section>
            </article>
          </main>
        </div>
      </div>
    `;
  }
  _narrowChanged(e) {
    this.narrow = e.matches !== undefined ? e.matches : e.detail.value;
  }
  _openedChanged(value) {
    this.opened = value;
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      ...super.properties,
      opened: {
        type: Boolean,
        reflect: true,
      },
      closed: {
        type: Boolean,
        reflect: true,
      },
      activeId: {
        type: String,
      },
      narrow: {
        type: Boolean,
        reflect: true,
      },
    };
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "activeId") {
        this._activeIdChanged(this[propName], oldValue);
      }
      if (propName == "closed") {
        this.dispatchEvent(
          new CustomEvent("closed-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
    });
  }
  /**
   * Link menu button to open and closing the side panel.
   */
  _toggleMenu(e) {
    this.opened = !this.opened;
    this.closed = !this.opened;
    globalThis.dispatchEvent(new Event("resize"));
  }

  _closeDrawer(e) {
    this.opened = false;
    this.closed = true;
  }
  /**
   * active id has changed.
   */
  _activeIdChanged(newValue, oldValue) {
    if (this.opened && this.narrow) {
      this.opened = false;
      this.closed = true;
    }
    globalThis.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }

    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.activeId);
        Promise.resolve().then(() => {
          this.activeId = _mobx_val_0;
        });
      }),
    );
  }
}
globalThis.customElements.define(OutlinePlayer.tag, OutlinePlayer);
export { OutlinePlayer };
