import { LitElement, html, css } from "lit";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
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
    `;
  }
  render() {
    return html`
      <grid-plate layout="1-2" disable-responsive>
        <div slot="col-1" style="text-align:center;">
          ${this.student.photo
            ? html`
                <img
                  src="${this.student.photo}"
                  alt="${this.t.photoOf} ${this.student.prefName}"
                />
              `
            : html`
                <simple-icon-lite icon="account-circle"></simple-icon-lite>
              `}
        </div>
        <div slot="col-2">
          <h2>${this.student.name}</h2>
          <ul>
            ${this.student.userId
              ? html`<li>${this.t.userID}: ${this.student.userId}</li>`
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
customElements.define(GradeBookStudentBlock.tag, GradeBookStudentBlock);
export { GradeBookStudentBlock };
