import "@polymer/iron-ajax/iron-ajax.js";
import "./govcon-banner.js";
Polymer({
  _template: `
    <style>
       :host {
        display: block;
      }
    </style>

    <iron-ajax auto="" url="[[dataSource]]" handle-as="json" last-response="{{data}}" debounce-duration="300"></iron-ajax>
    
    <template is="dom-repeat" items="{{data.banners}}" as="banner">
      <govcon-banner title="[[banner.title]]" text="[[banner.text]]" image\$="../files/[[banner.image]]" link="[[banner.link]]" alt="[[banner.alt]]"></govcon-banner>
    </template>
`,

  is: "govcon-banner-ajax",

  properties: {
    data: {
      type: Object
    },
    dataSource: {
      type: String
    }
  }
});
