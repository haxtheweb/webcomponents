import { html, css } from "lit-element/lit-element.js";
import { HAXCMSLitElementTheme } from "@lrnwebcomponents/haxcms-elements/lib/core/HAXCMSLitElementTheme.js";
import { SimpleColorsSuper } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
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
class OutlinePlayer extends SimpleColorsSuper(HAXCMSLitElementTheme) {
  /**
   * LitElement style render
   */
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          font-family: libre baskerville;
          position: relative;
          overflow: hidden;
          --outline-player-min-height: 100vh;
          --app-drawer-width: 300px;
          --outline-player-dark: #222222;
          --outline-player-light: #f8f8f8;
          background-color: var(--outline-player-light);
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

        h1 {
          font-size: 48px;
          line-height: 16px;
        }

        h2 {
          font-size: 32px;
        }

        h3 {
          font-size: 28px;
        }

        p {
          line-height: 26px;
          min-height: 26px;
        }

        a,
        a:visited,
        a:active {
          color: #000;
        }

        a:hover {
          color: #2196f3;
        }

        ul li {
          padding-bottom: 24px;
          line-height: 1.5;
          color: #424242;
          max-width: 448px;
        }

        ul li:last-child {
          padding-bottom: 16px;
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
        app-drawer-layout[narrow] #contentcontainer {
          padding-top: 64px;
        }
        #content {
          padding: 8px 8px 8px 64px;
        }
        #menutoggle {
          display: block;
          float: left;
          margin-right: 16px;
        }

        /* Required for HAX */
        :host([edit-mode]) #slot {
          display: none !important;
        }
        :host([edit-mode]) #contentcontainer {
          padding: 32px 8px 8px 8px;
        }
        :host([is-logged-in]) app-drawer,
        :host([is-logged-in]) app-drawer-layout[narrow] {
          left: 48px;
        }
        #contentcontainer {
          max-width: 840px;
          display: block;
          margin: 0;
          padding: 0 16px 16px 16px;
          flex: none;
          transition: 0.5s opacity ease-in-out;
        }
        #contentcontainer h-a-x {
          margin: 0;
        }
        #menubuttoncontainer {
          display: flex;
          justify-content: center;
          padding: 8px 0 0 0;
        }
        site-menu-button {
          display: inline-flex;
        }
        site-print-button {
          display: inline-flex;
          margin-right: 20px;
        }
        site-active-title {
          --site-active-title-margin: 0px;
          --site-active-title-padding: 0px;
        }
        @media screen and (max-width: 800px) {
          :host([edit-mode][is-logged-in]) app-drawer,
          :host([edit-mode][is-logged-in]) app-drawer-layout[narrow] {
            left: 0;
          }
        }
        @media screen and (max-width: 640px) {
          #content {
            padding: 8px 8px 8px 8px;
          }
        }
      `
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
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/navigation/site-menu-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-print-button.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/site/site-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-active-title.js");
    import("@lrnwebcomponents/haxcms-elements/lib/ui-components/active-item/site-git-corner.js");
  }
  // render function
  render() {
    return html`
      <custom-style>
        <style>
          app-drawer {
            box-shadow: 0 0 6px -3px var(--outline-player-dark);
            overflow: hidden;
            --app-drawer-scrim-background: rgba(80, 80, 80, 0.8);
            --app-drawer-content-container: {
              overflow: hidden;
            }
          }
          site-menu {
            height: calc(100vh - 64px);
            color: #000000;
            padding: 0;
            background-color: #ffffff;
            --site-menu-active-color: rgba(0, 0, 0, 0.1);
            --site-menu-scrolltrack-bg-color: rgba(0, 0, 0, 0.3);
            --site-menu-bg-shadow: rgba(0, 0, 0, 0.3);
            --site-menu-bg-color: #fafafa;
            --site-menu-padding: 0;
            --site-menu-background-color: #ffffff;
            --site-menu-color: #000000;

            --site-menu-container-padding: 0;
            --site-menu-container-background-color: #ffffff;
            --site-menu-container-color: #000000;

            --site-menu-item-active-item-color: #000000;
          }
          site-menu-button {
            --site-menu-button-button-hover-background-color: rgba(
              0,
              0,
              0,
              0.2
            );
            --site-menu-button-button: {
              border-radius: 50%;
              background-color: rgba(0, 0, 0, 0.1);
              height: 40px;
              width: 40px;
            }
          }
        </style>
      </custom-style>
      <app-drawer-layout
        .narrow="${this.narrow}"
        @narrow-changed="${this._narrowChanged}"
      >
        <app-drawer
          id="drawer"
          swipe-open=""
          slot="drawer"
          .opened="${this.opened}"
          @opened-changed="${this._openedChanged}"
        >
          <div id="menubuttoncontainer">
            <site-print-button></site-print-button>
            <site-menu-button
              type="prev"
              position="bottom"
              raised
            ></site-menu-button>
            <site-menu-button
              type="next"
              position="bottom"
              raised
            ></site-menu-button>
          </div>
          <site-menu></site-menu>
        </app-drawer>
        <div id="content">
          <site-git-corner></site-git-corner>
          <paper-icon-button
            icon="menu"
            id="menutoggle"
            @click="${this._toggleMenu}"
          ></paper-icon-button>
          <site-active-title></site-active-title>
          <div><slot name="title"></slot></div>
          <div id="contentcontainer">
            <div id="slot"><slot></slot></div>
          </div>
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
        reflect: true
      },
      closed: {
        type: Boolean,
        reflect: true
      },
      activeId: {
        type: String
      },
      narrow: {
        type: Boolean,
        reflect: true
      }
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
              value: this[propName]
            }
          })
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
    window.dispatchEvent(new Event("resize"));
  }
  /**
   * active id has changed.
   */
  _activeIdChanged(newValue, oldValue) {
    // close menu if it's narrow and something new is picked
    if (this.opened && this.narrow) {
      this.shadowRoot.querySelector("#drawer").toggle();
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    autorun(reaction => {
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
window.customElements.define(OutlinePlayer.tag, OutlinePlayer);
export { OutlinePlayer };
