import { LitElement, html, css } from "lit-element/lit-element.js";
import { I18NMixin } from "@lrnwebcomponents/i18n-manager/lib/I18NMixin.js";

class GradeBookStudentBlock extends I18NMixin(LitElement) {
  constructor() {
    super();

    this.student = {
      name: "sample student",
      userId: "abc123",
      email: "abc123@test.test",
      prefName: "sample student",
      accommodations: "gets extra time",
      photo:
        "https://oer.hax.psu.edu/bto108/sites/ist402/files/headshot61690.51500000205.jpg",
      interests: ["some", "interests"],
    };
    this.t = {
      profileImageFor: "Profile image for",
      userID: "User ID",
      preferredName: "Preferred name",
      emailAddress: "Email address",
      accommodations: "Accommodations",
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
        max-width: 80%;
        height: 150px;
        border-radius: 50%;
      }
      grid-plate {
        --grid-plate-col-transition: none;
        --grid-plate-item-margin: 0px;
        --grid-plate-item-padding: 4px;
      }
    `;
  }
  render() {
    return html`
      <grid-plate layout="1-2">
        <div slot="col-1" style="text-align:center;">
          <img
            src="${this.student.photo}"
            alt="${this.t.photoOf} ${this.student.prefName}"
          />
        </div>
        <div slot="col-2">
          <h2>${this.student.name}</h2>
          <ul>
            ${this.student.userId
              ? html`<li>${this.t.userID}:${this.student.userId}</li>`
              : ``}
            ${this.student.prefName
              ? html`<li>${this.t.preferredName}:${this.student.prefName}</li>`
              : ``}
            ${this.student.email
              ? html`<li>
                  <a href="mailto:${this.student.email}"
                    >${this.t.emailAddress}</a
                  >
                </li>`
              : ``}
            ${this.student.accommodations
              ? html`<li>
                  ${this.t.accommodations}:${this.student.accommodations}
                </li>`
              : ``}
            ${this.student.interests
              ? html`<li>
                  ${this.t.interests}:${this.student.interests.join(",")}
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
