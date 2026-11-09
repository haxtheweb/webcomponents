import { html, css, unsafeCSS } from "lit";
import { autorun, toJS } from "mobx";
import {
  store,
  HAXcmsStore,
} from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { encapScript } from "@haxtheweb/utils/lib/safe-html.js";
import { neutralizeStrayScripts } from "@haxtheweb/utils/lib/sanitize.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-tooltip/simple-tooltip.js";
import { HAXCMSI18NMixin } from "./HAXCMSI18NMixin.js";

/**
 * Lesson view: read a lesson page by page (how HAXcms works today) or as one
 * page, with the lesson's sub-pages stacked below the lesson page.
 *
 * A "lesson" is the lowest level of the outline with pages under it (a page
 * whose children have no children), so a unit is never stacked. In
 * whole-lesson view the site moves to the lesson page and the mixin adds its
 * pages, in outline order, after the lesson page's own content.
 * Each added page opens with a heading ("Page 2 of 8" + its title) and its
 * own headings move down one level. Previous / next scroll between those
 * pages, and next from the last page goes on to whatever follows the lesson.
 *
 * Whole-lesson view is for readers. While someone is logged in (the editor
 * top bar is showing) or editing, the button is greyed out, nothing is
 * stacked and pages are edited one at a time. A view-only session reports
 * isLoggedIn false, so previewing a site as a student gets the button.
 *
 * Stacked pages are light DOM children of the theme, marked with
 * data-lesson-view, so the theme's reading styles apply to them. They are
 * removed on every page change, whenever someone logs in or edits, and when
 * the view goes back to page by page. The site builder's own insert of the
 * active page and the editor's copy of it are never touched.
 *
 * Themes opt in: apply the mixin outside PrintBranchMixin (so "Print page"
 * prints the lesson in whole-lesson view) and render LessonViewButton()
 * where their page tools live.
 */

// a reader's choice, kept for every HAX site they visit, like dark mode
const STORAGE_KEY = "haxcms-lesson-view";
// how far below the top of the viewport a page heading counts as "the page
// being read" when previous / next decide where to go
const READING_LINE = 96;
// tag names are only ever passed in by theme code, never by content
const SAFE_TAG = /^[a-z][a-z0-9]*(-[a-z0-9]+)+$/;

function isStackable(item) {
  if (!item) {
    return false;
  }
  const meta = item.metadata || {};
  // unpublished pages stay out; link pages only redirect, they have no body
  return meta.published !== false && !meta.linkUrl;
}

function stackableChildren(items, parentId) {
  return items
    .filter((item) => item.parent === parentId && isStackable(item))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * A lesson is the lowest level of the outline with pages under it: a page
 * whose children have no children of their own. A unit (whose children are
 * lessons with pages) is not a lesson, so whole-lesson view never stacks a
 * whole unit.
 */
function isLessonRoot(items, id) {
  const children = stackableChildren(items, id);
  if (children.length === 0) {
    return false;
  }
  return !children.some(
    (child) => stackableChildren(items, child.id).length > 0,
  );
}

/**
 * The lesson the active page belongs to: the page itself when it is a
 * lesson, otherwise its parent when that is one. null when the page is not
 * part of a lesson.
 */
export function lessonRootId(items, activeId) {
  if (!Array.isArray(items) || !activeId) {
    return null;
  }
  const active = items.find((item) => item.id === activeId);
  if (!active) {
    return null;
  }
  if (isLessonRoot(items, active.id)) {
    return active.id;
  }
  if (active.parent && isLessonRoot(items, active.parent)) {
    return active.parent;
  }
  return null;
}

/**
 * The lesson page followed by its pages in outline order.
 */
export function lessonPages(items, rootId) {
  if (!Array.isArray(items) || !rootId) {
    return [];
  }
  const root = items.find((item) => item.id === rootId);
  if (!root) {
    return [];
  }
  return [root, ...stackableChildren(items, root.id)];
}

/**
 * Move every h1-h5 in a fragment down one level (h6 stays h6), so a page's
 * own headings sit under the page title it is stacked beneath.
 */
export function demoteHeadings(fragment) {
  if (!fragment || !fragment.querySelectorAll) {
    return fragment;
  }
  const doc = globalThis.document;
  fragment.querySelectorAll("h1, h2, h3, h4, h5").forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1), 10);
    const next = doc.createElement("h" + (level + 1));
    for (let i = 0; i < heading.attributes.length; i++) {
      next.setAttribute(
        heading.attributes[i].name,
        heading.attributes[i].value,
      );
    }
    while (heading.firstChild) {
      next.appendChild(heading.firstChild);
    }
    heading.replaceWith(next);
  });
  return fragment;
}

