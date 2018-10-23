/**
`boiler-plate`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -
 -

*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
    </style>
    <h2>[[title]]</h2>
`,

  is: "boiler-plate",

  properties: {
    title: {
      type: String,
      value: "boiler-plate"
    }
  }
});
