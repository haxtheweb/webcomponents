/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, svg } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

// the story mark: an open book with a spark over it
export const storyMark = svg`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 1.2l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z" fill="currentColor"/><path d="M2.5 8.2c3-1.1 6-1 9.5.9 3.5-1.9 6.5-2 9.5-.9v11.6c-3-1.1-6-1-9.5.9-3.5-1.9-6.5-2-9.5-.9z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 9.1v11.6" stroke="currentColor" stroke-width="1.8"/></svg>`;

/**
 * `hax-story-link`
 * `The one button that opens the story behind a claim, on hax.cloud`
 *
 * Put it beside anything that makes a claim: a number, a pillar, a person,
 * an element. `story` is the story's address on hax.cloud (stories/ee450a19, or a web's path such as hax-lab). The label and the
 * mark never change, so people learn it once and recognize it on any site.
 *
 * @element hax-story-link
 */
class HaxStoryLink extends I18NMixin(DDD) {
  static get tag() {
    return "hax-story-link";
  }

  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
  static get properties() {
    return {
      ...super.properties,
      /** address of the story on hax.cloud: stories/<address>, or a web's path */
      story: { type: String },
      /** what the story is about, for people who cannot see what it sits beside */
      about: { type: String },
      /** small chip that reads "Story" */
      compact: { type: Boolean, reflect: true },
      /** where stories live */
      base: { type: String },
    };
  }
  constructor() {
    super();
    this.story = "";
    this.about = "";
    this.compact = false;
    this.base = "https://hax.cloud/";
    this.t = {
      seeTheStory: "See the story",
      story: "Story",
      onHaxCloud: "on hax.cloud",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL(`../locales/${this.tag}.es.json`, import.meta.url).href +
        "/../",
    });
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          vertical-align: middle;
          --hsl-ink: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          --hsl-surface: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
        }
        a {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-spacing-8);
          box-sizing: border-box;
          padding: var(--ddd-spacing-1) var(--ddd-spacing-4)
            var(--ddd-spacing-1) var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation, var(--ddd-font-primary));
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1;
          text-decoration: none;
          color: var(--hsl-ink);
          background-color: var(--hsl-surface);
          border: var(--ddd-border-size-sm) solid var(--hsl-ink);
          border-radius: 999px;
        }
        .mark {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--ddd-spacing-6);
          height: var(--ddd-spacing-6);
          border-radius: 50%;
          color: var(--hm-on-brand, var(--hsl-surface));
          background-color: var(--hm-brand, var(--hsl-ink));
          flex: none;
        }
        svg {
          width: var(--ddd-spacing-4);
          height: var(--ddd-spacing-4);
        }
        a:hover {
          color: var(--hsl-surface);
          background-color: var(--hsl-ink);
        }
        a:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        :host([compact]) a {
          min-height: var(--ddd-spacing-6);
          padding: 0 var(--ddd-spacing-3) 0 0;
          font-size: var(--ddd-font-size-5xs);
          gap: var(--ddd-spacing-1);
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
  get href() {
    let base = "https://hax.cloud/";
    try {
      const url = new URL(this.base);
      if (url.protocol === "https:" || url.protocol === "http:") {
        base = url.href;
      }
    } catch {
      // keep hax.cloud
    }
    // a story's address (stories/ee450a19) or a web's path (hax-lab), nothing else
    const path = String(this.story || "").replace(/^\/+/, "");
    if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(path)) return base;
    return base.replace(/\/*$/, "/") + path;
  }
  render() {
    return html`<a href="${this.href}"
      ><span class="mark">${storyMark}</span>${
        this.compact ? this.t.story : this.t.seeTheStory
      }<span class="sr"
        >${this.about ? `: ${this.about},` : ``} ${this.t.onHaxCloud}</span
      ></a
    >`;
  }
}
globalThis.customElements.define(HaxStoryLink.tag, HaxStoryLink);
export { HaxStoryLink };
