/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";

/**
 * `course-design`
 * `some different elements specific to the design of educational materials. Lots of small elements and a catch all repo`
 * @demo demo/index.html
 * @element course-design
 */
class CourseDesign extends SchemaBehaviors(LitElement) {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  // Template return function
  render() {
    return html`
      ${this.courseIdentifier
        ? html`<meta property="oer:courseIdentifier" content="${this.courseIdentifier}" />`
        : ``}
      ${this.primaryInstructor
        ? html`<meta property="oer:primaryInstructor" content="${this.primaryInstructor}" />`
        : ``}
      ${this.termOffered
        ? html`<meta property="oer:termOffered" content="${this.termOffered}" />`
        : ``}
      ${this.syllabus
        ? html`<meta property="oer:syllabus" content="${this.syllabus}" />`
        : ``}
      ${this.deliveryFormat
        ? html`<meta property="oer:deliveryFormat" content="${this.deliveryFormat}" />`
        : ``}
      <slot></slot>`;
  }

  static get haxProperties() {
    return {
      canScale: true,
      canEditSource: true,
      gizmo: {
        title: "Course Design",
        description:
          "Container for educational materials and course design elements.",
        icon: "icons:school",
        color: "blue",
        tags: ["Instructional", "course", "design", "container"],
        handles: [],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "courseIdentifier",
            title: "Course Identifier",
            description:
              "OER Schema: the identifier of the course, e.g. MATH-100.",
            inputMethod: "textfield",
          },
          {
            property: "termOffered",
            title: "Term Offered",
            description:
              "OER Schema: the term during which the course is offered.",
            inputMethod: "textfield",
          },
          {
            property: "deliveryFormat",
            title: "Delivery Format",
            description:
              "OER Schema: the format used to deliver the course (e.g. in-person, online, hybrid).",
            inputMethod: "textfield",
          },
        ],
        advanced: [
          {
            property: "primaryInstructor",
            title: "Primary Instructor",
            description:
              "OER Schema: the primary instructor for the course.",
            inputMethod: "textfield",
          },
          {
            property: "syllabus",
            title: "Syllabus URL",
            description: "OER Schema: URL to the course syllabus.",
            inputMethod: "textfield",
          },
        ],
      },
    };
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      courseIdentifier: { type: String, attribute: "course-identifier" },
      primaryInstructor: { type: String, attribute: "primary-instructor" },
      termOffered: { type: String, attribute: "term-offered" },
      syllabus: { type: String },
      deliveryFormat: { type: String, attribute: "delivery-format" },
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "course-design";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.courseIdentifier = "";
    this.primaryInstructor = "";
    this.termOffered = "";
    this.syllabus = "";
    this.deliveryFormat = "";
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.setAttribute("typeof", "oer:Course");
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      /* notify example
      // notify
      if (propName == 'format') {
        this.dispatchEvent(
          new CustomEvent(`${propName}-changed`, {
            detail: {
              value: this[propName],
            }
          })
        );
      }
      */
      /* observer example
      if (propName == 'activeNode') {
        this._activeNodeChanged(this[propName], oldValue);
      }
      */
      /* computed example
      if (['id', 'selected'].includes(propName)) {
        this.__selectedChanged(this.selected, this.id);
      }
      */
    });
  }
}
globalThis.customElements.define(CourseDesign.tag, CourseDesign);
export { CourseDesign };
