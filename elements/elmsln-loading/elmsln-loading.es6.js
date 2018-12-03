import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/lrn-icons/lrn-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/lib/colors.js";let ElmslnLoading=Polymer({_template:html`
    <style is="custom-style" include="materializecss-styles-colors">
      @-moz-keyframes spin {
        100% {
          -moz-transform: rotate(60deg);
          filter: saturate(10) invert(0.9);
        }
      }
      @-webkit-keyframes spin {
        100% {
          -webkit-transform: rotate(60deg);
          filter: saturate(10) invert(0.9);
        }
      }
      @keyframes spin {
        100% {
          -webkit-transform: rotate(60deg);
          transform: rotate(60deg);
        }
      }
      :host {
        display: block;
        -webkit-animation: spin 1.25s ease-out infinite;
        -moz-animation: spin 1.25s ease-out infinite;
        animation: spin 1.25s ease-out infinite;
      }
      :host([size="tiny"]) {
        width: 16px;
        height: 16px;
        -webkit-animation: spin 0.75s ease-out infinite;
        -moz-animation: spin 0.75s ease-out infinite;
        animation: spin 0.75s ease-out infinite;
      }
      :host([size="small"]) {
        width: 32px;
        height: 32px;
        -webkit-animation: spin 1s ease-out infinite;
        -moz-animation: spin 1s ease-out infinite;
        animation: spin 1s ease-out infinite;
      }
      :host([size="medium"]) {
        width: 64px;
        height: 64px;
        -webkit-animation: spin 1.25s ease-out infinite;
        -moz-animation: spin 1.25s ease-out infinite;
        animation: spin 1.25s ease-out infinite;
      }
      :host([size="large"]) {
        width: 80px;
        height: 80px;
        -webkit-animation: spin 1.25s ease-out infinite;
        -moz-animation: spin 1.25s ease-out infinite;
        animation: spin 1.25s ease-out infinite;
      }
      :host([size="epic"]) {
        width: 400px;
        height: 400px;
        -webkit-animation: spin 2s ease-out infinite;
        -moz-animation: spin 2s ease-out infinite;
        animation: spin 2s ease-out infinite;
      }
    </style>
    <iron-icon icon="lrn:network" class$="[[color]]"></iron-icon>
  `,is:"elmsln-loading",properties:{color:{type:String,reflectToAttribute:!0},size:{type:String,reflectToAttribute:!0,value:"medium"}}});export{ElmslnLoading};