/**
 * Document-level styles for the page headings added in whole-lesson view.
 * The mixin adds these to the theme's global stylesheet itself.
 * @param {string} tag the theme's custom element name, ex: "clean-one"
 */
export function lessonViewStyles(tag) {
  if (!SAFE_TAG.test(tag)) {
    return css``;
  }
  const t = unsafeCSS(tag);
  return css`
    ${t} > hgroup[data-lesson-view-marker] {
      max-width: var(--ddd-theme-measure, var(--ddd-content-width-sm));
      box-sizing: border-box;
      margin-inline: auto;
      margin-block: var(--ddd-spacing-16) var(--ddd-spacing-6);
      padding-block-start: var(--ddd-spacing-8);
      border-block-start: var(--ddd-border-sm);
      border-block-start-color: light-dark(
        var(--ddd-theme-default-limestoneLight),
        var(--ddd-theme-default-slateGray)
      );
      scroll-margin-block-start: var(--ddd-spacing-4);
    }
    ${t} > hgroup[data-lesson-view-marker] > h2 {
      margin: 0;
      max-width: none;
      font-size: var(--ddd-font-size-ml);
      line-height: var(--ddd-lh-120);
    }
    /* the heading takes focus when previous / next or the menu move to its
       page, so screen readers land on it; it is not a control, so no ring */
    ${t} > hgroup[data-lesson-view-marker] > h2:focus {
      outline: none;
    }
  `;
}

