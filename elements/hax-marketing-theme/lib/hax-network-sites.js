/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HAX_NETWORK,
  haxNetworkGlyph,
  HaxNetworkGlyphStyles,
} from "@haxtheweb/hax-network-bar/lib/hax-network.js";

// every site made with HAX, in the bar's order, then where HAX is deployed
const ALL = HAX_NETWORK.order.concat(
  Object.keys(HAX_NETWORK.properties).filter(
    (id) => HAX_NETWORK.properties[id].deployment,
  ),
);

/**
 * `hax-network-sites`
 * `Every site in the HAX network as a card, with the network bar's own icons and colors`
 *
 * Draws each site from the network's record (the same one the network bar
 * reads), so its name, address, purpose, icon and color always match the
 * bar: the icon lights up in the site's color and moves on hover or focus,
 * exactly as it does in the bar. By default it lists every property in the
 * bar's order, then hax.psu.edu. `sites` picks and orders them instead, as
 * a space separated list of ids: web cloud try learn lab elements art psu.
 *
 * @element hax-network-sites
 */
class HaxNetworkSites extends I18NMixin(DDD) {
  static get tag() {
    return "hax-network-sites";
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get properties() {
    return {
      ...super.properties,
      /** which sites, in order, as ids separated by spaces; empty lists them all */
      sites: { type: String },
    };
  }
  constructor() {
    super();
    this.sites = "";
    this.t = {
      sitesMadeWithHax: "Sites made with HAX",
    };
    // the names and purposes start from the network's own English
    ALL.forEach((id) => {
      this.t[id] = HAX_NETWORK.properties[id].label;
      this.t[`${id}About`] = HAX_NETWORK.properties[id].purpose;
    });
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(`../locales/${this.tag}.en.json`, import.meta.url).href +
        "/../",
    });
  }
  static get styles() {
    return [
      super.styles,
      HaxNetworkGlyphStyles,
      css`
        :host {
          display: block;
          --hns-ink: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --hns-muted: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          --hns-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --hns-hover: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
        }
        ul {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
          gap: var(--ddd-spacing-4);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          list-style: none;
        }
        li {
          display: flex;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
        }
        a {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          flex: 1 1 auto;
          box-sizing: border-box;
          padding: var(--ddd-spacing-4);
          color: var(--hns-ink);
          background-color: var(--hns-surface);
          border: var(--ddd-border-sm);
          border-color: var(--hns-muted);
          border-bottom: var(--ddd-spacing-1) solid var(--prop);
          border-radius: var(--ddd-radius-md);
          box-shadow: var(--ddd-boxShadow-sm);
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          text-decoration: none;
          transition:
            background-color 0.2s,
            border-color 0.2s;
          --glyph-size: var(--ddd-icon-md, 48px);
          --glyph-accent: var(--hns-muted);
        }
        a:hover,
        a:focus-visible {
          background-color: var(--hns-hover);
          border-color: var(--prop);
        }
        a:hover,
        a:focus-visible,
        a:hover span,
        a:focus-visible span {
          text-decoration: none;
        }
        a:hover .name,
        a:focus-visible .name {
          text-decoration: underline;
        }
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .mark {
          margin-block-end: var(--ddd-spacing-2);
        }
        .name {
          font-size: var(--ddd-font-size-xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
        }
        .host {
          font-size: var(--ddd-font-size-4xs);
          color: var(--hns-muted);
        }
        .purpose {
          margin-block-start: var(--ddd-spacing-2);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-140);
        }
        @media (forced-colors: active) {
          a {
            border-bottom-color: LinkText;
          }
        }
      `,
    ];
  }
  /** the ids to draw: the ones asked for that the network knows, else all */
  get _ids() {
    const asked = String(this.sites || "")
      .split(/\s+/)
      .filter((id) => ALL.indexOf(id) !== -1);
    return asked.length ? asked : ALL;
  }
  render() {
    return html`<ul aria-label="${this.t.sitesMadeWithHax}">
      ${this._ids.map((id) => {
        const p = HAX_NETWORK.properties[id];
        return html`<li>
          <a
            class="glyph-host"
            href="${p.url}"
            data-site="${id}"
            style="--prop:var(--ddd-theme-default-${p.color})"
            ><span class="mark">${haxNetworkGlyph(id)}</span
            ><span class="name">${this.t[id]}</span
            ><span class="host"
              >${p.url.replace("https://", "").replace(/\/$/, "")}</span
            ><span class="purpose">${this.t[`${id}About`]}</span></a
          >
        </li>`;
      })}
    </ul>`;
  }
}
globalThis.customElements.define(HaxNetworkSites.tag, HaxNetworkSites);
export { HaxNetworkSites };
