import "@polymer/polymer/polymer.js";
import "lrndesign-panelcard/lrndesign-panelcard.js";
import "lrndesign-blockquote/lrndesign-blockquote.js";
/**
`hax-demo`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
    </style>
    <hax-ajax url="http://courses.elmsln.local/sing100/">
      <lrndesign-panelcard title="a really cool thing">
        <h4>A HEADING OF SOME KIND!</h4>
        <p>THis is a whole bunch of content.</p>
        <p>This is another paragraph let's see if it sticks too</p>
      </lrndesign-panelcard>

      <lrndesign-blockquote decorate="" citation="btopro" quote="This is a wuote by me... obviously">
      </lrndesign-blockquote>
    </hax-ajax>
`,

  is: "hax-demo",

  properties: {}
});
