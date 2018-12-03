import "./lrnapp-studio-submission-media-editoverlay.js";
Polymer({
  _template: `
    <style>
       :host {
        display: inline-flex;
        justify-content: space-around;
        min-height: 100px;
        position: relative;
      }

      iron-image {
        --iron-image-height: 200px;
        display: block;
      }
    </style>

    <lrnapp-studio-submission-media-editoverlay on-delete="_delete" data-index\$="[[index]]" embedcode="{{embedcode}}">
      <iron-image src="{{thumbnail}}" style="width:200px; height:200px; background-color: lightgray;" sizing="contain" class="contain" preload="" fade=""></iron-image>
    </lrnapp-studio-submission-media-editoverlay>
`,

  is: "lrnapp-studio-submission-edit-image",

  properties: {
    image: {
      type: Object,
      notify: true
    },
    thumbnail: {
      type: String,
      notify: true,
      computed: "_getThumbnail(image)"
    },
    embedcode: {
      type: String,
      computed: "_computeEmbedCode(image)"
    }
  },

  _getThumbnail: function(image) {
    return image.url;
  },

  _computeEmbedCode: function(image) {
    return "![Alternative Text Here](" + image.url + ")";
  },

  _delete: function(e) {
    this.fire("deleted");
  }
});
