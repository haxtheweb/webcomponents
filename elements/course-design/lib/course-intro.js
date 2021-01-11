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
          background: rgb(var(--course-intro-bg-color));
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
}
customElements.define(CourseIntro.tag, CourseIntro);
