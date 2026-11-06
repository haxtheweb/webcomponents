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
 * Renders a course's pacing as music. Each lesson is a phrase, written as one
 * bar with a beat per page; blank pages are rests. Each lesson is checked
 * for a five-part shape named with the music terms it borrows (anacrusis,
 * development, climax, decrescendo, cadence) and the course is engraved and
 * played with `sheet-music`. Built for the HAXcms Reports cadence screen
 * (haxtheweb/issues#3045).
 *
 * Data in, no fetching: pass the JSON Outline Schema items and one row per
 * page with its word, image, video and embed counts.
 *
 * @demo demo/index.html
 * @element instructional-cadence
 * @fires cadence-open-page - { id, slug } before following a page link;
 *   call preventDefault() on it to handle the navigation yourself
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
    this.lessonDepth = -1;
    this.hideScore = false;
    this.hideStats = false;
    this._analysis = null;
    this._tex = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      heading: "Instructional cadence",
      summary:
        "Each lesson is a phrase: one bar, a beat per page, and a rest for each blank page. A well paced lesson opens lightly, develops, reaches one clear climax, eases off and closes.",
      flow: "Flow",
      flowNote: "five-part shape across lessons",
      cadences: "Lessons that close",
      cadencesNote: "end on an authentic cadence",
      rests: "Rests",
      restsNote: "blank pages",
      blankPages: "Blank lesson pages",
      blankNote: "pages with no children and no content",
      partsLegend: "What each part means",
      lessons: "Lessons",
      interlude: "Interlude",
      pages: "pages",
      noLessons: "No lessons found in this part of the site.",
      anacrusis: "Anacrusis",
      anacrusisHelp:
        "Opens lightly: the first page with content weighs well under the climax.",
      development: "Development",
      developmentHelp:
        "The middle moves up and down on the way to the climax, with no blank pages.",
      climax: "Climax",
      climaxHelp:
        "One clear high point, a quarter heavier than the lesson's typical page, past the first third.",
      decrescendo: "Decrescendo",
      decrescendoHelp: "The page after the climax eases off.",
      cadence: "Cadence",
      cadenceHelp:
        "Closes on a page with content after the climax. Ending on a blank page or on the climax leaves it open (a half cadence).",
      authentic: "authentic cadence",
      half: "half cadence",
      present: "present",
      missing: "missing; open the page to look",
      beatsLabel: "{n} pages, {rests} rests, climax on page {climax}",
      score: "Score",
    };
  }

  static get properties() {
    return {
      ...super.properties,
      /** JSON Outline Schema items ({id, parent, title, slug, order}) */
      items: { type: Array },
      /** one row per page: {id, words, images, videos, embeds} */
      rows: { type: Array },
      /** Title used on the engraved score */
      courseTitle: { type: String, attribute: "course-title" },
      /** Prefix for page links, e.g. the site's base path */
      basePath: { type: String, attribute: "base-path" },
      /** Outline level that holds the lessons; -1 finds it from the outline */
      lessonDepth: { type: Number, attribute: "lesson-depth" },
      /** Skip rendering the sheet-music score */
      hideScore: { type: Boolean, attribute: "hide-score", reflect: true },
      /** Skip the summary numbers (when the host shows its own) */
      hideStats: { type: Boolean, attribute: "hide-stats", reflect: true },
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
        a {
          color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
        }
        .beats {
          display: flex;
          align-items: flex-end;
          gap: var(--ddd-spacing-1);
          height: var(--ddd-spacing-8);
        }
        .beat {
          flex: 0 0 var(--ddd-spacing-2);
          height: calc(var(--beat-h, 0) * var(--ddd-spacing-8));
          border-radius: var(--ddd-radius-xs);
          background-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
        }
        .beat.climax {
          background-color: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
        }
        .beat.rest {
          height: var(--ddd-spacing-1);
          background-color: var(--ddd-theme-default-potential0);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
        }
        .legend {
          font-size: var(--ddd-font-size-4xs);
        }
        .legend dl {
          display: grid;
          gap: var(--ddd-spacing-1);
          margin: var(--ddd-spacing-2) var(--ddd-spacing-0);
        }
        .legend dt {
          font-weight: var(--ddd-font-weight-bold);
        }
        .legend dd {
          margin: var(--ddd-spacing-0);
        }
        ol.lessons > li.interlude {
          font-size: var(--ddd-font-size-4xs);
          border-bottom-style: dashed;
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
    if (
      changedProperties.has("items") ||
      changedProperties.has("rows") ||
      changedProperties.has("lessonDepth")
    ) {
      this._analysis = analyzeCadence(this.items, this.rows, {
        depth: this.lessonDepth,
      });
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
    const find = (role) => beats.findIndex((b) => b.role === role);
    const climax = lesson.climax > -1 ? lesson.climax : 0;
    switch (part) {
      case "anacrusis": {
        const i = find("anacrusis");
        return beats[i > -1 ? i : 0];
      }
      case "development": {
        const blank = beats.findIndex(
          (b, i) => i > 0 && i < climax && b.rest && b.leaf,
        );
        if (blank > -1) {
          return beats[blank];
        }
        const i = find("development");
        return beats[i > -1 ? i : Math.min(1, beats.length - 1)];
      }
      case "climax":
        return beats[climax];
      case "decrescendo": {
        const i = find("decrescendo");
        return beats[i > -1 ? i : climax];
      }
      default:
        return beats[beats.length - 1];
    }
  }

  _pageHref(beat) {
    if (!beat || !beat.slug) {
      return "";
    }
    if (/^https?:\/\//.test(beat.slug)) {
      return beat.slug;
    }
    return `${this.basePath || ""}${beat.slug}`;
  }

  /**
   * Let a host (the Reports dialog) take over navigation; otherwise the link
   * is followed as usual.
   */
  _openPage(e, beat) {
    const evt = new CustomEvent("cadence-open-page", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { id: beat.id, slug: beat.slug },
    });
    this.dispatchEvent(evt);
    if (evt.defaultPrevented) {
      e.preventDefault();
    }
  }

  _pageLink(beat, label, ariaLabel) {
    const href = this._pageHref(beat);
    if (!href) {
      return html`${label}`;
    }
    return html`<a
      href="${href}"
      title="${beat.title}"
      aria-label="${ariaLabel || label}"
      @click="${(e) => this._openPage(e, beat)}"
      >${label}</a
    >`;
  }

  _renderPart(lesson, part) {
    const label = this.t[part];
    if (lesson.checks[part]) {
      return html`<li class="pass" title="${this.t[`${part}Help`]}">
        <span aria-hidden="true">✓</span> ${label}
        <span class="visually-hidden">${this.t.present}</span>
      </li>`;
    }
    const beat = this._beatForPart(lesson, part);
    return html`<li class="miss" title="${this.t[`${part}Help`]}">
      <span aria-hidden="true">·</span>
      ${this._pageLink(
        beat,
        label,
        `${label}: ${this.t.missing} (${beat ? beat.title : ""})`,
      )}
    </li>`;
  }

  _renderBeats(phrase) {
    const max = Math.max(1, ...phrase.beats.map((b) => b.ratio));
    const rests = phrase.beats.filter((b) => b.rest).length;
    const label = this.t.beatsLabel
      .replace("{n}", () => phrase.beats.length)
      .replace("{rests}", () => rests)
      .replace("{climax}", () => phrase.climax + 1);
    return html`<div
      class="beats"
      role="img"
      aria-label="${phrase.kind === "lesson" ? label : ""}"
    >
      ${phrase.beats.map(
        (b, i) =>
          html`<span
            class="beat ${b.rest ? "rest" : ""} ${
              i === phrase.climax ? "climax" : ""
            }"
            style="--beat-h: ${b.rest ? 0 : Math.max(0.08, b.ratio / max)}"
            title="${b.title}"
          ></span>`,
      )}
    </div>`;
  }

  /** blank content pages, each with the phrase it sits in */
  _blankBeats(a) {
    const out = [];
    a.lessons.forEach((phrase) => {
      phrase.beats.forEach((beat) => {
        if (beat.rest && beat.leaf) {
          out.push({ phrase: phrase.title, beat });
        }
      });
    });
    return out;
  }

  _renderStats(a, lessons) {
    if (this.hideStats) {
      return "";
    }
    return html`<dl class="stats">
      <div>
        <dt>${this.t.flow}</dt>
        <dd>${a.flow}%</dd>
      </div>
      <div>
        <dt>${this.t.cadences}</dt>
        <dd>${a.resolves}/${lessons.length}</dd>
      </div>
      <div>
        <dt>${this.t.rests}</dt>
        <dd>${a.rests}</dd>
      </div>
      <div>
        <dt>${this.t.blankPages}</dt>
        <dd>${a.blankPages.length}</dd>
      </div>
    </dl>`;
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
                ${this._renderStats(a, lessons)}
                <div class="score" ?hidden="${this.hideScore}"></div>
                <details class="legend">
                  <summary>${this.t.partsLegend}</summary>
                  <dl>
                    ${CADENCE_PARTS.map(
                      (part) =>
                        html`<div>
                          <dt>${this.t[part]}</dt>
                          <dd>${this.t[`${part}Help`]}</dd>
                        </div>`,
                    )}
                  </dl>
                </details>
                ${
                  a.blankPages.length
                    ? html`<p class="blank">
                        ${this.t.blankPages}:
                        ${this._blankBeats(a).map(
                          (item, i) =>
                            html`${i ? ", " : ""}${this._pageLink(
                              item.beat,
                              `${item.phrase} › ${item.beat.title}`,
                            )}`,
                        )}
                      </p>`
                    : ""
                }
                <ol class="lessons" aria-label="${this.t.lessons}">
                  ${a.phrases.map((phrase) =>
                    phrase.kind === "lesson"
                      ? html`<li>
                          <div class="lesson-head">
                            <h4>
                              ${this._pageLink(phrase.beats[0], phrase.title)}
                            </h4>
                            <span
                              >${this.t.flow}
                              ${phrase.score}/${CADENCE_PARTS.length} ·
                              ${phrase.beats.length} ${this.t.pages} ·
                              ${this.t[phrase.cadence]}</span
                            >
                          </div>
                          ${this._renderBeats(phrase)}
                          <ul class="parts">
                            ${CADENCE_PARTS.map((part) =>
                              this._renderPart(phrase, part),
                            )}
                          </ul>
                        </li>`
                      : html`<li class="interlude">
                          <div class="lesson-head">
                            <span>${this.t.interlude}</span>
                            <span
                              >${phrase.beats.map(
                                (b, i) =>
                                  html`${i ? " · " : ""}${this._pageLink(
                                    b,
                                    b.title,
                                  )}`,
                              )}</span
                            >
                          </div>
                        </li>`,
                  )}
                </ol>
              `
        }
      </div>
    `;
  }
}

globalThis.customElements.define(
  InstructionalCadence.tag,
  InstructionalCadence,
);
