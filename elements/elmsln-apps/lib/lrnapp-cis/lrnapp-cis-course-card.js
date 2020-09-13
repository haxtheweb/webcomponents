import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-image/iron-image.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
/*
 `lrnapp-cis-course-card`
 Present a course card
*/
class LrnappCisCourseCard extends PolymerElement {
  static get template() {
    return html`
      <style include="materializecss-styles">
        :host {
          display: inline-flex;
        }
        :host([size="micro"]) {
          transform: scale(0.5);
        }
        :host([size="small"]) {
          transform: scale(0.8);
        }
        paper-card {
          border-radius: 4px;
          margin: 0;
          width: 100%;
        }
        .card-actions {
          background-color: #f5f5f5;
          border-radius: 0 0 4px 4px;
          padding: 0 8px;
        }
        .card-actions .card-action-details {
          display: inline-block;
          vertical-align: middle;
          vertical-align: -webkit-baseline-middle;
          width: 80%;
        }
        .card-control-height {
          height: 240px;
        }
        [elevation="0"] {
          border: solid 1px #eeeeee;
        }
        .text-right {
          text-align: right;
        }
        .text-left {
          text-align: left;
        }
        .name,
        .title {
          color: #222;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          padding: 0 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 8px;
        }
        .title {
          font-size: 12px;
          font-weight: 400;
        }
        .divider {
          height: 1px;
          width: 100%;
          background: #efefef;
        }
        .course-icon {
          --iron-icon-height: 100%;
          --iron-icon-width: 100%;
          overflow: hidden;
          color: grey;
        }
        .course-icon:hover,
        .course-icon:focus {
          color: black;
        }
        .center {
          margin: auto;
          width: 80%;
          padding: 16px;
        }
        .link {
          font-size: 16px;
          line-height: 16px;
        }
        .course-info {
          width: 100%;
        }
        .course-preview {
          height: 160px;
        }
        .card-content {
          padding: 0;
          margin: 0;
          overflow: hidden;
        }
        .inline {
          display: inline;
        }
      </style>
      <paper-card elevation="[[elevation]]">
        <div class="card-content card-control-height card-control-center">
          <div class="course-preview">
            <iron-icon
              class="course-icon"
              icon="[[icon]]"
              hidden$="[[!icon]]"
            ></iron-icon>
            <iron-image
              style="width:100%; height:100%; background-color: lightgray;"
              sizing="cover"
              preload=""
              fade=""
              src="[[image]]"
              hidden$="[[!image]]"
            ></iron-image>
          </div>
          <div class="course-info">
            <div class="divider"></div>
            <div class="name">[[name]]</div>
            <div class="title">[[title]]</div>
          </div>
        </div>
        <div class="card-actions" hidden="">
          <div class="card-action-details"></div>
        </div>
      </paper-card>
    `;
  }
  static get tag() {
    return "lrnapp-cis-course-card";
  }
  connectedCallback() {
    super.connectedCallback();
    afterNextRender(this, function () {
      this.addEventListener("mouseenter", this._mouseEnter.bind(this));
      this.addEventListener("mouseleave", this._mouseLeave.bind(this));
    });
  }
  disconnectedCallback() {
    this.removeEventListener("mouseenter", this._mouseEnter.bind(this));
    this.removeEventListener("mouseleave", this._mouseLeave.bind(this));
    super.disconnectedCallback();
  }

  static get properties() {
    return {
      size: {
        type: String,
      },
      /**
       * Cover image src.
       */
      image: {
        type: String,
      },
      /**
       * Icon to use if image isn't there.
       */
      icon: {
        type: String,
        value: false,
      },
      /**
       * name of the course like sing100
       */
      name: {
        type: String,
        value: "",
      },
      /**
       * title of the course like Intro to studies
       */
      title: {
        type: String,
        value: "",
      },
      /**
       * color of the course item
       */
      color: {
        type: String,
        value: "grey",
      },
      /**
       * Visual elevation of the item off the UI via paper element height
       */
      elevation: {
        type: Number,
        value: 1,
        reflectToAttribute: true,
      },
    };
  }
  /**
   * Increase elevation while hovering.
   */
  _mouseEnter(e) {
    this.__oldElevation = this.elevation;
    if (this.elevation + 2 > 5) {
      this.elevation = 5;
    } else {
      this.elevation += 2;
    }
  }
  /**
   * Reset the elevation.
   */
  _mouseLeave(e) {
    this.elevation = this.__oldElevation;
  }
}
window.customElements.define(LrnappCisCourseCard.tag, LrnappCisCourseCard);
export { LrnappCisCourseCard };
