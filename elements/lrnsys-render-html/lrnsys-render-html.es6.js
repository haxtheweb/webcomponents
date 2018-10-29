import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div id="container"> </div>
`,is:"lrnsys-render-html",properties:{html:{type:String}},observers:["_render(html)"],_render:function(html){this.$.container.innerHTML=html}});