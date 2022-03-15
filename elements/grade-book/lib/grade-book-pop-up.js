import { html, LitElement } from "lit";
import { GradeBookStore } from "./grade-book-store.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import { autorun, toJS } from "mobx";
import { validURL, cleanVideoSource } from "@lrnwebcomponents/utils/utils.js";

class GradeBookPopUp extends I18NMixin(LitElement) {
  constructor() {
    super();
    this.t = {
      studentSubmission: "Student submission",
      openInNewWindow: "Open in new window",
      submitted: "Submitted",
    };
    autorun(() => {
      this.activeSubmission = toJS(GradeBookStore.activeSubmission);
    });
  }
  // forces an open root because this will render in a pop up that cannot use css from parent window :(
  createRenderRoot() {
    return this;
  }

  // weirdest way to do this award goes to...
  changeActive(e) {
    const tmp = e.target.value.split("-");
    switch (tmp[0]) {
      case "prev":
        GradeBookStore[`active${tmp[1]}`]--;
        break;
      case "next":
        GradeBookStore[`active${tmp[1]}`]++;
        break;
    }
  }
  render() {
    return html`
      <style>
        grade-book-pop-up .shortcut-btns {
          position: sticky;
          background-color: var(
            --simple-colors-default-theme-accent-12,
            #001333
          );
          color: var(--simple-colors-default-theme-accent-1, #e2ecff);
          height: 36px;
          vertical-align: middle;
          width: 100%;
          display: flex;
        }
        grade-book-pop-up .shortcut-btns button {
          background: transparent;
          margin: 0 10px;
          padding: 4px 8px;
          font-size: 12px;
          color: var(--simple-colors-default-theme-accent-1, #e2ecff);
          border: none;
          outline: 1px solid white;
          cursor: pointer;
        }
        .active-submission {
          overflow: hidden;
          /* 16:9 aspect ratio */
          padding-top: 56.25%;
          position: relative;
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
        <button @click="${this.changeActive}" value="prev-Student">
          Previous student
        </button>
        <button @click="${this.changeActive}" value="next-Student">
          Next student
        </button>
        <button @click="${this.changeActive}" value="prev-Assignment">
          Previous assignment
        </button>
        <button @click="${this.changeActive}" value="next-Assignment">
          Next assignment
        </button>
      </div>
      <div class="assignment-container">
        ${this.renderStudentSubmission(this.activeSubmission)}
      </div>
    `;
  }
  renderStudentSubmission(data) {
    let pre = html`<h3>${this.t.studentSubmission}</h3>
      ${this.t.submitted}
      <relative-time
        .datetime="${GradeBookStore.database.assignments[
          GradeBookStore.activeAssignment
        ]._ISODueDate}"
      ></relative-time> `;
    // test if this smells like a URL
    if (validURL(data)) {
      return html`${pre}<a
          href="${data}"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button>${this.t.openInNewWindow}</button></a
        >
        <div class="active-submission">
          <iframe
            width="560"
            height="315"
            loading="lazy"
            src="${cleanVideoSource(data)}"
            frameborder="0"
            allow="encrypted-media;"
            allowfullscreen
          ></iframe>
        </div>`;
    } else {
      // see if we can just present this as data
      import("@lrnwebcomponents/md-block/md-block.js");
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
customElements.define(GradeBookPopUp.tag, GradeBookPopUp);
export { GradeBookPopUp };
