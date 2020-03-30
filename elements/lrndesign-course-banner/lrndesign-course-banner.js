import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `lrndesign-course-banner`
 * @element lrndesign-course-banner
 * @demo demo/index.html
 */
class LrndesignCourseBanner extends PolymerElement {
  constructor() {
    super();
    import("@polymer/iron-image/iron-image.js");
    import("@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js");
  }
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        /**
       * Dialog
       */
        .course-image {
        }
        .course-heading {
          position: relative;
          background-color: rgba(30, 30, 30, 0.8);
          text-align: left;
          margin: -5em 0 0 0;
          padding: 16px;
          color: #ffffff;
          height: 64px;
        }
        .course-avatar {
          float: left;
          display: inline-flex;
          padding: 0 16px 0 0;
        }
        .course-name {
          font-size: 16px;
          line-height: 16px;
          min-width: 96px;
        }
        .course-title {
          font-size: 16px;
          line-height: 16px;
          display: none;
        }
        .name-wrapper {
          display: flow-root;
          overflow: hidden;
          text-overflow: clip;
        }
        @media screen and (min-width: 420px) {
          .course-name {
            font-size: 24px;
          }
          .course-title {
            display: block;
          }
        }
      </style>
      <iron-image
        class="course-image"
        style="width:100%; height:200px; background-color: lightgray;"
        sizing="cover"
        preload=""
        fade=""
        src\$="[[image]]"
      ></iron-image>
      <div class="course-heading">
        <lrndesign-avatar
          class="course-avatar"
          label="[[name]]"
          jdenticon=""
          color="[[color]]"
        >
        </lrndesign-avatar>
        <div class="name-wrapper">
          <div class="course-name">[[name]]</div>
          <div class="course-title">[[title]]</div>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "lrndesign-course-banner";
  }

  static get properties() {
    return {
      /**
       * Text representation of the color like red or blue
       */
      color: {
        type: String
      },
      /**
       * Banner image
       */
      image: {
        type: String
      },
      /**
       * Name of the course
       */
      name: {
        type: String
      },
      /**
       * Title of the course, longer description.
       */
      title: {
        type: String
      }
    };
  }
}
window.customElements.define(LrndesignCourseBanner.tag, LrndesignCourseBanner);
export { LrndesignCourseBanner };
