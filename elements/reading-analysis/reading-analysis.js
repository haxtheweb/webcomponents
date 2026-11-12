/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 * @demo demo/index.html
 */
import { html, css, nothing } from "lit";
import {
  QuestionElement,
  choiceResponse,
  XAPI_ITEM_DELIMITER,
} from "@haxtheweb/multiple-choice/lib/QuestionElement.js";
import { componentIds } from "@haxtheweb/user-action/lib/xapi.js";
import { buildReading, normalizeText } from "./lib/reading-segments.js";

// flag colours and shapes: a flag is never told apart by colour alone
const FLAG_STYLES = 7;
const FLAG_SHAPES = [
  "M7 2a5 5 0 1 1 0 10A5 5 0 0 1 7 2z",
  "M7 1.5 13 12.5H1z",
  "M7 1 13 7 7 13 1 7z",
  "M2 2h10v10H2z",
  "M7 1l1.8 3.9 4.2.5-3.1 2.9.8 4.2L7 10.4 3.3 12.5l.8-4.2L1 5.4l4.2-.5z",
  "M4 1.5h6L13 7l-3 5.5H4L1 7z",
  "M5 1h4v4h4v4H9v4H5V9H1V5h4z",
];

/**
 * `reading-analysis`
 * Learners stick labelled flags beside the sentences, paragraphs or figures
 * of an authored reading that are evidence for each label, or select the
 * one passage that best answers a question.
 *
 * Authored content is the default slot (any HTML). The answer key lives in
 * light dom inputs like every QuestionElement: one input per flag,
 * `<input value="Flag label" data-targets="c-1a2b3c4d,c-...">`, and in
 * select-one mode `<input data-select-one data-targets="c-...">`.
 *
 * @demo demo/index.html
 * @element reading-analysis
 */
