import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-collapse/iron-collapse.js";
import "@lrnwebcomponents/lrndesign-stepper/lrndesign-stepper.js";
/**
`lrndesign-steppercollapse`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <h2>[[title]]</h2>

<lrn-objective title="Text" task="assignment">
dokokadskoadsokds
ads
ad
s
ads
asd
</lrn-objective>
<lrndesign-stepper>
  <lrndesign-stepper-button title="Step 1: Text" icon="book" url="#">
  </lrndesign-stepper-button>
  <lrndesign-stepper-button title="Step 2: Video" icon="av:play-circle-filled" collapsible="">
    Things and stuff
  </lrndesign-stepper-button>
  <lrndesign-stepper-button title="Step 3: Quiz" icon="assignment-turned-in" url="#"></lrndesign-stepper-button>
  <lrndesign-stepper-button title="Step 4: Discuss" icon="social:people" collapsible="">
    Fourth step content goes here...
  </lrndesign-stepper-button>
</lrndesign-stepper>
`,

  is: "lrndesign-steppercollapse",

  properties: {
    title: {
      type: String,
      value: "lrndesign-steppercollapse"
    }
  }
});
