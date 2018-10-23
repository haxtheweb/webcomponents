import "@polymer/polymer/polymer.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/communication-icons.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-styles/color.js";
import "@polymer/paper-styles/typography.js";
import "@polymer/paper-toolbar/paper-toolbar.js";
import "hax-behaviors/hax-behaviors.js";
/**
`lrndesign-card`

A simple card for presenting material.

@demo demo/index.html
*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
      body {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      paper-card {
        max-width: 500px;
      }
      .card-header { @apply(--paper-font-headline); }
      .card-light { color: var(--paper-grey-600); }
      .card-location {
        float: right;
        font-size: 15px;
        vertical-align: middle;
      }
      .card-reserve { color: var(--google-blue-500); }
      iron-icon.star {
        --iron-icon-width: 16px;
        --iron-icon-height: 16px;
        color: var(--paper-amber-500);
      }
      iron-icon.star:last-of-type { color: var(--paper-grey-500); }
    </style>
    <paper-card image="https://unsplash.it/600/300">
      <hax-editbar edit="{{edit}}"></hax-editbar>
      <div class="card-content">
        <div class="card-header">
          <hax-editable edit="{{edit}}" type="textfield">{{title}}</hax-editable>
          <div class="card-location">
            <iron-icon icon="communication:location-on"></iron-icon>
            <span>250ft</span>
          </div>
        </div>
        <hax-editable edit="{{edit}}" type="html">
          <p>\$・Italian, Cafe</p>
          <p>Small plates, salads &amp; sandwiches in an intimate setting.</p>
        </hax-editable>
      </div>
      <div class="card-actions">
        <div class="horizontal justified">
          <paper-icon-button icon="icons:event"></paper-icon-button>
          <paper-button>5:30PM</paper-button>
          <paper-button>7:30PM</paper-button>
          <paper-button>9:00PM</paper-button>
          <paper-button class="cafe-reserve">Reserve</paper-button>
        </div>
      </div>
    </paper-card>
`,

  is: "lrndesign-card",
  behaviors: [HAXBehaviors.EditBehaviors],

  properties: {
    title: {
      type: String,
      value: "",
      notify: true,
      readOnly: false
    },
    body: {
      type: String,
      value: ""
    },
    image: {
      type: String,
      value: ""
    }
  },

  /**
   * Defaults for presenting as a demo.
   */
  _demoInit: function() {
    this.title = "Sing 100";
    this.body =
      "Disrupt, innovate out of your job. Pay everything forward. Collapse local inefficiencies.";
  }
});
