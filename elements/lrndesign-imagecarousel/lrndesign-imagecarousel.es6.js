import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/fancy-carousel/fancy-carousel.js";let LrndesignImagecarousel=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <fancy-carousel>
      <img src="https://app-layout-assets.appspot.com/assets/bg1.jpg" />
      <img src="https://app-layout-assets.appspot.com/assets/bg2.jpg" />
      <img src="https://app-layout-assets.appspot.com/assets/bg3.jpg" />
      <img src="https://app-layout-assets.appspot.com/assets/bg4.jpg" />
    </fancy-carousel>
  `,is:"lrndesign-imagecarousel",properties:{title:{type:String,value:"lrndesign-imagecarousel"}}});export{LrndesignImagecarousel};