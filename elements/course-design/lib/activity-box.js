/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import { css, html } from "lit";

/**
 * `activity-box`
 * `Small styled heading block that sets up an activity`
 * A DDD block: the icon is the header chip, the tag is the header title
 * under an "Activity" label and the slotted content is the body.
 *
 * Custom properties (kept from the original element):
 * --activity-box-container-padding, --activity-box-container-padding-top,
 * --activity-box-container-margin-bottom, --activity-box-content-padding,
 * --activity-box-content-font-family, --activity-box-tag-font-weight,
 * --activity-box-tag-font-size, --activity-box-icon-left
 * @element activity-box
 */
export class ActivityBox extends I18NMixin(DDD) {
  static get styles() {
    return [
      super.styles,
      DDDBlockStyles,
      css`
        :host {
          display: block;
          margin-bottom: var(
            --activity-box-container-margin-bottom,
            var(--ddd-spacing-5)
          );
        }
        /* an author picked primary colours the chip, the accent the top
           rule; the shell supplies the defaults and dark mode */
        :host([data-primary]) .ddd-block {
          --ddd-block-chip-background: var(--ddd-theme-primary);
          --ddd-block-chip-color: var(
            --ddd-theme-bgContrast,
            var(--lowContrast-override, var(--ddd-theme-default-white))
          );
        }
        :host([data-accent]) .ddd-block {
          --ddd-block-accent: var(--ddd-theme-accent);
        }
        /* drawn here rather than with data-block-accent in the template:
           the attribute only appears when an accent is picked */
        :host([data-accent]) .ddd-block {
          border-top: var(--ddd-border-size-md) solid var(--ddd-block-accent);
        }
        :host .ddd-block[data-neutral] {
          --ddd-block-chip-background: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-nittanyNavy)
          );
          --ddd-block-chip-color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        :host .ddd-block[data-neutral] .ddd-block-chip {
          box-shadow: inset 0 0 0 var(--ddd-border-size-xs)
            light-dark(
              var(--ddd-theme-default-limestoneLight),
              var(--ddd-theme-default-slateGray)
            );
        }
        .ddd-block-chip {
          margin-inline-start: var(--activity-box-icon-left, 0);
        }
        .tag-content {
          font-weight: var(
            --activity-box-tag-font-weight,
            var(--ddd-font-weight-bold)
          );
          font-size: var(--activity-box-tag-font-size, var(--ddd-font-size-xs));
        }
        .tag-content[data-empty]:not([contenteditable]) {
          display: none;
        }
        .tag-content[contenteditable] {
          min-height: 1lh;
          outline: var(--ddd-border-xs);
          outline-style: dashed;
          outline-offset: var(--ddd-spacing-1);
        }
        .ddd-block-body {
          padding: var(--activity-box-container-padding, 0);
          padding-top: var(--activity-box-container-padding-top, 0);
        }
        .pullout {
          margin: 0;
          padding: var(
            --activity-box-content-padding,
            var(--ddd-spacing-3) var(--ddd-spacing-4)
          );
          max-width: 100%;
          font-family: var(
            --activity-box-content-font-family,
            var(--ddd-font-primary)
          );
          font-size: var(--ddd-theme-body-font-size, var(--ddd-font-size-xxs));
          font-weight: var(--ddd-font-weight-regular);
          line-height: var(--ddd-lh-150);
        }
        .pullout ::slotted(*:first-child) {
          margin-top: 0;
        }
        .pullout ::slotted(*:last-child) {
          margin-bottom: 0;
        }
      `,
    ];
  }
  static get tag() {
    return "activity-box";
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * double-check that we are set to inactivate click handlers
   * this is for when activated in a duplicate / adding new content state
   * The tag is edited in place in the header title.
   */
  haxactiveElementChanged(el, val) {
    // flag for HAX to not trigger active on changes
    let container = this.shadowRoot.querySelector(".tag-content");
    if (val) {
      container.setAttribute("contenteditable", true);
    } else {
      container.removeAttribute("contenteditable");
      this.tag = container.innerText;
    }
    return false;
  }
  static get haxProperties() {
    return new URL("./activity-box.haxProperties.json", import.meta.url).href;
  }

  static get properties() {
    return {
      ...super.properties,
      /* The icon to use for the activity box */
      icon: {
        type: String,
        reflect: true,
      },
      /* Tag to be shown above the slotted content */
      tag: {
        type: String,
        reflect: true,
      },
      /* Whether or not the icon should have color applied */
      nocolourize: {
        type: Boolean,
        reflect: false,
      },
    };
  }

  constructor() {
    super();
    this.icon = "";
    this.tag = "";
    this.t = {
      ...this.t,
      activity: "Activity",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
  }

  /**
   * The chip icon: the authored icon, or the activity page type icon
   */
  get chipIcon() {
    return this.icon && this.icon !== "null" ? this.icon : "hax:ticket";
  }

  render() {
    return html`
      <div class="ddd-block container" ?data-neutral="${this.nocolourize}">
        ${renderDDDBlockHeader({
          icon: this.chipIcon,
          label: this.t.activity,
          after: html`<span
            class="ddd-block-title tag tag-content"
            ?data-empty="${!this.tag}"
            >${this.tag}</span
          >`,
        })}
        <div class="ddd-block-body">
          <div class="pullout"><slot></slot></div>
        </div>
      </div>
    `;
  }
}

globalThis.customElements.define(ActivityBox.tag, ActivityBox);
