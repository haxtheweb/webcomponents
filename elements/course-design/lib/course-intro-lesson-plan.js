import { LitElement, html, css } from "lit-element/lit-element.js";

class CourseIntroLessonPlan extends LitElement {
  static get properties() {
    return {
      position: { type: String },
      title: { type: String },
      description: { type: String },
      link: { type: String },
    };
  }
  constructor() {
    super();
    this.position = "";
    this.title = "";
    this.description = "";
    this.link = "";
  }
  shouldUpdate(properties) {
    if (this.description === null) {
      return false;
    }
    return true;
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        a {
          color: inherit;
          text-decoration: inherit;
        }
        #container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        #position {
          font-size: 48px;
          font-family: "Lato";
          color: rgba(77, 87, 104, 0.4);
          font-weight: 100;
        }
        #title {
          font-family: "Lato";
          color: rgb(77, 87, 104);
        }
        #description {
          color: rgba(77, 87, 104, 0.6);
          font-size: 16px;
        }
        @media screen and (min-width: 550px) {
          #container {
            flex-direction: row;
          }
          #left {
            width: 150px;
          }
          #right {
            flex: 1 1 auto;
            text-align: left;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <a id="container" href="${this.link}">
        <div id="left">
          <div id="position">${this.position}</div>
        </div>
        <div id="right">
          <div id="title">${this.title}</div>
          <div id="description">${this.description}</div>
        </div>
      </a>
    `;
  }
  static get tag() {
    return "course-intro-lesson-plan";
  }
}
customElements.define(CourseIntroLessonPlan.tag, CourseIntroLessonPlan);
