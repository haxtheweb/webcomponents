/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import "@haxtheweb/simple-icon/simple-icon.js";
/**
 * `lesson-highlight`
 * `Clean presentation of what to expect in an upcoming lesson of instruction`
 * @demo demo/index.html
 * @element lesson-highlight
 */
class LessonHighlight extends SimpleColors {
  /**
   * Convention we use
   */
  static get tag() {
    return "lesson-highlight";
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.title = "";
    this.subtitle = "";
    this.icon = "star";
    this.disabled = false;
    this.loading = false;
    this.smart = false;
    this.hidden = false;
    this.loaded = false;
    // intermittent variable for loading to force disabled
    // but we could already have been disabled so don't want to allow
    // it to trigger enabling automatically in that case
    this.__disabled = null;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --lesson-highlight-icon-width: 28px;
          --lesson-highlight-icon-height: var(--lesson-highlight-icon-width);
        }
        :host([smart]:not([loaded]):not([loading])) {
          display: none;
        }
        :host([hidden]) {
          display: none;
        }
        :host([disabled]) {
          opacity: 0.6;
          cursor: not-allowed;
        }
        :host([loading]) {
          opacity: 0.6;
          cursor: wait;
        }
        :host .wrapper:hover {
          --lesson-highlight-text-color: var(
            --simple-colors-default-theme-grey-12,
            #222222
          );
          --lesson-highlight-subtext-color: var(
            --simple-colors-default-theme-grey-12,
            #222222
          );
        }
        .wrapper {
          display: grid;
          grid-template-columns: 3.5em 0.5em 21em;
          margin: var(--lesson-highlight-internal-margin, 0.25em);
          background-color: var(--simple-colors-default-theme-grey-1, #eeeeee);
          padding: var(--lesson-highlight-internal-padding, 0.5em);
        }
        .icon-wrapper {
          padding: var(--lesson-highlight-internal-padding, 0.5em);
          display: block;
          margin: 0 auto;
        }

        .icon {
          margin: 0;
          width: var(--lesson-highlight-icon-width);
          height: var(--lesson-highlight-icon-height);
          --simple-icon-height: var(--lesson-highlight-icon-height);
          --simple-icon-width: var(--lesson-highlight-icon-width);
          border: 2px solid var(--simple-colors-default-theme-grey-4, #eeeeee);
          border-radius: 50%;
          padding: var(--lesson-highlight-internal-padding, 0.4em);
          display: block;
        }
        .text-wrapper {
          padding: 0 8px;
        }
        .title-text {
          margin-top: var(--lesson-highlight-title-margin-top, 8px);
        }
        .title-text ::slotted(p),
        .subtitle-text ::slotted(p) {
          margin: 0;
          padding: 0;
        }
        .title-text,
        .title-text ::slotted(*) {
          color: var(
            --lesson-highlight-text-color,
            var(--simple-colors-default-theme-grey-10, #222222)
          );
          font-family: "OpenSans-Bold", "OpenSans", "Arial", sans-serif;
          font-size: 1.25em;
          font-weight: bold;
        }

        .subtitle-text {
          margin-top: 8px;
        }

        .subtitle-text,
        .subtitle-text ::slotted(*) {
          color: var(
            --lesson-highlight-subtext-color,
            var(--simple-colors-default-theme-grey-8, #555555)
          );
          font-family: "OpenSans-Bold", "OpenSans", "Arial", sans-serif;
          font-size: 0.95em;
          line-height: 1.2;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      subtitle: { type: String },
      icon: { type: String },
      disabled: { type: Boolean, reflect: true },
      hidden: { type: Boolean, reflect: true },
      loading: { type: Boolean, reflect: true },
      loaded: { type: Boolean, reflect: true },
      smart: { type: String }, // if this is a "smart" block or manually set
    };
  }

  render() {
    return html`
      <div class="wrapper">
        <div class="icon-wrapper">
          <simple-icon
            class="icon"
            icon="${this.loading ? "hax:loading" : this.icon}"
            accent-color="${this.accentColor}"
            .contrast="${this.contrast}"
            ?dark="${this.dark}"
          ></simple-icon>
        </div>
        <div></div>
        <div class="text-wrapper">
          <div class="title-text"><slot name="title">${this.title}</slot></div>
          <div class="subtitle-text">
            <slot>${this.subtitle}</slot>
          </div>
        </div>
      </div>
    `;
  }
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      // if we go into a loading state, disable the item until loading finishes
      if (propName === "loading" && this[propName] && this.smart) {
        this.title = `Updating ${this.smart} data..`;
      }
    });
  }
  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}
customElements.define(LessonHighlight.tag, LessonHighlight);
export { LessonHighlight };
