/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, css, html } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `top-alert`
 * `A full width alert that has an important message for the website viewer`
 *
 * @demo demo/index.html
 * @element top-alert
 */
class TopAlert extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 100;
          height: auto;
          display: block;
          background-color: #001e44;
        }

        :host([hidden]) {
          display: none;
        }
        .alert .container {
          max-width: 576px;
          margin: 0 auto;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
        }
        .container {
          max-width: 1440px;
          margin: 0 auto;
        }
        .non-emergency {
          background-color: #cfeceb;
          color: #000321;
        }
        :host([hide-alert]) .alert.full,
        :host(:not([hide-alert])) .alert.min {
          display: none;
          -webkit-transition: 0.5s;
          transition: 0.5s;
        }
        :host([hide-alert]) .alert.min {
          display: block;
        }
        .alert.min {
          text-align: center;
          display: block;
          -webkit-transition: 0.5s;
          transition: 0.5s;
          -webkit-transition-delay: 0.5s;
          transition-delay: 0.5s;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .min.non-emergency {
          background-color: #cfeceb;
        }
        .non-emergency {
          background-color: #cfeceb;
          color: #000321;
        }
        .alert {
          position: relative;
          -webkit-transition: 0.5s;
          transition: 0.5s;
          overflow: hidden;
        }
        .alert {
          position: relative;
          -webkit-transition: 0.5s;
          transition: 0.5s;
          overflow: hidden;
        }
        .non-emergency .left-angle,
        .non-emergency .right-angle {
          fill: #fff;
        }
        .alert .container {
          position: relative;
        }
        .alert p {
          font-size: 1rem;
          line-height: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.03rem;
        }
        svg {
          display: none !important;
          line-height: 1.15;
        }

        .sr-only {
          opacity: 0;
          position: absolute;
          clip: rect(1px 1px 1px 1px);
          clip: rect(1px, 1px, 1px, 1px);
        }
        .non-emergency .alert-message {
          background-color: #fff;
        }
        .alert-message {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          float: left;
          -webkit-box-ordinal-group: 4;
          -ms-flex-order: 3;
          order: 3;
          -webkit-box-flex: 0;
          -ms-flex: 0 100%;
          flex: 0 100%;
        }
        .non-emergency .alert-icon {
          stroke: #000321;
        }
        @media screen and (min-width: 600px) {
          .alert .date {
            -webkit-box-flex: 0;
            -ms-flex: 0 69%;
            flex: 0 69%;
          }
          .alert .date {
            float: left;
            padding: 14px 33px 14px 24px;
            text-transform: uppercase;
            -webkit-box-ordinal-group: 2;
            -ms-flex-order: 1;
            order: 1;
            -webkit-box-flex: 0;
            -ms-flex: 0 50%;
            flex: 0 50%;
          }
        }

        .non-emergency .alert-message {
          background-color: #fff;
        }

        .alert .container {
          position: relative;
        }
        @media (min-width: 768px) {
          .alert .container {
            max-width: 768px;
            justify-items: flex-start;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-direction: row;
            flex-direction: row;
          }
        }
        .alert .container {
          max-width: 576px;
          margin: 0 auto;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -ms-flex-wrap: wrap;
          flex-wrap: wrap;
        }
        .container {
          max-width: 1440px;
          margin: 0 auto;
        }

        @media (min-width: 1080px) {
          .right-angle {
            -webkit-box-ordinal-group: 5;
            -ms-flex-order: 4;
            order: 4;
          }
        }
        @media (min-width: 768px) {
          .right-angle {
            -webkit-box-ordinal-group: 6;
            -ms-flex-order: 5;
            order: 5;
          }
        }
        @media (min-width: 1080px) {
          .left-angle,
          .right-angle {
            -webkit-box-flex: 0;
            -ms-flex: 0 5.6%;
            flex: 0 5.6%;
          }
        }
        @media (min-width: 768px) {
          .left-angle,
          .right-angle {
            display: inline-block;
            -webkit-box-flex: 0;
            -ms-flex: 0 9.15%;
            flex: 0 9.15%;
          }
        }
        .left-angle,
        .right-angle {
          display: none;
        }

        @media (min-width: 768px) {
          .alert-message {
            -webkit-box-pack: normal;
            -ms-flex-pack: normal;
            justify-content: normal;
            -webkit-box-flex: 0;
            -ms-flex: 0 81.5%;
            flex: 0 81.5%;
            height: auto;
          }
        }
        .alert-message {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          float: left;
          -webkit-box-ordinal-group: 4;
          -ms-flex-order: 3;
          order: 3;
          -webkit-box-flex: 0;
          -ms-flex: 0 100%;
          flex: 0 100%;
        }

        .alert-icon {
          width: 3rem;
          height: 3rem;
          position: relative;
          top: -1rem;
          left: -7px;
        }
        @media (min-width: 768px) {
          .alert-icon {
            width: 4rem;
            height: 4rem;
            padding: 0 0.5rem 0 2rem;
          }
          .alert .container {
            max-width: 768px;
            justify-items: flex-start;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            -ms-flex-direction: row;
            flex-direction: row;
          }
          .left-angle {
            -webkit-box-ordinal-group: 4;
            -ms-flex-order: 3;
            order: 3;
          }
          .alert .date {
            padding: 14px 0 14px 32px;
            -webkit-box-flex: 0;
            -ms-flex: 0 81%;
            flex: 0 81%;
          }
          .left-angle,
          .right-angle {
            display: inline-block;
            -webkit-box-flex: 0;
            -ms-flex: 0 9.15%;
            flex: 0 9.15%;
          }
          .right-angle {
            -webkit-box-ordinal-group: 6;
            -ms-flex-order: 5;
            order: 5;
          }
          .alert-message ::slotted(p) {
            font-style: italic;
            width: 76%;
            font-size: 1.0625rem;
            line-height: 1.1875rem;
            padding: 1.75rem 0;
            font-size: 1rem;
            line-height: 1.125rem;
            font-weight: 700;
            letter-spacing: 0.03rem;
            margin: 0;
            padding: 0;
          }
          .minimize-alert button {
            right: 3.75rem;
          }
        }
        .alert-message ::slotted(p) {
          color: #000321;
          font-size: 1.125rem;
          line-height: 1.25rem;
          padding: 0;
        }
        @media (min-width: 1080px) {
          .minimize-alert button {
            right: 1rem;
            padding-bottom: 0;
          }
          .minimize-alert {
            -webkit-box-ordinal-group: 6;
            -ms-flex-order: 5;
            order: 5;
            -webkit-box-flex: 0;
            -ms-flex: 0 9%;
            flex: 0 9%;
          }
        }
        .minimize-alert button span {
          display: inline-block;
          right: 34px;
          width: 16px;
          height: 19px;
          vertical-align: middle;
          z-index: inherit;
          padding-right: 0.5rem;
        }
        .non-emergency .minimize-alert button > span::after,
        .non-emergency .minimize-alert button > span::before {
          background-color: #001e44;
        }
        .minimize-alert button > span::before {
          display: block;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
        }
        .minimize-alert button > span::after {
          display: block;
          -webkit-transform: rotate(135deg);
          transform: rotate(135deg);
        }
        .minimize-alert button > span::after,
        .minimize-alert button > span::before {
          display: block;
          position: absolute;
          left: 15px;
          content: " ";
          height: 16px;
          width: 3px;
          background-color: #fff;
        }
        .minimize-alert button {
          float: right;
          position: relative;
          display: block;
          top: 0;
          right: 1rem;
          border: none;
          background-color: transparent;
          cursor: pointer;
          text-transform: uppercase;
          padding-top: 2rem;
          padding-bottom: 14px;
          font-size: 1rem;
          line-height: 1.125rem;
          font-weight: 700;
          letter-spacing: 0.03rem;
          -webkit-appearance: button;
          text-transform: none;
          font-family: inherit;
          font-size: 100%;
          line-height: 1.15;
          margin: 0;
          overflow: visible;
        }
        .alert.min .container {
          height: 3.375rem;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
        }
        .alert.min .expand-alert {
          border: none;
          background-color: transparent;
          cursor: pointer;
          text-transform: uppercase;
          font-weight: 700;
          font-style: italic;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
        }
        .alert.min .alert-icon {
          width: 1.75rem;
          height: 1.75rem;
          padding: 0 0 0 2rem;
          top: 0;
          left: -0.75rem;
        }
      `,
    ];
  }
  render() {
    return html`
      <div
        class="alert full non-emergency"
        role="dialog"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div id="alert-dialog-title" class="sr-only">Alert message</div>
        <p id="alert-dialog-description" class="sr-only">
          This dialog contains an alert message for the Penn State community.
        </p>
        <div class="container">
          <!--  The following div for the date is optional. -->
          <div class="date">
            <slot name="date"></slot>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="left-angle"
            viewBox="0 0 51.625 132.493"
          >
            <path
              id="Path_4283"
              data-name="Path 4283"
              d="M-13525.965,2373.5V2241.005h-51.625l31.835,82.837-22.107,21.054h30.465Z"
              transform="translate(13577.59 -2241.005)"
              class="left-angle"
            ></path>
          </svg>
          <div class="alert-message">
            <simple-icon-lite
              icon="${this.icon}"
              class="alert-icon"
            ></simple-icon-lite>
            <slot></slot>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="right-angle"
            viewBox="0 0 51.617 132.499"
          >
            <path
              id="Path_4279"
              data-name="Path 4279"
              d="M-13342.965,2541.5h-51.617V2409Z"
              transform="translate(13394.582 -2409)"
            ></path>
          </svg>
          <div class="minimize-alert">
            <button id="btn"><span></span>Close</button>
          </div>
        </div>
      </div>
      <div class="alert min non-emergency">
        <div class="container">
          <button id="btn2" class="expand-alert" tabindex="1">
            <simple-icon-lite
              icon="${this.icon}"
              class="alert-icon"
            ></simple-icon-lite>
            ${this.minLabel}
            <simple-icon-lite icon="icons:expand-more"></simple-icon-lite>
          </button>
        </div>
      </div>
    `;
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.shadowRoot
      .querySelector("#btn")
      .addEventListener("click", this.alertToggle.bind(this));
    this.shadowRoot
      .querySelector("#btn2")
      .addEventListener("click", this.alertToggle.bind(this));
  }

  alertToggle(e) {
    this.hideAlert = !this.hideAlert;
  }

  static get properties() {
    return {
      icon: {
        type: String,
      },
      minLabel: {
        type: String,
        attribute: "min-label",
      },
      hideAlert: {
        type: Boolean,
        reflect: true,
        attribute: "hide-alert",
      },
    };
  }

  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "top-alert";
  }
  /**
   * object life cycle
   */
  constructor() {
    super();
    this.icon = "icons:error-outline";
    this.minLabel = "Expand";
    this.hideAlert = false;
  }
}
customElements.define(TopAlert.tag, TopAlert);
export { TopAlert };
