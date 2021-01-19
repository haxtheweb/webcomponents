import { LitElement, html, css } from "lit-element/lit-element.js";
import "./course-intro-header.js";
import "./course-intro-lesson-plans.js";

class CourseIntro extends LitElement {
  static get tag() {
    return "course-intro";
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
          min-height: 100vh;
          padding-bottom: 30vh;
          background-color: rgba(var(--course-intro-bg-color), 1);
        }
      `,
    ];
  }
  constructor() {
    super();
    // Add the included Lato font-family
    let link = document.createElement("link");
    link.setAttribute(
      "href",
      "https://fonts.googleapis.com/css2?family=Lato:wght@300&display=swap"
    );
    link.setAttribute("rel", "stylesheet");
    document.head.appendChild(link);
  }
  render() {
    return html`
      <course-intro-header></course-intro-header>
      <course-intro-lesson-plans></course-intro-lesson-plans>
    `;
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Lesson plan",
        description: "Display a listing of top page headings",
        icon: "editor:format-list-bulleted",
        color: "blue",
        meta: {
          author: "LRNWebComponents",
        },
      },
      settings: {
        configure: [],
        advanced: [],
      },
    };
  }
}
customElements.define(CourseIntro.tag, CourseIntro);
