/**
 * Copyright 2026 andyid23
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `langkah-bertahap`
 * Split-pause progressive content reveal component with celebration effects.
 *
 * Renamed from `warp-glitch`; both tags stay registered so pages authored
 * before the rename keep rendering (see the compat aliases at the bottom).
 *
 * @demo index.html
 * @element langkah-bertahap
 */
export class LangkahBertahap extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "langkah-bertahap";
  }

  constructor() {
    super();
    this.visibleContent = 1;
    this.showButtons = true;
    this.showAllOption = false;
    this.labels = Array.from({ length: 12 }, (_, i) => `Bagian ${i + 1}`);
    this.buttonLabel = "";
    this.showAllLabel = "";
    this.confetti = true;
    this.isMenuOpen = false;
    this._dddTokens = {};

    this.t = this.t || {};
    this.t = Object.assign({}, this.t, {
      continue: "Lanjut...",
      showAll: "Tampilkan Semua",
      moreOptions: "Opsi lainnya",
      step: "Bagian",
      duplicateStep: "Duplikat",
      removeStep: "Hapus",
      addStep: "Bagian baru",
      addParagraph: "Teks",
      duplicateStepTitle: "Duplikat isi bagian ini",
      removeStepTitle: "Hapus bagian ini",
      addStepTitle: "Tambah bagian kosong setelah bagian ini",
      addParagraphTitle:
        "Tambah paragraf kosong di bagian ini supaya bisa langsung mengetik",
    });

    this.registerLocalization({
      context: this,
      /**
       * Pin the namespace so the compat aliases (<warp-glitch>, <split-pause>)
       * read the same locale files instead of looking for warp-glitch.<lang>.json.
       */
      namespace: "langkah-bertahap",
      /**
       * I18NMixin fetches `<namespace>.<lang>.json` from localesPath, where
       * namespace is the tag lowercased (`langkah-bertahap`). Listing the
       * locales also makes English load: without the list the manager treats
       * "en" as "use the built-in defaults" and never requests a file.
       */
      locales: [
        "ar",
        "bn",
        "en",
        "es",
        "fr",
        "hi",
        "id",
        "ja",
        "pt",
        "ru",
        "zh",
      ],
      localesPath:
        new URL("./locales/langkah-bertahap.ar.json", import.meta.url).href +
        "/../",
    });

    /**
     * i18n-manager only auto-loads a locale when the document language matches
     * one of `locales` exactly. A regional tag such as `en-US` (what the HAXcms
     * shell ships) therefore never requested the `en` file and the element kept
     * its Indonesian source strings. Announce the resolved base language once
     * registration is done; the manager caches every fetch, so this is cheap.
     */
    const baseLanguage = (this._documentLanguage() || "").split("-")[0];
    if (baseLanguage) {
      globalThis.dispatchEvent(
        new CustomEvent("languagechange", { detail: baseLanguage })
      );
    }
  }

  static get properties() {
    return Object.assign({}, super.properties, {
      visibleContent: {
        type: Number,
        attribute: "visible-content",
        reflect: true,
      },
      showButtons: {
        type: Boolean,
        attribute: "show-buttons",
        reflect: true,
      },
      showAllOption: {
        type: Boolean,
        attribute: "show-all-option",
      },
      labels: {
        type: Array,
      },
      buttonLabel: {
        type: String,
        attribute: "button-label",
      },
      showAllLabel: {
        type: String,
        attribute: "show-all-label",
      },
      confetti: {
        type: Boolean,
      },
      isMenuOpen: {
        type: Boolean,
        state: true,
      },
      /**
       * Set by hax-body on the host while the page is being edited. Declared so
       * Lit re-renders when the editor toggles edit mode, which is what reveals
       * the per-step authoring tools.
       */
      dataHaxRay: {
        type: String,
        attribute: "data-hax-ray",
        reflect: true,
      },
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this._clickOutsideHandler = (e) => {
      if (this.isMenuOpen && !this.shadowRoot.contains(e.composedPath()[0])) {
        this.isMenuOpen = false;
      }
    };
    globalThis.addEventListener("click", this._clickOutsideHandler);
    /**
     * Keep the step list in sync with the light DOM. The HAX editor inserts and
     * removes slotted blocks while the page is open, so a fixed label list goes
     * stale (a 4th section would never render at all).
     */
    if (globalThis.MutationObserver && !this._slotObserver) {
      this._slotObserver = new MutationObserver(() =>
        this._detectSlottedContent()
      );
      this._slotObserver.observe(this, {
        childList: true,
        attributeFilter: ["slot"],
        subtree: false,
      });
    }
    /**
     * Writing direction. Remember an explicit dir first, then follow the page
     * language so Arabic (RTL) mirrors the buttons and dropdown automatically.
     */
    if (this._authorDir === undefined) {
      this._authorDir = this.getAttribute("dir") || "";
    }
    this._syncDirection();
    if (
      globalThis.MutationObserver &&
      globalThis.document &&
      !this._documentLangObserver
    ) {
      this._documentLangObserver = new MutationObserver(() =>
        this._syncDirection()
      );
      const options = {
        attributes: true,
        attributeFilter: ["lang", "xml:lang", "dir", "xml:dir"],
      };
      this._documentLangObserver.observe(
        globalThis.document.documentElement,
        options
      );
      if (globalThis.document.body) {
        this._documentLangObserver.observe(globalThis.document.body, options);
      }
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    globalThis.removeEventListener("click", this._clickOutsideHandler);
    if (this._slotObserver) {
      this._slotObserver.disconnect();
      this._slotObserver = null;
    }
    if (this._documentLangObserver) {
      this._documentLangObserver.disconnect();
      this._documentLangObserver = null;
    }
  }

  /**
   * Scripts written right-to-left. Kept in sync with locales/*.json.
   */
  _isRtlLanguage(lang) {
    return /^(ar|arc|ckb|dv|fa|he|khw|ks|ps|sd|ug|ur|yi)(-|$)/i.test(
      lang || ""
    );
  }

  /**
   * Same precedence as I18NMixin: body lang, document lang, then the browser.
   */
  _documentLanguage() {
    const doc = globalThis.document;
    if (!doc) {
      return "";
    }
    const body = doc.body;
    return (
      (body && (body.getAttribute("lang") || body.getAttribute("xml:lang"))) ||
      doc.documentElement.getAttribute("lang") ||
      doc.documentElement.getAttribute("xml:lang") ||
      (globalThis.navigator && globalThis.navigator.language) ||
      ""
    );
  }

  /**
   * Mirror the page writing direction. An explicit dir on the element wins, and
   * the attribute doubles as the CSS hook (`:host([dir="rtl"])`).
   */
  _syncDirection() {
    if (this._authorDir) {
      return;
    }
    const dir = this._isRtlLanguage(this._documentLanguage()) ? "rtl" : "ltr";
    if (this.getAttribute("dir") !== dir) {
      this.setAttribute("dir", dir);
    }
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this._readDDDCustomProperties();
    this._detectSlottedContent();
  }

  _readDDDCustomProperties() {
    if (!globalThis.document || !globalThis.getComputedStyle) {
      return;
    }
    const root = globalThis.document.documentElement;
    const computed = getComputedStyle(root);
    const tokens = {};

    for (let i = 0; i < computed.length; i += 1) {
      const name = computed[i];
      if (name && name.startsWith("--ddd-")) {
        tokens[name] = computed.getPropertyValue(name).trim();
      }
    }
    this._dddTokens = tokens;
  }

  _detectSlottedContent() {
    const children = Array.from(this.children || []);
    let maxIndex = 0;
    for (let i = 0; i < children.length; i += 1) {
      const slot = children[i].getAttribute("slot");
      if (slot && slot.startsWith("content-")) {
        const idx = parseInt(slot.replace("content-", ""), 10);
        if (!isNaN(idx) && idx > maxIndex) {
          maxIndex = idx;
        }
      }
    }
    // nothing slotted by number: keep the step list as-is so the default slot
    // fallback text still works
    if (maxIndex === 0) {
      return;
    }
    // only expose steps that actually have slotted content, otherwise the
    // continue button walks off into placeholder "Content N" labels
    if (maxIndex !== this.labels.length) {
      const newLabels = this.labels.slice(0, maxIndex);
      const stepWord = (this.t && this.t.step) || "Bagian";
      while (newLabels.length < maxIndex) {
        newLabels.push(stepWord + " " + (newLabels.length + 1));
      }
      this.labels = newLabels;
    }
  }

  /**
   * Section numbers that currently exist in the light DOM, ascending.
   * `slot="content-3"` -> 3
   */
  _stepIndexes() {
    const indexes = new Set();
    Array.from(this.children || []).forEach((child) => {
      const slot = child.getAttribute("slot") || "";
      const match = /^content-(\d+)$/.exec(slot);
      if (match) {
        indexes.add(parseInt(match[1], 10));
      }
    });
    return Array.from(indexes).sort((a, b) => a - b);
  }

  // rename every block that lives in step `from` so it lands in step `to`
  _renameStep(from, to) {
    Array.from(this.children || []).forEach((child) => {
      if (child.getAttribute("slot") === "content-" + from) {
        child.setAttribute("slot", "content-" + to);
      }
    });
  }

  /**
   * Clone a block into another step without dragging editor bookkeeping along
   * (duplicate ids, contenteditable, drag state and hax-ray all get stripped so
   * the copy behaves like freshly authored content).
   */
  _cleanClone(node, stepIndex) {
    const clone = node.cloneNode(true);
    clone.setAttribute("slot", "content-" + stepIndex);
    const nodes = [clone, ...clone.querySelectorAll("*")];
    nodes.forEach((el) => {
      el.removeAttribute("id");
      el.removeAttribute("contenteditable");
      el.removeAttribute("data-hax-ray");
      el.removeAttribute("data-hax-active");
      el.removeAttribute("draggable");
      el.removeAttribute("spellcheck");
    });
    return clone;
  }

  /**
   * Copy every block of the given step right below it. Later steps are shifted
   * down one so nothing is overwritten and the continue button keeps walking
   * through the sections in order.
   */
  _duplicateStep(index) {
    const stepChildren = Array.from(this.children || []).filter(
      (child) => child.getAttribute("slot") === "content-" + index
    );
    if (stepChildren.length === 0) {
      return;
    }
    const indexes = this._stepIndexes();
    const highest = indexes.length > 0 ? indexes[indexes.length - 1] : index;
    for (let i = highest; i > index; i -= 1) {
      this._renameStep(i, i + 1);
    }
    let anchor = stepChildren[stepChildren.length - 1];
    const clones = [];
    stepChildren.forEach((child) => {
      const clone = this._cleanClone(child, index + 1);
      anchor.parentNode.insertBefore(clone, anchor.nextSibling);
      anchor = clone;
      clones.push(clone);
    });
    this._detectSlottedContent();
    this._adoptEditorBlocks(clones);
  }

  /**
   * Remove a step (all of its blocks) and close the gap in the numbering.
   * Refuses to remove the last remaining step.
   */
  _removeStep(index) {
    if (this._stepIndexes().length <= 1) {
      return;
    }
    Array.from(this.children || []).forEach((child) => {
      if (child.getAttribute("slot") === "content-" + index) {
        child.remove();
      }
    });
    const indexes = this._stepIndexes();
    const highest = indexes.length > 0 ? indexes[indexes.length - 1] : index;
    for (let i = index + 1; i <= highest; i += 1) {
      this._renameStep(i, i - 1);
    }
    this._detectSlottedContent();
  }

  /**
   * Build an empty paragraph that belongs to step `index`. The trailing <br> is
   * what gives the block a line height: a paragraph with no children is zero
   * pixels tall in the light DOM, which is why an added step used to look like
   * empty space with nowhere to type.
   */
  _createStepParagraph(index) {
    const doc = globalThis.document;
    const paragraph = doc.createElement("p");
    paragraph.setAttribute("slot", "content-" + index);
    paragraph.appendChild(doc.createElement("br"));
    return paragraph;
  }

  /**
   * Put the caret inside a freshly created block once the HAX editor has had a
   * chance to mark it contenteditable. Retries because hax-body applies editing
   * state through its own mutation observer, not synchronously.
   */
  _focusBlock(block) {
    if (!block) {
      return;
    }
    try {
      block.scrollIntoView({ block: "nearest", behavior: "smooth" });
    } catch (e) {
      /* scrolling is a nicety */
    }
    const place = () => {
      try {
        if (globalThis.document.activeElement === block) {
          return true;
        }
        block.focus();
        const selection = globalThis.getSelection && globalThis.getSelection();
        if (selection && block.isContentEditable) {
          const range = globalThis.document.createRange();
          range.selectNodeContents(block);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        return globalThis.document.activeElement === block;
      } catch (e) {
        return false;
      }
    };
    [0, 120, 400, 900].forEach((delay) => {
      setTimeout(place, delay);
    });
  }

  /**
   * Hand freshly created blocks to the HAX editor.
   *
   * hax-body normally applies editing state (contenteditable, data-hax-ray,
   * drag/drop handlers) through a MutationObserver, but in the deployed editor
   * that observer never connects: the body waits for its content state to be
   * stable while the edit-mode transition flag is itself one of the busy flags
   * it waits on, so the wait never resolves. Blocks the step tools add then
   * arrive "dead" — clicking them leaves the previous block active and its
   * settings stay on screen, which looks like the new block turning into an
   * unclickable paragraph. Apply the state directly instead, the same way
   * hax-body's own insert path does, then make the block active so the tray
   * opens its settings.
   */
  _adoptEditorBlocks(blocks) {
    const store = (globalThis.HaxStore && globalThis.HaxStore.instance) || null;
    const body = store && store.activeHaxBody;
    if (!store || !store.editMode || !body || !blocks || !blocks.length) {
      return Promise.resolve([]);
    }
    const apply = async (node) => {
      if (!node || node.nodeType !== 1) {
        return;
      }
      // everything a clone strips has to come back, including nested blocks
      const nodes = [node];
      if (typeof node.querySelectorAll === "function") {
        node.querySelectorAll("*").forEach((child) => nodes.push(child));
      }
      for (let i = 0; i < nodes.length; i++) {
        const target = nodes[i];
        // same validity test hax-body runs before it touches a node
        if (
          typeof body._validElementTest === "function" &&
          !body._validElementTest(target, true)
        ) {
          continue;
        }
        try {
          if (typeof body.__applyNodeEditableStateWhenReady === "function") {
            await body.__applyNodeEditableStateWhenReady(target, true);
          } else if (typeof body.__applyNodeEditableState === "function") {
            body.__applyNodeEditableState(target, true);
          }
        } catch (e) {
          /* editing state is an editor nicety; the block still renders */
        }
      }
      try {
        if (typeof body.__rehydrateLayoutDescendants === "function") {
          await body.__rehydrateLayoutDescendants(node, true);
        }
      } catch (e) {
        /* nested grid rehydration is best effort */
      }
    };
    return Promise.all(blocks.map(apply)).then(() => {
      const last = blocks[blocks.length - 1];
      if (last && last.nodeType === 1) {
        store.activeNode = last;
      }
      return blocks;
    });
  }

  /**
   * Insert an empty step after `index`, which is how new steps get created from
   * the HAX UI (the editor itself has no "add slot" affordance).
   */
  _addStepAfter(index) {
    const indexes = this._stepIndexes();
    const highest = indexes.length > 0 ? indexes[indexes.length - 1] : 0;
    if (index < highest) {
      for (let i = highest; i > index; i -= 1) {
        this._renameStep(i, i + 1);
      }
    }
    const paragraph = this._createStepParagraph(index + 1);
    this.appendChild(paragraph);
    this._detectSlottedContent();
    this._adoptEditorBlocks([paragraph]).then(() => {
      this._focusBlock(paragraph);
    });
  }

  /**
   * Append an empty paragraph to an existing step. Gives the author a typing
   * target inside a step without leaving the block or opening the tray.
   */
  _addParagraph(index) {
    if (index < 1) {
      return;
    }
    const children = Array.from(this.children || []);
    const paragraph = this._createStepParagraph(index);
    const inStep = children.filter(
      (child) => child.getAttribute("slot") === "content-" + index
    );
    const anchor = inStep.length
      ? inStep[inStep.length - 1]
      : children[children.length - 1];
    if (anchor && anchor.parentNode === this) {
      anchor.parentNode.insertBefore(paragraph, anchor.nextSibling);
    } else {
      this.appendChild(paragraph);
    }
    this._detectSlottedContent();
    this._adoptEditorBlocks([paragraph]).then(() => {
      this._focusBlock(paragraph);
    });
  }

  _handleStepTool(e, action, index) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (action === "duplicate") {
      this._duplicateStep(index);
    } else if (action === "remove") {
      this._removeStep(index);
    } else if (action === "add") {
      this._addStepAfter(index);
    } else if (action === "paragraph") {
      this._addParagraph(index);
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          font-family: var(
            --ddd-font-primary,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            "Helvetica Neue",
            Arial,
            sans-serif
          );
        }

        .wrapper {
          position: relative;
        }

        .content {
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s ease-out, opacity 0.3s ease-out;
        }

        .content.visible {
          max-height: 5000px;
          opacity: 1;
          overflow: visible;
        }

        /**
         * HAX editor state (the data-hax-ray attribute is set by hax-body on the
         * host while editing): every step must stay visible and tall enough to
         * click into, otherwise blocks can only be dropped into the steps that
         * are already revealed and the later slots look empty to the author.
         */
        :host([data-hax-ray]) .content {
          max-height: none;
          opacity: 1;
          overflow: visible;
          transition: none;
        }

        :host([data-hax-ray]) .content:not(.visible) {
          min-height: var(--ddd-spacing-10, 40px);
          outline: var(--ddd-border-xs, 1px) dashed
            var(--ddd-theme-default-limestoneGray, #cccccc);
          outline-offset: 2px;
          margin-top: var(--ddd-spacing-2, 8px);
        }

        /**
         * A freshly added step is a single empty paragraph. Without a minimum
         * height that block collapses to zero pixels, so there is literally no
         * line to click into and no space to type. In edit mode every slotted
         * block keeps at least one line of typing height.
         */
        :host([data-hax-ray]) .content ::slotted(*) {
          min-height: 1.5em;
        }

        /* Authoring tools, rendered inside each step while the HAX editor is on */
        .step-tools {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--ddd-spacing-2, 8px);
          margin-top: var(--ddd-spacing-2, 8px);
          font-size: var(--ddd-font-size-4xs, 0.7rem);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .step-tools-label {
          font-weight: var(--ddd-font-weight-bold, 700);
          opacity: 0.7;
        }

        .step-tool {
          font: inherit;
          text-transform: none;
          letter-spacing: normal;
          cursor: pointer;
          color: inherit;
          background: transparent;
          border: var(--ddd-border-xs, 1px) solid currentColor;
          border-radius: var(--ddd-radius-xs, 0.25rem);
          padding: var(--ddd-spacing-1, 4px) var(--ddd-spacing-2, 8px);
        }

        .step-tool:hover {
          background-color: var(--ddd-theme-default-limestoneLight, #eeeeee);
        }

        .step-tool:focus-visible {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: 2px;
        }

        .step-tool:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        /* Container for button group */
        .btn-group {
          position: relative;
          display: inline-flex;
          vertical-align: middle;
          margin-top: var(--ddd-spacing-4, 20px);
        }

        /* General button styling */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: var(--ddd-font-navigation, inherit);
          font-weight: var(--ddd-font-weight-medium, 500);
          text-align: center;
          vertical-align: middle;
          user-select: none;
          border: var(--ddd-border-xs) solid transparent;
          padding: var(--ddd-spacing-2, 0.375rem) var(--ddd-spacing-4, 0.75rem);
          font-size: var(--ddd-font-size-s, 1rem);
          line-height: var(--ddd-lh-150, 1.5);
          transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
            border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
          cursor: pointer;
          color: var(--pause-button-color, var(--ddd-theme-default-white, #ffffff));
          background-color: var(
            --pause-button-bg,
            var(--ddd-theme-default-beaverBlue, #005fa9)
          );
          border-color: var(
            --pause-button-bg,
            var(--ddd-theme-default-beaverBlue, #005fa9)
          );
        }

        .btn:hover {
          background-color: var(
            --pause-button-bg-hover,
            var(--ddd-theme-default-navy80, #1e4079)
          );
          border-color: var(
            --pause-button-bg-hover,
            var(--ddd-theme-default-navy80, #1e4079)
          );
        }

        .btn:focus,
        .btn:focus-visible {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: 2px;
          box-shadow: 0 0 0 0.2rem rgba(0, 95, 169, 0.3);
        }

        /* Main Button (Lanjut) - Left radius only */
        .btn-main {
          border-top-left-radius: var(--ddd-radius-xs, 0.25rem);
          border-bottom-left-radius: var(--ddd-radius-xs, 0.25rem);
          border-top-right-radius: var(--ddd-radius-none, 0);
          border-bottom-right-radius: var(--ddd-radius-none, 0);
          padding-right: var(--ddd-spacing-3, 12px);
        }

        /* Toggle Button (Arrow) - Right radius only */
        .dropdown-toggle {
          border-top-left-radius: var(--ddd-radius-none, 0);
          border-bottom-left-radius: var(--ddd-radius-none, 0);
          border-top-right-radius: var(--ddd-radius-xs, 0.25rem);
          border-bottom-right-radius: var(--ddd-radius-xs, 0.25rem);
          border-left: var(--ddd-border-xs) solid rgba(255, 255, 255, 0.3);
          padding-left: var(--ddd-spacing-2, 8px);
          padding-right: var(--ddd-spacing-2, 8px);
        }

        /* Arrow Icon */
        .arrow-down {
          display: inline-block;
          width: 0;
          height: 0;
          margin: var(--ddd-spacing-0, 0);
          vertical-align: middle;
          border-top: 5px solid currentColor;
          border-right: 5px solid transparent;
          border-left: 5px solid transparent;
        }

        /* Dropdown Menu */
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: var(--ddd-spacing-0, 0);
          z-index: 1000;
          display: none;
          min-width: 10rem;
          padding: var(--ddd-spacing-2, 0.5rem) 0;
          margin: var(--ddd-spacing-1, 0.125rem) 0 0;
          font-size: var(--ddd-font-size-s, 1rem);
          color: var(--ddd-theme-default-coalyGray, #212529);
          text-align: start;
          list-style: none;
          background-color: var(--ddd-theme-default-white, #ffffff);
          background-clip: padding-box;
          border: 1px solid
            var(--ddd-theme-default-limestoneGray, rgba(0, 0, 0, 0.15));
          border-radius: var(--ddd-radius-xs, 0.25rem);
          box-shadow: var(
            --ddd-boxShadow-md,
            0 0.5rem 1rem rgba(0, 0, 0, 0.15)
          );
        }

        .dropdown-menu.show {
          display: block;
          animation: fadeIn 0.2s ease-out;
        }

        /**
         * Right-to-left (Arabic). The element mirrors the page direction by
         * setting dir="rtl"; flexbox already swaps the button order, so only the
         * hard-coded corner radii and the dropdown anchor need flipping.
         */
        :host([dir="rtl"]) .btn-main {
          border-top-left-radius: var(--ddd-radius-none, 0);
          border-bottom-left-radius: var(--ddd-radius-none, 0);
          border-top-right-radius: var(--ddd-radius-xs, 0.25rem);
          border-bottom-right-radius: var(--ddd-radius-xs, 0.25rem);
          padding-right: var(--ddd-spacing-2, 8px);
          padding-left: var(--ddd-spacing-3, 12px);
        }

        :host([dir="rtl"]) .dropdown-toggle {
          border-top-left-radius: var(--ddd-radius-xs, 0.25rem);
          border-bottom-left-radius: var(--ddd-radius-xs, 0.25rem);
          border-top-right-radius: var(--ddd-radius-none, 0);
          border-bottom-right-radius: var(--ddd-radius-none, 0);
          border-left: none;
          border-right: var(--ddd-border-xs) solid rgba(255, 255, 255, 0.3);
        }

        :host([dir="rtl"]) .dropdown-menu {
          right: var(--ddd-spacing-0, 0);
          left: auto;
        }

        :host([dir="rtl"]) .step-tools {
          direction: rtl;
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: var(--ddd-spacing-2, 0.25rem) var(--ddd-spacing-4, 1.5rem);
          clear: both;
          font-family: var(--ddd-font-primary, inherit);
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--ddd-theme-default-coalyGray, #212529);
          text-align: inherit;
          white-space: nowrap;
          background-color: var(--ddd-theme-default-potential0, transparent);
          border: none;
          text-decoration: none;
          cursor: pointer;
        }

        .dropdown-item:hover,
        .dropdown-item:focus {
          background-color: var(--ddd-theme-default-slateLight, #f8f9fa);
          color: var(--ddd-theme-default-potentialMidnight, #16181b);
          outline: none;
        }

        /* Screen reader utility */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: var(--ddd-spacing-0, 0);
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: none;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="wrapper">
        ${this.renderContent()}
        ${this.showButtons ? this.renderSplitButton() : ""}
      </div>
    `;
  }

  renderContent() {
    const editing = this.dataHaxRay !== undefined && this.dataHaxRay !== null;
    return this.labels.map(
      (label, index) => html`
        <div class="content ${this.visibleContent > index ? "visible" : ""}">
          ${index === 0
            ? html`<slot name="content-1"><slot>${label}</slot></slot>`
            : html`<slot name="content-${index + 1}">${label}</slot>`}
          ${editing ? this.renderStepTools(index + 1) : ""}
        </div>
      `
    );
  }

  renderStepTools(stepIndex) {
    return html`
      <div class="step-tools" part="step-tools">
        <span class="step-tools-label"
          >${this.t.step || "Bagian"} ${stepIndex}</span
        >
        <button
          type="button"
          class="step-tool"
          title=${this.t.duplicateStepTitle || "Duplikat isi bagian ini"}
          @click=${(e) => this._handleStepTool(e, "duplicate", stepIndex)}
        >
          ${this.t.duplicateStep || "Duplikat"}
        </button>
        <button
          type="button"
          class="step-tool"
          title=${this.t.removeStepTitle || "Hapus bagian ini"}
          ?disabled=${this.labels.length <= 1}
          @click=${(e) => this._handleStepTool(e, "remove", stepIndex)}
        >
          ${this.t.removeStep || "Hapus"}
        </button>
        <button
          type="button"
          class="step-tool"
          title=${this.t.addParagraphTitle ||
          "Tambah paragraf kosong di bagian ini"}
          @click=${(e) => this._handleStepTool(e, "paragraph", stepIndex)}
        >
          + ${this.t.addParagraph || "Teks"}
        </button>
        <button
          type="button"
          class="step-tool"
          title=${this.t.addStepTitle || "Tambah bagian setelah bagian ini"}
          @click=${(e) => this._handleStepTool(e, "add", stepIndex)}
        >
          + ${this.t.addStep || "Bagian baru"}
        </button>
      </div>
    `;
  }

  renderSplitButton() {
    const mainText = this.buttonLabel || this.t.continue || "Lanjut...";
    const showAllText =
      this.showAllLabel || this.t.showAll || "Tampilkan Semua";
    const moreOptionsText = this.t.moreOptions || "Opsi lainnya";

    return html`
      <div class="btn-group">
        <!-- Main Button -->
        <button type="button" class="btn btn-main" @click=${this.handlePause}>
          ${mainText}
        </button>

        <!-- Toggle Button -->
        <button
          type="button"
          class="btn dropdown-toggle"
          @click=${this.toggleMenu}
          aria-haspopup="true"
          aria-expanded="${this.isMenuOpen ? "true" : "false"}"
          aria-label="${moreOptionsText}"
        >
          <span class="sr-only">${moreOptionsText}</span>
          <i class="arrow-down" aria-hidden="true"></i>
        </button>

        <!-- Dropdown Menu -->
        <div
          class="dropdown-menu ${this.isMenuOpen ? "show" : ""}"
          role="menu"
        >
          <button
            type="button"
            class="dropdown-item"
            @click=${this.showAll}
            role="menuitem"
          >
            ${showAllText}
          </button>
        </div>
      </div>
    `;
  }

  toggleMenu(e) {
    if (e && typeof e.stopPropagation === "function") {
      e.stopPropagation();
    }
    this.isMenuOpen = !this.isMenuOpen;
  }

  handlePause = () => {
    if (this.visibleContent < this.labels.length) {
      this.visibleContent += 1;
      this.launchConfetti();
    } else {
      this.visibleContent = this.labels.length;
      this.showButtons = false;
    }
    this.showAllOption = this.visibleContent < this.labels.length;
    this.isMenuOpen = false;

    this._notifyChange();
  };

  showAll = () => {
    this.visibleContent = this.labels.length;
    this.showButtons = false;
    this.launchConfetti();
    this.isMenuOpen = false;

    this._notifyChange();
  };

  _notifyChange() {
    this.dispatchEvent(
      new CustomEvent("pause-changed", {
        bubbles: true,
        composed: true,
        detail: {
          visibleContent: this.visibleContent,
          total: this.labels.length,
          finished: !this.showButtons,
        },
      })
    );
  }

  launchConfetti() {
    if (!this.confetti) {
      return;
    }
    const overlay =
      globalThis.document &&
      (globalThis.document.getElementById("confetti") ||
        globalThis.document.querySelector("kuis-confeti"));
    if (overlay && typeof overlay.fire === "function") {
      overlay.fire({ duration: 1500, particleCount: 120 });
      return;
    }

    if (globalThis.confetti) {
      const cs =
        globalThis.document && globalThis.getComputedStyle
          ? getComputedStyle(globalThis.document.documentElement)
          : null;

      const getColor = (prop, fallback) => {
        if (!cs) {
          return fallback;
        }
        const val = cs.getPropertyValue(prop);
        const trimmed = val ? val.trim() : "";
        return trimmed || fallback;
      };

      const colors = [
        getColor("--ddd-theme-default-skyBlue", "#3da9fc"),
        getColor("--ddd-theme-default-accent", "#ef4565"),
        getColor("--ddd-theme-default-link", "#6246ea"),
        getColor("--ddd-theme-default-lime", "#84cc16"),
        getColor("--ddd-theme-default-warning", "#f59e0b"),
      ];

      globalThis.confetti({
        particleCount: 100,
        spread: 90,
        angle: 90,
        startVelocity: 45,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
      });
    }
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LangkahBertahap.tag, LangkahBertahap);

/**
 * Compat aliases. `warp-glitch` is the pre-rename tag and `split-pause` comes
 * from info11; both share the same implementation and schema, so existing
 * content keeps working while new pages use <langkah-bertahap>.
 */
export class WarpGlitch extends LangkahBertahap {
  static get tag() {
    return "warp-glitch";
  }

  static get haxProperties() {
    return LangkahBertahap.haxProperties;
  }
}

if (!globalThis.customElements.get("warp-glitch")) {
  globalThis.customElements.define(WarpGlitch.tag, WarpGlitch);
}

if (!globalThis.customElements.get("split-pause")) {
  globalThis.customElements.define(
    "split-pause",
    class extends LangkahBertahap {
      static get tag() {
        return "split-pause";
      }

      static get haxProperties() {
        return LangkahBertahap.haxProperties;
      }
    }
  );
}