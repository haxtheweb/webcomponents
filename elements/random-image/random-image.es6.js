import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/iron-image/iron-image.js";/**
`random-image`
Element to show random image from a given group.

* @demo demo/index.html
*/let RandomImage=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
      .is-circle {
        border: 1px solid grey;
        border-radius: 50%;
        box-shadow: 0px 5px 10px #ccc;
      }
    </style>
    <iron-image
      style="width:200px; height:200px;"
      class$="[[mode]]"
      sizing="contain"
      src$="[[imgSrc]]"
      title$="[[imgTitle]]"
    ></iron-image>
  `,is:"random-image",properties:{mode:{type:String,notify:!0,value:""},imgSrc:{type:String},imgTitle:{type:String},imagesList:{type:Object,notify:!0,// When initializing a property to an object or array value, use a function to ensure that each element
// gets its own copy of the value, rather than having an object or array shared across all instances of the element
value:function(){return[]}}},_pickRandomProperty:function(obj){var result,count=0;for(var prop in obj)if(Math.random()<1/++count)result=prop;return result},ready:function(){var randomPos=this._pickRandomProperty(this.imagesList);this.imgSrc=this.imagesList[randomPos].path;this.imgTitle=this.imagesList[randomPos].title}});export{RandomImage};