import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-card/paper-card.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";let LrndesignPanelcard=Polymer({_template:html`
    <style include="simple-colors"></style>
    <style>
      :host {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        --lrndesign-panelcard-text-color: var(
          --simple-colors-default-theme-grey-12
        );
        --lrndesign-panelcard-color: var(
          --simple-colors-default-theme-accent-1
        );
      }
      :host([dark]:not([accent-color="grey"])) {
        --lrndesign-panelcard-color: var(
          --simple-colors-default-theme-accent-3
        );
      }
      :host([colored-text]) {
        --lrndesign-panelcard-text-color: var(
          --simple-colors-default-theme-accent-9
        );
        --lrndesign-panelcard-color: var(--simple-colors-default-theme-grey-1);
      }
      .card-panel {
        transition: box-shadow 0.25s;
        padding: 24px;
        margin: 0;
        border-radius: 2px;
        color: var(--lrndesign-panelcard-text-color);
        background-color: var(--lrndesign-panelcard-color);
      }

      h3 {
        padding: 0;
        margin: 0 0 8px 0;
      }
    </style>
    <aside>
      <paper-card elevation="[[elevation]]">
        <div class="card-panel">
          <h3>[[title]]</h3>
          <span><slot></slot></span>
        </div>
      </paper-card>
    </aside>
  `,is:"lrndesign-panelcard",behaviors:[HAXBehaviors.PropertiesBehaviors,SimpleColors],properties:{title:{type:String,value:"Block heading",reflectToAttribute:!0},elevation:{type:Number,value:2,reflectToAttribute:!0},coloredText:{type:Boolean,value:!1,reflectToAttribute:!0}},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Note card",description:"A small note to offset text used for asides.",icon:"icons:check-box-outline-blank",color:"grey",groups:["Content","Visual Treatment"],handles:[{type:"text",text:"title"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"title",title:"Title",description:"The heading for this sticky note",inputMethod:"textfield",icon:"editor:title"},{property:"accentColor",title:"Accent color",description:"Select the accent color use",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark",description:"Use dark theme",inputMethod:"boolean",icon:"invert-colors"},{property:"elevation",title:"Elevation",description:"Visually how high this is off the page",inputMethod:"textfield",icon:"icons:content-copy"}],configure:[{property:"title",title:"Title",description:"The heading for this sticky note",inputMethod:"textfield",icon:"editor:title"},{slot:"",title:"Text",description:"The text for our sticky note",inputMethod:"textarea",icon:"editor:title",required:!1,validationType:"text"},{property:"accentColor",title:"Accent color",description:"Select the accent color use",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"dark",title:"Dark",description:"Use dark theme",inputMethod:"boolean",icon:"invert-colors"},{property:"coloredText",title:"Colored Text",description:"Apply color to text instead of background.",inputMethod:"boolean",icon:"editor:format-color-text"},{property:"elevation",title:"Elevation",description:"Visually how high this is off the page",inputMethod:"select",options:{0:"0",1:"1",2:"2",3:"3",4:"4",5:"5"}}],advanced:[]}};this.setHaxProperties(props)}});export{LrndesignPanelcard};