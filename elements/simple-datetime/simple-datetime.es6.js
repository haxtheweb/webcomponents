import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./lib/date.format.js";let SimpleDatetime=Polymer({_template:html`
    <style>
      :host {
        display: block;
        font-size: 14px;
        color: #b3b3b1;
        line-height: 30px;
      }
    </style>
    <time datetime$="[[date]]">[[date]]</time>
  `,is:"simple-datetime",properties:{timestamp:{type:Number},format:{type:String,value:"M jS, Y"},date:{type:String,computed:"formatDate(timestamp, format, unix)"},unix:{type:Boolean,value:!1}},formatDate:function(timestamp,format,unix){if(unix){timestamp=1e3*timestamp}return new Date(timestamp).format(format)}});export{SimpleDatetime};