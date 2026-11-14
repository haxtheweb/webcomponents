/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `stat-tile`
 * One number that matters, with its label and how it changed: "Enrolled,
 * 1,284, up 6% this term". Place several in a grid for a dashboard row.
 *
 * @demo demo/index.html
 * @element stat-tile
 */
export class StatTile extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "stat-tile";
  }

  constructor() {
    super();
    this.label = "";
    this.value = "";
    this.change = "";
    this.trend = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      up: "up",
      down: "down",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/stat-tile.ar.json", import.meta.url).href + "/../",
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /** what the number measures */
      label: { type: String },
      /** the number; a plain number is grouped for the page language */
      value: { type: String },
      /** how it changed, in words: "6% this term" */
      change: { type: String },
      /** direction of the change: "up" or "down" */
      trend: { type: String, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          box-sizing: border-box;
          min-width: 0;
          padding: var(
            --ddd-card-padding,
            var(--ddd-surface-padding, var(--ddd-spacing-4))
          );
          border: var(--ddd-card-border-width, var(--ddd-border-size-sm)) solid
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-limestoneGray)
            );
          border-radius: var(--ddd-card-radius, var(--ddd-radius-xl));
          box-shadow: var(--ddd-card-shadow, var(--ddd-boxShadow-sm));
          background-color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-primary);
        }
        :host([hidden]) {
          display: none;
        }
        /* a plain description list: DDD frames dl by default */
        .tile {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-1);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          border: none;
          background: none;
        }
        .tile dt,
        .tile dd {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          border: none;
        }
        .label {
          font-weight: var(--ddd-font-weight-regular);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .value {
          margin: var(--ddd-spacing-0);
          font-family: var(--ddd-font-heading, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-120);
          font-variant-numeric: tabular-nums;
          overflow-wrap: anywhere;
        }
        .change {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
        }
        :host([trend="up"]) .change {
          color: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-successLight)
          );
        }
        :host([trend="down"]) .change {
          color: light-dark(
            var(--ddd-theme-default-error),
            var(--ddd-theme-default-errorLight)
          );
        }
        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
      `,
    ];
  }

  /**
   * A plain number is grouped the way the page language writes it
   * (1284 becomes 1,284); anything else ("87%", "4.2 hrs") shows as written.
   */
  get displayValue() {
    const raw =
      this.value === null || this.value === undefined ? "" : this.value;
    const text = String(raw).trim();
    if (/^-?\d+(\.\d+)?$/.test(text)) {
      try {
        const lang =
          (globalThis.document &&
            globalThis.document.documentElement &&
            globalThis.document.documentElement.lang) ||
          undefined;
        return new Intl.NumberFormat(lang, {
          maximumFractionDigits: 20,
        }).format(Number(text));
      } catch {
        return text;
      }
    }
    return text;
  }

  render() {
    const direction =
      this.trend === "up" || this.trend === "down" ? this.trend : "";
    return html`
      <dl class="tile">
        <dt class="label">${this.label}</dt>
        <dd class="value">${this.displayValue}</dd>
        ${
          this.change
            ? html`<dd class="change">
                ${
                  direction
                    ? html`<span aria-hidden="true"
                          >${direction === "up" ? "▲" : "▼"}</span
                        ><span class="sr">${this.t[direction]}</span>`
                    : nothing
                }
                ${this.change}
              </dd>`
            : nothing
        }
      </dl>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(StatTile.tag, StatTile);
