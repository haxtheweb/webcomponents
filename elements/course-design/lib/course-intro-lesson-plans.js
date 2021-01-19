import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/dist/mobx.esm.js";
import "./course-intro-lesson-plan.js";

class CourseIntroLessonPlans extends LitElement {
  static get properties() {
    return {
      items: { type: Array },
    };
  }
  constructor() {
    super();
    this.items = [];
    this._disposer = autorun(() => {
      this._itemsChanged(toJS(store.routerManifest.items));
    });
  }
  _itemsChanged(items) {
    this.items = [];
    this.items = items.filter((i) => {
      return (
        typeof i.metadata !== "undefined" &&
        typeof i.metadata.courselist !== "undefined" &&
        typeof i.metadata.courselist.show !== "undefined" &&
        i.metadata.courselist.show === true
      );
    });
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        #title {
          color: white;
          font-family: "Lato";
          text-transform: uppercase;
          font-weight: 400;
          text-align: center;
          letter-spacing: 4.48px;
          font-size: 1.4em;
        }
        #plans-container {
          background: white;
          margin: 0 auto;
          max-width: 900px;
        }
      `,
    ];
  }
  render() {
    return html`
      <h2 id="title">Lesson Plan</h2>
      <div id="plans-container">
        ${this.items.map(
          (plan) =>
            html`<course-intro-lesson-plan
              title="${plan.title}"
              description=${plan.metadata.courselist.description
                ? plan.metadata.courselist.description
                : ""}
              link=${plan.slug}
            ></course-intro-lesson-plan>`
        )}
      </div>
    `;
  }
  static get tag() {
    return "course-intro-lesson-plans";
  }
}
customElements.define(CourseIntroLessonPlans.tag, CourseIntroLessonPlans);