export const LessonViewMixin = function (SuperClass) {
  return class extends HAXCMSI18NMixin(SuperClass) {
    static get properties() {
      return {
        ...super.properties,
        /**
         * "page" (one page at a time) or "whole" (the lesson on one page)
         */
        lessonView: { type: String, attribute: "lesson-view", reflect: true },
        __lessonViewRoot: { type: String },
        __lessonViewAllowed: { type: Boolean },
      };
    }

    static get styles() {
      let styles = [];
      if (super.styles) {
        styles = super.styles;
      }
      return [
        styles,
        css`
          .lesson-view-btn simple-icon-button-lite[aria-disabled="true"] {
            opacity: var(--ddd-state-disabled-opacity, 0.5);
            cursor: not-allowed;
          }
        `,
      ];
    }

    constructor() {
      super();
      this.t.showWholeLesson = "Show the whole lesson on one page";
      this.t.showOnePage = "Show one page at a time";
      this.t.wholeLessonForReaders =
        "Whole lesson view is for readers. Edit one page at a time.";
      this.t.lessonPageOf = "Page {current} of {total}";
      this.lessonView = "page";
      this.__lessonViewRoot = null;
      this.__lessonViewAllowed = false;
      // the page to scroll to once the lesson is on screen
      this.__lessonViewTarget = null;
      // bumped whenever stacked pages are cleared, so a slow render of an
      // older page never lands on a newer one
      this.__lessonViewToken = 0;
      this.__lessonViewDisposers = [];
      this.__lessonViewBodyChanged = this.__lessonViewBodyChanged.bind(this);
      this.__lessonViewNavClick = this.__lessonViewNavClick.bind(this);
      try {
        if (globalThis.localStorage.getItem(STORAGE_KEY) === "whole") {
          this.lessonView = "whole";
        }
      } catch {
        // storage unavailable: page by page
      }
    }

    connectedCallback() {
      super.connectedCallback();
      globalThis.addEventListener(
        "json-outline-schema-active-body-changed",
        this.__lessonViewBodyChanged,
      );
      // readers only: logged in or editing turns the view off
      this.__lessonViewDisposers.push(
        autorun(() => {
          const allowed = !store.isLoggedIn && !toJS(store.editMode);
          this.__lessonViewAllowed = allowed;
          if (!allowed) {
            this._lessonViewClear();
          }
        }),
      );
      // which lesson the active page belongs to
      this.__lessonViewDisposers.push(
        autorun(() => {
          const activeId = toJS(store.activeId);
          const manifest = toJS(store.manifest);
          const items = manifest && manifest.items ? manifest.items : [];
          this.__lessonViewRoot = lessonRootId(items, activeId);
          // the builder wipes the theme's children on every page change, so
          // anything stacked is gone; move to the lesson page if needed
          this._lessonViewSync(false);
        }),
      );
    }

    disconnectedCallback() {
      globalThis.removeEventListener(
        "json-outline-schema-active-body-changed",
        this.__lessonViewBodyChanged,
      );
      for (let i = 0; i < this.__lessonViewDisposers.length; i++) {
        this.__lessonViewDisposers[i]();
      }
      this.__lessonViewDisposers = [];
      this._lessonViewClear();
      if (this.shadowRoot) {
        this.shadowRoot.removeEventListener(
          "click",
          this.__lessonViewNavClick,
          true,
        );
      }
      super.disconnectedCallback();
    }

    firstUpdated(changedProperties) {
      if (super.firstUpdated) {
        super.firstUpdated(changedProperties);
      }
      // capture, so previous / next can scroll within the lesson before the
      // router sees the click
      this.shadowRoot.addEventListener(
        "click",
        this.__lessonViewNavClick,
        true,
      );
    }

    /**
     * True when the lesson is shown on one page right now.
     */
    lessonViewActive() {
      return (
        this.lessonView === "whole" &&
        this.__lessonViewAllowed &&
        !!this.__lessonViewRoot
      );
    }

    /**
     * PrintBranchMixin prints this page and everything under it; in
     * whole-lesson view that is the lesson.
     */
    printBranchRootId() {
      if (this.lessonViewActive()) {
        return this.__lessonViewRoot;
      }
      if (super.printBranchRootId) {
        return super.printBranchRootId();
      }
      return toJS(store.activeId);
    }

    LessonViewButton(position = "auto") {
      if (!this.__lessonViewRoot) {
        return html``;
      }
      const allowed = this.__lessonViewAllowed;
      const whole = allowed && this.lessonView === "whole";
      let label = whole ? this.t.showOnePage : this.t.showWholeLesson;
      if (!allowed) {
        label = this.t.wholeLessonForReaders;
      }
      return html`
        <div
          class="lesson-view-btn"
          part="${this.editMode ? `edit-mode-active` : ``}"
        >
          <simple-icon-button-lite
            part="lesson-view-btn"
            class="btn"
            id="lesson-view-btn"
            icon="${whole ? `icons:description` : `icons:view-agenda`}"
            label="${label}"
            aria-disabled="${allowed ? `false` : `true`}"
            @click="${this.toggleLessonView}"
            icon-position="top"
          ></simple-icon-button-lite>
          <simple-tooltip for="lesson-view-btn" position="${position}">
            ${label}
          </simple-tooltip>
        </div>
      `;
    }

    /**
     * Switch between page by page and the whole lesson. Greyed out (and a
     * no-op) for anyone logged in.
     */
    toggleLessonView() {
      if (!this.__lessonViewAllowed || !this.__lessonViewRoot) {
        return;
      }
      const next = this.lessonView === "whole" ? "page" : "whole";
      try {
        globalThis.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // storage unavailable: the choice lasts for this visit
      }
      if (next === "whole") {
        // open the lesson where the reader is
        this.__lessonViewTarget = toJS(store.activeId);
        this.lessonView = next;
        this._lessonViewSync(true);
      } else {
        // go back to the page that was being read
        const reading = this._lessonViewReadingIndex();
        const markers = this._lessonViewMarkers();
        const pageId =
          reading >= 0 && markers[reading]
            ? markers[reading].getAttribute("data-lesson-view-marker")
            : null;
        this.lessonView = next;
        this._lessonViewClear();
        if (pageId) {
          this._lessonViewGo(pageId, false);
        }
      }
    }

    __lessonViewBodyChanged() {
      // the builder just put the active page in; stack the lesson after it
      this._lessonViewSync(true);
    }

    /**
     * Bring the screen in line with the current view.
     * @param {boolean} contentReady the active page's content is in place
     */
    _lessonViewSync(contentReady) {
      if (!this.lessonViewActive()) {
        this._lessonViewClear();
        return;
      }
      const activeId = toJS(store.activeId);
      if (activeId !== this.__lessonViewRoot) {
        // a page inside the lesson: show the lesson, scrolled to that page
        this.__lessonViewTarget = activeId;
        this._lessonViewGo(this.__lessonViewRoot, true);
        return;
      }
      if (contentReady) {
        this._lessonViewRender();
      }
    }

    /**
     * Navigate the way the rest of HAXcms does. replace keeps a page that
     * only redirects to its lesson out of the back button's history.
     */
    _lessonViewGo(itemId, replace) {
      const item = store.findItem(itemId);
      if (!item || !item.slug) {
        return;
      }
      if (replace) {
        globalThis.history.replaceState({}, "", item.slug);
      } else {
        globalThis.history.pushState({}, "", item.slug);
      }
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
    }

    _lessonViewMarkers() {
      return Array.from(
        this.querySelectorAll(":scope > hgroup[data-lesson-view-marker]"),
      );
    }

    /**
     * Index of the stacked page being read, -1 while still on the lesson
     * page's own content.
     */
    _lessonViewReadingIndex() {
      const markers = this._lessonViewMarkers();
      let current = -1;
      for (let i = 0; i < markers.length; i++) {
        if (markers[i].getBoundingClientRect().top <= READING_LINE) {
          current = i;
        }
      }
      return current;
    }

    /**
     * Remove every stacked page. Leaves the builder's own content alone.
     */
    _lessonViewClear() {
      this.__lessonViewToken++;
      this.querySelectorAll(":scope > [data-lesson-view]").forEach((node) => {
        node.remove();
      });
    }

    async _lessonViewRender() {
      this._lessonViewClear();
      const token = this.__lessonViewToken;
      const rootId = this.__lessonViewRoot;
      const manifest = toJS(store.manifest);
      const pages = lessonPages(
        manifest && manifest.items ? manifest.items : [],
        rootId,
      ).slice(1);
      if (pages.length === 0) {
        return;
      }
      const bodies = await Promise.all(
        pages.map((page) => store.loadItemContent(page.id)),
      );
      // a page change, a login or a newer render happened while loading
      if (
        token !== this.__lessonViewToken ||
        !this.lessonViewActive() ||
        toJS(store.activeId) !== rootId
      ) {
        return;
      }
      const doc = globalThis.document;
      const builder =
        HAXcmsStore.storePieces && HAXcmsStore.storePieces.siteBuilder
          ? HAXcmsStore.storePieces.siteBuilder
          : null;
      const total = pages.length + 1;
      const out = doc.createDocumentFragment();
      pages.forEach((page, i) => {
        const marker = doc.createElement("hgroup");
        marker.setAttribute("data-lesson-view", page.id);
        marker.setAttribute("data-lesson-view-marker", page.id);
        const eyebrow = doc.createElement("p");
        eyebrow.setAttribute("data-eyebrow", "");
        eyebrow.textContent = this.t.lessonPageOf
          .replace("{current}", String(i + 2))
          .replace("{total}", String(total));
        const heading = doc.createElement("h2");
        heading.setAttribute("tabindex", "-1");
        heading.textContent = page.title;
        marker.appendChild(eyebrow);
        marker.appendChild(heading);
        out.appendChild(marker);
        // the same pipeline the site builder runs on the active page
        let body = encapScript(bodies[i] || "");
        if (builder && builder.replaceTagReplacement) {
          body = builder.replaceTagReplacement(body);
        }
        const frag = doc.createRange().createContextualFragment(body);
        neutralizeStrayScripts(frag);
        demoteHeadings(frag);
        Array.from(frag.childNodes).forEach((node) => {
          if (node.nodeType === 1) {
            node.setAttribute("data-lesson-view", page.id);
            out.appendChild(node);
          } else if (node.nodeType === 3 && node.textContent.trim() !== "") {
            const p = doc.createElement("p");
            p.setAttribute("data-lesson-view", page.id);
            p.appendChild(node);
            out.appendChild(p);
          }
        });
      });
      this.appendChild(out);
      const target = this.__lessonViewTarget;
      this.__lessonViewTarget = null;
      if (target && target !== rootId) {
        const marker = this._lessonViewMarkers().find(
          (m) => m.getAttribute("data-lesson-view-marker") === target,
        );
        if (marker) {
          this._lessonViewScrollTo(marker);
        }
      }
    }

    _lessonViewScrollTo(el) {
      let smooth = true;
      try {
        smooth = !globalThis.matchMedia("(prefers-reduced-motion: reduce)")
          .matches;
      } catch {
        smooth = false;
      }
      el.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
      });
      const heading = el.querySelector("h2") || el;
      if (heading.focus) {
        heading.focus({ preventScroll: true });
      }
    }

    /**
     * Previous / next in whole-lesson view move between the stacked pages.
     * Next from the last page goes to whatever follows the lesson; previous
     * from the lesson page's own content leaves the default (the page before
     * the lesson).
     */
    __lessonViewNavClick(e) {
      if (
        !this.lessonViewActive() ||
        toJS(store.activeId) !== this.__lessonViewRoot
      ) {
        return;
      }
      const path = e.composedPath ? e.composedPath() : [];
      let button = null;
      for (let i = 0; i < path.length; i++) {
        if (path[i] === this) {
          break;
        }
        if (path[i].tagName === "SITE-MENU-BUTTON") {
          button = path[i];
          break;
        }
      }
      if (!button || button.disabled) {
        return;
      }
      const type = button.type || button.getAttribute("type");
      const markers = this._lessonViewMarkers();
      if (markers.length === 0) {
        return;
      }
      const reading = this._lessonViewReadingIndex();
      if (type === "next") {
        e.preventDefault();
        e.stopPropagation();
        if (markers[reading + 1]) {
          this._lessonViewScrollTo(markers[reading + 1]);
        } else {
          this._lessonViewGoAfterLesson();
        }
      } else if (type === "prev" && reading >= 0) {
        e.preventDefault();
        e.stopPropagation();
        if (reading > 0) {
          this._lessonViewScrollTo(markers[reading - 1]);
        } else {
          const top =
            this.shadowRoot.querySelector("site-active-title") ||
            this.shadowRoot.querySelector("#haxcms-theme-top");
          if (top) {
            this._lessonViewScrollTo(top);
          }
        }
      }
    }

    /**
     * The page after the lesson's last page in the site's reading order.
     */
    _lessonViewGoAfterLesson() {
      const manifest = toJS(store.manifest);
      const items = manifest && manifest.items ? manifest.items : [];
      const pages = lessonPages(items, this.__lessonViewRoot);
      const inLesson = new Set(pages.map((page) => page.id));
      const router = toJS(store.routerManifest);
      const order = router && router.items ? router.items : items;
      const last = pages[pages.length - 1];
      let index = -1;
      for (let i = 0; i < order.length; i++) {
        if (last && order[i].id === last.id) {
          index = i;
        }
      }
      for (let i = index + 1; i > 0 && i < order.length; i++) {
        if (!inLesson.has(order[i].id)) {
          // when that page is part of a lesson too, the view stays whole
          // and shows that lesson
          this._lessonViewGo(order[i].id, false);
          return;
        }
      }
    }

    HAXCMSGlobalStyleSheetContent() {
      const base = super.HAXCMSGlobalStyleSheetContent
        ? super.HAXCMSGlobalStyleSheetContent()
        : [];
      return [...base, lessonViewStyles(this.localName)];
    }
  };
};
