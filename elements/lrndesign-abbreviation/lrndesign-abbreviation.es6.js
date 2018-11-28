import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@polymer/paper-tooltip/paper-tooltip.js";let LrndesignAbbreviation=Polymer({_template:html`
    <style>
      :host {
        display: inline-block;
      }
      abbr {
        transition: .6s all ease;
        padding: 2px 4px;
        font-style: italic;
        background-color: var(--abbreviation-bg, #F9F9F9);
        text-underline-position: under;
        text-decoration:underline double;
        cursor: help;
        outline: var(--abbreviation-selection, #FFFF33);
        @apply --abbreviation-main;
      }
      abbr:focus,
      abbr:active,
      abbr:hover {
        text-decoration: none;
        background-color: var(--abbreviation-selection, #FFFF33);
        @apply --abbreviation-hover;
      }
      abbr::-moz-selection,
      abbr::selection {
        text-decoration: none;
        background-color: var(--abbreviation-selection, #FFFF33);
        @apply --abbreviation-selection;
      }
    </style>
    <abbr tabindex="0" title$="[[phrase]]" id="abbr">[[abbr]]</abbr>
    <paper-tooltip for="abbr" position="top" offset="2" animation-delay="300">[[phrase]]</paper-tooltip>
`,is:"lrndesign-abbreviation",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{abbr:{type:String,reflectToAttribute:!0,notify:!0},phrase:{type:String,reflectToAttribute:!0,notify:!0}},attached:function(){let props={canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"Abbreviation",description:"Simple abbreviation with tooltip of full word",icon:"editor:title",color:"grey",groups:["Instructional","Term"],handles:[{type:"inline",text:"text"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"abbr",title:"Abbreviation",description:"Abbreviation word",inputMethod:"textfield",icon:"editor:title"},{property:"phrase",title:"Phrase",description:"The phrase / original words",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"abbr",title:"Abbreviation",description:"Abbreviation word",inputMethod:"textfield",icon:"editor:title"},{property:"phrase",title:"Phrase",description:"The phrase / original words",inputMethod:"textfield",icon:"editor:title"}],advanced:[]}};this.setHaxProperties(props)}});export{LrndesignAbbreviation};