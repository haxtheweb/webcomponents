/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { html, LitElement } from "lit";
import { GradeBookStore } from "./grade-book-store.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import { validURL, cleanVideoSource } from "@haxtheweb/utils/utils.js";

class GradeBookPopUp extends I18NMixin(LitElement) {
  constructor() {
    super();
    this.t = {
      studentSubmission: "Student submission",
      openInNewWindow: "Open in new window",
      submitted: "Submitted",
      previousStudent: "Previous student",
      nextStudent: "Next student",
      previousAssignment: "Previous assignment",
      nextAssignment: "Next assignment",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../locales/", import.meta.url).href,
    });
    autorun(() => {
      const _mobx_val_0 = toJS(GradeBookStore.activeSubmission);
      Promise.resolve().then(() => {
        this.activeSubmission = _mobx_val_0;
      });
    });
  }
  // forces an open root because this will render in a pop up that cannot use css from parent window :(
  createRenderRoot() {
    return this;
  }

  // weirdest way to do this award goes to...
  changeActive(e) {
    // currentTarget is the button even when the click lands on its icon
    // or words
    const tmp = (e.currentTarget || e.target).value.split("-");
    if (tmp[0] !== "prev" && tmp[0] !== "next") {
      return;
    }
    // bounds check against the underlying roster / assignments list so
    // the active indexes can never walk off either end of the data
    const list =
      tmp[1] === "Student"
        ? GradeBookStore.database && GradeBookStore.database.roster
        : GradeBookStore.database && GradeBookStore.database.assignments;
    if (!list || list.length === 0) {
      return;
    }
    const key = `active${tmp[1]}`;
    if (tmp[0] === "prev" && GradeBookStore[key] > 0) {
      GradeBookStore[key]--;
    } else if (tmp[0] === "next" && GradeBookStore[key] < list.length - 1) {
      GradeBookStore[key]++;
    }
  }
  render() {
    return html`
      <style>
        /* the pop-up window gets no page styles, so every value here
           carries its DDD fallback. Buttons follow the shared control
           states: icon and words, a visible edge, hover, a focus ring,
           and a held-down overlay with a 1px drop. */
        grade-book-pop-up .shortcut-btns {
          position: sticky;
          top: 0;
          background-color: var(
            --simple-colors-default-theme-accent-12,
            #001333
          );
          color: var(--simple-colors-default-theme-accent-1, #e2ecff);
          display: flex;
          flex-wrap: wrap;
          gap: var(--ddd-spacing-2, 8px);
          padding: var(--ddd-spacing-2, 8px);
        }
        grade-book-pop-up .gb-pop-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--ddd-spacing-1, 4px);
          box-sizing: border-box;
          min-height: var(--ddd-control-height-xs, 32px);
          margin: 0;
          padding: 0 var(--ddd-spacing-3, 12px);
          border: 1px solid currentColor;
          border-radius: var(--ddd-radius-xs, 4px);
          background: transparent;
          color: inherit;
          font-family: var(--ddd-font-navigation, sans-serif);
          font-size: 14px;
          text-decoration: none;
          cursor: pointer;
        }
        /* the pop-up is its own window: Lit elements such as simple-icon
           cannot share their stylesheets into it, so the icons are text
           glyphs (hidden from screen readers; the words name the action) */
        grade-book-pop-up .gb-pop-glyph {
          font-size: 16px;
          line-height: 1;
        }
        grade-book-pop-up .gb-pop-btn:hover {
          background-color: color-mix(in srgb, currentColor 12%, transparent);
        }
        grade-book-pop-up .gb-pop-btn:focus-visible {
          outline: 2px solid var(--ddd-theme-default-keystoneYellow, #ffd100);
          outline-offset: 2px;
        }
        grade-book-pop-up .gb-pop-btn:active {
          transform: translateY(1px);
          box-shadow: inset 0 0 0 999px rgba(128, 128, 128, 0.28);
        }
        /* the open link sits on the window body, not the dark bar */
        grade-book-pop-up .gb-pop-btn.gb-pop-link {
          margin-inline-start: var(--ddd-spacing-2, 8px);
          color: var(--ddd-theme-default-link, #005fa9);
        }
        grade-book-pop-up .gb-pop-btn.gb-pop-link:focus-visible {
          outline-color: var(--ddd-theme-default-link, #005fa9);
        }
        .active-submission {
          overflow: hidden;
          position: relative;
        }
        /* video / iframe submissions keep a 16:9 frame; markdown
           submissions flow at their natural height */
        .active-submission.video {
          aspect-ratio: var(--ddd-aspect-video, 16 / 9);
        }

        .active-submission iframe {
          border: 0;
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      </style>
      <div class="shortcut-btns">
        <button
          type="button"
          class="gb-pop-btn"
          @click="${this.changeActive}"
          value="prev-Student"
        >
          <span class="gb-pop-glyph" aria-hidden="true">↑</span>
          <span>${this.t.previousStudent}</span>
        </button>
        <button
          type="button"
          class="gb-pop-btn"
          @click="${this.changeActive}"
          value="next-Student"
        >
          <span class="gb-pop-glyph" aria-hidden="true">↓</span>
          <span>${this.t.nextStudent}</span>
        </button>
        <button
          type="button"
          class="gb-pop-btn"
          @click="${this.changeActive}"
          value="prev-Assignment"
        >
          <span class="gb-pop-glyph" aria-hidden="true">←</span>
          <span>${this.t.previousAssignment}</span>
        </button>
        <button
          type="button"
          class="gb-pop-btn"
          @click="${this.changeActive}"
          value="next-Assignment"
        >
          <span class="gb-pop-glyph" aria-hidden="true">→</span>
          <span>${this.t.nextAssignment}</span>
        </button>
      </div>
      <div class="assignment-container">
        ${this.renderStudentSubmission(this.activeSubmission)}
      </div>
    `;
  }
  renderStudentSubmission(data) {
    // the active assignment may not exist (empty or partial store data),
    // so the submitted / due date area has to be guarded
    const activeAssignmentData =
      GradeBookStore.database &&
      GradeBookStore.database.assignments &&
      GradeBookStore.database.assignments[GradeBookStore.activeAssignment];
    let pre = html`<h3>${this.t.studentSubmission}</h3>
      ${
        activeAssignmentData && activeAssignmentData._ISODueDate
          ? html`${this.t.submitted}
              <relative-time
                .datetime="${activeAssignmentData._ISODueDate}"
              ></relative-time> `
          : ``
      }`;
    // test if this smells like a URL
    if (validURL(data)) {
      // the link is the control (icon and words), not a button nested
      // inside a link
      return html`${pre}<a
          class="gb-pop-btn gb-pop-link"
          href="${data}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span class="gb-pop-glyph" aria-hidden="true">↗</span>
          <span>${this.t.openInNewWindow}</span></a
        >
        <div class="active-submission video">
          <iframe
            width="560"
            height="315"
            loading="lazy"
            src="${cleanVideoSource(data)}"
            frameborder="0"
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </div>`;
    } else {
      // see if we can just present this as data
      import("@haxtheweb/md-block/md-block.js");
      return html`${pre}
        <div class="active-submission">
          <md-block .markdown="${data}"></md-block>
        </div>`;
    }
  }
  static get tag() {
    return `grade-book-pop-up`;
  }
  static get properties() {
    return {
      ...super.properties,
      activeSubmission: { type: String },
      data: { type: String },
    };
  }
}
globalThis.customElements.define(GradeBookPopUp.tag, GradeBookPopUp);
export { GradeBookPopUp };
