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
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `outline-player`
 * @element outline-player
 * `A basic outline presentation`
 *
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
          color: black;
          display: block;
          position: relative;
          overflow: hidden;
          --outline-player-min-height: 100vh;
          --app-drawer-width: 300px;
          --outline-player-dark: #222222;
          --outline-player-light: #f8f8f8;
          background-color: var(--outline-player-light);
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

        app-drawer-layout {
          min-height: 100vh;
          min-height: -moz-available; /* WebKit-based browsers will ignore this. */
          min-height: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
          min-height: fill-available;
          /* if the user has set a specific value then override the defaults */
          min-height: var(--outline-player-min-height);
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
        app-drawer {
          box-shadow: 0 0 6px -3px var(--outline-player-dark);
          overflow: hidden;
          --app-drawer-scrim-background: rgba(80, 80, 80, 0.8);
          z-index: 1000000;
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
        :host([is-logged-in]) app-drawer {
          top: -70px;
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
  constructor() {
    super();
    this.__disposer = [];
    this.closed = false;
    import("@polymer/app-layout/app-drawer/app-drawer.js");
    import("@polymer/app-layout/app-drawer-layout/app-drawer-layout.js");
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
      <custom-style>
        <style>
          app-drawer {
            --app-drawer-content-container: {
              overflow: hidden;
            };
          }
        </style>
      </custom-style>
      <app-drawer-layout
        .narrow="${this.narrow}"
        @narrow-changed="${this._narrowChanged}"
      >
        <nav>
          <app-drawer
            id="drawer"
            swipe-open=""
            slot="drawer"
            .opened="${this.opened}"
            @opened-changed="${this._openedChanged}"
          >
            <site-menu></site-menu>
          </app-drawer>
        </nav>
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
      </app-drawer-layout>
    `;
  }
  _narrowChanged(e) {
    this.narrow = e.detail.value;
  }
  _openedChanged(e) {
    this.opened = e.detail.value;
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
    this.shadowRoot.querySelector("#drawer").toggle();
    // allow styling to trigger based on open status
    this.closed = !this.shadowRoot.querySelector("#drawer").opened;
    // kind of silly it doesn't just work this way but
    // app-panel doesn't make any assumptions about how
    // to handle the layout when it closes
    // trick browser into thinking we just reized
    globalThis.dispatchEvent(new Event("resize"));
  }
  /**
   * active id has changed.
   */
  _activeIdChanged(newValue, oldValue) {
    // close menu if it's narrow and something new is picked
    if (this.opened && this.narrow) {
      this.shadowRoot.querySelector("#drawer").toggle();
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

    autorun((reaction) => {
      this.activeId = toJS(store.activeId);
      this.__disposer.push(reaction);
    });
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }

    super.disconnectedCallback();
  }
}
customElements.define(OutlinePlayer.tag, OutlinePlayer);
export { OutlinePlayer };
