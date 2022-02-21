import { LitElement, html, css } from "lit";

class CourseIntroLessonPlan extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      link: { type: String },
    };
  }
  constructor() {
    super();
    this.title = "";
    this.link = "";
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

        a:hover {
          background-color: #f5f5f5;
        }

        #container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-weight: 100;
          cursor: pointer;
          font-family: "Lato";
        }

        @media screen and (min-width: 320px) {
          #container {
            min-height: 40px;
          }
        }

        @media screen and (min-width: 620px) {
          #container {
            min-height: 60px;
          }
        }

        @media screen and (min-width: 920px) {
          #container {
            min-height: 80px;
          }
        }

        @media screen and (min-width: 320px) {
          #title {
            font-size: 20px;
            color: rgb(77, 87, 104);
          }
        }

        @media screen and (min-width: 620px) {
          #title {
            font-size: 24px;
          }
        }

        @media screen and (min-width: 920px) {
          #title {
            font-size: 26px;
          }
        }

        @media screen and (min-width: 1220px) {
          #title {
            font-size: 28px;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <a id="container" href="${this.link}">
        <div id="title">${this.title}</div>
      </a>
    `;
  }
  static get tag() {
    return "course-intro-lesson-plan";
  }
}
customElements.define(CourseIntroLessonPlan.tag, CourseIntroLessonPlan);
