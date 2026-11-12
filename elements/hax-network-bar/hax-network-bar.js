/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * The sites in the HAX network, in the order the bar shows them. `id` is what
 * `current` names; `label` is a key into `this.t`.
 */
export const HAX_NETWORK_SITES = [
  { id: "cloud", label: "cloud", href: "https://hax.cloud" },
  {
    id: "elements",
    label: "elements",
    href: "https://webcomponents.hax.cloud",
  },
  {
    id: "demo",
    label: "demo",
    href: "https://webcomponents.hax.cloud/elements/haxcms-elements/demo/index.html",
  },
  { id: "rpg", label: "rpg", href: "https://rpg-me.hax.cloud" },
  { id: "docs", label: "docs", href: "https://haxtheweb.org" },
];

/**
 * `hax-network-bar`
 * The thin strip across the top of every hax.cloud site (hax.cloud, the
 * element portfolio, the live demo, RPG me) that links them as one network
 * and marks the one you are on. Each site keeps its own header under it.
 *
 * @demo demo/index.html
 * @element hax-network-bar
 */
export class HaxNetworkBar extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "hax-network-bar";
  }

  constructor() {
    super();
    this.current = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      network: "HAX network",
      cloud: "hax.cloud",
      elements: "Elements",
      demo: "Live demo",
      rpg: "RPG me",
      docs: "Docs",
      github: "GitHub",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Which site this is: cloud, elements, demo, rpg or docs.
       */
      current: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          background-color: var(--ddd-theme-default-potentialMidnight);
          border-bottom: var(--ddd-border-xs);
          border-bottom-color: var(--ddd-theme-default-beaverBlue);
          color: var(--ddd-theme-default-white);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
        }
        nav {
          display: flex;
          align-items: center;
          gap: 0 var(--ddd-spacing-6);
          max-width: var(--hax-network-bar-max-width, 1440px);
          min-height: var(--ddd-spacing-11);
          margin: 0 auto;
          padding: 0 var(--hax-network-bar-gutter, var(--ddd-spacing-8));
          overflow-x: auto;
          white-space: nowrap;
        }
        .label {
          color: var(--ddd-theme-default-pughBlue);
          font-weight: var(--ddd-font-weight-bold);
          font-size: var(--ddd-font-size-4xs);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .sites {
          display: flex;
          gap: 0 var(--ddd-spacing-6);
        }
        nav .sites a,
        nav a.end {
          display: inline-block;
          padding: var(--ddd-spacing-2) 0;
          border-bottom: var(--ddd-border-size-md) solid transparent;
          color: var(--ddd-theme-default-white);
          font-weight: var(--ddd-font-weight-regular);
          text-decoration: none;
        }
        nav .sites a:hover,
        nav a.end:hover {
          border-bottom-color: var(--ddd-theme-default-pughBlue);
        }
        nav .sites a[aria-current="page"] {
          font-weight: var(--ddd-font-weight-bold);
          border-bottom-color: var(--ddd-theme-default-keystoneYellow);
        }
        nav a:focus-visible {
          outline: var(--ddd-border-size-md) solid
            var(--ddd-theme-default-linkLight);
          outline-offset: var(--ddd-spacing-1);
        }
        .end {
          margin-left: auto;
        }
        @media (max-width: 767px) {
          nav {
            padding: 0 var(--ddd-spacing-4);
          }
          .label {
            display: none;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <nav aria-label="${this.t.network}">
        <span class="label" aria-hidden="true">${this.t.network}</span>
        <div class="sites">
          ${HAX_NETWORK_SITES.map(
            (s) =>
              html`<a
                href="${s.href}"
                aria-current="${s.id === this.current ? "page" : "false"}"
                >${this.t[s.label]}</a
              >`,
          )}
        </div>
        <a class="end" href="https://github.com/haxtheweb">${this.t.github}</a>
      </nav>
    `;
  }
}

globalThis.customElements.define(HaxNetworkBar.tag, HaxNetworkBar);
