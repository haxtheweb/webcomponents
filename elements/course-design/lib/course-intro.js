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
          --course-intro-bg-color: 0, 0, 0;
          display: block;
          min-height: 100vh;
          padding-bottom: 30vh;
        }
      `,
    ];
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
