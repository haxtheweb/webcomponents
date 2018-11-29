import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/random-image/random-image.js";import"./node_modules/@polymer/paper-button/paper-button.js";let LrnsysRandomimage=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <div id="list">
      <random-image images-list$="{{images}}"></random-image>
  </div>
  <paper-button raised on-click="reload">Reload</paper-button>
`,is:"lrnsys-randomimage",properties:{images:{type:Object,notify:!0,value:function(){return[]}}},reload:function(e){let root=this;this.$.list.innerHTML=this.$.list.innerHTML}});export{LrnsysRandomimage};