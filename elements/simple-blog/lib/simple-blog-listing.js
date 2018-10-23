import "@polymer/polymer/polymer.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-button/paper-button.js";
import "./simple-blog-overview.js";
/**
`simple-blog-listing`
A simple blog and associated elements

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
Polymer({
  _template: `
    <style>
      :host {
        display: block;
      }
      iron-list {
        width: 100%;
        max-width: 640px;
        margin: 0 auto;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }
      @media only screen and (max-width: 800px) {
        iron-list {
          padding: 0 32px;
        }
      }
      simple-blog-overview {
        width: 100%;
        border: 1px solid #f2f2f0;
      }
    </style>
    <iron-list items="[[items]]">
      <template>
        <simple-blog-overview item-id="[[item.id]]" title="[[item.title]]" description="[[item.description]]" link="[[item.location]]" changed="[[item.metadata.updated]]"></simple-blog-overview>
      </template>
    </iron-list>
`,

  is: "simple-blog-listing",

  properties: {
    /**
     * items
     */
    items: {
      type: Object
    }
  }
});
