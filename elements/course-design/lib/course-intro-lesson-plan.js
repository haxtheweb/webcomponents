import { html, css } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";

class CourseIntroLessonPlan extends DDD {
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
          color: light-dark(black, white);
          text-decoration: inherit;
        }
        a:focus,
        a:hover {
          background-color: var(--ddd-accent-2);
          color: black;
        }

        :host([is-safari]) a {
          color: black;
        }
        :host([is-safari]) a:focus,
        :host([is-safari]) a:hover {
          color: black;
        }

        #container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
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
          }
        }

        @media screen and (min-width: 620px) {
          #title {
            font-size: var(--ddd-font-size-s);
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
