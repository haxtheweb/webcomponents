/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";

// the endings a scene can be, each with its own icon so an outcome never
// reads by colour alone
const ENDINGS = {
  good: { icon: "icons:check", word: "goodEnding" },
  mixed: { icon: "icons:remove", word: "mixedEnding" },
  poor: { icon: "icons:close", word: "poorEnding" },
};

/**
 * The ending a scene declares: "good", "mixed", "poor", or "" when the
 * scene is not an ending (or names something else).
 * @param {Element} scene a branching-scene
 * @returns {String}
 */
export function sceneEnding(scene) {
  const value = String(
    (scene && scene.getAttribute && scene.getAttribute("ending")) || "",
  )
    .trim()
    .toLowerCase();
  return ENDINGS[value] ? value : "";
}

/**
 * `branching-scene`
 * `One scene of a branching-scenario`
 *
 * The scene content is whatever is slotted into it. A choice is an ordinary
 * link in that content whose href is "#" plus the scene-id of another scene
 * in the same scenario. A scene with an ending (good, mixed or poor) closes
 * a path and carries the score for it.
 *
 * @element branching-scene
 * @slot - the scene content, including the links that are its choices
 */
export class BranchingScene extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "branching-scene";
  }

  constructor() {
    super();
    this.sceneId = "";
    this.heading = "";
    this.ending = "";
    this.score = null;
    // set by the parent scenario; a scene on its own (and a scene rendered
    // on the server) shows itself
    this.active = true;
    this.editing = false;
    this.step = 0;
    this.maxScore = null;
    this.isStart = false;
    this.orphan = false;
    this.deadLinks = "";
    this.t = {
      scene: "Scene",
      ending: "Ending",
      goodEnding: "Good ending",
      mixedEnding: "Mixed ending",
      poorEnding: "Poor ending",
      scoreOf: "Score {score} of {max}",
      scoreOnly: "Score {score}",
      startScene: "Start",
      sceneIdLabel: "Scene id",
      needsId: "Add a scene id so choices can link to this scene.",
      orphan: "No choice links to this scene.",
      deadLinks: "These links point to a scene that does not exist:",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * What choices link to: a link with href "#" + this id leads here
       */
      sceneId: { type: String, attribute: "scene-id" },
      /**
       * Heading of the scene
       */
      heading: { type: String },
      /**
       * "good", "mixed" or "poor" when this scene ends a path
       */
      ending: { type: String, reflect: true },
      /**
       * Score for reaching this ending
       */
      score: { type: Number },
      // state the parent scenario sets; never attributes, so never saved
      active: { attribute: false },
      editing: { attribute: false },
      step: { attribute: false },
      maxScore: { attribute: false },
      isStart: { attribute: false },
      orphan: { attribute: false },
      deadLinks: { attribute: false },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      css`
        :host {
          display: block;
        }
        :host([hidden]) {
          display: none;
        }
        .scene {
          box-sizing: border-box;
          margin-block: var(--ddd-spacing-3);
          padding: var(--ddd-spacing-4);
          border: var(--ddd-border-xs);
          border-color: transparent;
          border-radius: var(--ddd-radius-md);
          background-color: var(--ddd-status-answered-bg);
          color: var(--ddd-status-default-ink);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
          overflow-wrap: anywhere;
        }
        :host([data-hax-active]) .scene {
          outline: var(--ddd-border-sm);
          outline-color: var(--ddd-status-answered-signal);
          outline-offset: var(--ddd-spacing-1);
        }
        .scene[data-ending] {
          border-width: var(--ddd-border-size-md);
          background-color: var(--ddd-status-default-bg);
        }
        .scene[data-ending="good"] {
          border-style: var(--ddd-status-correct-line);
          border-color: var(--ddd-status-correct-signal);
        }
        .scene[data-ending="mixed"] {
          border-style: double;
          border-color: var(--ddd-status-answered-signal);
        }
        .scene[data-ending="poor"] {
          border-style: var(--ddd-status-incorrect-line);
          border-color: var(--ddd-status-incorrect-signal);
        }
        .heading {
          margin: 0 0 var(--ddd-spacing-3);
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-3xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: var(--ddd-lh-140);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
        }
        .heading:focus {
          outline: none;
        }
        .heading:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .num {
          display: block;
          margin-block-end: var(--ddd-spacing-1);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-6xs);
          font-weight: var(--ddd-font-weight-medium);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: var(--ddd-lh-120);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .outcome {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin: 0 0 var(--ddd-spacing-3);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
        }
        .outcome-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: none;
          width: var(--ddd-icon-xxs);
          height: var(--ddd-icon-xxs);
          border-radius: var(--ddd-radius-circle);
          background-color: var(--ddd-status-answered-signal);
          color: var(--ddd-status-default-bg);
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-4xs);
          --simple-icon-height: var(--ddd-icon-4xs);
        }
        .outcome-word {
          color: var(--ddd-status-answered-ink);
        }
        [data-ending="good"] .outcome-chip {
          background-color: var(--ddd-status-correct-signal);
        }
        [data-ending="good"] .outcome-word {
          color: var(--ddd-status-correct-ink);
        }
        [data-ending="poor"] .outcome-chip {
          background-color: var(--ddd-status-incorrect-signal);
        }
        [data-ending="poor"] .outcome-word {
          color: var(--ddd-status-incorrect-ink);
        }
        .content ::slotted(:first-child) {
          margin-block-start: var(--ddd-spacing-0);
        }
        .content ::slotted(:last-child) {
          margin-block-end: var(--ddd-spacing-0);
        }
        /* authoring: the id choices link to, and what is wrong with it */
        .author {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2);
          margin: 0 0 var(--ddd-spacing-3);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
        }
        .badge {
          padding: var(--ddd-spacing-1) var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-answered-signal);
          border-radius: var(--ddd-radius-xs);
          color: var(--ddd-status-answered-ink);
          background-color: var(--ddd-status-default-bg);
        }
        .badge code {
          font-family: var(--ddd-font-secondary, monospace);
        }
        .flag {
          display: flex;
          align-items: flex-start;
          gap: var(--ddd-spacing-2);
          margin: 0 0 var(--ddd-spacing-3);
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border: var(--ddd-border-sm);
          border-style: var(--ddd-status-missing-line);
          border-color: var(--ddd-status-missing-signal);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-missing-ink);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        .flag simple-icon-lite {
          flex: none;
        }
      `,
    ];
  }

  // text with {name} placeholders filled in
  _fill(text, values) {
    return Object.keys(values).reduce(
      (out, key) => out.split(`{${key}}`).join(String(values[key])),
      String(text || ""),
    );
  }

  /**
   * Words for this ending's score, "" when it has none
   * @returns {String}
   */
  scoreText() {
    const score = Number(this.score);
    if (this.score === null || this.score === "" || Number.isNaN(score)) {
      return "";
    }
    const max = Number(this.maxScore);
    return this.maxScore !== null && !Number.isNaN(max) && max > 0
      ? this._fill(this.t.scoreOf, { score, max })
      : this._fill(this.t.scoreOnly, { score });
  }

  /**
   * Word for this ending ("Good ending"), "" when the scene is not one
   * @returns {String}
   */
  endingWord() {
    const ending = sceneEnding(this);
    return ending ? this.t[ENDINGS[ending].word] : "";
  }

  renderAuthorNotes() {
    return html`<p class="author">
        <span class="badge"
          >${this.t.sceneIdLabel}: <code>${this.sceneId || "?"}</code></span
        >${
          this.isStart
            ? html`<span class="badge">${this.t.startScene}</span>`
            : nothing
        }
      </p>
      ${this.sceneId ? nothing : this.renderFlag(this.t.needsId)}
      ${this.orphan ? this.renderFlag(this.t.orphan) : nothing}
      ${
        this.deadLinks
          ? this.renderFlag(`${this.t.deadLinks} ${this.deadLinks}`)
          : nothing
      }`;
  }

  renderFlag(text) {
    return html`<p class="flag">
      <simple-icon-lite
        icon="icons:warning"
        aria-hidden="true"
      ></simple-icon-lite
      ><span>${text}</span>
    </p>`;
  }

  render() {
    if (!this.active) {
      // a scene that is not the current one draws nothing, so its content
      // is neither shown nor reachable; the light DOM itself is untouched
      return nothing;
    }
    const ending = sceneEnding(this);
    const score = ending ? this.scoreText() : "";
    return html`<section class="scene" data-ending="${ending || nothing}">
      ${this.editing ? this.renderAuthorNotes() : nothing}
      <h3 class="heading" id="heading" tabindex="-1">
        <span class="num"
          >${ending ? this.t.ending : this.t.scene}${
            !ending && this.step ? ` ${this.step}` : ""
          }</span
        >
        ${this.heading}
      </h3>
      ${
        ending
          ? html`<p class="outcome">
              <span class="outcome-chip" aria-hidden="true"
                ><simple-icon-lite
                  icon="${ENDINGS[ending].icon}"
                ></simple-icon-lite></span
              ><strong class="outcome-word">${this.endingWord()}</strong>${
                score
                  ? html`<span class="outcome-score">${score}</span>`
                  : nothing
              }
            </p>`
          : nothing
      }
      <div class="content"><slot></slot></div>
    </section>`;
  }

  /**
   * Move focus to this scene's heading (the scenario calls this when the
   * learner arrives here)
   */
  focusHeading() {
    const heading =
      this.shadowRoot && this.shadowRoot.querySelector("#heading");
    if (heading) {
      heading.focus();
    }
  }

  /**
   * HAX hooks this element implements
   */
  haxHooks() {
    return {
      preProcessNodeToContent: "haxpreProcessNodeToContent",
    };
  }

  /**
   * Saved scenes carry id = scene-id, so the choice links are working page
   * anchors where no JavaScript runs. An id the author set is kept.
   */
  haxpreProcessNodeToContent(node) {
    const sceneId = node.getAttribute("scene-id");
    if (sceneId && !node.getAttribute("id")) {
      node.setAttribute("id", sceneId);
    }
    return node;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }
}

globalThis.customElements.define(BranchingScene.tag, BranchingScene);
