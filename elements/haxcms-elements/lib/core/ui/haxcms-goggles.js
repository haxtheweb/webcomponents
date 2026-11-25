/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, css, svg, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import {
  HaxUiAdminTokens,
  HaxUiDarkChromeDeclarations,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminTokens.js";
import { HaxUiAdminSimpleFields } from "@haxtheweb/d-d-d/lib/HaxUiAdminControls.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import { futureTraveler } from "@haxtheweb/hax-network-bar/lib/hax-future-traveler.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/rpg-character/rpg-character.js";
import { I18NManagerStore } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "../haxcms-site-store.js";
import {
  a11yFindings,
  contentMark,
  elementPath,
  findByMark,
  INLINE_BUNDLE,
  issueFields,
  issueUrl,
  openIssuesUrl,
  packBundle,
  pathText,
  replayBundle,
  replayLink,
  reportTitle,
  translateUrl,
} from "./haxcms-goggles-report.js";
import {
  localStorageGet,
  localStorageSet,
} from "@haxtheweb/utils/lib/storage.js";
import "../haxcms-language-picker.js";
import {
  TRANSLATE_LIST_KEY,
  TRANSLATE_LANG_KEY,
  cleanLang,
  isEnglish,
  langName,
  lostTokens,
  tokensOf,
  stillEnglish,
  localeFileOf,
  partName,
  stringsOf,
  scanScreen,
  translateIssue,
  translateLink,
} from "./haxcms-goggles-translate.js";

const REPO = "https://github.com/haxtheweb/webcomponents";
const GALLERY = "https://webcomponents.hax.cloud/";
const STORIES = "https://hax.cloud/";
// label and say are keys in this.t
const LENSES = [
  { id: "code", label: "lensXray", icon: "icons:code", say: "lensXraySay" },
  {
    id: "makers",
    label: "lensMakers",
    icon: "social:group",
    say: "lensMakersSay",
  },
  { id: "flag", label: "lensFlag", icon: "icons:flag", say: "lensFlagSay" },
  {
    id: "translate",
    label: "lensTranslate",
    icon: "icons:translate",
    say: "lensTranslateSay",
  },
];
// events the lenses keep from the page while they are on, so looking never changes anything
const HELD = [
  "click",
  "dblclick",
  "auxclick",
  "contextmenu",
  "mousedown",
  "mouseup",
  "pointerdown",
  "pointerup",
  "mouseover",
  "mouseenter",
  "pointerover",
  "pointerenter",
];

/** one lens: lit when the lenses are on, struck through when they are off */
const lensIcon = (
  lit,
) => svg`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" class="lens-icon">
  <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="3"></circle>
  <circle cx="12" cy="12" r="5" class="${lit ? "lit" : "dim"}"></circle>
  ${lit ? nothing : svg`<path d="M4 20 20 4" stroke="currentColor" stroke-width="3" stroke-linecap="round"></path>`}
</svg>`;

/*
 * Who made what. haxcms-goggles-makers.json is generated from git history
 * (scripts/goggles-makers.mjs); haxcms-goggles-credits.json is kept by hand
 * for influence git cannot see. Both load the first time the goggles go on.
 */
let MAKERS = {
  sha: "",
  tags: {},
  pkgs: {},
  people: {},
  years: {},
  gallery: [],
  demos: {},
  third: {},
  shaped: {},
  shapedTags: {},
  owners: {},
  wraps: {},
};
let makersReady = null;
export function loadMakers() {
  if (!makersReady) {
    const get = (file) =>
      globalThis
        .fetch(new URL(file, import.meta.url).href)
        .then((r) => r.json());
    makersReady = Promise.all([
      get("./haxcms-goggles-makers.json"),
      get("./haxcms-goggles-credits.json"),
    ])
      .then((both) => {
        MAKERS = Object.assign({}, both[0], {
          people: Object.assign({}, both[1].people || {}, both[0].people || {}),
          shaped: both[1].shaped || {},
          shapedTags: both[1].shapedTags || {},
          owners: both[1].owners || {},
          wraps: both[1].wraps || {},
        });
        GogglesState.set({});
        return MAKERS;
      })
      .catch(() => {
        makersReady = null;
        return MAKERS;
      });
  }
  return makersReady;
}

/**
 * Markup with its comments taken out (lit leaves marker comments everywhere).
 * Cut by position rather than by pattern, so nothing half-removed is left.
 */
const withoutComments = (text) => {
  let out = "";
  let at = 0;
  while (at < text.length) {
    const open = text.indexOf("<!--", at);
    if (open === -1) {
      out += text.slice(at);
      break;
    }
    out += text.slice(at, open);
    const close = text.indexOf("-->", open + 4);
    if (close === -1) {
      break;
    }
    at = close + 3;
  }
  return out;
};

/*
 * The lens someone chose stays chosen: putting the goggles back on, or the
 * lenses back on, uses it, here and after a reload. Only the developer's own
 * browser keeps it, next to the developer mode switch.
 */
export const GOGGLES_LENS_KEY = "haxcms-goggles-lens";
const LENS_IDS = ["code", "makers", "flag", "translate", "person"];
const remembered = () => {
  const saved = localStorageGet(GOGGLES_LENS_KEY, null);
  if (!saved || LENS_IDS.indexOf(saved.lens) === -1) {
    return { lens: "code", person: null };
  }
  if (saved.lens === "person") {
    return typeof saved.person === "string" && saved.person
      ? { lens: "person", person: saved.person }
      : { lens: "makers", person: null };
  }
  return { lens: saved.lens, person: null };
};

/**
 * The one state the goggles and the editor's top bar buttons share. This
 * module is only imported once someone turns developer mode on; nothing is
 * drawn and no listener is added until the goggles are put on.
 */
export const GogglesState = Object.assign(
  {
    on: false,
    lensOn: true,
  },
  remembered(),
  {
    set(change) {
      const lensBefore = this.lens;
      const personBefore = this.person;
      Object.assign(this, change);
      if (this.lens !== lensBefore || this.person !== personBefore) {
        localStorageSet(GOGGLES_LENS_KEY, {
          lens: this.lens,
          person: this.lens === "person" ? this.person : null,
        });
      }
      if (this.on) {
        ensureOverlay();
      }
      globalThis.dispatchEvent(
        new CustomEvent("haxcms-goggles-changed", { detail: this }),
      );
    },
  },
);
/** the overlay sits on the body so theme swaps leave it alone; it removes itself once taken off */
const ensureOverlay = () => {
  if (!globalThis.document.querySelector("haxcms-goggles")) {
    globalThis.document.body.appendChild(
      globalThis.document.createElement("haxcms-goggles"),
    );
  }
};

/**
 * haxcms-goggles
 * The Future Traveler's goggles as a developer mode: rims around the whole
 * system, and lenses that show how a piece is made, who made it, or let you
 * flag it for an issue.
 */
export class HaxcmsGoggles extends I18NMixin(DDD) {
  static get tag() {
    return "haxcms-goggles";
  }
  static get state() {
    return GogglesState;
  }
  static loadMakers() {
    return loadMakers();
  }
  static get properties() {
    return {
      on: { type: Boolean, reflect: true },
      lensOn: { type: Boolean, reflect: true, attribute: "lens-on" },
      lens: { type: String, reflect: true },
      phase: { type: String, reflect: true },
      pinned: { type: Boolean, reflect: true },
      _box: { state: true },
      _target: { state: true },
      _pins: { state: true },
      _issue: { state: true },
      _status: { state: true },
      _point: { state: true },
      _copied: { state: true },
      _say: { state: true },
      person: { type: String, reflect: true },
      _marks: { state: true },
      _sort: { state: true },
      _showAll: { state: true },
      _showAllPeople: { state: true },
      _tx: { state: true },
      _txMarks: { state: true },
      _txHover: { state: true },
    };
  }
  constructor() {
    super();
    this.on = false;
    this.lensOn = true;
    this.lens = "code";
    this.phase = "";
    this.pinned = false;
    this._box = null;
    this._target = null;
    this._pins = [];
    this._issue = null;
    this._status = "";
    this._point = { x: 0, y: 0 };
    this._copied = false;
    this._say = "";
    this.person = null;
    this._marks = [];
    this._sort = "share";
    this._showAll = false;
    this._showAllPeople = false;
    this._era = "now";
    this._mark = null;
    this._tx = null;
    this._txMarks = [];
    this._txHover = null;
    this._txLang = "";
    this._langBefore = null;
    this.t = this.t || {};
    this.t = {
      ...this.t,
      lensXray: "X-ray",
      lensMakers: "Makers",
      lensFlag: "Flag",
      lensXraySay: "X-ray lens. Point at anything to see how it is made.",
      lensMakersSay: "Makers lens. Point at anything to see who made it.",
      lensFlagSay: "Flag lens. Pick the piece you want to report or wish for.",
      lensesOffSay:
        "Lenses off. The system works as usual; the rims show the goggles are still on.",
      followingSay:
        "Following {name}: everything they made is outlined. Click any piece to see who else made it.",
      putOnSay: "You are seeing what the Future Traveler sees. {lens}",
      takeOffSay: "Goggles off.",
      holdingSay: "Holding still on {tag}. Press Escape to let go.",
      seeItAlone: "See it alone",
      moveAround: "Move around",
      upTo: "Up to {tag}",
      downTo: "Down to {tag}",
      aboveIt: "Above it ({count})",
      insideIt: "Inside it ({count})",
      timesCount: "{count} of these",
      close: "Close",
      onGitHub: "GitHub",
      showTop: "Show top {count}",
      ownerHax: "From HAX",
      ownerHaxBy: "From HAX, by {names}",
      ownerWraps: "Carries {work}",
      ownerNative: "HTML standard: W3C and the browser",
      ownerThird: "Not from HAX: {package}",
      ownerThirdBy: "Not from HAX: {package}, by {owner}",
      ownerOutside: "Not from HAX; who made it is not known here",
      ownerLabel: "Owner",
      andNames: "{first} and {second}",
      everythingMadeBy: "Everything made by {name}",
      following: "Following",
      personStats: "{pieces} pieces of HAX, {commits} commits.",
      personSince: "Since {year}.",
      personOnScreen: "{count} on this screen.",
      stopFollowing: "Stop following",
      commitsByYear: "Commits by year",
      onThisScreen: "On this screen",
      nothingOnScreen:
        "Nothing they made is on this screen right now. Open the editor or another page and their pieces light up.",
      shaped: "Shaped",
      acrossHax: "Across HAX",
      sortTheirWork: "Sort their work",
      mostTheirs: "Most theirs",
      mostCommits: "Most commits",
      shareLine: "{share}% of its commits, {commits}, {years}",
      theirCommits: "Their commits",
      showAll: "Show all {count}",
      shotFailedSay:
        "The screenshot could not be made here, so the issue carries the X-ray snapshot instead.",
      shotReadySay:
        "Screenshot ready. It goes to your clipboard when you open the issue, so you can paste it in.",
      shotBlockedSay:
        "Your browser blocked copying the picture. Right-click the screenshot and choose Copy image, then paste it into the issue.",
      shotCopiedSay:
        "Screenshot copied. In the issue, click where it says to paste, then press Ctrl+V (Cmd+V on a Mac).",
      issueCopiedSay: "Issue text copied.",
      copyBlockedSay:
        "Copy was blocked by the browser. Select the text instead.",
      flaggedSay:
        "Flagged {tag}. Describe what you saw or what you wish it did.",
      theirStoryOnHax: "Their story on hax.cloud",
      everythingTheyMade: "Everything they made",
      drawnInside: "drawn inside",
      placedInside: "placed inside",
      madeIn: "Made in",
      builtOn: "Built on",
      markup: "Markup",
      propertiesNow: "Properties right now ({count})",
      slots: "Slots",
      inTheEditor: "In the HAX editor",
      editable: "Editable",
      editableAs: 'Editable as "{name}"',
      notABlock: "Not an authoring block",
      notRegistered:
        "This piece is not in the HAX registry, so its history is not known here.",
      andMore: "and {count} more",
      shapedBy: "Shaped by",
      alsoInPackage: "Also in the {package} package",
      agentCommits:
        "{commits} more made with coding agents, steered by the people above.",
      fullHistory: "Full history on GitHub",
      howItIsMade: "How it is made",
      whoMadeIt: "Who made it",
      seeWhoMadeIt: "See who made it",
      seeHowItIsMade: "See how it is made",
      flagIt: "Flag it",
      letGo: "Let go",
      clickToHold: "Click to hold still",
      xraySnapshotOf: "X-ray snapshot of {tag}",
      developingShot: "Developing the screenshot...",
      shotFailedCaption:
        "X-ray snapshot, {w} x {h} px. A screenshot could not be made here.",
      shotToAttach: "Screenshot to attach",
      wholeScreen: "Whole screen",
      justThisPiece: "Just this piece",
      shotAltWhole: "Screenshot of the screen with {tag} outlined",
      shotAltPiece: "Screenshot of {tag}",
      shotCaption:
        "{w} x {h} px PNG, {kb} KB. If copying is blocked, right-click the picture and choose Copy image.",
      whatIsThis: "What is this?",
      needsFixing: "Needs fixing",
      featureIWant: "Feature I want",
      confusedMe: "This confused me",
      cantUseIt: "Hard to use or see",
      whatConfused: "What confused you?",
      whatBarrier: "What got in the way?",
      checksFound: "Checks that failed here",
      noChecksFound:
        "The automatic checks found nothing here. Describe what got in the way.",
      checkImageAlt: "Image without alt text",
      checkControlName: "Button or link without a name",
      checkFieldLabel: "Field without a label",
      checkContrast: "Text contrast too low ({ratio})",
      docsFor: "Docs for {tag}",
      readTheDocs: "Read the docs",
      openIssues: "Open issues",
      alreadyReported: "Already reported? Look first, and +1 it there instead.",
      seeOpenIssues: "See open issues for {tag}",
      replayLabel: "Replay to include",
      replayBlock: "Just this block",
      replayPage: "The whole page",
      replayNone: "No replay",
      replayHelp:
        "A replay lets a maintainer open this on a scratch site and see the problem. Files from your site are swapped for placeholders.",
      previewSent: "Preview everything that is sent",
      replayTooBig:
        "This replay is too big for the link. Download it and drag the file into the issue.",
      downloadReplay: "Download replay",
      swappedCount: "Private files swapped for placeholders: {count}",
      pathLabel: "Path",
      githubAccount: "Reports go to GitHub; you need a GitHub account.",
      issueTitle: "Title",
      whatDidYouSee: "What did you see?",
      whatDoYouWish: "What do you wish it did?",
      page: "Page",
      none: "none",
      theme: "Theme",
      viewport: "Viewport",
      source: "Source",
      unknown: "unknown",
      copyShotOpenIssue: "Copy screenshot and open issue",
      openIssue: "Open issue on GitHub",
      shotCopied: "Screenshot copied",
      copyShot: "Copy screenshot",
      copied: "Copied",
      copyIssueText: "Copy issue text",
      cancel: "Cancel",
      pinLabel: "{tag}, made by {names}",
      gogglesLenses: "Goggles lenses",
      followingStop: "Following {name}. Stop following",
      lensesOff: "Lenses off",
      lensesOn: "Lenses on",
      takeOff: "Take off",
      commitOne: "{count} commit",
      commitMany: "{count} commits",
      yearRange: "{from} to {to}",
      lensTranslate: "Translate",
      lensTranslateSay:
        "Translate lens. Every outlined piece of text can be improved. Tap one.",
      txPickLang: "Which language do you speak?",
      txPickLangHint:
        "HAX switches to it, so you see the words people really see. You can change it any time.",
      txLanguage: "Language",
      txStart: "Start",
      txShareLink: "Copy a link for a {lang} speaker",
      txLinkCopied:
        "Link copied. Whoever opens it gets this page in {lang} with the Translate lens on.",
      txInEnglish: "In English",
      txNowIn: "Now in {lang}",
      txNotYet: "Not translated yet",
      txWhatsWrong: "What is wrong?",
      txWrongMeaning: "Wrong meaning",
      txUnnatural: "Sounds unnatural",
      txMissing: "Not translated",
      txTooLong: "Too long",
      txYourWords: "Your words in {lang}",
      txKeep: "Keep {tokens} exactly as written: HAX puts a value there.",
      txKeepMissing: "Missing: {tokens}",
      txNote: "A note for us (any language, optional)",
      txMoreWords: "More words from this part ({count})",
      txInPart: "Part: {name}",
      txAdd: "Add to my list",
      txUpdate: "Update my list",
      txAdded: "Added. {count} in your list.",
      txMyList: "My list",
      txListTitle: "Your suggestions",
      txEmpty: "Nothing yet. Tap any outlined words to start.",
      txRemove: "Remove {words}",
      txChange: "Change",
      txOtherNote: "Anything else? (any language, optional)",
      txSend: "Send on GitHub",
      txSendHint:
        "Opens a ready-made report. Sign in to GitHub and press Create. You do not need to change anything in it.",
      txCopyAll: "Copy everything",
      txCopied: "Copied. Paste it in an email or chat to the HAX team.",
      txWhatWeSend: "What we send",
      txSameAsNow: "Your words are the same as now.",
      txLookingAt: "{en}, now {now}. Press Enter to suggest better words.",
      txLookingMissing:
        "{en}, not translated yet. Press Enter to translate it.",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("../../../locales/haxcms-goggles.en.json", import.meta.url)
          .href + "/../",
    });
    this._hold = this._hold.bind(this);
    this._move = this._move.bind(this);
    this._focus = this._focus.bind(this);
    this._keys = this._keys.bind(this);
    this._reflow = this._reflow.bind(this);
    this._sync = this._sync.bind(this);
    this._caught = this._caught.bind(this);
    this._errors = [];
    this._docs = {};
  }
  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener("haxcms-goggles-changed", this._sync);
    if (GogglesState.on) {
      this._sync({ detail: GogglesState });
    }
  }
  disconnectedCallback() {
    globalThis.removeEventListener("haxcms-goggles-changed", this._sync);
    this._holdLang(false);
    this._watch(false);
    this._markAway(false);
    super.disconnectedCallback();
  }
  /** the page listeners exist only while the goggles are worn */
  _watch(on) {
    const w = globalThis;
    if (on === !!this._watching) {
      return;
    }
    this._watching = on;
    const method = on ? "addEventListener" : "removeEventListener";
    HELD.forEach((type) => w[method](type, this._hold, true));
    w[method]("pointermove", this._move, true);
    w[method]("focusin", this._focus, true);
    w[method]("keydown", this._keys, true);
    w[method]("scroll", this._reflow, { capture: true, passive: true });
    w[method]("resize", this._reflow);
    // errors while the goggles are on ride along in a report
    w[method]("error", this._caught);
    w[method]("unhandledrejection", this._caught);
    clearInterval(this._timer);
    if (on) {
      this._timer = setInterval(this._reflow, 700);
    }
  }

  /* ---------- state ---------- */
  _sync(e) {
    const s = e.detail;
    const was = this.on && this.phase !== "takeoff";
    const lensChanged =
      s.lens !== this.lens ||
      s.lensOn !== this.lensOn ||
      s.person !== this.person;
    this.person = s.person;
    this.lensOn = s.lensOn;
    this.lens = s.lens;
    if (s.on && !was) {
      this._putOn();
    } else if (!s.on && was) {
      this._takeOff();
    } else if (s.on && lensChanged) {
      const lens = LENSES.find((l) => l.id === this.lens);
      const who = this.person ? this._name(this.person) : "";
      this._status = !this.lensOn
        ? this.t.lensesOffSay
        : this.lens === "person"
          ? this.t.followingSay.replace("{name}", who)
          : this.t[lens.say];
      if (this.lens === "person") {
        this._showAll = false;
      }
      if (this.lens !== "translate" || !this.lensOn) {
        this._tx = null;
        this._txMarks = [];
      }
      this._holdLang(this.lens === "translate");
      if (this.lens === "translate" && this.lensOn) {
        this._txBegin();
      }
      if (
        !this.lensOn ||
        this.lens === "flag" ||
        this.lens === "person" ||
        this.lens === "translate"
      ) {
        this.pinned = false;
        this._target = null;
        this._box = null;
      } else if (this._target) {
        this._box = this._rect(
          this.lens === "code" ? this._target.node : this._target.comp,
        );
      }
      this._reflow();
    }
  }
  _still() {
    return !!(
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
  /*
   * The goggles that warp out are the Future Traveler's own, from the mark in
   * the corner: drawn in the era he was left in (hax-future-traveler-mark,
   * kept under hax-future-traveler-era), flying out of where the mark sits
   * and back into it when taken off. While he is out, the mark is empty.
   */
  _findMark() {
    let best = null;
    let bestRight = -1;
    const walk = (root, depth) => {
      if (!root || depth > 6) {
        return;
      }
      root.querySelectorAll("*").forEach((el) => {
        if (el.localName === "hax-future-traveler-mark") {
          const r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0 && r.right > bestRight) {
            best = el;
            bestRight = r.right;
          }
        }
        if (el.shadowRoot && el !== this) {
          walk(el.shadowRoot, depth + 1);
        }
      });
    };
    walk(globalThis.document, 0);
    return best;
  }
  _travelerFrom() {
    const mark = this._findMark();
    let era = mark && mark.era ? mark.era : "";
    if (!era) {
      try {
        era =
          globalThis.localStorage.getItem("hax-future-traveler-era") || "now";
      } catch {
        era = "now";
      }
    }
    this._era = era;
    // where his goggles sit on the icon, as a share of its height
    const eyes = era === "handheld" ? 0.833 : 0.692;
    this.style.setProperty("--haxcms-goggles-eyes", eyes * 100 + "%");
    this.style.setProperty(
      "--haxcms-goggles-eyes-shift",
      -(eyes - 0.5) * 100 + "%",
    );
    this._mark = mark;
    if (!mark) {
      [
        "--haxcms-goggles-from-x",
        "--haxcms-goggles-from-y",
        "--haxcms-goggles-from-scale",
      ].forEach((v) => this.style.removeProperty(v));
      return;
    }
    const r = mark.getBoundingClientRect();
    const vw = globalThis.innerWidth;
    const vh = globalThis.innerHeight;
    const size = 0.4 * Math.min(vw, vh);
    const scale = Math.max(r.width, r.height) / size;
    // the icon scales around its goggles, so place its middle on the mark's
    const x = r.left + r.width / 2 - vw / 2;
    const y = r.top + r.height / 2 - vh / 2 - (eyes - 0.5) * size * (1 - scale);
    this.style.setProperty("--haxcms-goggles-from-x", Math.round(x) + "px");
    this.style.setProperty("--haxcms-goggles-from-y", Math.round(y) + "px");
    this.style.setProperty("--haxcms-goggles-from-scale", scale.toFixed(3));
  }
  /** the mark is empty while he is out of his corner */
  _markAway(away) {
    if (this._mark && this._mark.style) {
      this._mark.style.visibility = away ? "hidden" : "";
    }
    if (!away) {
      this._mark = null;
    }
  }
  _putOn() {
    const still = this._still();
    if (!still) {
      this._travelerFrom();
      this._markAway(true);
    }
    this.on = true;
    this._watch(true);
    this.phase = still ? "" : "puton";
    // the goggles go on with the lens chosen last time, not always the x-ray
    const chosen = LENSES.find((l) => l.id === this.lens);
    this._status = this.t.putOnSay.replace(
      "{lens}",
      this.lens === "person" && this.person
        ? this.t.followingSay.replace("{name}", this._name(this.person))
        : this.t[(chosen || LENSES[0]).say],
    );
    loadMakers().then(() => this.requestUpdate());
    if (this.lens === "translate") {
      this._holdLang(true);
      if (this.lensOn) {
        this._txBegin();
      }
    }
    clearTimeout(this._phaseTimer);
    this._phaseTimer = setTimeout(
      () => {
        this.phase = "";
        this._markAway(false);
      },
      still ? 0 : 1700,
    );
  }
  /** taking them off plays the put-on in reverse, then the overlay removes itself */
  _takeOff() {
    const still = this._still();
    if (!still) {
      this._travelerFrom();
      this._markAway(true);
    }
    this._watch(false);
    this.pinned = false;
    this._target = null;
    this._box = null;
    this._closeIssue();
    this._tx = null;
    this._txMarks = [];
    this._holdLang(false);
    this._pins = [];
    this._marks = [];
    this._status = this.t.takeOffSay;
    // stays drawn (on) for the length of the animation, holding nothing
    this.on = !still;
    this.phase = still ? "" : "takeoff";
    clearTimeout(this._phaseTimer);
    this._phaseTimer = setTimeout(
      () => {
        this.phase = "";
        this.on = false;
        this._markAway(false);
        if (!GogglesState.on) {
          this.remove();
        }
      },
      still ? 0 : 1300,
    );
  }
  willUpdate(changed) {
    if (super.willUpdate) {
      super.willUpdate(changed);
    }
    // the caption repeats the latest status for a few seconds
    if (changed.has("_status") && this._status) {
      this._say = this._status;
      clearTimeout(this._sayTimer);
      this._sayTimer = setTimeout(() => {
        this._say = "";
      }, 6000);
    }
  }
  get looking() {
    return (
      this.on && this.lensOn && this.phase === "" && !this._issue && !this._tx
    );
  }

  /* ---------- looking at things ---------- */
  _own(e) {
    const path = e.composedPath ? e.composedPath() : [];
    for (let i = 0; i < path.length; i++) {
      const n = path[i];
      if (n === this || n.id === "gogglesbutton") {
        return true;
      }
    }
    return false;
  }
  _pick(e) {
    if (this.lens === "translate") {
      return this._txPick(e);
    }
    const path = e.composedPath ? e.composedPath() : [];
    let node = null;
    let comp = null;
    let any = null;
    for (let i = 0; i < path.length; i++) {
      const n = path[i];
      if (
        !n ||
        n.nodeType !== 1 ||
        n === globalThis.document.documentElement ||
        n === globalThis.document.body
      ) {
        continue;
      }
      if (!node) {
        node = n;
      }
      if (n.localName.indexOf("-") > 0) {
        if (!any) {
          any = n;
        }
        if (MAKERS.tags[n.localName]) {
          comp = n;
          break;
        }
      }
    }
    if (!node) {
      return null;
    }
    return { node: node, comp: comp || any || node };
  }
  _rect(el) {
    if (!el || !el.getBoundingClientRect) {
      return null;
    }
    const r = el.getBoundingClientRect();
    const vw = globalThis.innerWidth;
    const vh = globalThis.innerHeight;
    const x = Math.max(r.left, 3);
    const y = Math.max(r.top, 3);
    return {
      x: x,
      y: y,
      w: Math.max(Math.min(r.right, vw - 3) - x, 0),
      h: Math.max(Math.min(r.bottom, vh - 3) - y, 0),
    };
  }
  _look(found, point) {
    if (this.lens === "translate") {
      // the Translate lens outlines words, never a whole element
      this._target = found;
      this._box = null;
      this._txHover = found
        ? found.tx.ctx.localName + "/" + found.tx.key
        : null;
      return;
    }
    if (!found) {
      return;
    }
    this._target = found;
    this._box = this._rect(this.lens === "code" ? found.node : found.comp);
    if (point) {
      this._point = point;
    }
  }
  _move(e) {
    if (
      !this.looking ||
      this.pinned ||
      this.lens === "person" ||
      this._own(e) ||
      e.pointerType === "touch"
    ) {
      return;
    }
    this._look(this._pick(e), { x: e.clientX, y: e.clientY });
  }
  _focus(e) {
    if (
      !this.looking ||
      this.pinned ||
      this.lens === "person" ||
      this._own(e)
    ) {
      return;
    }
    const found = this._pick(e);
    if (found) {
      const r = found.node.getBoundingClientRect();
      this._look(found, { x: r.left + 12, y: r.bottom });
      if (found.tx) {
        this._status = found.tx.missing
          ? this.t.txLookingMissing.replace("{en}", found.tx.en)
          : this.t.txLookingAt
              .replace("{en}", found.tx.en)
              .replace("{now}", found.tx.now);
      }
    }
  }
  _hold(e) {
    if (!this.looking || this._own(e)) {
      return;
    }
    e.stopImmediatePropagation();
    if (e.type !== "click") {
      // pointerdown stays cancelable-free so a finger can still scroll the page
      if (e.type !== "pointerdown" && e.type !== "pointerup" && e.cancelable) {
        e.preventDefault();
      }
      return;
    }
    e.preventDefault();
    const found = this._pick(e);
    if (!found) {
      return;
    }
    if (this.lens === "person") {
      GogglesState.set({ lens: "makers" });
    }
    this._choose(found, { x: e.clientX, y: e.clientY });
  }
  _choose(found, point) {
    if (this.lens === "translate") {
      if (found && found.tx) {
        this._txOpen(found.tx.ctx, found.tx.detail, found.tx.key);
      }
      return;
    }
    this.pinned = false;
    this._showAllPeople = false;
    this._look(found, point);
    if (this.lens === "flag") {
      this._openIssue(found.comp);
    } else {
      this.pinned = true;
      this._status = this.t.holdingSay.replace("{tag}", found.comp.localName);
      this.updateComplete.then(() => {
        const card = this.shadowRoot.querySelector(".card");
        if (card) {
          card.focus();
        }
      });
    }
  }
  _keys(e) {
    if (!this.on) {
      return;
    }
    if (e.key === "Escape") {
      if (this._tx) {
        this._tx = null;
      } else if (this._issue) {
        this._closeIssue();
      } else if (this.pinned) {
        this.pinned = false;
      } else if (this.lensOn && this.lens === "person") {
        GogglesState.set({ lens: "makers" });
      } else if (this.lensOn) {
        GogglesState.set({ lensOn: false });
      } else {
        return;
      }
      e.stopImmediatePropagation();
    } else if (
      e.key === "Enter" &&
      this.looking &&
      !this.pinned &&
      !this._own(e) &&
      this._target
    ) {
      e.preventDefault();
      e.stopImmediatePropagation();
      this._choose(this._target, this._point);
    }
  }
  _reflow() {
    if (!this.on) {
      return;
    }
    if (this._target && this.lensOn) {
      const el = this.lens === "code" ? this._target.node : this._target.comp;
      if (el.isConnected) {
        const next = this._rect(el);
        const b = this._box;
        if (
          !b ||
          b.x !== next.x ||
          b.y !== next.y ||
          b.w !== next.w ||
          b.h !== next.h
        ) {
          this._box = next;
        }
      } else if (!this._issue) {
        this._target = null;
        this._box = null;
        this.pinned = false;
      }
    }
    const marks =
      this.looking && this.lens === "person" && this.person
        ? this._personMarks(this.person)
        : [];
    const markKey = marks
      .map(
        (m) =>
          m.tag +
          Math.round(m.x) +
          "," +
          Math.round(m.y) +
          "," +
          Math.round(m.w),
      )
      .join("|");
    if (markKey !== this._markKey) {
      this._markKey = markKey;
      this._marks = marks;
    }
    const words =
      this.looking && this.lens === "translate"
        ? scanScreen(this._txLang, ["haxcms-goggles"])
        : [];
    const wordKey = words
      .map(
        (m) =>
          m.ctx.localName +
          m.key +
          Math.round(m.x) +
          "," +
          Math.round(m.y) +
          m.missing,
      )
      .join("|");
    if (wordKey !== this._txKey) {
      this._txKey = wordKey;
      this._txMarks = words;
    }
    const pins =
      this.looking && this.lens === "makers" ? this._landmarks() : [];
    const key = pins
      .map((p) => p.tag + Math.round(p.x) + "," + Math.round(p.y))
      .join("|");
    if (key !== this._pinKey) {
      this._pinKey = key;
      this._pins = pins;
    }
  }

  /*
   * Moving around: only between custom elements. Plain tags in between are
   * walked through, never stopped on, so a few steps reach anything
   * interesting instead of wading through shadow roots div by div.
   */
  _isCustom(n) {
    return (
      !!n && n.nodeType === 1 && n !== this && n.localName.indexOf("-") > 0
    );
  }
  /** the custom elements this one sits inside, nearest first, across shadow roots */
  _above(el) {
    const out = [];
    let n = el;
    while (n && out.length < 40) {
      n = n.assignedSlot || n.parentNode || n.host;
      if (this._isCustom(n) && out.indexOf(n) === -1) {
        out.push(n);
      }
    }
    return out;
  }
  /** the nearest custom elements inside this one, in its own shadow root and in what it holds */
  _below(el) {
    const out = [];
    const walk = (root, depth) => {
      if (!root || depth > 40 || out.length >= 600) {
        return;
      }
      const kids = Array.from(root.children || []);
      for (let i = 0; i < kids.length && out.length < 600; i++) {
        const k = kids[i];
        if (k.localName === "style" || k.localName === "script") {
          continue;
        }
        if (this._isCustom(k)) {
          out.push(k);
        } else {
          walk(k, depth + 1);
          if (k.shadowRoot) {
            walk(k.shadowRoot, depth + 1);
          }
        }
      }
    };
    walk(el.shadowRoot, 0);
    walk(el, 0);
    return out;
  }
  /** one entry per tag, in the order first met, with how many there are */
  _byTag(list) {
    const out = [];
    const at = {};
    list.forEach((el) => {
      if (at[el.localName] === undefined) {
        at[el.localName] = out.length;
        out.push({ tag: el.localName, el: el, count: 1 });
      } else {
        out[at[el.localName]].count++;
      }
    });
    return out;
  }
  /** hold still on another element: scroll it into view and move the readout to it */
  _go(el) {
    if (!el || !el.isConnected) {
      return;
    }
    let r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > globalThis.innerHeight) {
      el.scrollIntoView({ block: "center" });
      r = el.getBoundingClientRect();
    }
    this._choose(
      { node: el, comp: el },
      {
        x: Math.min(Math.max(r.left + 12, 0), globalThis.innerWidth),
        y: Math.min(Math.max(r.bottom, 0), globalThis.innerHeight),
      },
    );
  }
  _tagButton(entry) {
    return html`<button
      type="button"
      class="code"
      @click="${() => this._go(entry.el)}"
    >
      &lt;${entry.tag}&gt;${
        entry.count > 1
          ? html`<span class="count"
              >${this.t.timesCount.replace("{count}", entry.count)}</span
            >`
          : nothing
      }
    </button>`;
  }
  _renderMoves() {
    if (!this.pinned || !this._target) {
      return nothing;
    }
    const here = this.lens === "code" ? this._target.node : this._target.comp;
    const above = this._byTag(this._above(here));
    const below = this._byTag(this._below(here));
    if (!above.length && !below.length) {
      return nothing;
    }
    return html`<nav class="moves" aria-label="${this.t.moveAround}">
      <h3>${this.t.moveAround}</h3>
      <div class="actions tight">
        ${
          above.length
            ? html`<button
                type="button"
                @click="${() => this._go(above[0].el)}"
              >
                <simple-icon-lite icon="icons:arrow-upward"></simple-icon-lite
                ><span class="code"
                  >${this.t.upTo.replace("{tag}", "<" + above[0].tag + ">")}</span
                >
              </button>`
            : nothing
        }
        ${
          below.length === 1
            ? html`<button
                type="button"
                @click="${() => this._go(below[0].el)}"
              >
                <simple-icon-lite icon="icons:arrow-downward"></simple-icon-lite
                ><span class="code"
                  >${this.t.downTo.replace("{tag}", "<" + below[0].tag + ">")}</span
                >
              </button>`
            : nothing
        }
      </div>
      ${
        above.length
          ? html`<details class="fold">
              <summary>
                ${this.t.aboveIt.replace("{count}", above.length)}
              </summary>
              <div class="actions tight">
                ${above.map((e) => this._tagButton(e))}
              </div>
            </details>`
          : nothing
      }
      ${
        below.length
          ? html`<details class="fold">
              <summary>
                ${this.t.insideIt.replace("{count}", below.length)}
              </summary>
              <div class="actions tight">
                ${below.map((e) => this._tagButton(e))}
              </div>
            </details>`
          : nothing
      }
    </nav>`;
  }

  /* ---------- who owns a tag ---------- */
  _names(list) {
    if (list.length === 1) {
      return list[0];
    }
    return this.t.andNames
      .replace("{first}", list.slice(0, -1).join(", "))
      .replace("{second}", list[list.length - 1]);
  }
  /** who a tag belongs to: HAX (and who made it), a package outside HAX, or the HTML standard */
  _owner(tag) {
    if (!tag || tag.indexOf("-") === -1) {
      return { kind: "native", text: this.t.ownerNative };
    }
    const t = MAKERS.tags[tag];
    if (t) {
      const names = t.p.slice(0, 2).map((p) => this._name(p[0]));
      const wraps = MAKERS.wraps[tag];
      return {
        kind: "hax",
        text: names.length
          ? this.t.ownerHaxBy.replace("{names}", this._names(names))
          : this.t.ownerHax,
        wraps: wraps ? this.t.ownerWraps.replace("{work}", wraps) : "",
      };
    }
    const pkg = MAKERS.third[tag];
    if (pkg) {
      const owner = MAKERS.owners[pkg];
      return {
        kind: "third",
        text: owner
          ? this.t.ownerThirdBy
              .replace("{package}", pkg)
              .replace("{owner}", owner)
          : this.t.ownerThird.replace("{package}", pkg),
      };
    }
    return { kind: "outside", text: this.t.ownerOutside };
  }
  _renderOwner(tag) {
    const o = this._owner(tag);
    return html`<p class="row owner ${o.kind}">
      <span class="muted">${this.t.ownerLabel}</span> ${o.text}${
        o.wraps ? html`. ${o.wraps}` : nothing
      }
    </p>`;
  }
  /** a link out of the goggles: always the same chip, with an icon for where it goes */
  _jump(href, icon, label) {
    return html`<a class="jump" href="${href}" target="_blank" rel="noopener"
      ><simple-icon-lite icon="${icon}"></simple-icon-lite>${label}</a
    >`;
  }

  _commits(n) {
    return (n === 1 ? this.t.commitOne : this.t.commitMany).replace(
      "{count}",
      n,
    );
  }
  _years(from, to) {
    return from === to
      ? String(from)
      : this.t.yearRange.replace("{from}", from).replace("{to}", to);
  }
  /* ---------- one person's work ---------- */
  _name(login) {
    const known = MAKERS.people[login];
    return known && known.n ? known.n : login;
  }
  _follow(login) {
    this.pinned = false;
    this._target = null;
    this._box = null;
    GogglesState.set({ lens: "person", person: login, lensOn: true });
  }
  /** every registered piece this person committed to or is credited with shaping */
  _personWork(login) {
    if (this._workFor === login && this._work) {
      return this._work;
    }
    const pieces = [];
    const files = {};
    Object.keys(MAKERS.tags).forEach((tag) => {
      const t = MAKERS.tags[tag];
      for (let i = 0; i < t.p.length; i++) {
        if (t.p[i][0] === login) {
          pieces.push({
            tag: tag,
            file: t.f,
            pkg: t.f.split("/")[0],
            c: t.p[i][1],
            a: t.p[i][2],
            z: t.p[i][3],
            share: t.n ? t.p[i][1] / t.n : 0,
          });
          files[t.f] = t.p[i][1];
          break;
        }
      }
    });
    const shaped = [];
    const shapedTags = {};
    Object.keys(MAKERS.shaped || {}).forEach((key) => {
      MAKERS.shaped[key].forEach((s) => {
        if (s[0] === login) {
          shaped.push({ key: key, credit: s[1] });
          Object.keys(MAKERS.tags).forEach((tag) => {
            const t = MAKERS.tags[tag];
            if (
              tag === key ||
              t.f.split("/")[0] === key ||
              (MAKERS.shapedTags || {})[tag] === key
            ) {
              shapedTags[tag] = s[1];
            }
          });
        }
      });
    });
    const yearsMap = (MAKERS.years || {})[login] || {};
    const years = Object.keys(yearsMap)
      .sort()
      .map((y) => [y, yearsMap[y]]);
    const commits = Object.keys(files).reduce((t, f) => t + files[f], 0);
    this._workFor = login;
    this._work = {
      pieces: pieces,
      shaped: shaped,
      shapedTags: shapedTags,
      years: years,
      commits: commits,
      since: years.length ? years[0][0] : "",
    };
    return this._work;
  }
  /** the pieces on screen right now that this person had a hand in */
  _personMarks(login) {
    const work = this._personWork(login);
    const mine = {};
    work.pieces.forEach((p) => {
      mine[p.tag] = true;
    });
    Object.keys(work.shapedTags).forEach((t) => {
      mine[t] = true;
    });
    const vw = globalThis.innerWidth;
    const vh = globalThis.innerHeight;
    const marks = [];
    const boxed = new Set();
    // outline only the outermost piece of theirs; pieces that fill most of the
    // screen (a theme, the editor body) get a label only and do not hide what is inside
    const insideBoxed = (el) => {
      let n = el.assignedSlot || el.parentNode || el.host;
      while (n) {
        if (boxed.has(n)) {
          return true;
        }
        n = n.assignedSlot || n.parentNode || n.host;
      }
      return false;
    };
    const walk = (root, depth) => {
      if (depth > 8 || marks.length >= 40) {
        return;
      }
      root.querySelectorAll("*").forEach((el) => {
        if (marks.length >= 40 || el === this) {
          return;
        }
        if (mine[el.localName] && !insideBoxed(el)) {
          const r = el.getBoundingClientRect();
          if (
            r.width >= 8 &&
            r.height >= 8 &&
            r.bottom > 0 &&
            r.top < vh &&
            r.right > 0 &&
            r.left < vw
          ) {
            const x = Math.max(r.left, 3);
            const y = Math.max(r.top, 3);
            const w = Math.min(r.right, vw - 3) - x;
            const h = Math.min(r.bottom, vh - 3) - y;
            const frame = w * h > vw * vh * 0.5;
            if (!frame) {
              boxed.add(el);
            }
            marks.push({
              el: el,
              tag: el.localName,
              frame: frame,
              x: x,
              y: y,
              w: w,
              h: h,
            });
          }
        }
        if (el.shadowRoot) {
          walk(el.shadowRoot, depth + 1);
        }
      });
    };
    walk(globalThis.document, 0);
    return marks;
  }
  /** the element on its own in the webcomponents gallery, in the design system and palette the site uses now */
  _alone(tag) {
    const t = MAKERS.tags[tag];
    if (!t) {
      return "";
    }
    const pkg = t.f.split("/")[0];
    // the gallery shows packages; a tag that is not its package's own
    // element is only alone there when the package has a demo named for it
    const demo = tag === pkg ? "" : MAKERS.demos[tag];
    if ((tag !== pkg && !demo) || MAKERS.gallery.indexOf(pkg) === -1) {
      return "";
    }
    const params = new URLSearchParams();
    params.set("element", pkg);
    if (demo) {
      params.set("demo", demo);
    }
    const theme =
      store && store.manifest && store.manifest.metadata
        ? store.manifest.metadata.theme || {}
        : {};
    if (theme.designSystem) {
      params.set("system", theme.designSystem);
    }
    if (
      theme.variables &&
      theme.variables.palette !== undefined &&
      theme.variables.palette !== ""
    ) {
      params.set("palette", theme.variables.palette);
    }
    return GALLERY + "?" + params.toString();
  }
  _renderAlone(tag) {
    const url = this._alone(tag);
    return url
      ? this._jump(url, "icons:open-in-new", this.t.seeItAlone)
      : nothing;
  }
  _renderPersonPanel() {
    if (!this.looking || this.lens !== "person" || !this.person) {
      return nothing;
    }
    const login = this.person;
    const known = MAKERS.people[login] || {};
    const work = this._personWork(login);
    const top = work.years.reduce((m, y) => Math.max(m, y[1]), 1);
    const onScreen = [];
    this._marks.forEach((m) => {
      if (onScreen.indexOf(m.tag) === -1) {
        onScreen.push(m.tag);
      }
    });
    const sorted = work.pieces
      .slice()
      .sort((a, b) =>
        this._sort === "share"
          ? b.share - a.share || b.c - a.c
          : b.c - a.c || b.share - a.share,
      );
    const shown = this._showAll ? sorted : sorted.slice(0, 5);
    const ghLogin = /^[A-Za-z0-9-]+$/.test(login);
    return html`<section
      class="panel"
      role="region"
      aria-label="${this.t.everythingMadeBy.replace("{name}", known.n || login)}"
    >
      <p class="eyebrow">
        <simple-icon-lite icon="social:person"></simple-icon-lite>
        ${this.t.following}
      </p>
      <div class="who-head">
        <rpg-character
          seed="${login}"
          width="72"
          height="90"
          aria-hidden="true"
        ></rpg-character>
        <div>
          <h2 class="name">${known.n || login}</h2>
          ${known.n && known.n !== login ? html`<p class="muted">${login}</p>` : nothing}
          ${(known.w || []).map((w) => html`<p class="role">${w}</p>`)}
        </div>
      </div>
      <p class="stats">
        ${this.t.personStats.replace("{pieces}", work.pieces.length).replace("{commits}", work.commits)}${work.since ? " " + this.t.personSince.replace("{year}", work.since) : ""}
        ${this.t.personOnScreen.replace("{count}", onScreen.length)}
      </p>
      <div class="actions tight">
        ${known.s ? this._jump(STORIES + known.s, "icons:book", this.t.theirStoryOnHax) : nothing}
        ${ghLogin ? this._jump("https://github.com/" + login, "mdi-social:github-circle", this.t.onGitHub) : nothing}
        <button
          type="button"
          @click="${() => GogglesState.set({ lens: "makers" })}"
        >
          <simple-icon-lite icon="icons:close"></simple-icon-lite
          >${this.t.stopFollowing}
        </button>
      </div>
      ${
        work.years.length
          ? html`<h3>${this.t.commitsByYear}</h3>
              <ul class="years">
                ${work.years.map(
                  (y) =>
                    html`<li>
                      <span class="year">${y[0]}</span>
                      <span class="bar"
                        ><span
                          style="width:${Math.max(Math.round((y[1] / top) * 100), 2)}%"
                        ></span
                      ></span>
                      <span class="count">${y[1]}</span>
                    </li>`,
                )}
              </ul>`
          : nothing
      }
      ${
        onScreen.length
          ? html`<h3>${this.t.onThisScreen}</h3>
              <div class="actions tight">
                ${onScreen.map((tag) => html`<button type="button" class="code" @click="${() => this._showMark(tag)}">&lt;${tag}&gt;</button>`)}
              </div>`
          : html`<p class="muted">${this.t.nothingOnScreen}</p>`
      }
      ${
        work.shaped.length
          ? html`<h3>${this.t.shaped}</h3>
              <ul class="work">
                ${work.shaped.map((s) => html`<li><span class="code-name">${s.key}</span><span class="muted">${s.credit}</span></li>`)}
              </ul>`
          : nothing
      }
      <h3>${this.t.acrossHax}</h3>
      <div class="sort" role="group" aria-label="${this.t.sortTheirWork}">
        <button
          type="button"
          aria-pressed="${this._sort === "share" ? "true" : "false"}"
          @click="${() => (this._sort = "share")}"
        >
          ${this.t.mostTheirs}
        </button>
        <button
          type="button"
          aria-pressed="${this._sort === "commits" ? "true" : "false"}"
          @click="${() => (this._sort = "commits")}"
        >
          ${this.t.mostCommits}
        </button>
      </div>
      <ul class="work">
        ${shown.map(
          (w) =>
            html`<li>
              <span class="code-name">&lt;${w.tag}&gt;</span>
              <span class="muted"
                >${this.t.shareLine
                  .replace("{share}", Math.round(w.share * 100))
                  .replace("{commits}", this._commits(w.c))
                  .replace("{years}", this._years(w.a, w.z))}</span
              >
              <span class="actions tight">
                ${ghLogin ? this._jump(REPO + "/commits/master/elements/" + w.file + "?author=" + login, "mdi-social:github-circle", this.t.theirCommits) : nothing}
                ${this._renderAlone(w.tag)}
              </span>
            </li>`,
        )}
      </ul>
      ${
        sorted.length > 5
          ? html`<div class="actions tight">
              <button
                type="button"
                aria-expanded="${this._showAll ? "true" : "false"}"
                @click="${() => (this._showAll = !this._showAll)}"
              >
                <simple-icon-lite
                  icon="${this._showAll ? "icons:expand-less" : "icons:expand-more"}"
                ></simple-icon-lite
                >${
                  this._showAll
                    ? this.t.showTop.replace("{count}", 5)
                    : this.t.showAll.replace("{count}", sorted.length)
                }
              </button>
            </div>`
          : nothing
      }
    </section>`;
  }
  _showMark(tag) {
    const m = this._marks.find((x) => x.tag === tag);
    if (m && m.el) {
      m.el.scrollIntoView({ block: "center", behavior: "smooth" });
      this._flash = tag;
      clearTimeout(this._flashTimer);
      this._flashTimer = setTimeout(() => {
        this._flash = "";
        this.requestUpdate();
      }, 1600);
      this.requestUpdate();
    }
  }
  _renderMarks() {
    if (this.lens === "translate") {
      return this._renderWords();
    }
    if (!this.looking || this.lens !== "person") {
      return nothing;
    }
    return this._marks.map(
      (m) =>
        html`<div
          class="box mark ${m.frame ? "frame" : ""} ${this._flash === m.tag ? "flash" : ""}"
          aria-hidden="true"
          style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px"
        >
          <span>&lt;${m.tag}&gt;</span>
        </div>`,
    );
  }

  /* ---------- who made it ---------- */
  _credits(tag) {
    const t = MAKERS.tags[tag];
    if (!t) {
      return null;
    }
    const pkg = t.f.split("/")[0];
    const shapedKey =
      MAKERS.shapedTags[tag] || (MAKERS.shaped[tag] ? tag : pkg);
    const seen = {};
    const person = (login, extra) => {
      const known = MAKERS.people[login] || {};
      return Object.assign(
        {
          login: login,
          name: known.n || login,
          work: known.w || [],
          story: known.s || "",
        },
        extra,
      );
    };
    const coded = t.p.map((p) => {
      seen[p[0]] = true;
      return person(p[0], { commits: p[1], from: p[2], to: p[3] });
    });
    const shaped = (MAKERS.shaped[shapedKey] || [])
      .filter((s) => !seen[s[0]])
      .map((s) => {
        seen[s[0]] = true;
        return person(s[0], { credit: s[1] });
      });
    const around = ((MAKERS.pkgs[pkg] || { p: [] }).p || [])
      .filter((p) => !seen[p[0]])
      .slice(0, 5)
      .map((p) => person(p[0], { commits: p[1], from: p[2], to: p[3] }));
    return {
      tag: tag,
      file: t.f,
      pkg: pkg,
      coded: coded,
      shaped: shaped,
      around: around,
      agents: t.g,
    };
  }
  /** the big pieces on screen right now, each with the people behind it */
  _landmarks() {
    const doc = globalThis.document;
    const vw = globalThis.innerWidth;
    const vh = globalThis.innerHeight;
    const found = [];
    const used = {};
    // wherever the editor's top bar is (other bars may sit above it)
    let bar = null;
    const findBar = (root, depth) => {
      if (bar || !root || depth > 6) {
        return;
      }
      root.querySelectorAll("*").forEach((el) => {
        if (!bar && el.localName === "app-hax-top-bar") {
          const r = el.getBoundingClientRect();
          if (r.height > 0) {
            bar = r;
          }
        }
        if (!bar && el.shadowRoot && el !== this) {
          findBar(el.shadowRoot, depth + 1);
        }
      });
    };
    findBar(doc, 0);
    const below = bar ? Math.max(bar.bottom + 6, 68) : 68;
    const add = (el) => {
      if (!el || used[el.localName] || !MAKERS.tags[el.localName]) {
        return;
      }
      const r = el.getBoundingClientRect();
      if (
        r.width < 40 ||
        r.height < 24 ||
        r.bottom < 10 ||
        r.top > vh - 90 ||
        r.right < 0 ||
        r.left > vw
      ) {
        return;
      }
      // pieces of the top bar get their pin just under the bar, so the bar
      // and the goggles' own buttons in it stay readable and clickable
      const inBar = bar
        ? r.top >= bar.top - 1 && r.bottom <= bar.bottom + 1
        : r.top < 60 && r.bottom < 80;
      const x = Math.min(
        Math.max(
          el.localName === "app-hax-top-bar" ? r.left + r.width * 0.68 : r.left,
          12,
        ),
        vw - 150,
      );
      const y = inBar ? below : Math.min(Math.max(r.top, below), vh - 150);
      for (let i = 0; i < found.length; i++) {
        if (Math.abs(found[i].x - x) < 210 && Math.abs(found[i].y - y) < 54) {
          return;
        }
      }
      used[el.localName] = true;
      found.push({ el: el, tag: el.localName, x: x, y: y });
    };
    const deep = (root, tags, depth) => {
      if (!root || depth > 6) {
        return;
      }
      root.querySelectorAll("*").forEach((el) => {
        if (tags.indexOf(el.localName) !== -1) {
          add(el);
        }
        if (el.shadowRoot && el !== this) {
          deep(el.shadowRoot, tags, depth + 1);
        }
      });
    };
    // the editor and the theme first, then the blocks of the page itself
    deep(doc, ["super-daemon-search", "app-hax-top-bar"], 0);
    const builder = doc.querySelector("haxcms-site-builder");
    if (builder) {
      // the theme is the element the site builder draws the site with
      Array.from(builder.children).forEach((el) => {
        if (/-theme$/.test(el.localName) || MAKERS.tags[el.localName]) {
          add(el);
        }
      });
    }
    deep(doc, ["hax-tray", "site-top-menu", "site-menu", "site-breadcrumb"], 0);
    const blocks = (root) => {
      root.querySelectorAll("*").forEach((el) => {
        if (
          el.localName.indexOf("-") > 0 &&
          found.length < 12 &&
          el.localName !== "haxcms-goggles-toggle" &&
          el.localName !== "hax-body"
        ) {
          add(el);
        }
      });
    };
    // in edit mode the page is inside hax-body, wherever the editor put it
    let body = null;
    const findBody = (root, depth) => {
      if (body || depth > 5) {
        return;
      }
      root.querySelectorAll("*").forEach((el) => {
        if (!body && el.localName === "hax-body") {
          body = el;
        }
        if (!body && el.shadowRoot && el !== this) {
          findBody(el.shadowRoot, depth + 1);
        }
      });
    };
    findBody(doc, 0);
    if (body) {
      blocks(body);
    }
    if (builder) {
      blocks(builder);
    }
    return found;
  }

  /* ---------- how it is made ---------- */
  _anatomy(found) {
    const comp = found.comp;
    const node = found.node;
    const chain = [];
    let p = Object.getPrototypeOf(comp);
    while (
      p &&
      p.constructor &&
      p.constructor !== globalThis.HTMLElement &&
      chain.length < 5
    ) {
      const n = p.constructor.name;
      if (n && n.length > 2 && chain.indexOf(n) === -1 && n !== "Object") {
        chain.push(n);
      }
      p = Object.getPrototypeOf(p);
    }
    const props = [];
    const ctor = comp.constructor;
    const defs =
      ctor && ctor.elementProperties
        ? Array.from(ctor.elementProperties.keys())
        : [];
    for (let i = 0; i < defs.length && props.length < 40; i++) {
      const k = defs[i];
      if (typeof k !== "string" || k.charAt(0) === "_" || k === "t") {
        continue;
      }
      const v = comp[k];
      if (
        v === null ||
        v === undefined ||
        v === "" ||
        typeof v === "object" ||
        typeof v === "function"
      ) {
        continue;
      }
      props.push([k, String(v).slice(0, 48)]);
    }
    const slots = [];
    if (comp.shadowRoot) {
      comp.shadowRoot.querySelectorAll("slot").forEach((s) => {
        const name = s.getAttribute("name") || "(default)";
        if (slots.indexOf(name) === -1) {
          slots.push(name);
        }
      });
    }
    const hax = ctor && ctor.haxProperties ? ctor.haxProperties : null;
    let gizmo = "";
    if (hax && typeof hax === "object" && hax.gizmo && hax.gizmo.title) {
      gizmo = hax.gizmo.title;
    }
    const markup = withoutComments(String(node.outerHTML || ""))
      .replace(/\s+/g, " ")
      .replace(/> </g, ">\n<")
      .trim();
    const info = MAKERS.tags[comp.localName];
    return {
      tag: comp.localName,
      nodeTag: node.localName,
      same: node === comp,
      inShadow: node.getRootNode() !== globalThis.document,
      file: info ? info.f : "",
      chain: chain,
      props: props,
      slots: slots,
      hax: !!hax,
      gizmo: gizmo,
      markup: markup,
    };
  }

  /* ---------- flag it ---------- */
  _openIssue(comp) {
    const r = comp.getBoundingClientRect();
    const boxes = [];
    const walk = (root, depth) => {
      if (depth > 5 || boxes.length > 70) {
        return;
      }
      const kids = root.shadowRoot
        ? Array.from(root.shadowRoot.children).concat(Array.from(root.children))
        : Array.from(root.children);
      kids.forEach((k) => {
        if (
          boxes.length > 70 ||
          !k.getBoundingClientRect ||
          k.localName === "style"
        ) {
          return;
        }
        const b = k.getBoundingClientRect();
        if (
          b.width > 6 &&
          b.height > 6 &&
          b.right > r.left &&
          b.left < r.right &&
          b.bottom > r.top &&
          b.top < r.bottom
        ) {
          boxes.push({
            x: b.left - r.left,
            y: b.top - r.top,
            w: b.width,
            h: b.height,
            c: k.localName.indexOf("-") > 0,
          });
        }
        walk(k, depth + 1);
      });
    };
    walk(comp, 0);
    const store =
      globalThis.HAXCMS && globalThis.HAXCMS.instance
        ? globalThis.HAXCMS.instance.store
        : null;
    const theme =
      store &&
      store.manifest &&
      store.manifest.metadata &&
      store.manifest.metadata.theme
        ? store.manifest.metadata.theme
        : {};
    const active = store && store.activeItem ? store.activeItem : {};
    const dark =
      globalThis.matchMedia &&
      globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
    const credits = this._credits(comp.localName);
    const anatomy = this._anatomy({ comp: comp, node: comp });
    this._issue = {
      kind: "bug",
      title: "",
      notes: "",
      tag: comp.localName,
      file: anatomy.file,
      w: Math.round(r.width),
      h: Math.round(r.height),
      x: Math.round(r.left),
      y: Math.round(r.top),
      boxes: boxes,
      page:
        (active.title || "") + (active.slug ? " (/" + active.slug + ")" : ""),
      theme: theme.element || "",
      designSystem: theme.designSystem || "ddd",
      edit: !!(store && store.editMode),
      viewport:
        globalThis.innerWidth +
        " x " +
        globalThis.innerHeight +
        " @" +
        (globalThis.devicePixelRatio || 1) +
        "x",
      scheme: dark ? "dark" : "light",
      agent: globalThis.navigator ? globalThis.navigator.userAgent : "",
      makers: credits
        ? credits.coded.concat(credits.shaped).map((p) => p.login)
        : [],
      markup: anatomy.markup.slice(0, 500),
      id: (this._issueCount = (this._issueCount || 0) + 1),
      shot: { state: "developing" },
      attach: "whole",
      shotCopied: false,
      path: elementPath(comp),
      lang:
        I18NManagerStore.lang || globalThis.document.documentElement.lang || "",
      build: MAKERS.sha ? "master at " + MAKERS.sha : "",
      errors: this._errors.slice(-5),
      findings: [],
      check: "",
      scope: "block",
      pageHost: this._pageHost(comp),
      replay: null,
    };
    this._comp = comp;
    this._copied = false;
    this._develop(comp, this._issue.id);
    this._pack(this._issue.id);
    if (!anatomy.file) {
      // flagged before the makers data arrived: fill in source and makers once it does
      loadMakers().then(() => {
        if (
          this._issue &&
          this._issue.tag === comp.localName &&
          MAKERS.tags[comp.localName]
        ) {
          const c = this._credits(comp.localName);
          this._issue = Object.assign({}, this._issue, {
            file: MAKERS.tags[comp.localName]
              ? MAKERS.tags[comp.localName].f
              : "",
            makers: c ? c.coded.concat(c.shaped).map((x) => x.login) : [],
          });
        }
      });
    }
    this._status = this.t.flaggedSay.replace("{tag}", comp.localName);
    this.updateComplete.then(() => {
      const f = this.shadowRoot.querySelector("#issue-title");
      if (f) {
        f.focus();
      }
    });
  }
  /** a picture of the screen as it is now, with the flagged piece outlined, plus a crop of just that piece */
  async _develop(comp, id) {
    const current = () => this._issue && this._issue.id === id;
    const fail = (why) => {
      if (current()) {
        this._issue = Object.assign({}, this._issue, {
          shot: { state: "failed", why: why },
        });
        this._status = this.t.shotFailedSay;
      }
    };
    try {
      const r = comp.getBoundingClientRect();
      const lib = await import("./haxcms-goggles-screenshot.js");
      const canvas = await lib.captureViewport({ exclude: [this] });
      if (!current()) {
        return;
      }
      const k = canvas.width / globalThis.innerWidth;
      const ctx = canvas.getContext("2d");
      const box = {
        x: Math.max(r.left, 2) * k,
        y: Math.max(r.top, 2) * k,
        w:
          (Math.min(r.right, globalThis.innerWidth - 2) - Math.max(r.left, 2)) *
          k,
        h:
          (Math.min(r.bottom, globalThis.innerHeight - 2) -
            Math.max(r.top, 2)) *
          k,
      };
      ctx.lineWidth = 6 * k;
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.lineWidth = 3 * k;
      ctx.strokeStyle = "#2fd3e0";
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      const pad = 24 * k;
      const cx = Math.max(box.x - pad, 0);
      const cy = Math.max(box.y - pad, 0);
      const crop = globalThis.document.createElement("canvas");
      crop.width = Math.max(Math.min(box.w + pad * 2, canvas.width - cx), 1);
      crop.height = Math.max(Math.min(box.h + pad * 2, canvas.height - cy), 1);
      crop
        .getContext("2d")
        .drawImage(
          canvas,
          cx,
          cy,
          crop.width,
          crop.height,
          0,
          0,
          crop.width,
          crop.height,
        );
      const blobOf = (c) => new Promise((done) => c.toBlob(done, "image/png"));
      const pack = (blob, c) => ({
        blob: blob,
        url: globalThis.URL.createObjectURL(blob),
        w: c.width,
        h: c.height,
        kb: Math.max(Math.round(blob.size / 1024), 1),
      });
      const whole = await blobOf(canvas);
      const piece = await blobOf(crop);
      if (!whole || !piece) {
        fail("empty");
        return;
      }
      if (!current()) {
        return;
      }
      this._issue = Object.assign({}, this._issue, {
        shot: {
          state: "ready",
          whole: pack(whole, canvas),
          piece: pack(piece, crop),
        },
      });
      this._status = this.t.shotReadySay;
    } catch (e) {
      fail(String(e && e.message ? e.message : e));
    }
  }
  _closeIssue() {
    const i = this._issue;
    if (i && i.shot && i.shot.state === "ready") {
      globalThis.URL.revokeObjectURL(i.shot.whole.url);
      globalThis.URL.revokeObjectURL(i.shot.piece.url);
    }
    this._issue = null;
  }
  /** puts the chosen picture on the clipboard; called from a click so the browser allows it */
  _copyShot() {
    const i = this._issue;
    if (!i || !i.shot || i.shot.state !== "ready") {
      return;
    }
    const pick = i.shot[i.attach];
    const blocked = () => {
      this._status = this.t.shotBlockedSay;
    };
    try {
      if (
        !globalThis.ClipboardItem ||
        !globalThis.navigator.clipboard ||
        !globalThis.navigator.clipboard.write
      ) {
        blocked();
        return;
      }
      globalThis.navigator.clipboard
        .write([new globalThis.ClipboardItem({ "image/png": pick.blob })])
        .then(() => {
          if (this._issue) {
            this._issue = Object.assign({}, this._issue, { shotCopied: true });
          }
          this._status = this.t.shotCopiedSay;
        }, blocked);
    } catch {
      blocked();
    }
  }
  /** the issue goes to the HAX maintainers' tracker, so its text stays in English */
  _issueText() {
    const i = this._issue;
    const f = issueFields(i);
    const r = i.replay;
    const lines = [
      "### " +
        (i.kind === "bug"
          ? "What's wrong"
          : i.kind === "wish"
            ? "What I wish it did"
            : i.kind === "docs"
              ? "What confused me"
              : "What got in the way"),
      f.description || "(not written yet)",
      "",
    ];
    if (f.check) {
      lines.push("### Failing check", f.check, "");
    }
    lines.push("### Element", f.element, "", "### Context", f.context, "");
    lines.push("### Markup", "```html", i.markup, "```", "");
    if (r && r.packed) {
      lines.push("### Replay", replayLink(r.packed), "");
    }
    lines.push(
      "### Screenshot",
      i.shot && i.shot.state === "ready"
        ? "<!-- The goggles put a screenshot on your clipboard: click on the next line and paste it (Ctrl+V or Cmd+V) -->\n"
        : "(no screenshot)",
    );
    return {
      title: reportTitle(i.kind, i.tag, i.title),
      body: lines.join("\n"),
    };
  }
  /** the goggles issue form for this kind, prefilled; what did not fit is attached instead */
  _issueLink() {
    const i = this._issue;
    const r = i.replay;
    return issueUrl(i, {
      markup: "```html\n" + i.markup + "\n```",
      replay:
        r && r.packed && r.packed.length <= INLINE_BUNDLE
          ? "Open on browser.hax.cloud: " + replayLink(r.packed)
          : "",
    });
  }
  /** where the whole page's content lives: the nearest hax-body or content container above the piece */
  /** where the page content lives: hax-body while editing, the theme otherwise */
  _contentHost() {
    const hax =
      store.editMode && globalThis.HaxStore
        ? globalThis.HaxStore.requestAvailability().activeHaxBody
        : null;
    return hax || store.themeElement || null;
  }
  _pageHost(comp) {
    const host = this._contentHost();
    return host && contentMark(comp, host) ? host : null;
  }
  /**
   * Holds still on the piece a replay link marks (?goggles=...&goggles-at=0.2),
   * once the page content has arrived.
   */
  holdAt(mark, tries) {
    const left = tries === undefined ? 40 : tries;
    const host = this._contentHost();
    const el = host ? findByMark(host, mark) : null;
    if (el && this.phase === "") {
      this._go(el);
      return true;
    }
    if (left > 0) {
      setTimeout(() => this.holdAt(mark, left - 1), 250);
    }
    return false;
  }
  /** packs the replay for the scope picked; runs again whenever the scope changes */
  async _pack(id) {
    const i = this._issue;
    if (!i || i.id !== id) {
      return;
    }
    if (i.scope === "none") {
      this._issue = Object.assign({}, i, { replay: null });
      return;
    }
    const theme =
      store && store.manifest && store.manifest.metadata
        ? store.manifest.metadata.theme || {}
        : {};
    const page = i.scope === "page" && i.pageHost;
    const bundle = replayBundle({
      scope: page ? "page" : "block",
      tag: i.tag,
      path: i.path,
      mark: page ? contentMark(this._comp, i.pageHost) : [0],
      html: withoutComments(
        page ? i.pageHost.innerHTML : this._comp ? this._comp.outerHTML : "",
      ),
      theme: theme.element || "",
      designSystem: theme.designSystem || "",
      build: i.build,
      lang: i.lang,
      scheme: i.scheme,
      viewport: i.viewport,
    });
    let packed = "";
    try {
      packed = await packBundle(bundle);
    } catch {
      packed = "";
    }
    if (this._issue && this._issue.id === id && this._issue.scope === i.scope) {
      this._issue = Object.assign({}, this._issue, {
        replay: { bundle: bundle, packed: packed },
      });
    }
  }
  /** a replay too big for the link becomes a file to drag into the issue */
  _downloadReplay() {
    const i = this._issue;
    if (!i || !i.replay) {
      return;
    }
    const blob = new globalThis.Blob([replayLink(i.replay.packed)], {
      type: "text/plain",
    });
    const url = globalThis.URL.createObjectURL(blob);
    const a = globalThis.document.createElement("a");
    a.href = url;
    a.download = "goggles-replay-" + i.tag + ".txt";
    this.shadowRoot.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => globalThis.URL.revokeObjectURL(url), 1000);
  }
  /** an error on the page while the goggles are on, kept short for the report */
  _caught(e) {
    const why =
      e && e.reason !== undefined
        ? e.reason && e.reason.message
          ? e.reason.message
          : String(e.reason)
        : e && e.message
          ? e.message
          : "";
    if (why) {
      this._errors = this._errors.concat(String(why).slice(0, 200)).slice(-10);
    }
  }
  /** an element's own docs (lib/<tag>.docs.json, shipped next to it), fetched once */
  _docsFor(tag) {
    if (this._docs[tag] !== undefined) {
      return this._docs[tag];
    }
    const info = MAKERS.tags[tag];
    const base = globalThis.WCGlobalBasePath || globalThis.WCAutoloadBasePath;
    this._docs[tag] = null;
    if (!info || !base) {
      return null;
    }
    const folder = info.f.split("/")[0];
    globalThis
      .fetch(
        new URL(
          "@haxtheweb/" + folder + "/lib/" + tag + ".docs.json",
          new URL(base, globalThis.location.href),
        ).href,
      )
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && d.description) {
          this._docs = Object.assign({}, this._docs, {
            [tag]: { description: d.description, title: d.title || tag },
          });
          this.requestUpdate();
        }
      })
      .catch(() => {});
    return null;
  }
  /** README of the element on GitHub: a plain link, nothing fetched */
  _readmeUrl(tag) {
    const info = MAKERS.tags[tag];
    return info
      ? REPO + "/blob/master/elements/" + info.f.split("/")[0] + "/README.md"
      : "";
  }
  _copyIssue() {
    const t = this._issueText();
    const done = () => {
      this._copied = true;
      this._status = this.t.issueCopiedSay;
    };
    try {
      globalThis.navigator.clipboard
        .writeText(t.title + "\n\n" + t.body)
        .then(done, () => {
          this._status = this.t.copyBlockedSay;
        });
    } catch {
      this._status = this.t.copyBlockedSay;
    }
  }
  _issueField(name, value) {
    const next = Object.assign({}, this._issue);
    next[name] = value;
    if (name === "attach") {
      next.shotCopied = false;
    }
    if (name === "kind" && value === "a11y" && this._comp) {
      // the checks run when someone says it is hard to use or see
      next.findings = a11yFindings(this._comp);
      next.check = next.findings.length
        ? this._checkText(next.findings[0])
        : "";
      if (!next.title && next.check) {
        next.title = next.check;
      }
    }
    this._issue = next;
    this._copied = false;
    if (name === "scope") {
      this._pack(next.id);
    }
  }
  /** one failed check, as it reads in the issue */
  _checkText(f) {
    const label =
      f.check === "image-alt"
        ? this.t.checkImageAlt
        : f.check === "control-name"
          ? this.t.checkControlName
          : f.check === "field-label"
            ? this.t.checkFieldLabel
            : this.t.checkContrast.replace("{ratio}", f.detail);
    return label + " (" + f.where + ")";
  }
  /** one of a few answers, as pressed buttons (the HAX UI way to pick one) */
  _renderChoices(name, label, options) {
    const id = "choice-" + name;
    return html`<div class="choices">
      <p class="legend" id="${id}">${label}</p>
      <div class="sort" role="group" aria-labelledby="${id}">
        ${options.map(
          (o) =>
            html`<button
              type="button"
              aria-pressed="${this._issue[name] === o.value ? "true" : "false"}"
              @click="${() => this._issueField(name, o.value)}"
            >
              <simple-icon-lite icon="${o.icon}"></simple-icon-lite>${o.label}
            </button>`,
        )}
      </div>
    </div>`;
  }

  /* ---------- drawing ---------- */
  _person(p, small) {
    const span = p.commits
      ? this._commits(p.commits) + ", " + this._years(p.from, p.to)
      : "";
    return html`<li class="person">
      <rpg-character
        seed="${p.login}"
        width="${small ? 40 : 56}"
        height="${small ? 50 : 70}"
        aria-hidden="true"
      ></rpg-character>
      <div>
        <strong>${p.name}</strong
        >${p.name !== p.login ? html` <span class="muted">${p.login}</span>` : nothing}
        ${span ? html`<div class="muted">${span}</div>` : nothing}
        ${p.credit ? html`<div>${p.credit}</div>` : nothing}
        ${!small && !p.credit && p.work.length ? html`<div>${p.work[0]}</div>` : nothing}
        ${
          this.pinned
            ? html`<div class="actions tight">
                ${p.story ? this._jump(STORIES + p.story, "icons:book", this.t.theirStoryOnHax) : nothing}
                <button
                  type="button"
                  class="follow"
                  @click="${() => this._follow(p.login)}"
                >
                  <simple-icon-lite icon="social:person"></simple-icon-lite
                  >${this.t.everythingTheyMade}
                </button>
              </div>`
            : nothing
        }
      </div>
    </li>`;
  }
  _cardPlace() {
    const vw = globalThis.innerWidth;
    const vh = globalThis.innerHeight;
    if (vw < 720) {
      return "";
    }
    const p = this._point;
    const side =
      p.x > vw / 2
        ? "right:" + Math.max(vw - p.x + 18, 16) + "px;"
        : "left:" + Math.max(p.x + 18, 16) + "px;";
    // above or below the pointer, whichever has more room between the top bar and the lens pod
    const above = p.y - 18 - 76;
    const below = vh - p.y - 18 - 84;
    if (Math.max(above, below) < 300) {
      return side + "top:76px;max-height:" + (vh - 76 - 84) + "px;";
    }
    return (
      side +
      (above > below
        ? "bottom:" + (vh - p.y + 18) + "px;max-height:" + above + "px;"
        : "top:" + (p.y + 18) + "px;max-height:" + below + "px;")
    );
  }
  _renderCode() {
    const a = this._anatomy(this._target);
    const full = this.pinned;
    return html`
      <p class="eyebrow">
        <simple-icon-lite icon="icons:code"></simple-icon-lite>
        ${this.t.lensXray}
      </p>
      <h2>&lt;${a.nodeTag}&gt;</h2>
      ${this._renderOwner(a.nodeTag)} ${this._renderDocsLine(a.tag)}
      ${
        a.same
          ? nothing
          : html`<p class="muted">
              ${a.inShadow ? this.t.drawnInside : this.t.placedInside}
              <strong>&lt;${a.tag}&gt;</strong> · ${this._owner(a.tag).text}
            </p>`
      }
      ${
        a.file
          ? html`<p class="row">
              <span class="muted">${this.t.madeIn}</span>
              <span class="path">elements/${a.file}</span>
            </p>`
          : nothing
      }
      ${a.chain.length ? html`<p class="row"><span class="muted">${this.t.builtOn}</span> <span class="path">${a.chain.join(" > ")}</span></p>` : nothing}
      <pre
        tabindex="${full ? "0" : "-1"}"
        aria-label="${this.t.markup}"
      ><code>${a.markup.slice(0, full ? 1500 : 260)}${a.markup.length > (full ? 1500 : 260) ? " ..." : ""}</code></pre>
      ${
        full && a.props.length
          ? html`<details class="fold">
              <summary>
                ${this.t.propertiesNow.replace("{count}", a.props.length)}
              </summary>
              <dl>
                ${a.props.map(
                  (p) =>
                    html`<div>
                      <dt>${p[0]}</dt>
                      <dd>${p[1]}</dd>
                    </div>`,
                )}
              </dl>
            </details>`
          : nothing
      }
      ${full && a.slots.length ? html`<p class="row"><span class="muted">${this.t.slots}</span> <span class="path">${a.slots.join(", ")}</span></p>` : nothing}
      ${full ? html`<p class="row"><span class="muted">${this.t.inTheEditor}</span> ${a.hax ? (a.gizmo ? this.t.editableAs.replace("{name}", a.gizmo) : this.t.editable) : this.t.notABlock}</p>` : nothing}
    `;
  }
  /** the element's own one-line description from its docs, when it ships them */
  _renderDocsLine(tag) {
    const d = this._docsFor(tag);
    return d ? html`<p class="docs-line">${d.description}</p>` : nothing;
  }
  _renderMakers() {
    const c = this._credits(this._target.comp.localName);
    const tag = this._target.comp.localName;
    if (!c) {
      return html`<p class="eyebrow">
          <simple-icon-lite icon="social:group"></simple-icon-lite>
          ${this.t.lensMakers}
        </p>
        <h2>&lt;${tag}&gt;</h2>
        ${this._renderOwner(tag)}
        <p class="muted">${this.t.notRegistered}</p>`;
    }
    const full = this.pinned;
    const top = full ? 5 : 3;
    const coded = full && this._showAllPeople ? c.coded : c.coded.slice(0, top);
    return html`
      <p class="eyebrow">
        <simple-icon-lite icon="social:group"></simple-icon-lite>
        ${this.t.lensMakers}
      </p>
      <h2>&lt;${tag}&gt;</h2>
      ${this._renderOwner(tag)}
      <p class="row"><span class="path">elements/${c.file}</span></p>
      <ul class="people">
        ${coded.map((p) => this._person(p, !full))}
      </ul>
      ${!full && c.coded.length > top ? html`<p class="muted">${this.t.andMore.replace("{count}", c.coded.length - top)}</p>` : nothing}
      ${
        full && c.coded.length > top
          ? html`<div class="actions tight">
              <button
                type="button"
                aria-expanded="${this._showAllPeople ? "true" : "false"}"
                @click="${() => (this._showAllPeople = !this._showAllPeople)}"
              >
                <simple-icon-lite
                  icon="${this._showAllPeople ? "icons:expand-less" : "icons:expand-more"}"
                ></simple-icon-lite
                >${
                  this._showAllPeople
                    ? this.t.showTop.replace("{count}", top)
                    : this.t.showAll.replace("{count}", c.coded.length)
                }
              </button>
            </div>`
          : nothing
      }
      ${
        c.shaped.length
          ? html`<h3>${this.t.shapedBy}</h3>
              <ul class="people">
                ${c.shaped.map((p) => this._person(p, !full))}
              </ul>`
          : nothing
      }
      ${
        full && c.around.length
          ? html`<h3>${this.t.alsoInPackage.replace("{package}", c.pkg)}</h3>
              <ul class="people small">
                ${c.around.map((p) => this._person(p, true))}
              </ul>`
          : nothing
      }
      ${c.agents ? html`<p class="muted">${this.t.agentCommits.replace("{commits}", this._commits(c.agents))}</p>` : nothing}
      ${full ? html`<div class="actions tight">${this._jump(REPO + "/commits/master/elements/" + c.file, "mdi-social:github-circle", this.t.fullHistory)}</div>` : nothing}
    `;
  }
  /** the source of the piece on GitHub, from the code lens */
  _renderSource() {
    if (this.lens !== "code") {
      return nothing;
    }
    const t = MAKERS.tags[this._target.comp.localName];
    return t
      ? this._jump(
          REPO + "/blob/master/elements/" + t.f,
          "mdi-social:github-circle",
          this.t.onGitHub,
        )
      : nothing;
  }
  _renderCard() {
    if (
      !this.looking ||
      !this._target ||
      this.lens === "flag" ||
      this.lens === "person" ||
      this.lens === "translate"
    ) {
      return nothing;
    }
    const code = this.lens === "code";
    return html`<section
      class="card"
      style="${this._cardPlace()}"
      tabindex="-1"
      aria-label="${code ? this.t.howItIsMade : this.t.whoMadeIt}"
    >
      ${
        this.pinned
          ? html`<button
              type="button"
              class="close"
              aria-label="${this.t.close}"
              title="${this.t.close}"
              @click="${() => {
                this.pinned = false;
              }}"
            >
              <simple-icon-lite icon="icons:close"></simple-icon-lite>
            </button>`
          : nothing
      }
      ${code ? this._renderCode() : this._renderMakers()} ${this._renderMoves()}
      ${
        this.pinned
          ? html`<div class="actions">
              <button
                type="button"
                @click="${() => GogglesState.set({ lens: code ? "makers" : "code" })}"
              >
                <simple-icon-lite
                  icon="${code ? "social:group" : "icons:code"}"
                ></simple-icon-lite
                >${code ? this.t.seeWhoMadeIt : this.t.seeHowItIsMade}
              </button>
              ${this._renderAlone(this._target.comp.localName)}
              ${this._renderSource()}
              ${this._jump(openIssuesUrl(this._target.comp.localName), "icons:list", this.t.openIssues)}
              <button
                type="button"
                @click="${() => this._openIssue(this._target.comp)}"
              >
                <simple-icon-lite icon="icons:flag"></simple-icon-lite
                >${this.t.flagIt}
              </button>
              <button
                type="button"
                @click="${() => {
                  this.pinned = false;
                }}"
              >
                <simple-icon-lite icon="icons:close"></simple-icon-lite
                >${this.t.letGo}
              </button>
            </div>`
          : html`<p class="hint">${this.t.clickToHold}</p>`
      }
    </section>`;
  }
  _renderShot(i, scale) {
    const xray = html`<svg
      viewBox="0 0 ${Math.max(i.w, 1)} ${Math.max(i.h, 1)}"
      width="${Math.round(i.w * scale)}"
      height="${Math.round(i.h * scale)}"
      role="img"
      aria-label="${this.t.xraySnapshotOf.replace("{tag}", i.tag)}"
    >
      <rect x="0" y="0" width="${i.w}" height="${i.h}" class="plate"></rect>
      ${i.boxes.map((b) => svg`<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" class="${b.c ? "bone strong" : "bone"}" vector-effect="non-scaling-stroke"></rect>`)}
    </svg>`;
    if (i.shot.state === "developing") {
      return html`<figure class="shot developing">
        ${xray}
        <figcaption>
          <span class="spinner" aria-hidden="true"></span
          >${this.t.developingShot}
        </figcaption>
      </figure>`;
    }
    if (i.shot.state === "failed") {
      return html`<figure class="shot">
        ${xray}
        <figcaption>
          ${this.t.shotFailedCaption.replace("{w}", i.w).replace("{h}", i.h)}
        </figcaption>
      </figure>`;
    }
    const pick = i.shot[i.attach];
    return html`${this._renderChoices("attach", this.t.shotToAttach, [
        {
          value: "whole",
          icon: "hardware:desktop-windows",
          label: this.t.wholeScreen,
        },
        { value: "piece", icon: "image:crop", label: this.t.justThisPiece },
      ])}
      <figure class="shot">
        <img
          src="${pick.url}"
          width="${pick.w}"
          height="${pick.h}"
          alt="${i.attach === "whole" ? this.t.shotAltWhole.replace("{tag}", i.tag) : this.t.shotAltPiece.replace("{tag}", i.tag)}"
        />
        <figcaption>
          ${this.t.shotCaption.replace("{w}", pick.w).replace("{h}", pick.h).replace("{kb}", pick.kb)}
        </figcaption>
      </figure>`;
  }
  _renderIssue() {
    if (this._tx) {
      return this._renderTranslate();
    }
    const i = this._issue;
    if (!i) {
      return nothing;
    }
    const scale = Math.min(300 / Math.max(i.w, 1), 150 / Math.max(i.h, 1));
    return html`<section
      class="issue"
      role="dialog"
      aria-labelledby="issue-heading"
    >
      <p class="eyebrow">
        <simple-icon-lite icon="icons:flag"></simple-icon-lite>
        ${this.t.lensFlag}
      </p>
      <h2 id="issue-heading">&lt;${i.tag}&gt;</h2>
      ${this._renderChoices("kind", this.t.whatIsThis, [
        { value: "bug", icon: "icons:bug-report", label: this.t.needsFixing },
        {
          value: "wish",
          icon: "icons:lightbulb-outline",
          label: this.t.featureIWant,
        },
        { value: "docs", icon: "icons:help-outline", label: this.t.confusedMe },
        {
          value: "a11y",
          icon: "icons:accessibility",
          label: this.t.cantUseIt,
        },
      ])}
      <p class="hint">
        ${this.t.alreadyReported}
        <a href="${openIssuesUrl(i.tag)}" target="_blank" rel="noopener"
          >${this.t.seeOpenIssues.replace("{tag}", i.tag)}</a
        >
      </p>
      <simple-fields-field
        id="issue-title"
        class="hax-ui-simple-field"
        type="text"
        label="${this.t.issueTitle}"
        autocomplete="off"
        .value="${i.title}"
        @value-changed="${(e) => this._issueField("title", e.detail.value || "")}"
      ></simple-fields-field>
      <simple-fields-field
        id="issue-notes"
        class="hax-ui-simple-field notes"
        type="textarea"
        label="${this._notesLabel(i.kind)}"
        .value="${i.notes}"
        @value-changed="${(e) => this._issueField("notes", e.detail.value || "")}"
      ></simple-fields-field>
      ${this._renderKindExtras(i)} ${this._renderShot(i, scale)}
      ${this._renderReplay(i)}
      <div class="evidence">
        <dl>
          <div>
            <dt>${this.t.page}</dt>
            <dd>${i.page || this.t.none}</dd>
          </div>
          <div>
            <dt>${this.t.theme}</dt>
            <dd>${i.theme}</dd>
          </div>
          <div>
            <dt>${this.t.viewport}</dt>
            <dd>${i.viewport}, ${i.scheme}</dd>
          </div>
          <div>
            <dt>${this.t.pathLabel}</dt>
            <dd>${pathText(i.path)}</dd>
          </div>
          <div>
            <dt>${this.t.source}</dt>
            <dd>${i.file ? "elements/" + i.file : this.t.unknown}</dd>
          </div>
          <div>
            <dt>${this.t.lensMakers}</dt>
            <dd>
              ${i.makers.length ? i.makers.slice(0, 4).join(", ") : this.t.unknown}
            </dd>
          </div>
        </dl>
      </div>
      <div class="actions">
        <a
          class="primary"
          href="${this._issueLink().url}"
          target="_blank"
          rel="noopener"
          @click="${this._copyShot}"
          ><simple-icon-lite icon="icons:open-in-new"></simple-icon-lite
          >${i.shot.state === "ready" ? this.t.copyShotOpenIssue : this.t.openIssue}</a
        >
        ${i.shot.state === "ready" ? html`<button type="button" @click="${this._copyShot}"><simple-icon-lite icon="image:photo-library"></simple-icon-lite>${i.shotCopied ? this.t.shotCopied : this.t.copyShot}</button>` : nothing}
        <button type="button" @click="${this._copyIssue}">
          <simple-icon-lite icon="icons:content-copy"></simple-icon-lite
          >${this._copied ? this.t.copied : this.t.copyIssueText}
        </button>
        <button type="button" @click="${this._closeIssue}">
          <simple-icon-lite icon="icons:close"></simple-icon-lite
          >${this.t.cancel}
        </button>
      </div>
      <p class="hint">${this.t.githubAccount}</p>
    </section>`;
  }
  /* ---------- the Translate lens ---------- */
  /*
   * While the Translate lens is on, the page speaks the translator's
   * language and keeps speaking it (the site's own language setting is put
   * back when the lens or the goggles come off).
   */
  _holdLang(on) {
    const root = globalThis.document.documentElement;
    if (on) {
      if (this._langBefore === null) {
        this._langBefore = root.getAttribute("lang") || "";
      }
      const saved = cleanLang(localStorageGet(TRANSLATE_LANG_KEY, ""));
      if (saved && saved !== this._txLang) {
        this._txLang = saved;
      }
      if (this._txLang && root.getAttribute("lang") !== this._txLang) {
        root.setAttribute("lang", this._txLang);
      }
      if (!this._langWatch && globalThis.MutationObserver) {
        this._langWatch = new globalThis.MutationObserver(() => {
          if (this._txLang && root.getAttribute("lang") !== this._txLang) {
            root.setAttribute("lang", this._txLang);
          }
        });
        this._langWatch.observe(root, {
          attributes: true,
          attributeFilter: ["lang"],
        });
      }
    } else {
      if (this._langWatch) {
        this._langWatch.disconnect();
        this._langWatch = null;
      }
      if (this._langBefore !== null) {
        if (this._langBefore) {
          root.setAttribute("lang", this._langBefore);
        } else {
          root.removeAttribute("lang");
        }
        this._langBefore = null;
      }
    }
  }
  /** a translator still in English is asked which language they speak first */
  _txBegin() {
    if (!this._tx && (!this._txLang || isEnglish(this._txLang))) {
      this._txLanguage();
    }
  }
  _txPick(e) {
    let x = e.clientX;
    let y = e.clientY;
    if (typeof x !== "number" || e.type === "focusin") {
      const t = e.composedPath ? e.composedPath()[0] : e.target;
      if (!t || !t.getBoundingClientRect) {
        return null;
      }
      const r = t.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    const hits = (this._txMarks || []).filter(
      (m) => x >= m.x && x <= m.x + m.w && y >= m.y && y <= m.y + m.h,
    );
    if (!hits.length) {
      return null;
    }
    hits.sort((a, b) => a.w * a.h - b.w * b.h);
    return { node: hits[0].el, comp: hits[0].ctx, tx: hits[0] };
  }
  /** the translator's list lives in their browser until they send it */
  _txItems() {
    const l = localStorageGet(TRANSLATE_LIST_KEY, []);
    return Array.isArray(l) ? l : [];
  }
  _txSave(list) {
    localStorageSet(TRANSLATE_LIST_KEY, list);
    this.requestUpdate();
  }
  _txFocus(sel) {
    this.updateComplete.then(() => {
      const f = this.shadowRoot.querySelector(sel);
      if (f) {
        f.focus();
      }
    });
  }
  _txLanguage() {
    this._tx = {
      mode: "lang",
      pick: this._txLang && !isEnglish(this._txLang) ? this._txLang : "",
    };
    this._txFocus("haxcms-language-picker");
  }
  _txSetLang(l) {
    const lang = cleanLang(l);
    if (!lang) {
      return;
    }
    localStorageSet(TRANSLATE_LANG_KEY, lang);
    this._txLang = lang;
    this._holdLang(true);
    this._tx = null;
    this._status = this.t.lensTranslateSay;
    setTimeout(() => this._reflow(), 900);
  }
  /** a link to this page in a language with the lens on, for someone who speaks it */
  _txShare(l) {
    const lang = cleanLang(l);
    // inside the component gallery the link is the gallery's own, which
    // opens this demo with the lens on (?goggles=translate&lang=)
    let href = globalThis.location.href;
    try {
      const top = globalThis.parent;
      if (
        top &&
        top !== globalThis &&
        top.location.origin === globalThis.location.origin &&
        top.document.getElementById("translateBtn")
      ) {
        href = top.location.href;
      }
    } catch {
      // another site frames this one: share this page itself
    }
    const link = translateLink(lang, href);
    const done = () => {
      this._tx = Object.assign({}, this._tx, { shared: true });
      this._status = this.t.txLinkCopied.replace("{lang}", langName(lang));
    };
    try {
      globalThis.navigator.clipboard.writeText(link).then(done, () => {
        this._status = this.t.copyBlockedSay;
      });
    } catch {
      this._status = this.t.copyBlockedSay;
    }
  }
  _txOpen(ctx, detail, key) {
    const lang = this._txLang;
    const all = stringsOf(ctx);
    const s = all.find((x) => x.key === key);
    if (!s) {
      return;
    }
    const before = this._txItems().find(
      (x) =>
        x.namespace === detail.namespace && x.key === key && x.lang === lang,
    );
    const missing = stillEnglish(s, lang);
    this._tx = {
      mode: "string",
      ctx: ctx,
      detail: detail,
      key: key,
      en: s.en,
      now: s.now,
      missing: missing,
      why: before ? before.why : missing ? "missing" : "",
      words: before ? before.suggested : missing ? "" : s.now,
      note: before ? before.note : "",
      editing: !!before,
      others: all.filter((x) => x.key !== key),
    };
    this._txFocus("#tx-words");
  }
  _txField(name, value) {
    this._tx = Object.assign({}, this._tx, { [name]: value });
  }
  _txAdd() {
    const t = this._tx;
    const words = (t.words || "").trim();
    if (
      !words ||
      (words === t.now && !t.missing) ||
      lostTokens(t.en, words).length
    ) {
      return;
    }
    const lang = this._txLang;
    const active = store.activeItem || {};
    const item = {
      lang: lang,
      namespace: t.detail.namespace,
      file: localeFileOf(t.detail, lang),
      key: t.key,
      en: t.en,
      now: t.missing ? "" : t.now,
      suggested: words,
      why: t.why || "unnatural",
      note: (t.note || "").trim(),
      part: partName(t.ctx),
      page: active.slug ? "/" + active.slug : "",
    };
    const list = this._txItems().filter(
      (x) =>
        !(
          x.namespace === item.namespace &&
          x.key === item.key &&
          x.lang === lang
        ),
    );
    list.push(item);
    this._txSave(list);
    this._tx = null;
    this._status = this.t.txAdded.replace("{count}", list.length);
  }
  _txRemove(i) {
    const list = this._txItems();
    list.splice(i, 1);
    this._txSave(list);
  }
  _txShowList() {
    this._tx = { mode: "list", note: "" };
    this._txFocus(".tx h2");
  }
  _txIssue() {
    const manifest = store.manifest;
    const theme =
      manifest && manifest.metadata && manifest.metadata.theme
        ? manifest.metadata.theme.element
        : "";
    // only this language's suggestions go in one report
    return translateIssue({
      list: this._txItems().filter((x) => x.lang === this._txLang),
      lang: this._txLang,
      note: this._tx && this._tx.note,
      theme: theme,
      base: MAKERS.sha
        ? "haxtheweb/webcomponents@" + MAKERS.sha
        : "haxtheweb/webcomponents",
    });
  }
  /** the goggles translation issue form, which applies the labels for every reporter */
  _txLink() {
    return translateUrl(this._txIssue(), this._txLang);
  }
  _txCopy() {
    const i = this._txIssue();
    try {
      globalThis.navigator.clipboard.writeText(i.title + "\n\n" + i.body).then(
        () => {
          this._txField("copied", true);
          this._status = this.t.txCopied;
        },
        () => {
          this._status = this.t.copyBlockedSay;
        },
      );
    } catch {
      this._status = this.t.copyBlockedSay;
    }
  }
  _renderWords() {
    if (!this.looking) {
      return nothing;
    }
    return this._txMarks.map((m) => {
      const hot = this._txHover === m.ctx.localName + "/" + m.key;
      return html`<div
        class="box mark tx ${m.missing ? "missing" : ""} ${hot ? "hot" : ""}"
        aria-hidden="true"
        style="left:${m.x}px;top:${m.y}px;width:${m.w}px;height:${m.h}px"
      >
        ${m.missing ? html`<b class="badge">EN</b>` : nothing}
        ${hot ? html`<span>EN: ${m.en}</span>` : nothing}
      </div>`;
    });
  }
  _renderTranslate() {
    const t = this._tx;
    const lang = this._txLang;
    const name = langName(lang);
    const eyebrow = html`<p class="eyebrow">
      <simple-icon-lite icon="icons:translate"></simple-icon-lite
      >${this.t.lensTranslate}
    </p>`;
    if (t.mode === "lang") {
      return html`<section
        class="issue tx"
        role="dialog"
        aria-labelledby="tx-heading"
      >
        ${eyebrow}
        <h2 id="tx-heading">${this.t.txPickLang}</h2>
        <p class="hint">${this.t.txPickLangHint}</p>
        <haxcms-language-picker
          label="${this.t.txLanguage}"
          include-regions="featured"
          .value="${t.pick || ""}"
          @value-changed="${(e) => this._txField("pick", e.detail.value)}"
        ></haxcms-language-picker>
        <div class="actions">
          <button
            type="button"
            class="primary"
            ?disabled="${!cleanLang(t.pick) || isEnglish(t.pick)}"
            @click="${() => this._txSetLang(t.pick)}"
          >
            <simple-icon-lite icon="icons:check"></simple-icon-lite
            >${this.t.txStart}
          </button>
          ${
            cleanLang(t.pick) && !isEnglish(t.pick)
              ? html`<button
                  type="button"
                  @click="${() => this._txShare(t.pick)}"
                >
                  <simple-icon-lite icon="icons:link"></simple-icon-lite
                  >${this.t.txShareLink.replace("{lang}", langName(t.pick))}
                </button>`
              : nothing
          }
          <button type="button" @click="${() => (this._tx = null)}">
            <simple-icon-lite icon="icons:close"></simple-icon-lite
            >${this.t.cancel}
          </button>
        </div>
        ${
          t.shared
            ? html`<p class="hint">
                ${this.t.txLinkCopied.replace("{lang}", langName(t.pick))}
              </p>`
            : nothing
        }
      </section>`;
    }
    if (t.mode === "list") {
      const all = this._txItems();
      const list = all.filter((x) => x.lang === lang);
      const issue = this._txIssue();
      return html`<section
        class="issue tx"
        role="dialog"
        aria-labelledby="tx-heading"
      >
        ${eyebrow}
        <h2 id="tx-heading" tabindex="-1">${this.t.txListTitle}</h2>
        <p class="langrow">
          <span>${this.t.txLanguage}: <b lang="${lang}">${name}</b></span>
          <button type="button" class="small" @click="${this._txLanguage}">
            ${this.t.txChange}
          </button>
        </p>
        ${
          list.length
            ? html`<ol class="txlist">
                ${list.map(
                  (x) =>
                    html`<li>
                      <div class="pair">
                        <span class="en" lang="en">${x.en}</span>
                        <span class="sugg" lang="${x.lang}"
                          >${x.suggested}</span
                        >
                        <span class="part"
                          >${this.t.txInPart.replace("{name}", x.part)}</span
                        >
                      </div>
                      <button
                        type="button"
                        class="small"
                        aria-label="${this.t.txRemove.replace("{words}", x.suggested)}"
                        @click="${() => this._txRemove(all.indexOf(x))}"
                      >
                        <simple-icon-lite
                          icon="icons:delete"
                        ></simple-icon-lite>
                      </button>
                    </li>`,
                )}
              </ol>`
            : html`<p class="hint">${this.t.txEmpty}</p>`
        }
        <simple-fields-field
          id="tx-other"
          class="hax-ui-simple-field notes"
          type="textarea"
          label="${this.t.txOtherNote}"
          .value="${t.note || ""}"
          @value-changed="${(e) => this._txField("note", e.detail.value || "")}"
        ></simple-fields-field>
        <div class="actions">
          ${
            list.length
              ? html`<a
                  class="primary"
                  href="${this._txLink()}"
                  target="_blank"
                  rel="noopener"
                  ><simple-icon-lite icon="icons:open-in-new"></simple-icon-lite
                  >${this.t.txSend}</a
                >`
              : nothing
          }
          <button
            type="button"
            ?disabled="${!list.length}"
            @click="${this._txCopy}"
          >
            <simple-icon-lite icon="icons:content-copy"></simple-icon-lite
            >${this.t.txCopyAll}
          </button>
          <button type="button" @click="${() => (this._tx = null)}">
            <simple-icon-lite icon="icons:close"></simple-icon-lite
            >${this.t.cancel}
          </button>
        </div>
        <p class="hint">${t.copied ? this.t.txCopied : this.t.txSendHint}</p>
        ${
          list.length
            ? html`<details class="fold">
                <summary>${this.t.txWhatWeSend}</summary>
                <pre>
${issue.title}

${issue.body}</pre>
              </details>`
            : nothing
        }
      </section>`;
    }
    // one string
    const need = tokensOf(t.en);
    const lost = lostTokens(t.en, t.words);
    const same = (t.words || "").trim() === t.now && !t.missing;
    const why = [
      {
        value: "meaning",
        icon: "icons:error-outline",
        label: this.t.txWrongMeaning,
      },
      {
        value: "unnatural",
        icon: "icons:record-voice-over",
        label: this.t.txUnnatural,
      },
      { value: "missing", icon: "icons:translate", label: this.t.txMissing },
      { value: "length", icon: "editor:format-size", label: this.t.txTooLong },
    ];
    return html`<section
      class="issue tx"
      role="dialog"
      aria-labelledby="tx-heading"
    >
      ${eyebrow}
      <h2 id="tx-heading" lang="en">${t.en}</h2>
      <p class="part">${this.t.txInPart.replace("{name}", partName(t.ctx))}</p>
      <dl class="compare">
        <div>
          <dt>${this.t.txInEnglish}</dt>
          <dd lang="en">${t.en}</dd>
        </div>
        <div>
          <dt>${this.t.txNowIn.replace("{lang}", name)}</dt>
          <dd lang="${lang}" class="${t.missing ? "missing" : ""}">
            ${t.missing ? this.t.txNotYet : t.now}
          </dd>
        </div>
      </dl>
      <div class="choices">
        <p class="legend" id="tx-why">${this.t.txWhatsWrong}</p>
        <div class="sort" role="group" aria-labelledby="tx-why">
          ${why.map(
            (o) =>
              html`<button
                type="button"
                aria-pressed="${t.why === o.value ? "true" : "false"}"
                @click="${() => this._txField("why", o.value)}"
              >
                <simple-icon-lite icon="${o.icon}"></simple-icon-lite>${o.label}
              </button>`,
          )}
        </div>
      </div>
      <simple-fields-field
        id="tx-words"
        class="hax-ui-simple-field notes"
        type="textarea"
        lang="${lang}"
        label="${this.t.txYourWords.replace("{lang}", name)}"
        .value="${t.words || ""}"
        @value-changed="${(e) => this._txField("words", e.detail.value || "")}"
      ></simple-fields-field>
      ${
        need.length
          ? html`<p class="hint tokens">
              <simple-icon-lite
                icon="${lost.length ? "icons:warning" : "icons:info-outline"}"
              ></simple-icon-lite>
              <span
                >${this.t.txKeep.replace("{tokens}", need.join(" "))}
                ${
                  lost.length
                    ? html`<b
                        >${this.t.txKeepMissing.replace("{tokens}", lost.join(" "))}</b
                      >`
                    : nothing
                }</span
              >
            </p>`
          : nothing
      }
      ${same ? html`<p class="hint">${this.t.txSameAsNow}</p>` : nothing}
      <simple-fields-field
        id="tx-note"
        class="hax-ui-simple-field notes"
        type="textarea"
        label="${this.t.txNote}"
        .value="${t.note || ""}"
        @value-changed="${(e) => this._txField("note", e.detail.value || "")}"
      ></simple-fields-field>
      <div class="actions">
        <button
          type="button"
          class="primary"
          ?disabled="${!(t.words || "").trim() || same || lost.length > 0}"
          @click="${this._txAdd}"
        >
          <simple-icon-lite icon="icons:add"></simple-icon-lite
          >${t.editing ? this.t.txUpdate : this.t.txAdd}
        </button>
        <button type="button" @click="${() => (this._tx = null)}">
          <simple-icon-lite icon="icons:close"></simple-icon-lite
          >${this.t.cancel}
        </button>
      </div>
      ${
        t.others.length
          ? html`<details class="fold">
              <summary>
                ${this.t.txMoreWords.replace("{count}", t.others.length)}
              </summary>
              <ul class="others">
                ${t.others.map(
                  (o) =>
                    html`<li>
                      <button
                        type="button"
                        class="other ${stillEnglish(o, lang) ? "missing" : ""}"
                        @click="${() => this._txOpen(t.ctx, t.detail, o.key)}"
                      >
                        <span class="en" lang="en">${o.en}</span>
                        <span class="sugg" lang="${lang}"
                          >${stillEnglish(o, lang) ? this.t.txNotYet : o.now}</span
                        >
                      </button>
                    </li>`,
                )}
              </ul>
            </details>`
          : nothing
      }
    </section>`;
  }
  _notesLabel(kind) {
    return kind === "wish"
      ? this.t.whatDoYouWish
      : kind === "docs"
        ? this.t.whatConfused
        : kind === "a11y"
          ? this.t.whatBarrier
          : this.t.whatDidYouSee;
  }
  /** what each kind of report adds: the docs, the language and text, or the failed checks */
  _renderKindExtras(i) {
    if (i.kind === "docs") {
      const d = this._docsFor(i.tag);
      const readme = this._readmeUrl(i.tag);
      return html`<div class="kind-extra">
        <p class="legend">${this.t.docsFor.replace("{tag}", i.tag)}</p>
        ${d ? html`<p>${d.description}</p>` : nothing}
        ${readme ? this._jump(readme, "icons:description", this.t.readTheDocs) : nothing}
      </div>`;
    }
    if (i.kind === "a11y") {
      return i.findings.length
        ? this._renderChoices(
            "check",
            this.t.checksFound,
            i.findings.map((f) => ({
              value: this._checkText(f),
              icon:
                f.check === "contrast"
                  ? "image:tonality"
                  : f.check === "image-alt"
                    ? "image:image"
                    : "icons:label-outline",
              label: this._checkText(f),
            })),
          )
        : html`<p class="hint">${this.t.noChecksFound}</p>`;
    }
    return nothing;
  }
  /** the replay: pick its scope, see exactly what is sent, download it when too big for the link */
  _renderReplay(i) {
    const options = [
      { value: "block", icon: "image:crop", label: this.t.replayBlock },
    ];
    if (i.pageHost) {
      options.push({
        value: "page",
        icon: "icons:description",
        label: this.t.replayPage,
      });
    }
    options.push({
      value: "none",
      icon: "icons:block",
      label: this.t.replayNone,
    });
    const r = i.replay;
    const left = r ? this._issueLink().left : [];
    return html`<div class="replay">
      ${this._renderChoices("scope", this.t.replayLabel, options)}
      <p class="hint">${this.t.replayHelp}</p>
      ${
        r && r.bundle.swapped.length
          ? html`<p class="hint">
              ${this.t.swappedCount.replace("{count}", r.bundle.swapped.length)}
            </p>`
          : nothing
      }
      ${
        left.indexOf("replay") !== -1
          ? html`<p class="hint">${this.t.replayTooBig}</p>
              <div class="actions tight">
                <button type="button" @click="${this._downloadReplay}">
                  <simple-icon-lite
                    icon="icons:file-download"
                  ></simple-icon-lite
                  >${this.t.downloadReplay}
                </button>
              </div>`
          : nothing
      }
      <details class="fold">
        <summary>${this.t.previewSent}</summary>
        <pre tabindex="0"><code>${this._issueText().title}

${this._issueText().body}${r ? "\n\n" + JSON.stringify(r.bundle, null, 2) : ""}</code></pre>
      </details>
    </div>`;
  }
  _renderPins() {
    if (!this.looking || this.lens !== "makers" || this.pinned) {
      return nothing;
    }
    return this._pins.map((pin) => {
      const c = this._credits(pin.tag);
      if (!c) {
        return nothing;
      }
      const all = c.coded.concat(c.shaped);
      const faces = all.slice(0, 3);
      const names = all.map((p) => p.name).join(", ");
      return html`<button
        type="button"
        class="pin"
        style="left:${pin.x}px;top:${pin.y}px"
        aria-label="${this.t.pinLabel.replace("{tag}", pin.tag).replace("{names}", names)}"
        @click="${() => this._choose({ node: pin.el, comp: pin.el }, { x: pin.x + 40, y: pin.y + 40 })}"
      >
        <span class="faces"
          >${faces.map((p) => html`<rpg-character seed="${p.login}" width="32" height="40" aria-hidden="true"></rpg-character>`)}</span
        >
        ${all.length > 3 ? html`<span class="more">+${all.length - 3}</span>` : nothing}
        <span class="pin-tag">${pin.tag}</span>
      </button>`;
    });
  }
  _renderPod() {
    return html`<div
        class="pod"
        role="toolbar"
        aria-label="${this.t.gogglesLenses}"
      >
        <simple-icon-lite
          class="pod-mark"
          icon="hax:goggles"
          aria-hidden="true"
        ></simple-icon-lite>
        ${LENSES.map(
          (l) =>
            html`<button
              type="button"
              class="lens"
              aria-pressed="${this.lensOn && this.lens === l.id ? "true" : "false"}"
              @click="${() => GogglesState.set({ lens: l.id, lensOn: true })}"
            >
              <simple-icon-lite icon="${l.icon}"></simple-icon-lite
              ><span>${this.t[l.label]}</span>
            </button>`,
        )}
        ${
          this.person && this.lens === "person"
            ? html`<button
                type="button"
                class="lens who"
                aria-pressed="true"
                aria-label="${this.t.followingStop.replace("{name}", this._name(this.person))}"
                @click="${() => GogglesState.set({ lens: "makers" })}"
              >
                <rpg-character
                  seed="${this.person}"
                  width="20"
                  height="25"
                  aria-hidden="true"
                ></rpg-character
                ><span>${this._name(this.person).split(" ")[0]}</span>
              </button>`
            : nothing
        }
        ${
          this.lens === "translate" && this._txItems().length
            ? html`<button
                type="button"
                class="lens list"
                aria-label="${this.t.txMyList} (${this._txItems().length})"
                @click="${this._txShowList}"
              >
                <span class="count" aria-hidden="true"
                  >${this._txItems().length}</span
                ><span>${this.t.txMyList}</span>
              </button>`
            : nothing
        }
        <span class="pod-split" aria-hidden="true"></span>
        <button
          type="button"
          class="lens"
          @click="${() => GogglesState.set({ lensOn: !this.lensOn })}"
        >
          ${lensIcon(!this.lensOn)}<span
            >${this.lensOn ? this.t.lensesOff : this.t.lensesOn}</span
          >
        </button>
        <button
          type="button"
          class="lens"
          @click="${() => GogglesState.set({ on: false })}"
        >
          <simple-icon-lite icon="icons:close"></simple-icon-lite
          ><span>${this.t.takeOff}</span>
        </button>
      </div>
      ${this._say && !this.pinned && !this._issue && !this._tx && !(this.lens === "person" && globalThis.innerWidth < 720) ? html`<p class="caption" aria-hidden="true">${this._say}</p>` : nothing}`;
  }
  render() {
    const b = this._box;
    return html`
      <div class="sr" role="status" aria-live="polite">${this._status}</div>
      ${
        this.on
          ? html`
              <div class="rims" aria-hidden="true">
                <span class="glass"></span
                >${this.lensOn ? html`<span class="sweep"></span>` : nothing}
              </div>
              ${
                this.looking &&
                b &&
                this.lens !== "makers" &&
                this.lens !== "person" &&
                this.lens !== "translate"
                  ? html`<div
                      class="box"
                      aria-hidden="true"
                      style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px"
                    >
                      <span
                        >&lt;${(this.lens === "code" ? this._target.node : this._target.comp).localName}&gt;</span
                      >
                    </div>`
                  : nothing
              }
              ${
                this.looking &&
                b &&
                this.lens === "makers" &&
                (this.pinned || !this._pins.length || this._target)
                  ? html`<div
                      class="box quiet"
                      aria-hidden="true"
                      style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px"
                    ></div>`
                  : nothing
              }
              ${this._renderMarks()} ${this._renderPins()} ${this._renderCard()}
              ${this._renderPersonPanel()} ${this._renderIssue()}
              ${this.phase ? nothing : this._renderPod()}
            `
          : nothing
      }
      ${
        this.phase
          ? html`<div class="puton" aria-hidden="true">
              <div class="traveler">${futureTraveler(this._era || "now")}</div>
              <span class="flash"></span>
            </div>`
          : nothing
      }
    `;
  }
  static get styles() {
    return [
      HaxUiAdminTokens,
      ...HaxUiAdminSimpleFields,
      css`
        :host {
          /* the goggles are HAX UI dark chrome, like the top bar, whatever the page uses */
          color-scheme: dark;
          ${HaxUiDarkChromeDeclarations}
          /* the mascot's own goggle colors (hax:future-traveler): band and lit lens */
          --haxcms-goggles-band: #1d5e3c;
          --haxcms-goggles-lens: #2fd3e0;
          --haxcms-goggles-rim: var(--ddd-spacing-2, 8px);
          position: fixed;
          inset: 0;
          display: block;
          pointer-events: none;
          z-index: calc(var(--ddd-z-toast, 100000000) + 5);
          font-family: var(
            --hax-ui-admin-font-family,
            var(--ddd-font-navigation)
          );
          font-size: var(--ddd-font-size-4xs, 16px);
          line-height: var(--ddd-lh-140, 1.4);
          color: var(--hax-ui-text);
        }
        .sr {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
          background: var(--ddd-theme-default-black, #000);
          color: var(--ddd-theme-default-white, #fff);
        }
        simple-icon-lite {
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
          --simple-icon-color: currentColor;
          flex: none;
        }

        /* rims: the border of the goggles around the whole system */
        .rims {
          position: absolute;
          inset: 0;
          overflow: hidden;
          animation: rims-in 420ms var(--hax-ui-easing, ease-out) both;
        }
        .rims::before {
          content: "";
          position: absolute;
          inset: var(--haxcms-goggles-rim);
          border-radius: var(--ddd-radius-xl, 28px);
          border: var(--ddd-border-size-sm, 2px) solid
            var(--haxcms-goggles-lens);
          box-shadow:
            0 0 0 var(--ddd-spacing-12, 48px) var(--haxcms-goggles-band),
            inset 0 0 var(--ddd-spacing-6, 24px)
              color-mix(in srgb, var(--haxcms-goggles-lens) 35%, transparent);
          transition:
            border-color 300ms,
            box-shadow 300ms;
        }
        :host(:not([lens-on])) .rims::before {
          border-color: color-mix(
            in srgb,
            var(--haxcms-goggles-band) 60%,
            var(--ddd-theme-default-white, #fff)
          );
          box-shadow: 0 0 0 var(--ddd-spacing-12, 48px)
            var(--haxcms-goggles-band);
        }
        .glass {
          position: absolute;
          inset: var(--haxcms-goggles-rim);
          border-radius: var(--ddd-radius-xl, 28px);
          background: color-mix(
            in srgb,
            var(--haxcms-goggles-lens) 7%,
            transparent
          );
          transform-origin: 50% 0;
          transition:
            transform 450ms var(--hax-ui-easing, ease-in-out),
            opacity 450ms;
        }
        /* lenses off: the glass flips up off the eyes, like goggles pushed onto the forehead */
        :host(:not([lens-on])) .glass {
          transform: perspective(800px) rotateX(-80deg) translateY(-40%);
          opacity: 0;
        }
        .sweep {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: var(--ddd-spacing-16, 64px);
          background: linear-gradient(
            to bottom,
            transparent,
            color-mix(in srgb, var(--haxcms-goggles-lens) 30%, transparent),
            transparent
          );
          animation: sweep 900ms 150ms ease-in both;
        }
        @keyframes rims-in {
          from {
            transform: scale(1.12);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes sweep {
          from {
            transform: translateY(-64px);
            opacity: 1;
          }
          to {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        /* what the lens is pointed at */
        .box {
          position: absolute;
          box-sizing: border-box;
          border: var(--ddd-border-size-sm, 2px) solid
            var(--haxcms-goggles-lens);
          border-radius: var(--hax-ui-radius, 4px);
          box-shadow:
            0 0 0 1px var(--ddd-theme-default-coalyGray, #262626),
            inset 0 0 0 1px var(--ddd-theme-default-coalyGray, #262626);
          background: color-mix(
            in srgb,
            var(--haxcms-goggles-lens) 12%,
            transparent
          );
        }
        .box.mark {
          background: transparent;
          border-width: var(--ddd-border-size-md, 3px);
          box-shadow:
            0 0 0 1px var(--ddd-theme-default-coalyGray, #262626),
            0 0 var(--ddd-spacing-4, 16px)
              color-mix(in srgb, var(--haxcms-goggles-lens) 45%, transparent);
        }
        .box.mark span {
          top: 0;
          border-radius: 0 0 var(--hax-ui-radius, 4px) 0;
        }
        .box.mark.frame {
          border-width: 1px;
          border-style: dashed;
          box-shadow: none;
        }
        .box.mark.flash {
          background: color-mix(
            in srgb,
            var(--haxcms-goggles-lens) 25%,
            transparent
          );
        }
        .panel {
          position: absolute;
          top: 76px;
          right: var(--ddd-spacing-4, 16px);
          bottom: 92px;
          width: min(380px, calc(100vw - 32px));
          box-sizing: border-box;
          overflow-y: auto;
          overscroll-behavior: contain;
          pointer-events: auto;
          padding: var(--ddd-spacing-4, 16px);
          background: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          border: 1px solid var(--hax-ui-line-strong);
          border-top: var(--ddd-border-size-md, 3px) solid
            var(--haxcms-goggles-lens);
          border-radius: var(--hax-ui-radius-lg, 8px);
          box-shadow: var(
            --hax-ui-shadow-popover,
            0 8px 24px rgba(0, 0, 0, 0.4)
          );
        }
        .who-head {
          display: flex;
          gap: var(--ddd-spacing-3, 12px);
          align-items: center;
          margin-top: var(--ddd-spacing-2, 8px);
        }
        .who-head rpg-character {
          flex: none;
          background: var(--ddd-theme-default-white, #fff);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
        }
        h2.name {
          font-family: inherit;
        }
        .role {
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        .stats {
          margin-top: var(--ddd-spacing-3, 12px);
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        .years {
          list-style: none;
          display: grid;
          gap: var(--ddd-spacing-1, 4px);
        }
        .years li {
          display: grid;
          grid-template-columns: 3.2em 1fr 3.5em;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        .years .bar {
          height: var(--ddd-spacing-3, 12px);
          background: var(--ddd-theme-default-black, #000);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
          overflow: hidden;
        }
        .years .bar span {
          display: block;
          height: 100%;
          background: var(--haxcms-goggles-lens);
        }
        .years .count {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        .work {
          list-style: none;
          display: grid;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-2, 8px);
        }
        .work li {
          display: grid;
          gap: 2px;
          padding-bottom: var(--ddd-spacing-2, 8px);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .code-name {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size, 14px);
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow-wrap: anywhere;
        }
        /* every link out of the goggles is the same chip: icon for where it goes, then words */
        a.jump {
          line-height: normal;
        }
        a.jump simple-icon-lite,
        button simple-icon-lite {
          flex: none;
          --simple-icon-height: var(--ddd-icon-4xs, 16px);
          --simple-icon-width: var(--ddd-icon-4xs, 16px);
        }
        .card .close {
          position: sticky;
          top: 0;
          float: right;
          z-index: 1;
          width: var(--ddd-control-height-sm, 40px);
          padding: 0;
          margin: 0 0 var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          background: var(--hax-ui-surface);
        }
        .card .close:hover {
          background: var(--hax-ui-hover);
        }
        .owner {
          margin-top: var(--ddd-spacing-1, 4px);
        }
        span.code,
        button .count {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        button .count {
          margin-left: var(--ddd-spacing-1, 4px);
          color: var(--hax-ui-text-muted);
          font-family: inherit;
        }
        /* a fold reads as a fieldset whose legend opens and closes it */
        details.fold {
          margin-top: var(--ddd-spacing-2, 8px);
          padding: 0 var(--ddd-spacing-2, 8px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
        }
        details.fold[open] {
          padding-bottom: var(--ddd-spacing-2, 8px);
        }
        details.fold summary {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          min-height: var(--ddd-control-height-sm, 40px);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
          cursor: pointer;
          list-style: none;
        }
        details.fold summary::-webkit-details-marker {
          display: none;
        }
        details.fold summary::before {
          content: "";
          flex: none;
          width: 0;
          height: 0;
          border-left: 5px solid currentColor;
          border-top: 5px solid transparent;
          border-bottom: 5px solid transparent;
          transition: transform 0.15s;
        }
        details.fold[open] summary::before {
          transform: rotate(90deg);
        }
        details.fold summary:hover {
          color: var(--hax-ui-text);
        }
        details.fold summary:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid
            var(--hax-ui-focus, #ffd100);
          outline-offset: 2px;
        }
        details.fold .actions.tight {
          margin-top: 0;
        }
        .moves h3 {
          margin-bottom: 0;
        }
        .sort {
          display: flex;
          gap: var(--ddd-spacing-2, 8px);
        }
        .sort button[aria-pressed="true"] {
          background: var(--hax-ui-text);
          color: var(--hax-ui-surface);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        button.follow {
          margin-top: var(--ddd-spacing-1, 4px);
          min-height: var(--ddd-spacing-8, 32px);
        }
        .pod .lens.who {
          gap: 2px;
        }
        .pod .lens.who rpg-character {
          background: var(--ddd-theme-default-white, #fff);
          border-radius: var(--hax-ui-radius, 4px);
        }
        .box.quiet {
          background: transparent;
          border-style: dashed;
        }
        .box span {
          position: absolute;
          left: -2px;
          top: 100%;
          max-width: 60vw;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding: 0 var(--ddd-spacing-2, 8px);
          background: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          border: 1px solid var(--haxcms-goggles-lens);
          border-radius: 0 0 var(--hax-ui-radius, 4px) var(--hax-ui-radius, 4px);
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }

        /* the readout */
        .card,
        .issue {
          position: absolute;
          box-sizing: border-box;
          width: min(400px, calc(100vw - 32px));
          max-height: min(62dvh, 560px);
          overflow: hidden;
          padding: var(--ddd-spacing-4, 16px);
          background: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          border: 1px solid var(--hax-ui-line-strong);
          border-top: var(--ddd-border-size-md, 3px) solid
            var(--haxcms-goggles-lens);
          border-radius: var(--hax-ui-radius-lg, 8px);
          box-shadow: var(
            --hax-ui-shadow-popover,
            0 8px 24px rgba(0, 0, 0, 0.4)
          );
        }
        :host([pinned]) .card,
        .issue {
          pointer-events: auto;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        .card:focus {
          outline: none;
        }
        .issue {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(560px, calc(100vw - 32px));
          max-height: calc(100dvh - 150px);
        }
        h2,
        h3,
        p,
        ul,
        dl,
        pre,
        figure,
        fieldset {
          margin: 0;
          padding: 0;
        }
        fieldset {
          border: 0;
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
        }
        legend,
        label,
        h3 {
          display: block;
          margin: var(--ddd-spacing-3, 12px) 0 var(--ddd-spacing-1, 4px);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        h2 {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--ddd-font-size-xxs, 20px);
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow-wrap: anywhere;
        }
        .eyebrow {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--haxcms-goggles-lens);
        }
        .muted,
        .hint,
        figcaption {
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        .hint {
          margin-top: var(--ddd-spacing-2, 8px);
        }
        .row {
          margin-top: var(--ddd-spacing-2, 8px);
          font-size: var(--hax-ui-admin-font-size, 14px);
          overflow-wrap: anywhere;
        }
        .path,
        dd {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        a {
          color: var(--haxcms-goggles-lens);
          display: inline-block;
          min-height: var(--ddd-spacing-6, 24px);
          line-height: var(--ddd-spacing-6, 24px);
        }
        a:focus-visible,
        button:focus-visible,
        pre:focus-visible {
          outline: var(--hax-ui-focus-width, 2px) solid
            var(--hax-ui-focus, #ffd100);
          outline-offset: 2px;
        }
        pre {
          margin-top: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-2, 8px);
          max-height: 180px;
          overflow: hidden;
          background: var(--ddd-theme-default-black, #000);
          color: var(--ddd-theme-default-white, #fff);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }
        :host([pinned]) pre {
          overflow: auto;
        }
        dl > div {
          display: flex;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-1, 4px) 0;
          border-bottom: 1px solid var(--hax-ui-line);
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        dt {
          flex: 0 0 34%;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow-wrap: anywhere;
        }
        dd {
          margin: 0;
          overflow-wrap: anywhere;
        }
        .people {
          list-style: none;
          margin-top: var(--ddd-spacing-2, 8px);
          display: grid;
          gap: var(--ddd-spacing-2, 8px);
        }
        .person {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-3, 12px);
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        .person rpg-character {
          flex: none;
          background: var(--ddd-theme-default-white, #fff);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
        }
        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-4, 16px);
        }
        .actions.tight {
          margin-top: var(--ddd-spacing-1, 4px);
        }
        button.code {
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        button,
        .actions a,
        a.jump {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: var(--ddd-spacing-1, 4px);
          box-sizing: border-box;
          min-height: var(--ddd-control-height-sm, 40px);
          padding: 0 var(--ddd-spacing-3, 12px);
          background: transparent;
          color: var(--hax-ui-text);
          border: 1px solid var(--hax-ui-text);
          border-radius: var(--hax-ui-radius-lg, 8px);
          font: inherit;
          font-size: var(--hax-ui-admin-font-size, 14px);
          text-decoration: none;
          cursor: pointer;
        }
        button:hover,
        .actions a:hover,
        a.jump:hover {
          background: var(--hax-ui-hover);
        }
        button:active,
        .actions a:active,
        a.jump:active {
          background: var(--hax-ui-pressed, var(--hax-ui-hover));
          transform: translateY(1px);
        }
        .actions a.primary {
          background: var(--hax-ui-text);
          color: var(--hax-ui-surface);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .actions a.primary:hover {
          background: var(--haxcms-goggles-lens);
          color: var(--ddd-theme-default-black, #000);
        }
        /* the issue's fields are HAX UI simple-fields (HaxUiAdminSimpleFields) */
        .issue simple-fields-field {
          margin-top: var(--ddd-spacing-3, 12px);
        }
        .issue simple-fields-field.notes {
          padding-top: var(--ddd-spacing-2, 8px);
          padding-bottom: var(--ddd-spacing-2, 8px);
        }
        .issue pre {
          overflow: auto;
        }
        .kind-extra,
        .replay {
          margin-top: var(--ddd-spacing-3, 12px);
        }
        .kind-extra p:not(.legend) {
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        .docs-line {
          margin-top: var(--ddd-spacing-2, 8px);
          font-size: var(--hax-ui-admin-font-size, 14px);
        }
        .kind-extra .legend,
        .choices .legend {
          margin: var(--ddd-spacing-3, 12px) 0 var(--ddd-spacing-1, 4px);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .choices .sort {
          flex-wrap: wrap;
        }
        .evidence {
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-4, 16px);
          margin-top: var(--ddd-spacing-4, 16px);
        }
        .evidence dl {
          flex: 1 1 200px;
          min-width: 0;
        }
        .shot {
          margin-top: var(--ddd-spacing-3, 12px);
        }
        .shot img {
          display: block;
          max-width: 100%;
          max-height: 240px;
          width: auto;
          height: auto;
          border: 1px solid var(--haxcms-goggles-lens);
          border-radius: var(--hax-ui-radius, 4px);
          background: var(--ddd-theme-default-black, #000);
        }
        .shot figcaption {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-1, 4px);
        }
        .shot.developing svg {
          animation: develop 1200ms ease-in-out infinite alternate;
        }
        .spinner {
          flex: none;
          width: var(--ddd-icon-4xs, 16px);
          height: var(--ddd-icon-4xs, 16px);
          border: 2px solid var(--hax-ui-line-strong);
          border-top-color: var(--haxcms-goggles-lens);
          border-radius: 50%;
          animation: spin 800ms var(--ddd-timing-linear, linear) infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes develop {
          from {
            opacity: 0.45;
          }
          to {
            opacity: 1;
          }
        }
        figure svg {
          display: block;
          max-width: 100%;
          border: 1px solid var(--haxcms-goggles-lens);
          border-radius: var(--hax-ui-radius, 4px);
        }
        .plate {
          fill: var(--ddd-theme-default-black, #000);
        }
        .bone {
          fill: color-mix(in srgb, var(--haxcms-goggles-lens) 8%, transparent);
          stroke: color-mix(
            in srgb,
            var(--haxcms-goggles-lens) 55%,
            transparent
          );
          stroke-width: 1;
        }
        .bone.strong {
          stroke: var(--haxcms-goggles-lens);
          stroke-width: 1.5;
        }

        /* makers pinned on the pieces in view */
        .pin {
          position: absolute;
          pointer-events: auto;
          min-height: var(--ddd-control-height-md, 48px);
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px)
            var(--ddd-spacing-1, 4px) var(--ddd-spacing-1, 4px);
          background: var(--hax-ui-surface);
          border: 1px solid var(--haxcms-goggles-lens);
          border-radius: var(--hax-ui-radius-pill, 999px);
          box-shadow: var(
            --hax-ui-shadow-popover,
            0 8px 24px rgba(0, 0, 0, 0.4)
          );
          animation: pin-in 260ms var(--hax-ui-easing, ease-out) both;
        }
        .pin:hover {
          background: var(--ddd-theme-default-black, #000);
        }
        .faces {
          display: inline-flex;
        }
        .faces rpg-character {
          margin-right: calc(-1 * var(--ddd-spacing-2, 8px));
          background: var(--ddd-theme-default-white, #fff);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-pill, 999px);
          overflow: hidden;
        }
        .more {
          margin-left: var(--ddd-spacing-3, 12px);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .pin-tag {
          margin-left: var(--ddd-spacing-3, 12px);
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        @keyframes pin-in {
          from {
            transform: scale(0.6);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* the bridge of the goggles: where the lenses are picked */
        .pod {
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          max-width: calc(100vw - 16px);
          box-sizing: border-box;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px)
            var(--ddd-spacing-3, 12px);
          pointer-events: auto;
          background: var(--haxcms-goggles-band);
          border: var(--ddd-border-size-sm, 2px) solid
            var(--haxcms-goggles-lens);
          border-bottom: 0;
          border-radius: var(--ddd-radius-lg, 20px) var(--ddd-radius-lg, 20px) 0
            0;
          animation: pod-in 380ms 200ms var(--hax-ui-easing, ease-out) both;
        }
        :host(:not([lens-on])) .pod {
          border-color: color-mix(
            in srgb,
            var(--haxcms-goggles-band) 60%,
            var(--ddd-theme-default-white, #fff)
          );
        }
        .pod-mark {
          --simple-icon-width: var(--ddd-icon-xs, 32px);
          --simple-icon-height: var(--ddd-icon-xs, 32px);
          --simple-icon-color: var(--haxcms-goggles-lens);
          margin-right: var(--ddd-spacing-1, 4px);
        }
        :host(:not([lens-on])) .pod-mark {
          --simple-icon-color: var(--ddd-theme-default-limestoneGray, #a2aaad);
        }
        .lens-icon .lit {
          fill: var(--haxcms-goggles-lens);
        }
        .lens-icon {
          width: var(--ddd-icon-4xs, 16px);
          height: var(--ddd-icon-4xs, 16px);
          display: block;
        }
        .lens-icon .dim {
          fill: none;
        }
        .caption {
          position: absolute;
          left: 50%;
          bottom: 84px;
          transform: translateX(-50%);
          width: max-content;
          max-width: calc(100vw - 48px);
          box-sizing: border-box;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-4, 16px);
          background: var(--hax-ui-surface);
          color: var(--hax-ui-text);
          border: 1px solid var(--haxcms-goggles-lens);
          border-radius: var(--hax-ui-radius-lg, 8px);
          font-size: var(--hax-ui-admin-font-size, 14px);
          text-align: center;
        }
        .pod-split {
          width: 1px;
          align-self: stretch;
          margin: var(--ddd-spacing-1, 4px);
          background: color-mix(
            in srgb,
            var(--ddd-theme-default-white, #fff) 45%,
            transparent
          );
        }
        .pod .lens {
          min-width: var(--ddd-control-height-md, 48px);
          min-height: var(--ddd-control-height-md, 48px);
          flex-direction: column;
          gap: 0;
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
          background: var(--ddd-theme-default-coalyGray, #262626);
          color: var(--ddd-theme-default-white, #fff);
          border: 1px solid var(--ddd-theme-default-white, #fff);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          white-space: nowrap;
        }
        .pod .lens:hover {
          background: var(--ddd-theme-default-black, #000);
        }
        .pod .lens[aria-pressed="true"] {
          background: var(--ddd-theme-default-white, #fff);
          color: var(--ddd-theme-default-black, #000);
          border-color: var(--ddd-theme-default-black, #000);
          font-weight: var(--ddd-font-weight-bold, 700);
          box-shadow: 0 0 0 2px var(--haxcms-goggles-lens);
        }
        @keyframes pod-in {
          from {
            transform: translate(-50%, 100%);
          }
          to {
            transform: translate(-50%, 0);
          }
        }

        /* putting them on: the traveler comes forward until you are looking through his goggles */
        .puton {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: color-mix(
            in srgb,
            var(--ddd-theme-default-potentialMidnight, #000321) 70%,
            transparent
          );
          animation: puton-fade 1700ms var(--ddd-timing-linear, linear) both;
        }
        .traveler {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 40vmin;
          height: 40vmin;
          margin: -20vmin 0 0 -20vmin;
          transform-origin: 50% var(--haxcms-goggles-eyes, 69.2%);
          animation: puton-zoom 1500ms cubic-bezier(0.6, 0, 0.9, 0.4) both;
        }
        .traveler svg {
          width: 100%;
          height: 100%;
          display: block;
          overflow: visible;
        }
        .flash {
          position: absolute;
          inset: 0;
          background: var(--haxcms-goggles-lens);
          opacity: 0;
          animation: puton-flash 1700ms var(--ddd-timing-linear, linear) both;
        }
        @keyframes puton-zoom {
          0% {
            /* out of the Future Traveler mark in the corner */
            transform: translate(
                var(--haxcms-goggles-from-x, 42vw),
                var(--haxcms-goggles-from-y, -42vh)
              )
              scale(var(--haxcms-goggles-from-scale, 0.12));
          }
          35% {
            transform: translate(0, -6vh) scale(1);
          }
          55% {
            transform: translate(0, -6vh) scale(1.08);
          }
          100% {
            transform: translate(0, var(--haxcms-goggles-eyes-shift, -19.2%))
              scale(11);
          }
        }
        @keyframes puton-flash {
          0%,
          70% {
            opacity: 0;
          }
          86% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes puton-fade {
          0% {
            opacity: 0;
          }
          12%,
          88% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        :host([phase="puton"]) .rims {
          animation-delay: 1350ms;
        }
        :host([phase="puton"]) .sweep {
          animation-delay: 1500ms;
        }
        /* taking them off: the rims let go, the view pulls back out through the
           lenses, and the traveler heads back to his corner */
        :host([phase="takeoff"]) .rims {
          animation: rims-in 500ms var(--hax-ui-easing, ease-in) reverse both;
        }
        :host([phase="takeoff"]) .puton {
          animation: puton-fade 1300ms var(--ddd-timing-linear, linear) reverse
            both;
        }
        :host([phase="takeoff"]) .traveler {
          animation: puton-zoom 1150ms cubic-bezier(0.1, 0.6, 0.4, 1) 150ms
            reverse both;
        }
        :host([phase="takeoff"]) .flash {
          animation: puton-flash 1300ms var(--ddd-timing-linear, linear) reverse
            both;
        }

        /* the Translate lens: outlined words, a dashed outline when still in English */
        .box.mark.tx {
          border-width: var(--ddd-border-size-sm, 2px);
          box-shadow: 0 0 0 1px var(--ddd-theme-default-coalyGray, #262626);
        }
        .box.mark.tx.hot {
          border-width: var(--ddd-border-size-md, 3px);
          background: color-mix(
            in srgb,
            var(--haxcms-goggles-lens) 25%,
            transparent
          );
        }
        .box.mark.tx.missing {
          border-style: dashed;
        }
        .box.mark.tx span {
          top: 100%;
          font-family: var(--ddd-font-navigation, sans-serif);
        }
        .box.mark.tx .badge {
          position: absolute;
          right: -2px;
          top: -14px;
          padding: 0 var(--ddd-spacing-1, 4px);
          background: var(--haxcms-goggles-lens);
          color: var(--ddd-theme-default-black, #000);
          border-radius: var(--hax-ui-radius, 4px) var(--hax-ui-radius, 4px) 0 0;
          font-size: 10px;
          line-height: 14px;
          font-family: var(--ddd-font-navigation, sans-serif);
        }
        .tx h2 {
          min-height: 24px;
          line-height: 1.3;
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--ddd-font-size-xs, 24px);
          margin-top: var(--ddd-spacing-2, 8px);
          overflow-wrap: anywhere;
        }
        .tx h2:focus {
          outline: none;
        }
        .tx .part {
          margin-top: var(--ddd-spacing-1, 4px);
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        .tx .compare {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--ddd-spacing-3, 12px);
          margin: var(--ddd-spacing-3, 12px) 0 0;
        }
        .tx .compare div {
          display: block;
          min-width: 0;
        }
        .tx .compare dt {
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          font-weight: var(--ddd-font-weight-bold, 700);
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--hax-ui-text-muted);
        }
        .tx .compare dd {
          margin: var(--ddd-spacing-1, 4px) 0 0;
          padding: var(--ddd-spacing-2, 8px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: var(--hax-ui-admin-font-size, 14px);
          overflow-wrap: anywhere;
        }
        .tx .compare dd.missing {
          border-style: dashed;
          font-style: italic;
        }
        .tx .tokens {
          display: flex;
          gap: var(--ddd-spacing-2, 8px);
          align-items: flex-start;
        }
        .tx .tokens b {
          display: block;
        }
        .tx button.primary {
          background: var(--hax-ui-text);
          color: var(--hax-ui-surface);
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .tx button.primary:hover:not([disabled]) {
          background: var(--haxcms-goggles-lens);
          color: var(--ddd-theme-default-black, #000);
        }
        .tx button[disabled] {
          cursor: not-allowed;
          opacity: 1;
          background: transparent;
          color: var(--hax-ui-text-muted);
          border-style: dashed;
          border-color: var(--hax-ui-text-muted);
        }
        .tx button.small {
          min-height: var(--ddd-spacing-8, 32px);
          min-width: var(--ddd-spacing-8, 32px);
          padding: 0 var(--ddd-spacing-2, 8px);
        }
        .tx .langrow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-2, 8px);
        }
        .tx haxcms-language-picker {
          display: block;
          margin-top: var(--ddd-spacing-3, 12px);
        }
        .tx ol.txlist,
        .tx ul.others {
          list-style: none;
          margin: var(--ddd-spacing-3, 12px) 0 0;
          padding: 0;
        }
        .tx ol.txlist li {
          display: flex;
          gap: var(--ddd-spacing-2, 8px);
          align-items: center;
          padding: var(--ddd-spacing-2, 8px) 0;
          border-top: 1px solid var(--hax-ui-line-strong);
        }
        .tx .pair {
          flex: 1 1 auto;
          min-width: 0;
          display: grid;
          gap: 2px;
        }
        .tx .pair .en,
        .tx .other .en {
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
        }
        .tx .pair .sugg {
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow-wrap: anywhere;
        }
        .tx ul.others li + li {
          margin-top: var(--ddd-spacing-1, 4px);
        }
        .tx button.other {
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
          padding: var(--ddd-spacing-2, 8px) var(--ddd-spacing-3, 12px);
          text-align: start;
          border-color: var(--hax-ui-line-strong);
        }
        .tx button.other.missing {
          border-style: dashed;
        }
        .tx pre {
          margin-top: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-2, 8px);
          max-height: 220px;
          overflow: auto;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          font-family: var(--ddd-font-mono, monospace);
          font-size: var(--hax-ui-admin-font-size-xs, 12px);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius, 4px);
        }
        .pod .lens.list .count {
          min-width: 20px;
          height: 20px;
          box-sizing: border-box;
          padding: 0 var(--ddd-spacing-1, 4px);
          border-radius: 10px;
          background: var(--haxcms-goggles-lens);
          color: var(--ddd-theme-default-black, #000);
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 20px;
        }

        @media (max-width: 719px) {
          :host {
            --haxcms-goggles-rim: 6px;
          }
          .card {
            left: 12px;
            right: 12px;
            bottom: 84px;
            width: auto;
            max-height: 52dvh;
          }
          .panel {
            top: auto;
            left: 12px;
            right: 12px;
            bottom: 84px;
            width: auto;
            max-height: 50dvh;
          }
          .issue {
            top: 68px;
            bottom: 84px;
            left: 12px;
            right: 12px;
            width: auto;
            max-height: none;
            transform: none;
          }
          .pod {
            gap: 2px;
            padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px)
              var(--ddd-spacing-2, 8px);
          }
          .pod-mark,
          .pod-split {
            display: none;
          }
          .pin-tag {
            display: none;
          }
          .tx .compare {
            grid-template-columns: 1fr;
            gap: var(--ddd-spacing-2, 8px);
          }
        }
        /* five lenses and the switches fit a phone: the switches keep their
           icon and their name for screen readers */
        @media (max-width: 420px) {
          .pod {
            gap: 2px;
            padding-inline: var(--ddd-spacing-1, 4px);
          }
          .pod .lens {
            min-width: 40px;
            padding: var(--ddd-spacing-1, 4px) 2px;
            font-size: 10px;
          }
          .pod .lens:not([aria-pressed]) > span:not(.count) {
            position: absolute;
            width: 1px;
            height: 1px;
            overflow: hidden;
            clip-path: inset(50%);
            white-space: nowrap;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .glass,
          details.fold summary::before {
            transition: none;
          }
          .rims,
          .sweep,
          .pod,
          .pin,
          .shot.developing svg,
          .spinner {
            animation: none;
          }
          .sweep {
            display: none;
          }
        }
      `,
    ];
  }
}
globalThis.customElements.define(HaxcmsGoggles.tag, HaxcmsGoggles);
