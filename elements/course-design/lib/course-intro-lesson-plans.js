import { LitElement, html, css } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
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
      return i.slug !== "introduction" && i.parent === null;
    });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          background-color: var(
            --course-intro-header--header--background-color,
            #1e1e1e
          );
          padding-bottom: 40px;
          min-height: 60vh;
        }

        @media screen and (min-width: 320px) {
          #plans-container {
            background: white;
            margin: 0 auto;
            max-width: 400px;
          }
        }

        @media screen and (min-width: 620px) {
          #plans-container {
            max-width: 500px;
          }
        }

        @media screen and (min-width: 920px) {
          #plans-container {
            max-width: 700px;
          }
        }

        @media screen and (min-width: 1220px) {
          #plans-container {
            max-width: 900px;
          }
        }
      `,
    ];
  }
  render() {
    return html`
      <div id="plans-container">
        ${this.items.map(
          (plan) =>
            html`<course-intro-lesson-plan
              title="${plan.title}"
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
