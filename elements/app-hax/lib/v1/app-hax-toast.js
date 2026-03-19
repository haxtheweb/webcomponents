import { autorun, toJS } from "mobx";
import { css } from "lit";
import { store } from "./AppHaxStore.js";
import { RPGCharacterToast } from "@haxtheweb/haxcms-elements/lib/core/ui/rpg-character-toast/rpg-character-toast.js";

export class AppHaxToast extends RPGCharacterToast {
  static get tag() {
    return "app-hax-toast";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          --simple-toast-top: var(
            --app-hax-toast-top,
            calc(
              var(--top-bar-height, var(--ddd-spacing-16, 64px)) +
                var(--ddd-spacing-2, 8px)
            )
          );
          --app-hax-toast-user-menu-offset: calc(
            var(--top-bar-height, var(--ddd-spacing-16, 64px)) +
              var(--ddd-spacing-2, 8px)
          );
          --simple-toast-right: var(
            --app-hax-toast-right,
            var(--app-hax-toast-user-menu-offset)
          );
          --simple-toast-bottom: auto;
          --simple-toast-slide-offset-y: calc(var(--ddd-spacing-8, 32px) * -1);
          --simple-toast-z-index: 100000001;
          top: var(--simple-toast-top);
          right: var(--simple-toast-right);
          left: auto;
          bottom: auto;
          height: auto;
          width: min(
            520px,
            calc(100vw - var(--simple-toast-right) - var(--ddd-spacing-3, 12px))
          );
          min-width: min(
            320px,
            calc(100vw - var(--simple-toast-right) - var(--ddd-spacing-3, 12px))
          );
          font-family: var(--ddd-font-primary, sans-serif);
          color: var(--ddd-theme-default-coalyGray, #222);
          background-color: light-dark(
            var(--ddd-theme-default-white, white),
            var(--ddd-theme-default-coalyGray, #222)
          );
          border-radius: var(--ddd-radius-md, 8px);
          box-shadow: var(--ddd-boxShadow-sm);
          padding: var(--ddd-spacing-1, 4px);
        }
        rpg-character::part(rpg-character-item) {
          width: 100%;
          height: 100%;
        }
        :host([dark-mode]) {
          color: var(--ddd-theme-default-white, white);
          background-color: var(--ddd-theme-default-coalyGray, #222);
        }
        .bubble {
          height: auto;
        }
        .bubble-wrapper {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          grid-template-areas:
            "message avatar"
            "actions actions";
          column-gap: var(--ddd-spacing-2, 8px);
          row-gap: var(--ddd-spacing-1, 4px);
          align-items: end;
          min-width: 0;
          width: 100%;
        }
        .leftedge,
        .rightedge {
          display: none;
        }
        .mid {
          grid-area: message;
          min-width: 0;
          line-height: normal;
          padding: var(--ddd-spacing-3, 12px);
          background-image: none;
          border: var(--ddd-border-xs, 1px solid);
          border-color: var(--ddd-theme-default-limestoneGray, #d9d9d9);
          border-radius: var(--ddd-radius-md, 8px);
          box-shadow: var(--ddd-boxShadow-sm);
          background-color: var(--ddd-theme-default-white, white);
        }
        :host([dark-mode]) .mid {
          border-color: var(--ddd-theme-default-slateGray, #666);
          background-color: var(--ddd-theme-default-coalyGray, #222);
          box-shadow: none;
        }
        .message {
          margin: 0;
          height: auto;
          line-height: 1.45;
          font-size: var(--ddd-font-size-3xs, 12px);
          text-align: left;
          color: inherit;
        }
        rpg-character,
        .merlin,
        .awaiting-input {
          grid-area: avatar;
          align-self: end;
          margin: 0;
        }
        rpg-character,
        .merlin {
          --app-hax-toast-avatar-size: var(--ddd-icon-l, 48px);
          width: var(--app-hax-toast-avatar-size);
          height: var(--app-hax-toast-avatar-size);
          padding: 0;
          overflow: hidden;
          border: var(--ddd-border-xs, 1px solid);
          border-color: var(--ddd-theme-default-limestoneGray, #d9d9d9);
          border-radius: var(--ddd-radius-sm, 4px);
          background-color: var(--ddd-theme-default-white, white);
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        :host([dark-mode]) rpg-character,
        :host([dark-mode]) .merlin {
          border-color: var(--ddd-theme-default-slateGray, #666);
          background-color: var(--ddd-theme-default-coalyGray, #222);
        }
        .awaiting-input {
          --app-hax-toast-avatar-size: var(--ddd-icon-l, 48px);
          --simple-icon-height: var(--app-hax-toast-avatar-size);
          --simple-icon-width: var(--app-hax-toast-avatar-size);
          width: var(--app-hax-toast-avatar-size);
          height: var(--app-hax-toast-avatar-size);
          padding: var(--ddd-spacing-1, 4px);
          border-radius: var(--ddd-radius-sm, 4px);
          background-color: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          color: var(--ddd-theme-default-wonderPurple, #9933cc);
        }
        :host([dark-mode]) .awaiting-input {
          background-color: var(--ddd-theme-default-slateGray, #666);
          color: var(--ddd-theme-default-white, white);
        }
        .buttons {
          grid-area: actions;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          line-height: normal;
          font-size: var(--ddd-font-size-4xs, 10px);
          height: auto;
          margin: 0;
        }
        .dismiss {
          margin: 0;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          border: var(--ddd-border-xs, 1px solid);
          border-color: currentColor;
          border-radius: var(--ddd-radius-sm, 4px);
          background-color: transparent;
          color: inherit;
          font-size: var(--ddd-font-size-4xs, 10px);
          line-height: 1.4;
        }
        .dismiss:hover,
        .dismiss:focus-visible {
          background-color: var(--ddd-theme-default-limestoneGray, #f5f5f5);
          outline: none;
        }
        :host([dark-mode]) .dismiss:hover,
        :host([dark-mode]) .dismiss:focus-visible {
          background-color: var(--ddd-theme-default-slateGray, #666);
        }
        .progress {
          border: none;
          height: var(--ddd-spacing-1, 4px);
          margin: var(--ddd-spacing-1, 4px) 0 0 0;
          border-radius: var(--ddd-radius-xs, 2px);
          overflow: hidden;
          background-color: var(--ddd-theme-default-limestoneGray, #f5f5f5);
        }
        :host([dark-mode]) .progress {
          background-color: var(--ddd-theme-default-slateGray, #666);
        }
        .progress .progress__bar {
          background-color: var(--ddd-theme-default-keystoneYellow, #ffd100);
        }
      `,
    ];
  }

  constructor() {
    super();
    this.windowControllers = new AbortController();
    this.characterHeight = 48;
    this.characterWidth = 48;
    autorun(() => {
      this.userName = toJS(store.user.name);
    });
    autorun(() => {
      this.darkMode = toJS(store.darkMode);
    });
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(
      "haxcms-toast-hide",
      this.hideSimpleToast.bind(this),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-toast-show",
      this.showSimpleToast.bind(this),
      { signal: this.windowControllers.signal },
    );
  }

  hideSimpleToast(e) {
    this.hide();
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.windowControllers.abort();
    super.disconnectedCallback();
  }
}
globalThis.customElements.define(AppHaxToast.tag, AppHaxToast);
globalThis.AppHaxToast = globalThis.AppHaxToast || {};

globalThis.AppHaxToast.requestAvailability = () => {
  if (!globalThis.AppHaxToast.instance) {
    globalThis.AppHaxToast.instance = globalThis.document.createElement(
      AppHaxToast.tag,
    );
    globalThis.document.body.appendChild(globalThis.AppHaxToast.instance);
  }
  return globalThis.AppHaxToast.instance;
};
export const AppHaxToastInstance = globalThis.AppHaxToast.requestAvailability();
