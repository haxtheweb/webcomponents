import { html, css, LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { autorun, toJS } from "mobx";
import "./course-intro-header.js";
import "./course-intro-lesson-plans.js";
//import "./course-intro-footer.js";

export class CourseIntro extends LitElement {
  static get tag() {
    return "course-intro";
  }
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
        }
        course-intro-footer {
          display: flex;
          justify-content: space-between;
          background: #000;
          padding: var(--ddd-spacing-6);
          min-height: 300px;
          align-items: center;
        }
      `,
    ];
  }
  static get properties() {
    return {
      color: { type: String },
    };
  }
  constructor() {
    super();
    this.color = "";
    autorun(() => {
      const manifest = toJS(store.manifest);
      if (
        manifest &&
        manifest.metadata &&
        manifest.metadata.theme &&
        manifest.metadata.theme.variables
      ) {
        this.color = manifest.metadata.theme.variables.hexCode;
      }
    });
  }
  render() {
    return html`
      <course-intro-header part="course-intro-header">
        <div slot="header-left">
          <slot name="header-left"></slot>
        </div>
        <div slot="outline-title">
          <slot name="outline-title"></slot>
        </div>
      </course-intro-header>
      <course-intro-lesson-plans
        part="course-intro-lesson-plans"
      ></course-intro-lesson-plans>
      <course-intro-footer
        part="course-intro-footer"
        style="border-top: 3px solid ${this.color};"
      >
        <div slot="footer-left">
          <slot name="footer-left"></slot>
        </div>
        <div slot="footer-right">
          <slot name="footer-right"></slot>
        </div>
      </course-intro-footer>
    `;
  }
}
customElements.define(CourseIntro.tag, CourseIntro);
