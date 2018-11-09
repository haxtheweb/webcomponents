import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
/**
`lrn-assignment`

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: flex;
        width: 100%;
      }
      paper-card {
        width: 100%;
      }
    </style>
    <paper-card heading="[[title]]" image="[[image]]" elevation="1" animated-shadow="false">
      <div class="card-content">
        [[details]]
        <slot></slot>
      </div>  
      <div class="card-actions">
        <template is="dom-repeat" items="[[actions]]">
          <a href$="[[item.url]]"><paper-button raised>[[item.label]]</paper-button></a>
        </template>
      </div>
    </paper-card>
`,

  is: "lrn-assignment",

  properties: {
    /**
     * Title
     */
    title: {
      type: String
    },
    /**
     * Image url
     */
    image: {
      type: String
    },
    /**
     * Details of the assignment
     */
    details: {
      type: String
    },
    /**
     * url
     */
    url: {
      type: String
    },
    open: {
      type: Boolean,
      value: false
    },
    complete: {
      type: Boolean,
      value: false
    },
    actions: {
      type: Object
    }
  }
});
Polymer({
  _template: html`
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
      <lrn-assignment title="[[item.title]]" actions="[[item.actions]]"></lrn-assignment>
    </template>

    <template is="dom-if" if="[[url]]">
      <iron-ajax auto="" url="[[url]]" handle-as="json" on-response="handleResponse"></iron-ajax>
    </template>
`,

  is: "lrn-assignments",

  properties: {
    assignments: {
      type: Object,
      reflectToAttribute: true,
      observer: "assignmentsChanged"
    },
    layout: {
      type: String,
      reflectToAttribute: true
    },
    url: {
      type: String
    }
  },

  assignmentsChanged: function(assignments) {
    if (assignments.length <= 1) {
      this.layout = "wide";
    } else if (assignments.length <= 4) {
      this.layout = "medium";
    } else if (assignments.length <= 6) {
      this.layout = "tight";
    }
  },

  rowItemsChanged: function(items) {},

  handleResponse: function(data) {
    this.assignments = data.response;
  }
});
