import { LitElement, html, css } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { studentDisplayName } from "./GradeBookHelpers.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
class GradeBookStudentBlock extends I18NMixin(LitElement) {
  constructor() {
    super();

    this.student = {};
    this.t = {
      profileImageFor: "Profile image for",
      userID: "User ID",
      preferredName: "Preferred name",
      emailAddress: "Email this student",
      notes: "Notes",
      interests: "Interests",
    };
    this.registerLocalization({
      context: this,
      namespace: "grade-book",
    });
  }
  static get properties() {
    return {
      student: { type: Object },
    };
  }
  static get styles() {
    return css`
      :host {
        display: block;
      }
      img {
        max-width: 150px;
        height: 150px;
        border-radius: 50%;
      }
      grid-plate {
        --grid-plate-col-transition: none;
        --grid-plate-item-margin: 0px;
        --grid-plate-item-padding: 4px;
      }
      simple-icon-lite {
        --simple-icon-height: 150px;
        --simple-icon-width: 150px;
      }
      h2 {
        color: light-dark(
          var(--ddd-theme-default-nittanyNavy),
          var(--ddd-theme-default-white)
        );
      }
      a {
        color: light-dark(
          var(--ddd-theme-default-link),
          var(--ddd-theme-default-linkLight)
        );
      }
    `;
  }
  // name and id from either data shape: { name, userId } or the roster
  // row shape { student, surname, id } the gradebook passes in
  get studentName() {
    return studentDisplayName(this.student);
  }
  get studentId() {
    const s = this.student || {};
    return s.userId || s.id || "";
  }
  render() {
    return html`
      <grid-plate layout="1-2" disable-responsive>
        <div slot="col-1" style="text-align:center;">
          ${this.student.photo
            ? html`
                <img
                  src="${this.student.photo}"
                  alt="${this.t.profileImageFor} ${this.student.prefName ||
                  this.studentName}"
                />
              `
            : html`
                <simple-icon-lite
                  icon="account-circle"
                  aria-hidden="true"
                ></simple-icon-lite>
              `}
        </div>
        <div slot="col-2">
          <h2>${this.studentName}</h2>
          <ul>
            ${this.studentId
              ? html`<li>${this.t.userID}: ${this.studentId}</li>`
              : ``}
            ${this.student.prefName
              ? html`<li>${this.t.preferredName}: ${this.student.prefName}</li>`
              : ``}
            ${this.student.email
              ? html`<li>
                  <a href="mailto:${this.student.email}"
                    >${this.t.emailAddress}</a
                  >
                </li>`
              : ``}
            ${this.student.notes
              ? html`<li>${this.t.notes}: ${this.student.notes}</li>`
              : ``}
            ${this.student.interests
              ? html`<li>
                  ${this.t.interests}: ${this.student.interests.join(",")}
                </li>`
              : ``}
          </ul>
        </div>
      </grid-plate>
    `;
  }
  static get tag() {
    return "grade-book-student-block";
  }
}
globalThis.customElements.define(
  GradeBookStudentBlock.tag,
  GradeBookStudentBlock,
);
export { GradeBookStudentBlock };
