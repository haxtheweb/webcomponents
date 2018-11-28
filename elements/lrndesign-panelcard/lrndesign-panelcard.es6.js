import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-card/paper-card.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";let LrndesignPanelcard=Polymer({_template:html`
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        --secondary-text-color: #FFFFFF;
        --paper-input-container-color: #FFFFFF;
      }

      .card-panel {
        transition: box-shadow .25s;
        padding: 24px;
        margin: 0;
        border-radius: 2px;
        background-color: #fff;
      }

      h3 {
        padding: 0;
        margin: 0 0 8px 0;
      }
    </style>
    <aside>
      <paper-card elevation="[[elevation]]">
        <div class\$="card-panel [[color]]">
          <h3 class\$="[[textColor]]">[[title]]</h3>
          <span class\$="[[textColor]]">
            <slot></slot>
          </span>
        </div>
      </paper-card>
    </aside>
`,is:"lrndesign-panelcard",behaviors:[HAXBehaviors.PropertiesBehaviors,MaterializeCSSBehaviors.ColorBehaviors],properties:{title:{type:String,value:"Block heading",reflectToAttribute:!0},color:{type:String,value:"yellow lighten-4",reflectToAttribute:!0},textColor:{type:String,value:"black-text",reflectToAttribute:!0},elevation:{type:Number,value:2,reflectToAttribute:!0}},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Note card",description:"A small note to offset text used for asides.",icon:"icons:check-box-outline-blank",color:"grey",groups:["Content","Visual Treatment"],handles:[{type:"text",text:"title"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The heading for this sticky note",inputMethod:"textfield",icon:"editor:title"},{property:"color",title:"Background color",description:"Select the background color use",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"elevation",title:"Elevation",description:"Visually how high this is off the page",inputMethod:"textfield",icon:"icons:content-copy"}],configure:[{property:"title",title:"Title",description:"The heading for this sticky note",inputMethod:"textfield",icon:"editor:title"},{slot:"",title:"Text",description:"The text for our sticky note",inputMethod:"textarea",icon:"editor:title",required:!1,validationType:"text"},{property:"color",title:"Background color",description:"Select the background color use",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"elevation",title:"Elevation",description:"Visually how high this is off the page",inputMethod:"select",options:{0:"0",1:"1",2:"2",3:"3",4:"4",5:"5"}}],advanced:[]}};this.setHaxProperties(props)}});export{LrndesignPanelcard};