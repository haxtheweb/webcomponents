import '@polymer/polymer/polymer.js';
import 'paper-stepper/paper-stepper.js';
import 'paper-stepper/paper-step.js';
import 'iron-scroll-spy/iron-auto-scroll-spy.js';
/**
`test-element`


@demo demo/index.html
*/
Polymer({
  _template: `
  <template is="dom-bind" id="scope">
    <style>
      :host {
        display: block;
      }
      div {
        background-color: #CCCCCC;
        width: 100%;
        height: 20em;
      }
    </style>
    <div id="headerPanel">
      <paper-stepper vertical="">
        <paper-step label="step 1">
          dfsfsfsfsfsf
        </paper-step>
        <paper-step label="step 2">
          pdidujjudsfjusdfju
        </paper-step>
        <paper-step label="step 3"></paper-step>
        <paper-step label="step 4"></paper-step>
      </paper-stepper>
      <iron-auto-scroll-spy selected="{{scrollSelected}}" id="autoScrollSpy">
        <div> <h1>Section A</h1> </div>
        <div> <h1>Section B</h1> </div>
        <div> <h1>Section C</h1> </div>
        <div> <h1>Section D</h1> </div>
        <div> <h1>Section E</h1> </div>
        <div> <h1>Section F</h1> </div>
        <div> <h1>Section G</h1> </div>
        <div> <h1>Section H</h1> </div>
      </iron-auto-scroll-spy>
    </div>
  </template>
`,

  is: 'test-element',

  properties: {
    prop1: {
      type: String,
      value: 'test-element',
    },
  },

  ready: function(e) {
    this.$.autoScrollSpy.scrollTarget = this.$.headerPanel.scroller;
  }
});
