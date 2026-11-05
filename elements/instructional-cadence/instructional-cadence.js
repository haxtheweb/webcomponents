/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  analyzeCadence,
  cadenceToAlphaTex,
  CADENCE_PARTS,
} from "./lib/cadence-model.js";

/**
 * `instructional-cadence`
 * Renders a course's pacing as music: one measure per lesson, one beat per
 * page. Each lesson is checked for a five-part shape (setup, dance, peak,
 * follow-up, recap) and the result is engraved and played with
 * `sheet-music`. Built for the HAXcms Site Insights stats dashboard
 * (haxtheweb/issues#3045).
 *
 * Data in, no fetching: pass the JSON Outline Schema items and the Site
 * Insights `content` report rows.
 *
 * @demo demo/index.html
 * @element instructional-cadence
 */
export class InstructionalCadence extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "instructional-cadence";
  }

  constructor() {
    super();
    this.items = [];
    this.rows = [];
    this.courseTitle = "";
    this.basePath = "";
    this.hideScore = false;
    this._analysis = null;
    this._tex = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      heading: "Instructional cadence",
      flow: "Flow",
      lessonsResolve: "Lessons resolve",
      emptyBeats: "Empty pages",
      pages: "pages",
      noLessons:
        "No lessons found. A lesson is a page whose child pages have no children of their own.",
      summary:
        "Each lesson is one measure and each page is one beat. A well paced lesson has a short setup, a middle that moves, a peak, a lighter follow-up and a recap.",
      setup: "Setup",
      dance: "Dance",
      peak: "Peak",
      follow: "Follow-up",
      recap: "Recap",
      present: "present",
      missing: "missing, open the page behind it",
      score: "Score",
    };
  }

  static get properties() {
    return {
      ...super.properties,
      /** JSON Outline Schema items ({id, parent, title, slug, order}) */
      items: { type: Array },
      /** Site Insights content report rows (contentData) */
      rows: { type: Array },
      /** Title used on the engraved score */
      courseTitle: { type: String, attribute: "course-title" },
      /** Prefix for page links, e.g. the site's base path */
      basePath: { type: String, attribute: "base-path" },
      /** Skip rendering the sheet-music score (summary only) */
      hideScore: { type: Boolean, attribute: "hide-score", reflect: true },
      _analysis: { type: Object, state: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          font-family: var(--ddd-font-navigation);
        }
        h3,
        h4 {
          margin: var(--ddd-spacing-0);
          font-weight: var(--ddd-font-weight-bold);
        }
        h3 {
          font-size: var(--ddd-font-size-s);
        }
        h4 {
          font-size: var(--ddd-font-size-xs);
        }
        p {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-3xs);
        }
        .wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-4);
        }
        .stats {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-6);
          margin: var(--ddd-spacing-0);
        }
        .stats div {
          display: flex;
          flex-direction: column-reverse;
        }
        .stats dt {
          font-size: var(--ddd-font-size-4xs);
          text-transform: uppercase;
          letter-spacing: var(--ddd-ls-16-sm);
        }
        .stats dd {
          margin: var(--ddd-spacing-0);
          font-size: var(--ddd-font-size-l);
          font-weight: var(--ddd-font-weight-bold);
          font-variant-numeric: tabular-nums;
        }
        ol.lessons {
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-3);
        }
        ol.lessons > li {
          display: flex;
          flex-direction: column;
          gap: var(--ddd-spacing-2);
          padding-bottom: var(--ddd-spacing-3);
          border-bottom: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
        }
        .lesson-head {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
          align-items: baseline;
        }
        .lesson-head span {
          font-size: var(--ddd-font-size-4xs);
        }
        ul.parts {
          flex-direction: row;
          list-style: none;
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
        }
        ul.parts li {
          flex: 0 0 auto;
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          text-transform: uppercase;
          letter-spacing: var(--ddd-ls-16-sm);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-radius: var(--ddd-radius-rounded);
        }
        ul.parts li.pass {
          color: light-dark(
            var(--ddd-theme-default-success),
            var(--ddd-theme-default-successLight)
          );
        }
        ul.parts li.miss,
        ul.parts li.miss a {
          color: light-dark(
            var(--ddd-theme-default-warning),
            var(--ddd-theme-default-warningLight)
          );
        }
        ul.parts a:focus-visible {
          outline: var(--ddd-border-sm);
          outline-offset: var(--ddd-spacing-1);
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        .score {
          display: block;
          min-height: var(--ddd-spacing-20);
        }
      `,
    ];
  }

  willUpdate(changedProperties) {
    if (super.willUpdate) {
      super.willUpdate(changedProperties);
    }
    if (changedProperties.has("items") || changedProperties.has("rows")) {
      this._analysis = analyzeCadence(this.items, this.rows);
    }
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("_analysis") ||
      changedProperties.has("courseTitle") ||
      changedProperties.has("hideScore")
    ) {
      this._renderScore();
    }
  }

  /**
   * sheet-music reads alphaTex from a light-DOM <template>, which Lit cannot
   * bind into, so the score is built imperatively and replaced when the
   * cadence changes.
   */
  async _renderScore() {
    const container = this.shadowRoot
      ? this.shadowRoot.querySelector(".score")
      : null;
    if (!container) {
      return;
    }
    const tex =
      this.hideScore || !this._analysis
        ? ""
        : cadenceToAlphaTex(this._analysis, this.courseTitle);
    if (tex === this._tex && container.firstElementChild) {
      return;
    }
    this._tex = tex;
    container.replaceChildren();
    if (tex === "") {
      return;
    }
    await import("@haxtheweb/sheet-music/sheet-music.js");
    // a newer render may have started while sheet-music loaded
    if (tex !== this._tex) {
      return;
    }
    const sheet = globalThis.document.createElement("sheet-music");
    const template = globalThis.document.createElement("template");
    template.setAttribute("preserve-content", "preserve-content");
    template.content.appendChild(globalThis.document.createTextNode(tex));
    sheet.appendChild(template);
    container.replaceChildren(sheet);
    this._mirrorScoreStyles();
  }

  /**
   * alphaTab and sheet-music add their glyph and cursor CSS to document.head.
   * The score lives inside this element's shadow root, where document styles
   * do not reach, so copy those style elements in as they appear. The
   * @font-face rules stay registered at the document level.
   */
  _mirrorScoreStyles() {
    if (!this.shadowRoot || !globalThis.document || !globalThis.document.head) {
      return;
    }
    const copy = () => {
      globalThis.document.head
        .querySelectorAll("style[id]")
        .forEach((style) => {
          const id = style.id;
          if (
            id.indexOf("alphaTabStyle") !== 0 &&
            id !== "sheet-music-cursor-styles"
          ) {
            return;
          }
          let mirror = null;
          this.shadowRoot
            .querySelectorAll("style[data-mirror-of]")
            .forEach((el) => {
              if (el.getAttribute("data-mirror-of") === id) {
                mirror = el;
              }
            });
          if (!mirror) {
            mirror = globalThis.document.createElement("style");
            mirror.setAttribute("data-mirror-of", id);
            this.shadowRoot.appendChild(mirror);
          }
          if (mirror.textContent !== style.textContent) {
            mirror.textContent = style.textContent;
          }
        });
    };
    copy();
    if (!this._headObserver) {
      this._headObserver = new MutationObserver(copy);
      this._headObserver.observe(globalThis.document.head, { childList: true });
    }
  }

  disconnectedCallback() {
    if (this._headObserver) {
      this._headObserver.disconnect();
      this._headObserver = null;
    }
    super.disconnectedCallback();
  }

  _beatForPart(lesson, part) {
    const beats = lesson.beats;
    const peak = lesson.roles.indexOf("peak");
    switch (part) {
      case "setup":
        return beats[0];
      case "recap":
        return beats[beats.length - 1];
      case "peak":
        return peak > -1 ? beats[peak] : beats[Math.floor(beats.length / 2)];
      case "follow":
        return peak > -1 && peak + 1 < beats.length
          ? beats[peak + 1]
          : beats[beats.length - 1];
      default: {
        const empty = beats.find((b, i) => i > 0 && b.empty);
        return empty || beats[Math.min(1, beats.length - 1)];
      }
    }
  }

  _pageHref(beat) {
    if (!beat || !beat.slug) {
      return "";
    }
    return `${this.basePath || ""}${beat.slug}`;
  }

  _renderPart(lesson, part) {
    const label = this.t[part];
    if (lesson.checks[part]) {
      return html`<li class="pass">
        <span aria-hidden="true">✓</span> ${label}
        <span class="visually-hidden">${this.t.present}</span>
      </li>`;
    }
    const beat = this._beatForPart(lesson, part);
    const href = this._pageHref(beat);
    return html`<li class="miss">
      <span aria-hidden="true">·</span>
      ${
        href
          ? html`<a
              href="${href}"
              title="${beat.title}"
              aria-label="${label}: ${this.t.missing} (${beat.title})"
              >${label}</a
            >`
          : html`${label}
              <span class="visually-hidden">${this.t.missing}</span>`
      }
    </li>`;
  }

  render() {
    const a = this._analysis;
    const lessons = a ? a.lessons : [];
    return html`
      <div class="wrapper">
        <h3>${this.t.heading}</h3>
        <p>${this.t.summary}</p>
        ${
          lessons.length === 0
            ? html`<p>${this.t.noLessons}</p>`
            : html`
                <dl class="stats">
                  <div>
                    <dt>${this.t.flow}</dt>
                    <dd>${a.flow}%</dd>
                  </div>
                  <div>
                    <dt>${this.t.lessonsResolve}</dt>
                    <dd>${a.resolves}/${lessons.length}</dd>
                  </div>
                  <div>
                    <dt>${this.t.emptyBeats}</dt>
                    <dd>${a.emptyBeats}</dd>
                  </div>
                </dl>
                <ol class="lessons">
                  ${lessons.map(
                    (lesson) => html`
                      <li>
                        <div class="lesson-head">
                          <h4>${lesson.title}</h4>
                          <span
                            >${this.t.flow}
                            ${lesson.score}/${CADENCE_PARTS.length} ·
                            ${lesson.beats.length} ${this.t.pages}</span
                          >
                        </div>
                        <ul class="parts">
                          ${CADENCE_PARTS.map((part) =>
                            this._renderPart(lesson, part),
                          )}
                        </ul>
                      </li>
                    `,
                  )}
                </ol>
              `
        }
        <div class="score" ?hidden="${this.hideScore}"></div>
      </div>
    `;
  }
}

globalThis.customElements.define(
  InstructionalCadence.tag,
  InstructionalCadence,
);
