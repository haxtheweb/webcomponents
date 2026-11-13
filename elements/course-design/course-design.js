/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
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
    return html` ${
        this.courseIdentifier
          ? html`<meta
              property="oer:courseIdentifier"
              content="${this.courseIdentifier}"
            />`
          : ``
      }
      ${
        this.primaryInstructor
          ? html`<meta
              property="oer:primaryInstructor"
              content="${this.primaryInstructor}"
            />`
          : ``
      }
      ${
        this.termOffered
          ? html`<meta
              property="oer:termOffered"
              content="${this.termOffered}"
            />`
          : ``
      }
      ${
        this.syllabus
          ? html`<meta property="oer:syllabus" content="${this.syllabus}" />`
          : ``
      }
      ${
        this.deliveryFormat
          ? html`<meta
              property="oer:deliveryFormat"
              content="${this.deliveryFormat}"
            />`
          : ``
      }
      <slot></slot>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * OER Schema type. Reflected (rather than set in firstUpdated) so it is
       * also in server rendered HTML.
       */
      typeof: { type: String, reflect: true },
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
    this.typeof = "oer:Course";
    this.courseIdentifier = "";
    this.primaryInstructor = "";
    this.termOffered = "";
    this.syllabus = "";
    this.deliveryFormat = "";
  }
}
globalThis.customElements.define(CourseDesign.tag, CourseDesign);
export { CourseDesign };