export class ReadingAnalysis extends QuestionElement {
  static get tag() {
    return "reading-analysis";
  }
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "reading-analysis",
      event: "user-engagement",
      verbs: ["answered"],
      objectType: "http://adlnet.gov/expapi/activities/cmi.interaction",
      interactionType: "choice",
      definition: [
        "name",
        "interactionType",
        "choices",
        "correctResponsesPattern",
      ],
      response:
        "flag mode: ids of the flag-and-passage pairs placed, joined by [,]; select-one mode: the id of the passage chosen",
      result: [
        "success",
        "completion",
        "response",
        "score",
        "extensions.attempts",
        "extensions.max-attempts",
      ],
      countsTowardCompletion: true,
      done: "every expected flag placed with no wrong ones (or the right passage selected), or out of attempts",
    };
  }

  constructor() {
    super();
    this.t = {
      ...this.t,
      questionType: "Reading analysis",
      flags: "Flags",
      flagDirections:
        "Pick a flag, then select each {unit} or figure in the reading that is evidence for it. Select a flag in the margin to remove it. When you are done, press {checkAnswer}.",
      selectOneDirections:
        "Select the {unit} that best answers the question, then press {checkAnswer}.",
      unitSentence: "sentence",
      unitParagraph: "paragraph",
      unitFigure: "figure",
      sentenceN: "Sentence {n}",
      paragraphN: "Paragraph {n}",
      figureN: "Figure {n}",
      holding: "Holding {flag}. Select where it belongs. Escape puts it back.",
      pickAFlag: "Pick a flag, then select where it belongs.",
      flagUsed: "used {count} times",
      flagPlaced: "{flag} flag placed beside {target}",
      flagRemoved: "{flag} flag removed from {target}",
      flagAlready: "{flag} is already beside {target}",
      flagOnTarget: "{flag} beside {target}",
      peelOff: "Select to remove",
      expected: "Expected",
      selected: "{target} selected",
      flagsFound: "{correct} of {total} found",
      toRethink: "{count} to rethink",
      notEvidence: "not evidence for this flag",
      isEvidence: "evidence for this flag",
      readingKeys: "Use the arrow keys to move from one {unit} to the next.",
      markAnswers: "Mark answers",
      doneMarking: "Done marking answers",
      editHint:
        "Edit the reading below. Use Mark answers in the block menu to choose where each flag belongs.",
      markingHint:
        "Marking answers: pick a flag, then select each place it belongs. Learners never see this layer.",
      noTargets: "Add a reading with paragraphs or figures to this block.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("./locales/", import.meta.url).href,
    });
    this.question = "";
    this.mode = "flag";
    this.unit = "sentence";
    this.guessDataValue = "_placed";
    this._placed = [];
    this._picked = "";
    this._held = "";
    this._marking = false;
    this._targets = [];
    this._rovingId = "";
    this._selectKey = [];
    this._readingDirty = true;
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onScroll = this._onScroll.bind(this);
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * "flag": stick labelled flags on evidence; "one": select one passage
       */
      mode: { type: String, reflect: true },
      /**
       * what a learner points at: "sentence", "paragraph" or "figure"
       */
      unit: { type: String, reflect: true },
      _placed: { type: Array, state: true },
      _picked: { type: String, state: true },
      _held: { type: String, state: true },
      _marking: { type: Boolean, state: true },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("keyup", this._onKeyUp);
    if (typeof globalThis.MutationObserver === "function") {
      this._observer = new globalThis.MutationObserver((records) => {
        // only authored content changes rebuild the reading
        const relevant = records.some(
          (r) =>
            r.type === "characterData" ||
            Array.from(r.addedNodes)
              .concat(Array.from(r.removedNodes))
              .some((n) => !(n.nodeType === 1 && n.matches("input"))),
        );
        if (relevant) {
          this._readingDirty = true;
          this.requestUpdate();
        }
      });
      this._observer.observe(this, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
    if (typeof globalThis.ResizeObserver === "function") {
      this._resize = new globalThis.ResizeObserver(() => {
        this._layoutMargin();
        this._pinRail();
      });
      this._resize.observe(this);
    }
    // capture catches scrolling in any container (themes often wrap content
    // in one), not only the window
    globalThis.addEventListener("scroll", this._onScroll, {
      capture: true,
      passive: true,
    });
    globalThis.addEventListener("resize", this._onScroll, { passive: true });
  }
  disconnectedCallback() {
    globalThis.removeEventListener("keyup", this._onKeyUp);
    globalThis.removeEventListener("scroll", this._onScroll, { capture: true });
    globalThis.removeEventListener("resize", this._onScroll);
    if (this._observer) {
      this._observer.disconnect();
    }
    if (this._resize) {
      this._resize.disconnect();
    }
    super.disconnectedCallback();
  }
  _onKeyUp(e) {
    if (e.key === "Escape" && this._held) {
      this._held = "";
    }
  }
  _onScroll() {
    if (this._railFrame) {
      return;
    }
    this._railFrame = globalThis.requestAnimationFrame(() => {
      this._railFrame = null;
      this._pinRail();
    });
  }
  /**
   * Keep the action bar (flag pad + check) on screen while the reading is.
   * position: sticky does the job on a plain page, but any ancestor with
   * overflow hidden or auto (HAX themes, galleries) stops it, so when the
   * bar would sit below the viewport while the reading is still showing it
   * is pinned to the bottom of the viewport instead.
   */
  _pinRail() {
    const root = this.shadowRoot;
    const bar = root && root.querySelector(".shell-action-bar");
    const shell = root && root.querySelector(".shell");
    const desk = root && root.querySelector(".desk");
    if (!bar || !shell) {
      return;
    }
    const pinned = bar.classList.contains("ra-pinned");
    const vh = globalThis.innerHeight || 0;
    let want = false;
    if (desk && !this._authoring() && vh) {
      const barH = bar.offsetHeight;
      const d = desk.getBoundingClientRect();
      const s = shell.getBoundingClientRect();
      // while pinned, the shell keeps the bar's space as padding, so the
      // page does not get shorter and the bar's place in the flow is the
      // bottom of the shell
      const naturalBottom = pinned
        ? s.bottom
        : bar.getBoundingClientRect().bottom;
      want = d.top < vh - barH && d.bottom > barH && naturalBottom > vh + 1;
      if (want) {
        bar.style.left = `${Math.max(0, s.left)}px`;
        bar.style.width = `${Math.min(s.width, globalThis.innerWidth)}px`;
        if (!pinned) {
          shell.style.paddingBottom = `${barH}px`;
        }
      }
    }
    if (want !== pinned) {
      bar.classList.toggle("ra-pinned", want);
      if (!want) {
        bar.style.left = "";
        bar.style.width = "";
        shell.style.paddingBottom = "";
      }
    }
  }

  // ---------- answer key ----------

  // no targets default here: an answer that arrives without targets (HAX's
  // array editor) gets its previous ones back in _keepTargets
  answerPrototype() {
    return { ...super.answerPrototype(), correct: true };
  }
  processInput(index, inputs, answers) {
    const out = super.processInput(index, inputs, answers);
    const input = inputs[index];
    if (input && typeof input.getAttribute === "function") {
      const raw = input.getAttribute("data-targets") || "";
      out.targets = raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      out.selectOne = input.hasAttribute("data-select-one");
      out.correct = true;
    } else if (input) {
      out.targets = Array.isArray(input.targets) ? input.targets.slice() : [];
      out.selectOne = Boolean(input.selectOne);
      out.correct = true;
    }
    return out;
  }
  loadLightDomData() {
    super.loadLightDomData();
    this._splitKey();
  }
  // the select-one key travels as one input of its own; flags are the rest
  _splitKey() {
    const all = Array.isArray(this.answers) ? this.answers : [];
    const one = all.find((a) => a && a.selectOne);
    if (one) {
      this._selectKey = (one.targets || []).slice(0, 1);
      this.answers = all.filter((a) => a && !a.selectOne);
    }
  }
  // HAX's array editor rebuilds flag objects from its fields; keep each
  // flag's targets across those edits by label
  _keepTargets(prev) {
    const byLabel = {};
    (prev || []).forEach((a) => {
      if (a && a.label && Array.isArray(a.targets)) {
        byLabel[a.label] = a.targets;
      }
    });
    (this.answers || []).forEach((a) => {
      if (a && !Array.isArray(a.targets)) {
        a.targets = byLabel[a.label] ? byLabel[a.label].slice() : [];
      }
    });
  }
  _flags() {
    return (this.answers || []).filter(
      (a) => a && normalizeText(a.label) && !a.selectOne,
    );
  }
  _flagIds() {
    const flags = this._flags();
    const ids = componentIds(flags.map((f) => normalizeText(f.label)));
    return flags.map((f, i) => ({
      id: ids[i],
      flag: f,
      style: i % FLAG_STYLES,
    }));
  }
  _flagById(id) {
    return this._flagIds().find((f) => f.id === id) || null;
  }
  _targetById(id) {
    return this._targets.find((t) => t.id === id) || null;
  }
  // expected pairs, [{ f, t }], only for targets that exist in the reading
  _keyPairs() {
    const out = [];
    this._flagIds().forEach((f) => {
      (f.flag.targets || []).forEach((t) => {
        if (this._targetById(t)) {
          out.push({ f: f.id, t });
        }
      });
    });
    return out;
  }

  async haxpreProcessNodeToContent(node) {
    // the select-one key rides along as one more input
    const answers = node.answers;
    if (node.mode === "one" && node._selectKey && node._selectKey.length) {
      node.answers = [
        ...(answers || []),
        {
          ...this.answerPrototype(),
          label: "",
          selectOne: true,
          targets: node._selectKey.slice(),
        },
      ];
    }
    const flags = node.answers || [];
    node = await super.haxpreProcessNodeToContent(node);
    const inputs = Array.from(node.querySelectorAll("input:not([slot])"));
    inputs.forEach((input, i) => {
      const a = flags[i];
      // every flag is "correct" somewhere; the key is data-targets
      input.removeAttribute("data-correct");
      if (a && Array.isArray(a.targets) && a.targets.length) {
        input.setAttribute("data-targets", a.targets.join(","));
      }
      if (a && a.selectOne) {
        input.setAttribute("data-select-one", "");
      }
    });
    node.answers = answers;
    return node;
  }

  // ---------- learner answer ----------

  getGuess() {
    if (this.mode === "one") {
      return this._picked ? [this._picked] : [];
    }
    return this._placed;
  }
  guessCount() {
    return this.getGuess().length;
  }
  isCorrect() {
    if (this.mode === "one") {
      return Boolean(this._picked) && this._selectKey[0] === this._picked;
    }
    const key = this._keyPairs();
    if (!key.length) {
      return false;
    }
    const has = (list, p) => list.some((x) => x.f === p.f && x.t === p.t);
    return (
      key.every((p) => has(this._placed, p)) &&
      this._placed.every((p) => has(key, p))
    );
  }
  // right / wrong for one placed flag once checked
  _placementCorrect(p) {
    return this._keyPairs().some((k) => k.f === p.f && k.t === p.t);
  }
  // expected pairs the learner has found (each counted once)
  _foundPairs() {
    return this._keyPairs().filter((k) =>
      this._placed.some((p) => p.f === k.f && p.t === k.t),
    );
  }
  resetAnswer(e) {
    // a correct answer starts over; a wrong one keeps its flags to fix
    if (this.isCorrect() || this.attemptsExhausted()) {
      this._placed = [];
      this._picked = "";
    }
    this._held = "";
    super.resetAnswer(e);
  }

  // ---------- xAPI ----------
  // Flag mode is sent as "choice", not "matching": one flag can be evidence
  // in several places and one passage can carry several flags, and a
  // matching response may pair each source only once. Each choice is one
  // flag beside one passage ("Racism · Sentence 3"), so the response is the
  // set of pairs the learner placed. Select-one mode: each choice is a
  // passage.

  xapiInteractionType() {
    return "choice";
  }
  // every flag-and-passage pair as a choice: [{ id, description, f, t }]
  _xapiPairs() {
    const pairs = [];
    this._flagIds().forEach((f) => {
      this._targets.forEach((t) => {
        pairs.push({
          f: f.id,
          t: t.id,
          description: `${normalizeText(f.flag.label)} · ${t.label}`,
        });
      });
    });
    const ids = componentIds(pairs.map((p) => `${p.f}:${p.t}`));
    return pairs.map((p, i) => ({ ...p, id: ids[i] }));
  }
  // pair ids for placements, once each: placing the same flag twice beside
  // one passage is still one choice in the response
  _pairIds(list) {
    const table = this._xapiPairs();
    const ids = (list || [])
      .map((p) => {
        const hit = table.find((x) => x.f === p.f && x.t === p.t);
        return hit ? hit.id : "";
      })
      .filter(Boolean);
    return ids.filter((id, i) => ids.indexOf(id) === i);
  }
  xapiDefinition() {
    if (this.mode === "one") {
      const out = {
        choices: this._targets.map((t) => ({ id: t.id, description: t.label })),
      };
      if (this._selectKey[0] && this._targetById(this._selectKey[0])) {
        out.correctResponsesPattern = [choiceResponse(this._selectKey)];
      }
      return out;
    }
    const out = {
      choices: this._xapiPairs().map(({ id, description }) => ({
        id,
        description,
      })),
    };
    const key = this._pairIds(this._keyPairs());
    if (key.length) {
      out.correctResponsesPattern = [choiceResponse(key)];
    }
    return out;
  }
  learnerResponse() {
    if (this.mode === "one") {
      return choiceResponse(this._picked ? [this._picked] : []);
    }
    return choiceResponse(this._pairIds(this._placed));
  }
  learnerScore(correct) {
    if (this.mode === "one") {
      return { raw: correct ? 1 : 0, max: 1 };
    }
    return {
      raw: this._foundPairs().length,
      max: Math.max(1, this._keyPairs().length),
    };
  }
  _canRestoreGuess() {
    return true;
  }
  restoreLearnerResponse(response) {
    if (typeof response !== "string" || !response) {
      return false;
    }
    this._ensureReading();
    const tokens = response.split(XAPI_ITEM_DELIMITER);
    if (this.mode === "one") {
      if (this._targetById(tokens[0])) {
        this._picked = tokens[0];
        return true;
      }
      return false;
    }
    const table = this._xapiPairs();
    const placed = [];
    tokens.forEach((tok) => {
      const hit = table.find((x) => x.id === tok);
      if (hit) {
        placed.push({ f: hit.f, t: hit.t });
      }
    });
    this._placed = placed;
    return placed.length > 0;
  }
  forgetLearnerResponse() {
    this._placed = [];
    this._picked = "";
  }

  // ---------- HAX ----------

  haxeditModeChanged(value) {
    super.haxeditModeChanged(value);
    this._marking = false;
    this._held = "";
    this._readingDirty = true;
    this.requestUpdate();
  }
  haxinlineContextMenu(ceMenu) {
    super.haxinlineContextMenu(ceMenu);
    ceMenu.ceButtons = [
      ...(ceMenu.ceButtons || []),
      {
        icon: "icons:flag",
        callback: "haxToggleMarking",
        label: this._marking ? this.t.doneMarking : this.t.markAnswers,
      },
    ];
  }
  haxToggleMarking() {
    this._marking = !this._marking;
    this._held = "";
    this._readingDirty = true;
    return true;
  }
  // authors see and edit the real content unless they are marking answers
  _authoring() {
    return Boolean(this._haxstate) && !this._marking;
  }
  // the answers being worked on: the learner's, or the key while marking
  _list() {
    if (this._marking) {
      return this._keyPairs();
    }
    return this._placed;
  }

  // ---------- reading ----------

  _unitWord() {
    if (this.unit === "paragraph") {
      return this.t.unitParagraph;
    }
    if (this.unit === "figure") {
      return this.t.unitFigure;
    }
    return this.t.unitSentence;
  }
  _sourceNodes() {
    return Array.from(this.childNodes).filter(
      (n) =>
        (n.nodeType === 3 && normalizeText(n.data)) ||
        (n.nodeType === 1 && !n.hasAttribute("slot") && !n.matches("input")),
    );
  }
  // build (or rebuild) the segmented copy of the reading
  _ensureReading() {
    const box = this.shadowRoot && this.shadowRoot.querySelector("#reading");
    if (!box) {
      return false;
    }
    if (!this._readingDirty && box.childNodes.length) {
      return true;
    }
    const scope = this.closest && this.closest("[lang]");
    const lang = (scope && scope.getAttribute("lang")) || undefined;
    const raw = buildReading(this._sourceNodes(), box, this.unit, lang);
    const ids = componentIds(raw.map((t) => `${t.kind}:${t.text}`));
    const n = { sentence: 0, paragraph: 0, figure: 0 };
    const words = {
      sentence: this.t.sentenceN,
      paragraph: this.t.paragraphN,
      figure: this.t.figureN,
    };
    this._targets = raw.map((t, i) => {
      n[t.kind]++;
      return {
        ...t,
        id: ids[i],
        label: this._fill(words[t.kind], { n: n[t.kind] }),
      };
    });
    // one tab stop for the whole reading (the last one reached, or the
    // first); the arrow keys move between passages from there
    if (!this._targetById(this._rovingId)) {
      this._rovingId = this._targets.length ? this._targets[0].id : "";
    }
    this._targets.forEach((t) => {
      t.els.forEach((el, i) => {
        el.setAttribute("data-t", t.id);
        if (i === 0) {
          el.setAttribute("tabindex", t.id === this._rovingId ? "0" : "-1");
          // the passage itself is the accessible name, so what is read
          // matches what is seen
          el.setAttribute("role", "button");
        }
      });
    });
    this._readingDirty = false;
    // placements whose target no longer exists are dropped
    if (this._placed.some((p) => !this._targetById(p.t))) {
      this._placed = this._placed.filter((p) => this._targetById(p.t));
    }
    if (this._picked && !this._targetById(this._picked)) {
      this._picked = "";
    }
    return true;
  }
  _locked() {
    if (this._marking) {
      return false;
    }
    return Boolean(this.showAnswer) || this.attemptsExhausted();
  }
  // classes on the copied reading for the current state
  _paintReading() {
    const checked = this.showAnswer && !this._marking;
    const one = this.mode === "one";
    const keyOne = this._selectKey[0];
    this._targets.forEach((t) => {
      const picked = one && !this._marking && this._picked === t.id;
      t.els.forEach((el) => {
        el.classList.toggle("picked", picked);
        el.classList.toggle("key", one && this._marking && keyOne === t.id);
        el.classList.toggle("is-correct", checked && picked && keyOne === t.id);
        el.classList.toggle(
          "is-incorrect",
          checked && picked && keyOne !== t.id,
        );
      });
      const first = t.els[0];
      if (!first) {
        return;
      }
      if (one) {
        const pressed = this._marking ? keyOne === t.id : picked;
        first.setAttribute("aria-pressed", pressed ? "true" : "false");
      } else {
        first.removeAttribute("aria-pressed");
      }
      if (this._locked()) {
        first.setAttribute("aria-disabled", "true");
      } else {
        first.removeAttribute("aria-disabled");
      }
    });
  }
  // flags in the margin, beside the first line of what each one marks
  _layoutMargin() {
    const sheet = this.shadowRoot && this.shadowRoot.querySelector("#sheet");
    const margin = this.shadowRoot && this.shadowRoot.querySelector("#margin");
    if (!sheet || !margin) {
      return;
    }
    margin.textContent = "";
    if (this.mode !== "flag") {
      return;
    }
    const base = sheet.getBoundingClientRect().top;
    const items = this._list().map((p, i) => ({ p, i, ghost: false }));
    const checked = this.showAnswer && !this._marking;
    if (checked && this.attemptsExhausted() && !this.isCorrect()) {
      this._keyPairs().forEach((k) => {
        if (!this._placed.some((p) => p.f === k.f && p.t === k.t)) {
          items.push({ p: k, i: -1, ghost: true });
        }
      });
    }
    const spans = {};
    items.forEach((it) => {
      const t = this._targetById(it.p.t);
      if (!t) {
        return;
      }
      if (!spans[t.id]) {
        let top = Infinity;
        let bot = -Infinity;
        t.els.forEach((el) => {
          Array.from(el.getClientRects()).forEach((r) => {
            top = Math.min(top, r.top);
            bot = Math.max(bot, r.bottom);
          });
        });
        if (top === Infinity) {
          return;
        }
        spans[t.id] = { top: top - base, bot: bot - base };
      }
      it.top = spans[t.id].top;
    });
    const doc = globalThis.document;
    let next = -Infinity;
    const bars = {};
    items
      .filter((it) => it.top !== undefined)
      .sort((a, b) => a.top - b.top)
      .forEach((it) => {
        const f = this._flagById(it.p.f);
        const t = this._targetById(it.p.t);
        if (!f || !t) {
          return;
        }
        const y = Math.max(it.top + 2, next);
        next = y + 26;
        const span = spans[t.id];
        const barKey = `${t.id}|${f.id}`;
        if (!bars[barKey]) {
          bars[barKey] = true;
          const bar = doc.createElement("span");
          bar.className = `bracket${it.ghost ? " ghost" : ""}`;
          bar.setAttribute("data-style", String(f.style));
          bar.style.top = `${span.top}px`;
          bar.style.height = `${Math.max(14, span.bot - span.top)}px`;
          margin.appendChild(bar);
        }
        let res = "";
        if (checked && !it.ghost) {
          res = this._placementCorrect(it.p) ? "correct" : "incorrect";
        }
        const label = normalizeText(f.flag.label);
        const name = this._fill(this.t.flagOnTarget, {
          flag: label,
          target: t.label,
        });
        const tab = doc.createElement("button");
        tab.type = "button";
        // result classes are not "correct" / "incorrect": QuestionElement styles
        // those names for its own options
        tab.className = `tab${it.ghost ? " ghost" : ""}${res ? ` res-${res}` : ""}`;
        tab.setAttribute("data-style", String(f.style));
        tab.setAttribute("data-for", t.id);
        tab.setAttribute("data-label", label);
        tab.setAttribute("data-target-label", t.label);
        tab.setAttribute("data-res", res);
        if (it.ghost) {
          tab.setAttribute("data-ghost", "");
          tab.tabIndex = -1;
          tab.setAttribute("aria-disabled", "true");
          tab.setAttribute("aria-label", `${this.t.expected}: ${name}`);
        } else {
          tab.setAttribute("data-i", String(it.i));
          let spoken = name;
          if (res) {
            spoken += `, ${res === "correct" ? this.t.correct : this.t.incorrect}`;
          }
          if (this._locked()) {
            tab.setAttribute("aria-disabled", "true");
          } else {
            spoken += `. ${this.t.peelOff}`;
          }
          tab.setAttribute("aria-label", spoken);
        }
        tab.style.top = `${y}px`;
        tab.style.setProperty("--ra-tilt", `${this._tilt(barKey)}deg`);
        const svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 14 14");
        svg.setAttribute("aria-hidden", "true");
        const path = doc.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", FLAG_SHAPES[f.style]);
        svg.appendChild(path);
        tab.appendChild(svg);
        if (res) {
          const mark = doc.createElement("span");
          mark.className = "res";
          mark.setAttribute("aria-hidden", "true");
          mark.textContent = res === "correct" ? "✓" : "✕";
          tab.appendChild(mark);
        }
        margin.appendChild(tab);
      });
  }
  _tilt(key) {
    let h = 0;
    for (let i = 0; i < key.length; i++) {
      h = (h * 31 + key.charCodeAt(i)) | 0;
    }
    return ((Math.abs(h) % 7) - 3) * 0.6;
  }
  _fill(str, parts) {
    return String(str || "").replace(/\{(\w+)\}/g, (m, k) =>
      k in parts ? String(parts[k]) : m,
    );
  }
  _say(text) {
    const live = this.shadowRoot && this.shadowRoot.querySelector("#ra-live");
    if (live) {
      live.textContent = "";
      setTimeout(() => {
        live.textContent = text;
      }, 30);
    }
  }

  // ---------- interaction ----------

  _act(targetId) {
    if (this._locked()) {
      return;
    }
    const t = this._targetById(targetId);
    if (!t) {
      return;
    }
    if (this.mode === "one") {
      if (this._marking) {
        this._selectKey = [targetId];
      } else {
        this._picked = targetId;
        this._say(this._fill(this.t.selected, { target: t.label }));
      }
      this.requestUpdate();
      return;
    }
    if (!this._held) {
      this._say(this.t.pickAFlag);
      return;
    }
    const f = this._flagById(this._held);
    if (!f) {
      return;
    }
    const label = normalizeText(f.flag.label);
    // learners may put the same flag beside a passage more than once (two
    // pieces of evidence in one paragraph); the answer key stays one per pair
    if (
      this._marking &&
      this._list().some((p) => p.f === f.id && p.t === targetId)
    ) {
      this._say(
        this._fill(this.t.flagAlready, { flag: label, target: t.label }),
      );
      return;
    }
    if (this._marking) {
      f.flag.targets = [...(f.flag.targets || []), targetId];
      this.answers = [...this.answers];
    } else {
      this._placed = [...this._placed, { f: f.id, t: targetId }];
    }
    this._say(this._fill(this.t.flagPlaced, { flag: label, target: t.label }));
  }
  _remove(index) {
    if (this._locked()) {
      return;
    }
    const p = this._list()[index];
    if (!p) {
      return;
    }
    const f = this._flagById(p.f);
    const t = this._targetById(p.t);
    if (this._marking) {
      if (f) {
        f.flag.targets = (f.flag.targets || []).filter((x) => x !== p.t);
        this.answers = [...this.answers];
      }
    } else {
      this._placed = this._placed.filter((_x, i) => i !== index);
    }
    if (f && t) {
      this._say(
        this._fill(this.t.flagRemoved, {
          flag: normalizeText(f.flag.label),
          target: t.label,
        }),
      );
    }
  }
  _targetIn(path) {
    return path.find((n) => n.getAttribute && n.getAttribute("data-t"));
  }
  _tabIn(path) {
    return path.find((n) => n.classList && n.classList.contains("tab"));
  }
  _onReadingClick(e) {
    const path = e.composedPath();
    const tab = this._tabIn(path);
    if (tab) {
      e.stopPropagation();
      if (tab.hasAttribute("data-i")) {
        this._remove(Number(tab.getAttribute("data-i")));
      }
      return;
    }
    const el = this._targetIn(path);
    if (el) {
      e.preventDefault();
      this._act(el.getAttribute("data-t"));
    }
  }
  _onReadingKey(e) {
    const el = e.composedPath()[0];
    if (!el || !el.getAttribute || !el.getAttribute("data-t")) {
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._act(el.getAttribute("data-t"));
      return;
    }
    const step = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    };
    const last = this._targets.length - 1;
    const at = this._targets.findIndex(
      (t) => t.id === el.getAttribute("data-t"),
    );
    let next = -1;
    if (e.key in step) {
      next = Math.min(last, Math.max(0, at + step[e.key]));
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = last;
    }
    if (next < 0 || next === at) {
      return;
    }
    e.preventDefault();
    this._rove(this._targets[next].id, true);
  }
  // move the reading's single tab stop to a passage
  _rove(targetId, focus) {
    const target = this._targetById(targetId);
    if (!target || !target.els[0]) {
      return;
    }
    this._targets.forEach((t) => {
      if (t.els[0]) {
        t.els[0].setAttribute("tabindex", t.id === targetId ? "0" : "-1");
      }
    });
    this._rovingId = targetId;
    if (focus) {
      target.els[0].focus();
    }
  }
  _onReadingFocus(e) {
    const el = this._targetIn(e.composedPath());
    if (el && el.getAttribute("data-t") !== this._rovingId) {
      this._rove(el.getAttribute("data-t"), false);
    }
    this._onTipShow(e);
  }
  _onTipShow(e) {
    const tab = this._tabIn(e.composedPath());
    if (!tab) {
      return;
    }
    const tip = this.shadowRoot.querySelector("#tip");
    const target = this._targetById(tab.getAttribute("data-for"));
    const res = tab.getAttribute("data-res");
    let word = "";
    if (res) {
      word = ` · ${res === "correct" ? this.t.correct : this.t.incorrect}`;
    }
    tip.setAttribute("data-style", tab.getAttribute("data-style"));
    tip.querySelector(".tip-label").textContent = `${
      tab.hasAttribute("data-ghost") ? `${this.t.expected} · ` : ""
    }${tab.getAttribute("data-label")}`;
    tip.querySelector(".tip-target").textContent =
      `${tab.getAttribute("data-target-label")}${word}`;
    tip.style.top = `${parseFloat(tab.style.top) - 34}px`;
    tip.hidden = false;
    if (target) {
      target.els.forEach((el) => {
        el.setAttribute("data-lit", "");
        el.setAttribute("data-style", tab.getAttribute("data-style"));
      });
    }
  }
  _onTipHide(e) {
    if (!this._tabIn(e.composedPath())) {
      return;
    }
    this.shadowRoot.querySelector("#tip").hidden = true;
    this.shadowRoot.querySelectorAll("[data-lit]").forEach((el) => {
      el.removeAttribute("data-lit");
      el.removeAttribute("data-style");
    });
  }
  _pick(id) {
    this._held = this._held === id ? "" : id;
    const f = this._flagById(this._held);
    if (f) {
      this._say(
        this._fill(this.t.holding, { flag: normalizeText(f.flag.label) }),
      );
    }
  }
  _dragStart(e, id) {
    this._held = id;
    try {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "copy";
    } catch {
      // some browsers refuse custom drag data; the held flag still works
    }
  }
  _dragOver(e) {
    if (this.mode !== "flag" || this._locked()) {
      return;
    }
    if (this._targetIn(e.composedPath())) {
      e.preventDefault();
    }
  }
  _drop(e) {
    const el = this._targetIn(e.composedPath());
    if (!el) {
      return;
    }
    e.preventDefault();
    let id = "";
    try {
      id = e.dataTransfer.getData("text/plain");
    } catch {
      id = "";
    }
    if (id && this._flagById(id)) {
      this._held = id;
    }
    this._act(el.getAttribute("data-t"));
  }

  // ---------- render ----------

  updated(changedProperties) {
    if (changedProperties.has("answers")) {
      this._keepTargets(changedProperties.get("answers"));
      if ((this.answers || []).some((a) => a && a.selectOne)) {
        this._splitKey();
      }
    }
    if (changedProperties.has("unit") || changedProperties.has("mode")) {
      this._readingDirty = true;
      if (changedProperties.get("unit") || changedProperties.get("mode")) {
        this._placed = [];
        this._picked = "";
        this._held = "";
      }
    }
    super.updated(changedProperties);
    if (!this._authoring() && this._ensureReading()) {
      this._paintReading();
      this._layoutMargin();
      this._pinRail();
    } else {
      this._readingDirty = true;
    }
  }
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    if (globalThis.document && globalThis.document.fonts) {
      globalThis.document.fonts.ready.then(() => this._layoutMargin());
    }
  }

  renderDirections() {
    if (this._marking) {
      return html`<p>${this.t.markingHint}</p>`;
    }
    return html`<p>
      ${this._tParts(
        this.mode === "one"
          ? this.t.selectOneDirections
          : this.t.flagDirections,
        {
          unit: this._unitWord(),
          checkAnswer: html`<strong>${this.t.checkAnswer}</strong>`,
        },
      )}
    </p>`;
  }

  renderInteraction() {
    if (this._authoring()) {
      return html`<div class="author">
        <p class="author-hint">${this.t.editHint}</p>
        <div class="author-reading"><slot></slot></div>
      </div>`;
    }
    const cls = [
      "desk",
      this._held && !this._locked() ? "holding" : "",
      this._marking ? "marking" : "",
      this._locked() ? "locked" : "",
    ].join(" ");
    return html`<div
      class="${cls}"
      @click="${this._onReadingClick}"
      @keydown="${this._onReadingKey}"
      @dragover="${this._dragOver}"
      @drop="${this._drop}"
      @mouseover="${this._onTipShow}"
      @mouseout="${this._onTipHide}"
      @focusin="${this._onReadingFocus}"
      @focusout="${this._onTipHide}"
    >
      ${
        this._marking
          ? html`<p class="marking-note">${this.t.markingHint}</p>`
          : nothing
      }
      <div class="sheet" id="sheet">
        <div class="margin" id="margin"></div>
        <div
          class="reading"
          id="reading"
          role="group"
          aria-describedby="ra-keys"
        ></div>
        <span id="ra-keys" class="sr-only"
          >${this._fill(this.t.readingKeys, { unit: this._unitWord() })}</span
        >
        <div class="tip" id="tip" hidden aria-hidden="true">
          <i></i><span class="tip-label"></span
          ><small class="tip-target"></small>
        </div>
      </div>
      ${
        this._targets.length === 0 && !this._readingDirty
          ? html`<p class="empty">${this.t.noTargets}</p>`
          : nothing
      }
      <span id="ra-live" class="sr-only" aria-live="polite"></span>
    </div>`;
  }

  _renderPad() {
    if (this.mode !== "flag" || this._authoring()) {
      return nothing;
    }
    const counts = {};
    this._list().forEach((p) => {
      counts[p.f] = (counts[p.f] || 0) + 1;
    });
    const held = this._flagById(this._held);
    let hint = this.t.pickAFlag;
    if (held) {
      hint = this._fill(this.t.holding, {
        flag: normalizeText(held.flag.label),
      });
    } else if (this._locked()) {
      hint = "";
    }
    return html`<div class="pad" role="group" aria-label="${this.t.flags}">
      ${this._flagIds().map((f) => {
        const label = normalizeText(f.flag.label);
        return html`<button
          type="button"
          class="flag"
          draggable="true"
          data-style="${f.style}"
          aria-pressed="${this._held === f.id ? "true" : "false"}"
          ?disabled="${this._locked()}"
          @click="${() => this._pick(f.id)}"
          @dragstart="${(e) => this._dragStart(e, f.id)}"
        >
          <svg viewBox="0 0 14 14" aria-hidden="true">
            <path d="${FLAG_SHAPES[f.style]}"></path></svg
          ><span>${label}</span
          ><span class="count" aria-hidden="true">${counts[f.id] || 0}</span
          ><span class="sr-only"
            >,
            ${this._fill(this.t.flagUsed, { count: counts[f.id] || 0 })}</span
          >
        </button>`;
      })}
      <span class="pad-hint">${hint}</span>
    </div>`;
  }

  renderButtons() {
    if (this._marking) {
      return this._renderPad();
    }
    return html`${this._renderPad()}${super.renderButtons()}`;
  }

  renderFeedback() {
    if (this.edit || this.mode === "one" || !this.showAnswer) {
      return super.renderFeedback();
    }
    const key = this._keyPairs();
    const found = this._foundPairs();
    const wrong = this._placed.filter((p) => !this._placementCorrect(p)).length;
    return html`<p class="feedback">
        ${this._fill(this.t.flagsFound, {
          correct: found.length,
          total: key.length,
        })}${
          wrong
            ? html`, ${this._fill(this.t.toRethink, { count: wrong })}`
            : nothing
        }
      </p>
      <ul class="placements">
        ${this._placed.map((p) => {
          const f = this._flagById(p.f);
          const t = this._targetById(p.t);
          if (!f || !t) {
            return nothing;
          }
          const ok = this._placementCorrect(p);
          return html`<li class="${ok ? "res-correct" : "res-incorrect"}">
            <span aria-hidden="true">${ok ? "✓" : "✕"}</span>
            ${this._fill(this.t.flagOnTarget, {
              flag: normalizeText(f.flag.label),
              target: t.label,
            })}:
            ${ok ? this.t.isEvidence : this.t.notEvidence}
          </li>`;
        })}
      </ul>
      ${super.renderFeedback()}`;
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          --ra-flag-0: light-dark(
            var(--ddd-theme-default-beaverBlue),
            var(--ddd-theme-default-skyBlue)
          );
          --ra-flag-1: var(--ddd-theme-default-inventOrange);
          --ra-flag-2: var(--ddd-theme-default-creekTeal);
          --ra-flag-3: var(--ddd-theme-default-discoveryCoral);
          --ra-flag-4: var(--ddd-theme-default-keystoneYellow);
          --ra-flag-5: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-slateLight)
          );
          --ra-flag-6: light-dark(
            var(--ddd-theme-default-landgrantBrown),
            var(--ddd-theme-default-shrineTan)
          );
          --ra-ink-light: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --ra-ink: var(--ddd-theme-default-potentialMidnight);
          --ra-desk: light-dark(
            var(--ddd-theme-default-limestoneMaxLight),
            var(--ddd-theme-default-coalyGray)
          );
          --ra-page: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-potentialMidnight)
          );
          --ra-text: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-limestoneMaxLight)
          );
        }
        [data-style="0"] {
          --ra-fc: var(--ra-flag-0);
          --ra-fi: var(--ra-ink-light);
        }
        [data-style="1"] {
          --ra-fc: var(--ra-flag-1);
          --ra-fi: var(--ra-ink);
        }
        [data-style="2"] {
          --ra-fc: var(--ra-flag-2);
          --ra-fi: var(--ra-ink);
        }
        [data-style="3"] {
          --ra-fc: var(--ra-flag-3);
          --ra-fi: var(--ra-ink);
        }
        [data-style="4"] {
          --ra-fc: var(--ra-flag-4);
          --ra-fi: var(--ra-ink);
        }
        [data-style="5"] {
          --ra-fc: var(--ra-flag-5);
          --ra-fi: var(--ra-ink-light);
        }
        [data-style="6"] {
          --ra-fc: var(--ra-flag-6);
          --ra-fi: var(--ra-ink-light);
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        .author-hint,
        .marking-note,
        .empty {
          margin: 0 0 var(--ddd-spacing-3);
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        .marking-note {
          padding: var(--ddd-spacing-2) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          background-color: var(--ddd-status-answered-bg);
        }
        .author-reading {
          border: var(--ddd-border-xs);
          border-style: dashed;
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          border-radius: var(--ddd-radius-sm);
          padding: var(--ddd-spacing-3);
        }
        /* the reading sits on a page; flags hang off its left edge */
        .desk {
          position: relative;
          background-color: var(--ra-desk);
          border-radius: var(--ddd-radius-sm);
          padding-block: var(--ddd-spacing-4) var(--ddd-spacing-5);
          padding-inline: var(--ddd-spacing-14) var(--ddd-spacing-4);
        }
        .sheet {
          position: relative;
          background-color: var(--ra-page);
          color: var(--ra-text);
          border-radius: var(--ddd-radius-xs);
          box-shadow: var(--ddd-boxShadow-sm);
          padding-block: var(--ddd-spacing-5);
          padding-inline: var(--ddd-spacing-7) var(--ddd-spacing-6);
        }
        .reading {
          font-family: var(--ddd-font-primary);
          font-size: var(--ddd-font-size-s);
          line-height: var(--ddd-lh-150);
          max-width: 70ch;
        }
        .reading > :first-child {
          margin-top: var(--ddd-spacing-0);
        }
        .reading > :last-child {
          margin-bottom: var(--ddd-spacing-0);
        }
        .reading p,
        .reading li,
        .reading blockquote {
          margin-block: 0 var(--ddd-spacing-4);
        }
        .reading h1,
        .reading h2,
        .reading h3,
        .reading h4,
        .reading h5,
        .reading h6 {
          font-family: var(--ddd-font-navigation);
          color: light-dark(
            var(--ddd-theme-default-nittanyNavy),
            var(--ddd-theme-default-white)
          );
          margin-block: 0 var(--ddd-spacing-3);
          text-wrap: balance;
        }
        /* images in a reading are evidence, not heroes: keep them modest */
        .reading img {
          display: block;
          max-width: min(100%, 480px);
          max-height: 320px;
          width: auto;
          height: auto;
          object-fit: contain;
        }
        .reading figure {
          margin: var(--ddd-spacing-0);
        }
        .reading .ra-media {
          margin-block: 0 var(--ddd-spacing-4);
        }
        .reading figcaption {
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
          margin-top: var(--ddd-spacing-1);
        }
        .reading a {
          color: light-dark(
            var(--ddd-theme-default-link),
            var(--ddd-theme-default-linkLight)
          );
        }
        .ra-t {
          border-radius: var(--ddd-radius-xs);
          transition: background-color var(--ddd-duration-fast) ease;
        }
        .desk:not(.locked) .ra-t {
          cursor: pointer;
        }
        .desk:not(.locked) .ra-t:hover {
          background-color: var(--ddd-status-answered-bg);
        }
        /* while a flag is held, a quiet dotted underline shows what can take it */
        .desk.holding span.ra-t {
          text-decoration-line: underline;
          text-decoration-style: dotted;
          text-decoration-color: var(--ddd-status-answered-line);
          text-underline-offset: 0.2em;
        }
        .desk.holding p.ra-t,
        .desk.holding li.ra-t,
        .desk.holding blockquote.ra-t,
        .desk.holding .ra-media {
          box-shadow: inset var(--ddd-border-size-sm) 0 0
            var(--ddd-status-answered-line);
        }
        .ra-t:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .ra-media {
          display: block;
          padding: var(--ddd-spacing-1);
          border: var(--ddd-border-xs);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneLight),
            var(--ddd-theme-default-slateGray)
          );
        }
        .ra-t.picked {
          background-color: var(--ddd-status-answered-bg);
          box-shadow: inset 0 calc(-1 * var(--ddd-border-size-md)) 0
            var(--ddd-status-answered-signal);
        }
        .ra-t.key {
          box-shadow: inset 0 calc(-1 * var(--ddd-border-size-md)) 0
            var(--ddd-status-answered-signal);
        }
        .ra-t.is-correct {
          background-color: var(--ddd-status-correct-bg);
          box-shadow: inset 0 calc(-1 * var(--ddd-border-size-md)) 0
            var(--ddd-status-correct-signal);
        }
        .ra-t.is-incorrect {
          background-color: var(--ddd-status-incorrect-bg);
          box-shadow: inset 0 calc(-1 * var(--ddd-border-size-md)) 0
            var(--ddd-status-incorrect-signal);
        }
        .ra-t[data-lit] {
          background-color: color-mix(in srgb, var(--ra-fc) 22%, transparent);
        }
        /* margin flags: tucked under the page edge, hanging into the desk */
        .margin {
          position: absolute;
          inset-block: 0;
          inset-inline-start: calc(-1 * var(--ddd-spacing-12));
          width: calc(var(--ddd-spacing-12) + var(--ddd-spacing-4));
          pointer-events: none;
          z-index: 2;
        }
        .bracket {
          position: absolute;
          inset-inline-start: calc(
            var(--ddd-spacing-12) + var(--ddd-spacing-2)
          );
          width: var(--ddd-border-size-md);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ra-fc);
          opacity: 0.6;
        }
        .bracket.ghost {
          background-color: transparent;
          border-inline-start: var(--ddd-border-size-sm) dashed var(--ra-fc);
          opacity: 0.9;
        }
        .margin .tab {
          position: absolute;
          inset-inline-start: 0;
          width: calc(var(--ddd-spacing-12) + var(--ddd-spacing-3));
          height: var(--ddd-spacing-6);
          margin: var(--ddd-spacing-0);
          border: 0;
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(--ddd-spacing-2) 0;
          display: flex;
          align-items: center;
          background-color: var(--ra-fc);
          color: var(--ra-fi);
          border-radius: var(--ddd-radius-xs);
          box-shadow: var(--ddd-boxShadow-sm);
          pointer-events: auto;
          cursor: pointer;
          transform: rotate(var(--ra-tilt, 0deg));
          transform-origin: 100% 50%;
          transition: box-shadow var(--ddd-duration-fast) ease;
        }
        .margin .tab::after {
          content: "";
          position: absolute;
          inset-block: 0;
          inset-inline-end: 0;
          width: var(--ddd-spacing-4);
          background-color: var(--ra-page);
          opacity: 0.25;
        }
        .margin .tab:hover,
        .margin .tab:focus-visible {
          z-index: 3;
          box-shadow: var(--ddd-boxShadow-md);
        }
        .tab:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .margin .tab svg {
          width: var(--ddd-icon-4xs);
          height: var(--ddd-icon-4xs);
          fill: currentColor;
          flex: none;
        }
        .margin .tab.ghost {
          background-color: transparent;
          color: var(--ra-fc);
          box-shadow: inset 0 0 0 var(--ddd-border-size-sm) var(--ra-fc);
          cursor: default;
        }
        .margin .tab.ghost::after {
          display: none;
        }
        .margin .tab .res {
          position: absolute;
          inset-inline-start: calc(-1 * var(--ddd-spacing-3));
          top: 50%;
          transform: translateY(-50%);
          width: var(--ddd-spacing-4);
          height: var(--ddd-spacing-4);
          border-radius: var(--ddd-radius-circle);
          display: grid;
          place-items: center;
          font-size: var(--ddd-font-size-5xs);
          font-weight: var(--ddd-font-weight-bold);
          line-height: 1;
          color: var(--ddd-status-default-bg);
        }
        .margin .tab.res-correct .res {
          background-color: var(--ddd-status-correct-signal);
        }
        .margin .tab.res-incorrect .res {
          background-color: var(--ddd-status-incorrect-signal);
        }
        .margin .tab.res-incorrect {
          opacity: 0.85;
        }
        .tip {
          position: absolute;
          inset-inline-start: var(--ddd-spacing-4);
          z-index: 4;
          pointer-events: none;
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-1) var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-sm);
          background-color: light-dark(
            var(--ddd-theme-default-coalyGray),
            var(--ddd-theme-default-white)
          );
          color: light-dark(
            var(--ddd-theme-default-white),
            var(--ddd-theme-default-coalyGray)
          );
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          box-shadow: var(--ddd-boxShadow-md);
          white-space: nowrap;
        }
        .tip[hidden] {
          display: none;
        }
        .tip i {
          width: var(--ddd-spacing-3);
          height: var(--ddd-spacing-3);
          border-radius: var(--ddd-radius-xs);
          background-color: var(--ra-fc);
          flex: none;
        }
        .tip small {
          opacity: 0.8;
        }
        /* the flag pad rides in the sticky action bar */
        .shell .shell-action-bar {
          position: sticky;
          bottom: 0;
          z-index: 5;
        }
        /* pinned by script when sticky cannot hold (overflow ancestors) */
        .shell .shell-action-bar.ra-pinned {
          position: fixed;
          bottom: env(safe-area-inset-bottom, 0px);
          z-index: 1000;
          box-sizing: border-box;
          border-radius: var(--ddd-radius-sm) var(--ddd-radius-sm) 0 0;
          box-shadow: var(--ddd-boxShadow-lg);
        }
        .pad {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2) var(--ddd-spacing-3);
          flex: 1 1 100%;
          order: -1;
        }
        .pad .flag {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-2);
          min-height: var(--ddd-control-height-sm);
          margin: var(--ddd-spacing-0);
          border: 0;
          padding-block: var(--ddd-spacing-0);
          padding-inline: var(--ddd-spacing-3) var(--ddd-spacing-6);
          background-color: var(--ra-fc);
          color: var(--ra-fi);
          font-family: var(--ddd-font-navigation);
          font-size: var(--ddd-font-size-4xs);
          font-weight: var(--ddd-font-weight-bold);
          clip-path: polygon(
            0 0,
            calc(100% - var(--ddd-spacing-3)) 0,
            100% 50%,
            calc(100% - var(--ddd-spacing-3)) 100%,
            0 100%
          );
          cursor: grab;
          touch-action: none;
          user-select: none;
          transition: transform var(--ddd-duration-fast) ease;
        }
        .flag svg {
          width: var(--ddd-icon-4xs);
          height: var(--ddd-icon-4xs);
          fill: currentColor;
        }
        .flag .count {
          font-family: var(--ddd-font-secondary);
          font-weight: var(--ddd-font-weight-regular);
          font-variant-numeric: tabular-nums;
          opacity: 0.85;
        }
        .flag[aria-pressed="true"] {
          transform: translateY(-3px);
          box-shadow: inset 0 0 0 var(--ddd-border-size-md) var(--ra-page);
        }
        .flag:focus-visible {
          outline: var(--ddd-focus-ring);
          outline-offset: var(--ddd-focus-offset);
        }
        .flag[disabled] {
          opacity: 0.55;
          cursor: default;
        }
        .pad-hint {
          flex: 1 1 200px;
          font-size: var(--ddd-font-size-4xs);
          color: light-dark(
            var(--ddd-theme-default-slateGray),
            var(--ddd-theme-default-limestoneLight)
          );
        }
        ul.placements {
          margin: 0 0 var(--ddd-spacing-2);
          padding-inline-start: var(--ddd-spacing-5);
          font-size: var(--ddd-font-size-4xs);
        }
        ul.placements li.res-correct span {
          color: var(--ddd-status-correct-signal);
        }
        ul.placements li.res-incorrect span {
          color: var(--ddd-status-incorrect-signal);
        }
        @media (max-width: 600px) {
          .desk {
            padding-inline: var(--ddd-spacing-10) var(--ddd-spacing-2);
          }
          .sheet {
            padding-inline: var(--ddd-spacing-6) var(--ddd-spacing-3);
          }
          .reading {
            font-size: var(--ddd-font-size-xs);
          }
          /* keep the pinned pad to one row on phones */
          .pad {
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-block-end: var(--ddd-spacing-1);
          }
          .pad .flag {
            flex: none;
          }
          .pad-hint {
            display: none;
          }
          .margin {
            inset-inline-start: calc(-1 * var(--ddd-spacing-9));
            width: calc(var(--ddd-spacing-9) + var(--ddd-spacing-4));
          }
          .tab {
            width: calc(var(--ddd-spacing-9) + var(--ddd-spacing-3));
          }
          .bracket {
            inset-inline-start: calc(
              var(--ddd-spacing-9) + var(--ddd-spacing-2)
            );
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .flag,
          .tab,
          .ra-t {
            transition: none;
          }
          .flag[aria-pressed="true"] {
            transform: none;
          }
        }
      `,
    ];
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(ReadingAnalysis.tag, ReadingAnalysis);
