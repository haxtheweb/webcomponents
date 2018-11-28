import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-input/paper-input.js";import"./node_modules/@polymer/paper-tooltip/paper-tooltip.js";import{PaperInputBehavior}from"./node_modules/@polymer/paper-input/paper-input-behavior.js";import"./node_modules/@polymer/iron-icons/iron-icons.js";import"./node_modules/@polymer/iron-icon/iron-icon.js";let PaperInputFlagged=Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
      iron-icon {
        transition: .6s all ease-in;
        width: 24px;
        height: 24px;
        margin-right: 4px;
      }
      paper-tooltip {
        font-size: 11px;
        --paper-tooltip-delay-in: 100;
      }
      #icon {
        color: var(--paper-grey-400);
        background-color: transparent;
      }
      :host([status="info"]) #icon {
        color: var(--paper-green-400);
      }
      :host([status="notice"]) #icon {
        color: var(--paper-grey-400);
      }
      :host([status="warning"]) #icon {
        color: var(--paper-yellow-700);
      }
      :host([status="error"]) #icon {
        color: var(--paper-red-900);
      }
      .element-invisible {
        position: absolute !important;
        clip: rect(1px, 1px, 1px, 1px);
        overflow: hidden;
        height: 1px;
      }
    </style>
    <paper-input label="[[label]]" value="{{value}}" char-counter="[[charCounter]]" disabled="[[disabled]]" minlength="[[minlength]]" maxlength="[[minlength]]">
      <iron-icon id="icon" icon="[[icon]]" slot="prefix"></iron-icon>
    </paper-input>
    <div class="element-invisible">[[__activeMessage]]</div>
    <paper-tooltip for="icon" position="top" offset="20" fit-to-visible-bounds>
        [[__activeMessage]]
    </paper-tooltip>
`,is:"paper-input-flagged",behaviors:[PaperInputBehavior],properties:{icon:{type:String,computed:"_iconFromStatus(status)"},status:{type:String,reflectToAttribute:!0,computed:"testStatus(flaggedInput, value)"},value:{type:String,notify:!0,value:""},flaggedInput:{type:Array,value:[{match:null,message:"Alt data is required for everything except decoration images.",status:"notice"},{match:"image",message:"Screenreaders will say the word image, don't put it in the descriptive text",status:"error"},{match:"photo",message:"Screenreaders will say the word image, don't put photo in the descriptive text",status:"error"},{match:"picture",message:"Screenreaders will say the word image, don't put picture in the descriptive text",status:"error"},{match:3,message:"Description not effective enough. This should be at least a sentance about what the image is.",status:"error"},{match:10,message:"Make sure your alt text is descriptive enough for those that can't see the media.",status:"warning"}]},inputSuccess:{type:Object,value:{message:"You passed our simple accessibility checks.",status:"info"}}},ready:function(){this.removeAttribute("tabindex")},testStatus:function(test,value){for(var i in test){if(null===test[i].match&&(""===value||null===value)){this.__activeMessage=test[i].message;return test[i].status}else if(!isNaN(test[i].match)&&value.split(/\s+/g).length<parseInt(test[i].match)){this.__activeMessage=test[i].message;return test[i].status}else if(value.toLowerCase().includes(test[i].match)){this.__activeMessage=test[i].message;return test[i].status}}this.__activeMessage=this.inputSuccess.message;return this.inputSuccess.status},_iconFromStatus:function(status){switch(status){case"error":return"icons:error";break;case"warning":case"notice":return"icons:warning";break;case"info":return"icons:info-outline";break;default:return"icons:info";break;}}});export{PaperInputFlagged};