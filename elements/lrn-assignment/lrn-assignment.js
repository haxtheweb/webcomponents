import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";

/**
`lrn-assignment`

* @demo demo/index.html
*/
class LrnAssignment extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          width: 100%;
        }
        div.card {
          width: 100%;
          box-shadow: 0 5px 5px rgba(0, 0, 0, 0.7);
        }
      </style>
      <div class="card">
        <img src="[[image]]" loading="lazy" />
        <h3>[[title]]</h3>
        <div class="card-content">[[details]] <slot></slot></div>
        <div class="card-actions">
          <template is="dom-repeat" items="[[actions]]">
            <a href$="[[item.url]]"><button raised>[[item.label]]</button></a>
          </template>
        </div>
      </div>
    `;
  }

  static get tag() {
    return "lrn-assignment";
  }

  static get properties() {
    return {
      /**
       * Title
       */
      title: {
        type: String,
      },
      /**
       * Image url
       */
      image: {
        type: String,
      },
      /**
       * Details of the assignment
       */
      details: {
        type: String,
      },
      /**
       * url
       */
      url: {
        type: String,
      },
      open: {
        type: Boolean,
        value: false,
      },
      complete: {
        type: Boolean,
        value: false,
      },
      actions: {
        type: Object,
      },
    };
  }
}
window.customElements.define(LrnAssignment.tag, LrnAssignment);
export { LrnAssignment };
class LrnAssignments extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-wrap: wrap;
        }
        :host lrn-assignment {
          margin: 16px;
        }
        :host([layout="wide"]) lrn-assignment {
          width: calc(100% - 32px);
        }
        :host([layout="medium"]) lrn-assignment {
          width: calc(50% - 32px);
        }
        :host([layout="tight"]) lrn-assignment {
          width: calc(25% - 32px);
        }
      </style>
      <template is="dom-repeat" items="[[assignments]]">
        <lrn-assignment
          title="[[item.title]]"
          actions="[[item.actions]]"
        ></lrn-assignment>
      </template>

      <template is="dom-if" if="[[url]]">
        <iron-ajax
          auto=""
          url="[[url]]"
          handle-as="json"
          on-response="handleResponse"
        ></iron-ajax>
      </template>
    `;
  }

  static get tag() {
    return "lrn-assignments";
  }

  static get properties() {
    return {
      assignments: {
        type: Object,
        reflectToAttribute: true,
        observer: "assignmentsChanged",
      },
      layout: {
        type: String,
        reflectToAttribute: true,
      },
      url: {
        type: String,
      },
    };
  }

  assignmentsChanged(assignments) {
    if (assignments.length <= 1) {
      this.layout = "wide";
    } else if (assignments.length <= 4) {
      this.layout = "medium";
    } else if (assignments.length <= 6) {
      this.layout = "tight";
    }
  }

  rowItemsChanged(items) {}

  handleResponse(data) {
    this.assignments = data.response;
  }
}
window.customElements.define(LrnAssignments.tag, LrnAssignments);
export { LrnAssignments };
