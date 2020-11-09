import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
/**
`lrndesign-stepper-button`
visualization of steps

* @demo demo/index.html
*/
class LrndesignStepperButton extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --lrndesign-icon-button-color: #abacae;
          --lrndesign-stepper-btn-title-color: #000;
          --lrndesign-stepper-btn-active: #f6f7f7;
          --lrndesign-border-color: #abacae;
        }

        .top-line,
        .bottom-line {
          background-color: transparent;
        }

        :host([location="start"]) .bottom-line {
          background-color: var(--lrndesign-icon-button-color);
        }

        :host([location="middle"]) .top-line,
        :host([location="middle"]) .bottom-line {
          background-color: var(--lrndesign-icon-button-color);
        }

        :host([location="end"]) .top-line {
          background-color: var(--lrndesign-icon-button-color);
        }

        .top-line {
          width: 2px;
          height: 24px;
          margin: auto;
        }

        .bottom-line {
          width: 2px;
          height: 24px;
          margin: auto;
        }

        .stepper-btn {
          background-color: transparent;
          display: flex;
          width: 100%;
          justify-content: center;
        }

        .node-title {
          color: var(--lrndesign-stepper-btn-title-color);
          text-transform: none;
          line-height: 32px;
          font-weight: bold;
          font-size: 16px;
        }

        .btn-icon {
          background-color: transparent;
          color: var(--lrndesign-icon-button-color);
          border-radius: 50%;
          --simple-icon-height: 35px;
          --simple-icon-width: 35px;
        }

        .url-style {
          text-decoration: none;
        }

        .title-container {
          padding: 10px;
          width: 70%;
          position: relative;
          right: 19.2px;
        }

        .title-container:hover {
          text-decoration: underline;
        }

        .box-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          width: 30%;
        }

        button {
          width: 100%;
          background-color: transparent;
          position: relative;
        }

        button:after {
          content: "";
          display: block;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
        }

        button:active,
        button:focus {
          background-color: var(--lrndesign-stepper-btn-active);
        }
        button:focus simple-icon {
          color: black;
        }

        button:active:after,
        button:focus:after {
          border-color: var(--lrndesign-border-color);
        }

        button {
          border-radius: 0;
          padding: 0;
        }
      </style>

      <template is="dom-if" if="{{hasCollapse(collapsible, 1)}}">
        <a11y-collapse>
          <div class="box-container" slot="heading">
            <div class="top-line"></div>
            <div class="stepper-btn">
              <simple-icon icon="[[icon]]" class="btn-icon"></simple-icon>
            </div>
            <div class="bottom-line"></div>
          </div>
          <div class="title-container">
            <div class="node-title">[[title]]</div>
          </div>
          <div><slot></slot></div>
        </a11y-collapse>
      </template>
      <template is="dom-if" if="{{hasCollapse(collapsible, 0)}}">
        <a tabindex="-1" href="[[url]]" class="url-style">
          <button class="btn">
            <div class="box-container">
              <div class="top-line"></div>
              <div class="stepper-btn">
                <simple-icon icon="[[icon]]" class="btn-icon"></simple-icon>
              </div>
              <div class="bottom-line"></div>
            </div>
            <div class="title-container">
              <div class="node-title">[[title]]</div>
            </div>
          </button>
        </a>
        <slot></slot>
      </template>
    `;
  }

  static get tag() {
    return "lrndesign-stepper-button";
  }

  static get properties() {
    return {
      /**
       * The button title.
       */
      title: {
        type: String,
        reflectToAttribute: true,
        notify: true,
      },

      /**
       * The button icon.
       */
      icon: {
        type: String,
        reflectToAttribute: true,
        notify: true,
      },

      /**
       * The url for button.
       */
      url: {
        type: String,
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * The tab location position (start / middle / end).
       */
      location: {
        type: String,
        reflectToAttribute: true,
        notify: true,
      },
      /**
       * Allow for collapsible content with the items inside
       */
      collapsible: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false,
      },
      opened: {
        type: Boolean,
        value: false,
      },
    };
  }

  /**
   * If it is in a collapsed state or not.
   */
  hasCollapse(bool, test) {
    if (bool == test) {
      return true;
    } else {
      return false;
    }
  }
}
window.customElements.define(
  LrndesignStepperButton.tag,
  LrndesignStepperButton
);
export { LrndesignStepperButton };
