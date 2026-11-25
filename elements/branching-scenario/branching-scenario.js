/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import {
  DDDBlockStyles,
  renderDDDBlockHeader,
  celebrateDDDCompletion,
} from "@haxtheweb/d-d-d/lib/DDDBlock.js";
import { DDDStatusTokens } from "@haxtheweb/d-d-d/lib/DDDStatusTokens.js";
import { DDDAccentStyles } from "@haxtheweb/d-d-d/lib/DDDAccent.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import {
  activityId,
  buildStatement,
  componentIds,
  XAPI_EXTENSIONS,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/user-action/lib/xapi.js";
import { sceneEnding } from "./lib/branching-scene.js";

const SCENE_TAG = "branching-scene";

// what choices link to: the scene's scene-id, or its id when it has none
function sceneKey(scene) {
  return scene.getAttribute("scene-id") || scene.getAttribute("id") || "";
}

// the scene key a link's href names ("#cut" -> "cut"), "" for other links
function hashKey(href) {
  const value = String(href || "");
  if (value.charAt(0) !== "#" || value.length < 2) {
    return "";
  }
  try {
    return decodeURIComponent(value.slice(1));
  } catch {
    return value.slice(1);
  }
}

// a value inside a double quoted CSS attribute selector
function cssString(value) {
  return String(value)
    .replace(/["\\]/g, "\\$&")
    .replace(/[\n\r\f]/g, (c) => `\\${c.charCodeAt(0).toString(16)} `);
}

// the score a scene carries, or null
function sceneScore(scene) {
  const raw = scene.getAttribute("score");
  if (raw === null || raw.trim() === "") {
    return null;
  }
  const score = Number(raw);
  return Number.isNaN(score) ? null : score;
}

const MARKER =
  "var(--ddd-component-branching-scenario-marker, light-dark(var(--ddd-theme-default-beaverBlue), var(--ddd-theme-default-skyBlue)))";
const TINT =
  "var(--ddd-component-branching-scenario-tint, light-dark(var(--ddd-theme-default-skyMaxLight), var(--ddd-theme-default-nittanyNavy)))";

/**
 * `branching-scenario`
 * `A story where each choice leads to a different scene and ending`
 *
 * The scenes are branching-scene children. A choice is an ordinary link in a
 * scene whose href is "#" plus the scene-id of another scene here. Without
 * JavaScript every scene is on the page and those links are page anchors;
 * once this element runs only the current scene is shown and the same links
 * move the learner along the path. Nothing in the light DOM is changed.
 *
 * @demo demo/index.html
 * @element branching-scenario
 * @slot - branching-scene elements, the first is the start unless start names another
 * @fires user-engagement - xAPI statements: progressed for each choice, completed at an ending
 */
export class BranchingScenario extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "branching-scenario";
  }

  constructor() {
    super();
    this.title = "";
    this.start = "";
    this.accentColor = null;
    this.t = {
      scenario: "Scenario",
      directions: "Directions",
      showDirections: "Show directions",
      hideDirections: "Hide directions",
      directionsRead: "Read each scene and choose what you would do.",
      directionsEndings:
        "There are several endings. Try another path after you finish.",
      startOver: "Start over",
      back: "Back one step",
      tryAnother: "Try another path",
      path: "Path",
      scene: "Scene",
      ending: "Ending",
      end: "end",
      scenesSeen: "{seen} of {total} scenes seen",
      endingReached: "Ending reached",
      addScene: "Add scene",
      newScene: "New scene",
      newSceneText: "Describe what happens, then link each choice to a scene.",
      editingNote:
        "Editing: every scene is shown. A choice is a link to # followed by a scene id.",
      noScenes: "Add a scene to start the scenario.",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/branching-scenario.en.json", import.meta.url).href +
        "/../",
    });
    this._path = [];
    this._seen = new Set();
    this._taken = new Map();
    this._endingsSent = new Set();
    this._graph = null;
    this._editing = false;
    this._done = false;
    this._directionsOpen = false;
    this._status = "";
    this._observer = null;
    this._sheet = null;
    this._sheetRoot = null;
    this._onClick = this._onClick.bind(this);
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * Title of the scenario, shown in the header
       */
      title: { type: String },
      /**
       * scene-id of the scene to start at; the first scene when empty
       */
      start: { type: String },
      /**
       * Optional accent for the chip, buttons and choice edge
       */
      accentColor: { type: String, attribute: "accent-color", reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      DDDStatusTokens,
      DDDBlockStyles,
      DDDAccentStyles,
      css`
        :host {
          display: block;
          margin: var(--ddd-stack-gap, var(--ddd-spacing-4)) 0;
          /* accent roles: the palette when the page has one, then the DDD
             defaults; a colour picked on the element wins (below) */
          --ddd-component-branching-scenario-accent: var(
            --ddd-palette-accent,
            light-dark(
              var(--ddd-theme-default-nittanyNavy),
              var(--ddd-theme-default-linkLight)
            )
          );
          --ddd-component-branching-scenario-accent-ink: var(
            --ddd-palette-accent-ink,
            light-dark(
              var(--ddd-theme-default-white),
              var(--ddd-theme-default-potentialMidnight)
            )
          );
          --ddd-component-branching-scenario-marker: var(
            --ddd-palette-marker,
            light-dark(
              var(--ddd-theme-default-beaverBlue),
              var(--ddd-theme-default-skyBlue)
            )
          );
          --ddd-component-branching-scenario-tint: var(
            --ddd-palette-tint,
            light-dark(
              var(--ddd-theme-default-skyMaxLight),
              var(--ddd-theme-default-nittanyNavy)
            )
          );
        }
        :host([accent-color]) {
          --ddd-component-branching-scenario-accent: var(
            --ddd-accent-color,
            var(
              --ddd-palette-accent,
              light-dark(
                var(--ddd-theme-default-nittanyNavy),
                var(--ddd-theme-default-linkLight)
              )
            )
          );
          --ddd-component-branching-scenario-accent-ink: var(
            --ddd-accent-color-ink,
            var(
              --ddd-palette-accent-ink,
              light-dark(
                var(--ddd-theme-default-white),
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
          --ddd-component-branching-scenario-marker: var(
            --ddd-accent-color,
            var(
              --ddd-palette-marker,
              light-dark(
                var(--ddd-theme-default-beaverBlue),
                var(--ddd-theme-default-skyBlue)
              )
            )
          );
          --ddd-component-branching-scenario-tint: var(
            --ddd-accent-color-tint,
            var(
              --ddd-palette-tint,
              light-dark(
                var(--ddd-theme-default-skyMaxLight),
                var(--ddd-theme-default-nittanyNavy)
              )
            )
          );
        }
        :host([accent-color]) .ddd-block {
          --ddd-block-chip-background: var(
            --ddd-accent-color,
            var(
              --ddd-palette-chip,
              light-dark(
                var(--ddd-theme-default-beaverBlue),
                var(--ddd-theme-default-skyBlue)
              )
            )
          );
          --ddd-block-chip-color: var(
            --ddd-accent-color-ink,
            var(
              --ddd-palette-chip-ink,
              light-dark(
                var(--ddd-theme-default-white),
                var(--ddd-theme-default-potentialMidnight)
              )
            )
          );
        }
        :host([hidden]),
        [hidden] {
          display: none !important;
        }
        .ddd-block {
          display: flex;
          flex-direction: column;
          color: var(--ddd-status-default-ink);
          --ddd-block-background: var(--ddd-status-default-bg);
        }
        .directions {
          padding-block: var(--ddd-spacing-3);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
          border-bottom: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        .directions li {
          font-size: inherit;
        }
        .directions ul {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-5);
        }
        .scenes {
          padding-block: var(--ddd-spacing-1);
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
        }
        .action-bar {
          justify-content: flex-end;
          padding-inline: var(--ddd-surface-padding, var(--ddd-spacing-4));
          background-color: var(--ddd-status-answered-bg);
        }
        .progress {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-4);
          flex: 1 1 auto;
          min-width: 0;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .trail {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .trail-label {
          margin-inline-end: var(--ddd-spacing-1);
          font-weight: var(--ddd-font-weight-bold);
        }
        .trail-list {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-1);
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          list-style: none;
        }
        .trail-item {
          margin: var(--ddd-spacing-0);
          padding: var(--ddd-spacing-0);
          font-size: inherit;
          line-height: var(--ddd-lh-140);
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1);
        }
        .trail-item + .trail-item::before {
          content: "\\2192";
        }
        .trail .stop {
          padding: var(--ddd-spacing-0) var(--ddd-spacing-2);
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-default-signal);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ddd-status-default-bg);
          color: var(--ddd-status-default-ink);
        }
        .trail-item[aria-current] .stop {
          border-color: var(--ddd-component-branching-scenario-marker);
          border-inline-start-width: var(--ddd-border-size-lg);
        }
        .note {
          margin: var(--ddd-spacing-0);
          flex: 1 1 auto;
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-5xs);
          line-height: var(--ddd-lh-140);
        }
        .buttons {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2);
        }
        :host .action-bar button {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          box-sizing: border-box;
          min-height: var(--ddd-control-height-sm);
          margin: var(--ddd-spacing-0);
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-xs);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-medium);
          cursor: pointer;
          --simple-icon-color: currentColor;
          --simple-icon-width: var(--ddd-icon-3xs);
          --simple-icon-height: var(--ddd-icon-3xs);
        }
        :host .action-bar #again {
          border: var(--ddd-border-xs);
          border-color: var(--ddd-component-branching-scenario-accent);
          background-color: var(--ddd-component-branching-scenario-accent);
          color: var(--ddd-component-branching-scenario-accent-ink);
        }
        :host .action-bar #back {
          border: var(--ddd-border-xs);
          border-color: var(--ddd-status-answered-signal);
          background-color: transparent;
          color: var(--ddd-status-answered-ink);
        }
        :host .action-bar button:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this._onClick);
    if (globalThis.MutationObserver) {
      this._observer = new globalThis.MutationObserver(() => this._refresh());
      this._observer.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["href", "scene-id", "id", "ending", "score"],
      });
    }
    this._refresh();
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onClick);
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    this._dropLinkStyles();
    const chip =
      this.shadowRoot && this.shadowRoot.querySelector(".ddd-block-chip");
    if (chip && chip.__dddCelebrate) {
      clearTimeout(chip.__dddCelebrate);
    }
    super.disconnectedCallback();
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (
      changedProperties.has("start") &&
      this._graph &&
      this._graph.startKey !== this.start
    ) {
      this._refresh();
    }
    this._syncScenes();
    this._applyLinkStyles();
  }

  /**
   * The scenes of this scenario, in authored order
   * @returns {Element[]}
   */
  get scenes() {
    return Array.from(this.children).filter((c) => c.localName === SCENE_TAG);
  }

  /**
   * The scene the learner is on, null when there are no scenes
   * @returns {Element|null}
   */
  get currentScene() {
    return this._path.length ? this._path[this._path.length - 1] : null;
  }

  /**
   * The scenes the learner went through to get here, start first
   * @returns {Element[]}
   */
  get path() {
    return this._path.slice();
  }

  // read the scenes and their links again; called when the content changes
  _refresh() {
    const scenes = this.scenes;
    const byKey = new Map();
    scenes.forEach((scene) => {
      const key = sceneKey(scene);
      if (key && !byKey.has(key)) {
        byKey.set(key, scene);
      }
    });
    const root = this.getRootNode();
    const info = new Map();
    const linked = new Set();
    scenes.forEach((scene) => {
      const choices = [];
      const dead = [];
      Array.from(
        globalThis.Element.prototype.querySelectorAll.call(scene, "a[href]"),
      ).forEach((a) => {
        const href = a.getAttribute("href");
        const key = hashKey(href);
        const target = key ? byKey.get(key) : null;
        if (!key || target === scene) {
          // not a choice: another kind of link, or a scene linking to itself
          return;
        }
        if (target) {
          choices.push({ href, target });
          linked.add(target);
        } else if (
          !(root && root.getElementById && root.getElementById(key)) &&
          !dead.includes(href)
        ) {
          dead.push(href);
        }
      });
      info.set(scene, { choices, dead });
    });
    const start = (this.start && byKey.get(this.start)) || scenes[0] || null;
    this._graph = { scenes, byKey, info, linked, start, startKey: this.start };
    // keep the part of the path that still exists
    const path = [];
    for (let i = 0; i < this._path.length; i++) {
      if (!scenes.includes(this._path[i])) {
        break;
      }
      path.push(this._path[i]);
    }
    this._path = path.length && path[0] === start ? path : start ? [start] : [];
    this._seen = new Set(
      Array.from(this._seen).filter((scene) => scenes.includes(scene)),
    );
    if (start) {
      this._seen.add(start);
    }
    this.requestUpdate();
  }

  // the highest score an ending here carries, null when none has one
  _maxScore() {
    const scores = this.scenes
      .filter((scene) => sceneEnding(scene))
      .map((scene) => sceneScore(scene))
      .filter((score) => score !== null);
    return scores.length ? Math.max(...scores) : null;
  }

  // tell each scene what to show; properties only, never attributes
  _syncScenes() {
    if (!this._graph) {
      return;
    }
    const g = this._graph;
    const current = this.currentScene;
    const max = this._maxScore();
    const set = (scene, name, value) => {
      if (scene[name] !== value) {
        scene[name] = value;
      }
    };
    g.scenes.forEach((scene) => {
      const editing = this._editing;
      set(scene, "editing", editing);
      set(scene, "active", editing || scene === current);
      set(scene, "step", editing ? 0 : this._path.indexOf(scene) + 1);
      set(scene, "maxScore", max);
      set(scene, "isStart", editing && scene === g.start);
      set(
        scene,
        "orphan",
        editing && scene !== g.start && !g.linked.has(scene),
      );
      set(scene, "deadLinks", editing ? g.info.get(scene).dead.join(", ") : "");
    });
  }

  /*
   * The choices of the current scene are links in the light DOM, which this
   * element never changes. They get their button look from one small sheet
   * adopted by the document (or the shadow root this element is in) that
   * names only those links; it is taken away while editing and on removal.
   */
  _applyLinkStyles() {
    const current = this.currentScene;
    const info = current && this._graph ? this._graph.info.get(current) : null;
    const root = this.getRootNode();
    if (
      this._editing ||
      !info ||
      !info.choices.length ||
      !this.isConnected ||
      !root ||
      !Array.isArray(root.adoptedStyleSheets) ||
      !globalThis.CSSStyleSheet
    ) {
      this._dropLinkStyles();
      return;
    }
    const key = sceneKey(current);
    const attr = current.getAttribute("scene-id") ? "scene-id" : "id";
    const scene = `${SCENE_TAG}[${attr}="${cssString(key)}"]`;
    const list = (choices) =>
      `:is(${choices.map((c) => `a[href="${cssString(c.href)}"]`).join(",")})`;
    const all = list(info.choices);
    const took = this._taken.get(current);
    const taken = info.choices.filter((c) => took && took.has(c.target));
    const text = [
      `${scene} :is(ul,ol):has(> li > ${all}){margin:0;padding:0;}`,
      `${scene} li:has(> ${all}){margin:0;padding:0;list-style:none;}`,
      `${scene} ${all}{display:block;box-sizing:border-box;min-height:var(--ddd-control-height-sm);margin-block:var(--ddd-spacing-2) 0;padding:var(--ddd-spacing-2) var(--ddd-spacing-3);border:var(--ddd-border-xs);border-color:light-dark(var(--ddd-theme-default-limestoneGray),var(--ddd-theme-default-slateLight));border-radius:var(--ddd-radius-sm);background-color:light-dark(var(--ddd-theme-default-white),var(--ddd-theme-default-coalyGray));color:light-dark(var(--ddd-theme-default-nittanyNavy),var(--ddd-theme-default-white));font-family:var(--ddd-font-navigation);font-size:var(--ddd-font-size-4xs);font-weight:var(--ddd-font-weight-medium);line-height:var(--ddd-lh-150);text-align:start;text-decoration:none;cursor:pointer;}`,
      `${scene} ${all}:is(:hover,:focus-visible){border-color:${MARKER};background-color:${TINT};}`,
      `${scene} ${all}:focus-visible{outline:var(--ddd-focus-ring);outline-offset:var(--ddd-focus-offset);}`,
      taken.length
        ? `${scene} ${list(taken)}{border-color:${MARKER};border-inline-start-width:var(--ddd-border-size-lg);}`
        : "",
    ].join("\n");
    if (this._sheetRoot !== root) {
      this._dropLinkStyles();
      this._sheet = new globalThis.CSSStyleSheet();
      this._sheetRoot = root;
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, this._sheet];
    }
    if (this._sheetText !== text) {
      this._sheetText = text;
      this._sheet.replaceSync(text);
    }
  }

  _dropLinkStyles() {
    if (this._sheet && this._sheetRoot) {
      this._sheetRoot.adoptedStyleSheets =
        this._sheetRoot.adoptedStyleSheets.filter((s) => s !== this._sheet);
    }
    this._sheet = null;
    this._sheetRoot = null;
    this._sheetText = "";
  }

  // is HAX editing right now (the hook told us, or the store says so)
  _isEditing() {
    const store =
      globalThis.HaxStore &&
      typeof globalThis.HaxStore.requestAvailability === "function"
        ? globalThis.HaxStore.requestAvailability()
        : null;
    return this._editing || Boolean(store && store.editMode);
  }

  // a click on a choice link of the current scene moves along the path
  _onClick(e) {
    if (
      this._isEditing() ||
      e.defaultPrevented ||
      e.button ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      !this._graph
    ) {
      return;
    }
    const current = this.currentScene;
    const trail = e.composedPath();
    let link = null;
    for (let i = 0; i < trail.length && trail[i] !== this; i++) {
      const node = trail[i];
      if (!link && node.localName === "a" && node.hasAttribute("href")) {
        link = node;
      }
      if (node === current && link) {
        const target = this._graph.byKey.get(
          hashKey(link.getAttribute("href")),
        );
        if (target && target !== current) {
          e.preventDefault();
          this.choose(target);
        }
        return;
      }
    }
  }

  /**
   * Take the choice that leads to a scene. A scene already on the path is
   * gone back to rather than visited twice.
   * @param {Element} target a branching-scene of this scenario
   */
  choose(target) {
    const from = this.currentScene;
    if (
      !this._graph ||
      !this._graph.scenes.includes(target) ||
      target === from
    ) {
      return;
    }
    if (from) {
      if (!this._taken.has(from)) {
        this._taken.set(from, new Set());
      }
      this._taken.get(from).add(target);
    }
    const at = this._path.indexOf(target);
    this._path =
      at === -1 ? [...this._path, target] : this._path.slice(0, at + 1);
    this._seen.add(target);
    this._sendProgress(target);
    return this._arrive(target);
  }

  /**
   * Go back to the scene before this one
   */
  back() {
    if (this._path.length < 2) {
      return;
    }
    this._path = this._path.slice(0, -1);
    return this._arrive(this.currentScene);
  }

  /**
   * Start again from the first scene; the scenes seen so far stay counted
   */
  restart() {
    if (!this._graph || !this._graph.start) {
      return;
    }
    this._path = [this._graph.start];
    return this._arrive(this.currentScene);
  }

  // show the scene, say where the learner is and put focus on its heading
  async _arrive(scene) {
    this.requestUpdate();
    await this.updateComplete;
    if (scene.updateComplete) {
      await scene.updateComplete;
    }
    if (scene !== this.currentScene) {
      // the learner already moved on
      return;
    }
    this._status = this._describe(scene);
    this.requestUpdate();
    if (typeof scene.focusHeading === "function") {
      scene.focusHeading();
    }
    await this.updateComplete;
  }

  // "Scene 2: Kickback" or "Ending: Safe call. Good ending. Score 3 of 3"
  _describe(scene) {
    const heading = scene.getAttribute("heading") || "";
    if (!sceneEnding(scene)) {
      return `${this.t.scene} ${this._path.indexOf(scene) + 1}: ${heading}`;
    }
    const parts = [`${this.t.ending}: ${heading}`];
    if (typeof scene.endingWord === "function") {
      parts.push(scene.endingWord(), scene.scoreText());
    }
    return parts.filter((part) => part).join(". ");
  }

  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "branching-scenario",
      event: "user-engagement",
      verbs: ["progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "sequencing",
      definition: ["name", "interactionType", "choices"],
      response:
        "scene ids of the path the learner took, in order, joined by [,]",
      result: ["success", "completion", "response", "score"],
      countsTowardCompletion: true,
      done: "any ending reached",
    };
  }

  // what identifies this scenario when it has no id
  xapiFingerprint() {
    return `${this.title || ""}\u0001${this.scenes.map(sceneKey).join("\u0001")}`;
  }

  // the scenes as xAPI components: stable ids from their scene ids
  xapiComponents() {
    const scenes = this.scenes.filter((scene) => sceneKey(scene));
    const ids = componentIds(scenes.map(sceneKey));
    return scenes.map((scene, i) => ({
      scene,
      id: ids[i],
      description: scene.getAttribute("heading") || sceneKey(scene),
    }));
  }

  _statement(verb, result) {
    const name = (this.title || this.t.scenario).slice(0, 120);
    const components = this.xapiComponents();
    const response = this._path
      .map((scene) => components.find((c) => c.scene === scene))
      .filter((c) => c)
      .map((c) => c.id)
      .join(XAPI_ITEM_DELIMITER);
    return {
      name,
      statement: buildStatement({
        verb,
        object: {
          id: activityId(this, this.xapiFingerprint()),
          name,
          interactionType: "sequencing",
          choices: components.map(({ id, description }) => ({
            id,
            description,
          })),
        },
        result: { ...result, response },
        context: {
          extensions: { [XAPI_EXTENSIONS.element]: BranchingScenario.tag },
        },
      }),
    };
  }

  _dispatch(detail) {
    this.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail,
      }),
    );
  }

  // learner data: progressed for the choice just made and, the first time
  // each ending is reached in a visit, completed with its score. Never while
  // HAX is editing.
  _sendProgress(scene) {
    if (this._isEditing()) {
      return;
    }
    const progressed = this._statement("progressed", { completion: false });
    this._dispatch({
      activityDisplay: "progressed",
      objectName: progressed.name,
      statement: progressed.statement,
    });
    const ending = sceneEnding(scene);
    if (!ending || this._endingsSent.has(scene)) {
      return;
    }
    this._endingsSent.add(scene);
    const first = !this._done;
    this._done = true;
    const result = { completion: true, success: ending === "good" };
    const raw = sceneScore(scene);
    const max = this._maxScore();
    if (raw !== null && max !== null) {
      result.score = { raw, max, min: Math.min(0, raw) };
    }
    const completed = this._statement("completed", result);
    this._dispatch({
      activityDisplay: "completed",
      objectName: completed.name,
      resultSuccess: result.success,
      statement: completed.statement,
    });
    if (first) {
      this.updateComplete.then(() => {
        celebrateDDDCompletion(
          this.shadowRoot && this.shadowRoot.querySelector(".ddd-block-chip"),
        );
      });
    }
  }

  _toggleDirections() {
    this._directionsOpen = !this._directionsOpen;
    this.requestUpdate();
  }

  // text with {name} placeholders filled in
  _fill(text, values) {
    return Object.keys(values).reduce(
      (out, key) => out.split(`{${key}}`).join(String(values[key])),
      String(text || ""),
    );
  }

  renderTrail() {
    const total = this._graph ? this._graph.scenes.length : 0;
    return html`<div class="progress">
      <div class="trail">
        <span class="trail-label" id="trail-label">${this.t.path}</span>
        <span class="trail-list" role="list" aria-labelledby="trail-label">
          ${this._path.map(
            (scene, i) =>
              html`<span
                class="trail-item"
                role="listitem"
                aria-current="${i === this._path.length - 1 ? "step" : nothing}"
              >
                <span class="stop"
                  ><span class="sr-only">${this.t.scene} </span>${i + 1}<span
                    class="sr-only"
                    >: ${scene.getAttribute("heading") || ""}</span
                  >${sceneEnding(scene) ? ` · ${this.t.end}` : ""}</span
                >
              </span>`,
          )}
        </span>
      </div>
      <span class="seen" id="seen"
        >${this._fill(this.t.scenesSeen, {
          seen: this._seen.size,
          total,
        })}</span
      >
    </div>`;
  }

  renderActions() {
    const moved = this._path.length > 1;
    return html`<button
        class="ddd-block-action"
        id="directions-toggle"
        type="button"
        aria-controls="directions"
        aria-expanded="${this._directionsOpen ? "true" : "false"}"
        aria-label="${
          this._directionsOpen ? this.t.hideDirections : this.t.showDirections
        }"
        title="${this.t.directions}"
        @click="${this._toggleDirections}"
      >
        <simple-icon-lite
          icon="icons:info-outline"
          aria-hidden="true"
        ></simple-icon-lite></button
      >${
        this._editing
          ? nothing
          : html`<button
              class="ddd-block-action"
              id="restart"
              type="button"
              aria-label="${this.t.startOver}"
              title="${this.t.startOver}"
              ?disabled="${!moved}"
              @click="${this.restart}"
            >
              <simple-icon-lite
                icon="av:replay"
                aria-hidden="true"
              ></simple-icon-lite>
            </button>`
      }`;
  }

  render() {
    const current = this.currentScene;
    const atEnding = Boolean(current && sceneEnding(current));
    const moved = this._path.length > 1;
    const empty = Boolean(this._graph && !this._graph.scenes.length);
    return html`<div class="ddd-block" role="group" aria-labelledby="header">
      ${renderDDDBlockHeader({
        id: "header",
        icon: "communication:call-split",
        label: this.t.scenario,
        title: this.title,
        done: this._done && !this._editing,
        doneLabel: this.t.endingReached,
        actions: this.renderActions(),
      })}
      <div
        id="directions"
        class="directions"
        ?hidden="${!this._directionsOpen}"
      >
        <span class="sr-only">${this.t.directions}: </span>
        <ul>
          <li>${this.t.directionsRead}</li>
          <li>${this.t.directionsEndings}</li>
        </ul>
      </div>
      <div class="ddd-block-body scenes"><slot></slot></div>
      <div class="sr-only" id="status" role="status">${this._status}</div>
      <div class="ddd-block-footer action-bar" ?hidden="${!this._graph}">
        ${
          this._editing || empty
            ? html`<p class="note">
                ${empty ? this.t.noScenes : this.t.editingNote}
              </p>`
            : html`${this.renderTrail()}
                <div class="buttons">
                  <button
                    id="back"
                    type="button"
                    ?hidden="${!moved}"
                    @click="${this.back}"
                  >
                    <simple-icon-lite
                      icon="icons:arrow-back"
                      aria-hidden="true"
                    ></simple-icon-lite
                    >${this.t.back}
                  </button>
                  <button
                    id="again"
                    type="button"
                    ?hidden="${!atEnding}"
                    @click="${this.restart}"
                  >
                    <simple-icon-lite
                      icon="av:replay"
                      aria-hidden="true"
                    ></simple-icon-lite
                    >${this.t.tryAnother}
                  </button>
                </div>`
        }
      </div>
    </div>`;
  }

  /**
   * HAX hooks this element implements
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
      editModeChanged: "haxeditModeChanged",
      inlineContextMenu: "haxinlineContextMenu",
    };
  }

  /**
   * Register the haxProperties locales so HAX can translate the editor UI.
   * Files live at locales/branching-scenario.haxProperties.<lang>.json
   */
  haxgizmoRegistration() {
    globalThis.dispatchEvent(
      new CustomEvent("i18n-manager-register-element", {
        detail: {
          namespace: "branching-scenario.haxProperties",
          localesPath:
            new URL("./locales/branching-scenario.en.json", import.meta.url)
              .href + "/../",
        },
      }),
    );
  }

  /**
   * Editing shows every scene so each can be edited, and starts from a
   * clean slate: where a learner was on the path never reaches authoring.
   */
  haxeditModeChanged(value) {
    this._editing = Boolean(value);
    this._taken = new Map();
    this._done = false;
    this._status = "";
    const start = this._graph ? this._graph.start : null;
    this._path = start ? [start] : [];
    this._seen = new Set(this._path);
    this.requestUpdate();
  }

  haxinlineContextMenu(ceMenu) {
    ceMenu.ceButtons = [
      {
        icon: "icons:add",
        callback: "haxAddScene",
        label: this.t.addScene,
      },
    ];
  }

  /**
   * Add an empty scene at the end, with a scene id nothing else here uses
   * @returns {Boolean} true so HAX keeps the menu open
   */
  haxAddScene() {
    const used = this.scenes.map(sceneKey);
    let n = used.length + 1;
    while (used.includes(`scene-${n}`)) {
      n++;
    }
    const scene = globalThis.document.createElement(SCENE_TAG);
    scene.setAttribute("scene-id", `scene-${n}`);
    scene.setAttribute("heading", this.t.newScene);
    scene.setAttribute("data-hax-layout", "true");
    scene.setAttribute("data-hax-ray", SCENE_TAG);
    const p = globalThis.document.createElement("p");
    p.textContent = this.t.newSceneText;
    scene.appendChild(p);
    this.appendChild(scene);
    return true;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(BranchingScenario.tag, BranchingScenario);
