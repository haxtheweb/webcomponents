/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `a11y-footnotes`
 * The numbered list of a page's footnotes. Authors never place it: the
 * footnotes manager adds one at the bottom of the content area whenever a
 * page has a footnote, and removes it when the last one goes. It is never
 * part of saved content. A list already in the page (server-rendered) is
 * adopted instead of drawing a second one.
 *
 * @element a11y-footnotes
 */
export class A11yFootnotes extends I18NMixin(LitElement) {
  static get tag() {
    return "a11y-footnotes";
  }

  constructor() {
    super();
    this.notes = [];
    this.t = this.t || {};
    this.t = {
      ...this.t,
      footnotes: "Footnotes",
      backToReference: "Back to reference",
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
       * The footnote elements in reading order, set by the manager
       */
      notes: { type: Array, attribute: false },
    };
  }

  /**
   * Light DOM, so the list item ids are in the document and the references'
   * #a11y-footnote-N links reach them, and so the theme's text styles apply.
   */
  createRenderRoot() {
    return this;
  }

  render() {
    if (!this.notes || this.notes.length === 0) {
      return html``;
    }
    return html`<style>
        a11y-footnotes {
          display: block;
          margin-block-start: var(--ddd-spacing-8);
          padding-block-start: var(--ddd-spacing-3);
          border-block-start: var(--ddd-border-sm);
          border-color: light-dark(
            var(--ddd-theme-default-limestoneGray),
            var(--ddd-theme-default-slateGray)
          );
          font-size: var(--ddd-font-size-4xs);
          line-height: var(--ddd-lh-150);
        }
        a11y-footnotes h2.a11y-footnotes-heading {
          font-size: var(--ddd-font-size-xs);
          margin: 0 0 var(--ddd-spacing-2);
        }
        a11y-footnotes ol {
          margin: var(--ddd-spacing-0);
          padding-inline-start: var(--ddd-spacing-6);
        }
        a11y-footnotes li {
          font-size: var(--ddd-font-size-4xs);
          margin-block-end: var(--ddd-spacing-1);
        }
        a11y-footnotes li:target {
          outline: var(--ddd-border-size-md) solid
            var(--ddd-theme-default-keystoneYellow);
          outline-offset: var(--ddd-spacing-1);
        }
        a11y-footnotes .a11y-footnotes-back {
          margin-inline-start: var(--ddd-spacing-1);
          text-decoration: none;
        }
      </style>
      <h2 class="a11y-footnotes-heading" id="a11y-footnotes-heading">
        ${this.t.footnotes}
      </h2>
      <ol
        aria-labelledby="a11y-footnotes-heading"
        start="${this.notes[0].number || 1}"
      >
        ${this.notes.map(
          (note) =>
            html`<li id="a11y-footnote-${note.number}">
              ${this._noteContent(note)}<a
                class="a11y-footnotes-back"
                href="#a11y-footnote-ref-${note.number}"
                aria-label="${this.t.backToReference} ${note.number}"
                @click="${(e) => this._back(e, note)}"
                >↩</a
              >
            </li>`,
        )}
      </ol>`;
  }

  /**
   * A copy of the note's own content, so links and emphasis in a note keep
   * working in the list; the original stays where the author wrote it.
   */
  _noteContent(note) {
    const frag = globalThis.document.createDocumentFragment();
    note.childNodes.forEach((child) => {
      frag.appendChild(child.cloneNode(true));
    });
    frag.appendChild(globalThis.document.createTextNode(" "));
    return frag;
  }

  /**
   * The reference link lives in the footnote's shadow root, which a
   * #fragment can't target, so return focus to it directly.
   */
  _back(e, note) {
    e.preventDefault();
    note.scrollIntoView({ block: "center" });
    note.focusReference();
  }
}

globalThis.customElements.define(A11yFootnotes.tag, A11yFootnotes);

/**
 * Where a footnote's list goes. The list is never put inside hax-body, so
 * editing never saves it: while a page is being edited the list sits right
 * after hax-body. Otherwise the list goes at the end of the light DOM the
 * content lives in: in HAXcms that is the theme element, so the list is
 * slotted below the page content in every theme. Outside HAXcms it goes at
 * the end of the nearest main or article, else the body.
 * Returns { parent, before } for insertBefore.
 */
export function footnotesPlacement(note) {
  const haxBody = note.closest("hax-body");
  if (haxBody && haxBody.parentNode) {
    return { parent: haxBody.parentNode, before: haxBody.nextSibling };
  }
  const marked = note.closest("[data-a11y-footnotes]");
  if (marked) {
    return { parent: marked, before: null };
  }
  let node = note;
  while (node.parentElement) {
    const parent = node.parentElement;
    if (parent.shadowRoot && parent.tagName.includes("-")) {
      return { parent: parent, before: null };
    }
    if (parent === globalThis.document.body) {
      break;
    }
    node = parent;
  }
  return {
    parent: note.closest("main, article") || globalThis.document.body,
    before: null,
  };
}

/**
 * The one footnotes manager on a page (the issue's singleton). Footnotes
 * register when they connect; numbering and the list are rebuilt once per
 * frame after any change, in reading order.
 */
class A11yFootnotesManagerClass {
  constructor() {
    this.notes = new Set();
    this.lists = new Set();
    this._pending = false;
  }

  register(note) {
    this.notes.add(note);
    this.schedule();
  }

  unregister(note) {
    this.notes.delete(note);
    this.schedule();
  }

  schedule() {
    if (this._pending) {
      return;
    }
    this._pending = true;
    const run = () => {
      this._pending = false;
      this.update();
    };
    if (globalThis.requestAnimationFrame) {
      globalThis.requestAnimationFrame(run);
    } else {
      setTimeout(run, 0);
    }
  }

  /**
   * Number every footnote and draw one list per content area
   */
  update() {
    const ordered = [...this.notes]
      .filter((note) => note.isConnected)
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING
          ? -1
          : 1,
      );
    // group by where the list goes; a page normally has one group
    const groups = new Map();
    ordered.forEach((note) => {
      if (note.editing) {
        note.number = 0;
        return;
      }
      const place = footnotesPlacement(note);
      if (!groups.has(place.parent)) {
        groups.set(place.parent, { place: place, notes: [] });
      }
      groups.get(place.parent).notes.push(note);
    });
    const used = new Set();
    let count = 0;
    groups.forEach(({ place, notes }) => {
      notes.forEach((note) => {
        count++;
        note.number = count;
        if (!note.id || note.id.indexOf("a11y-footnote-ref-") === 0) {
          note.id = "a11y-footnote-ref-" + count;
        }
      });
      let list = [...place.parent.children].find(
        (child) => child.tagName === "A11Y-FOOTNOTES",
      );
      if (!list) {
        list = globalThis.document.createElement("a11y-footnotes");
        place.parent.insertBefore(list, place.before);
        this.lists.add(list);
      }
      // a new array so the list re-renders; numbering continues across
      // groups, so a second list starts where the first ended
      list.notes = [...notes];
      used.add(list);
    });
    // drop lists this manager drew that no longer have notes
    this.lists.forEach((list) => {
      if (!used.has(list)) {
        list.remove();
        this.lists.delete(list);
      }
    });
  }
}

export const A11yFootnotesManager =
  globalThis.A11yFootnotesManager || new A11yFootnotesManagerClass();
globalThis.A11yFootnotesManager = A11yFootnotesManager;
