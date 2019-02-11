import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import{SimpleColors}from"./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";import"./lib/simple-concept-network-node.js";let SimpleConceptNetwork=Polymer({_template:html`
    <style include="simple-colors">
      :host {
        display: block;
      }
      :host([visualization="network"]) simple-concept-network-node {
        position: relative;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(1) {
        top: 150px;
        left: 176px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(2) {
        top: 0px;
        left: 60px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(3) {
        top: 75px;
        left: 60px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(4) {
        top: 230px;
        left: -56px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(5) {
        top: 300px;
        left: -282px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(6) {
        top: 230px;
        left: -515px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(7) {
        top: 75px;
        left: -630px;
      }
      :host([visualization="network"]) {
        display: block;
        min-height: 450px;
      }
    </style>
    <template is="dom-repeat" items="[[nodes]]" as="node">
      <simple-concept-network-node
        accent-color$="[[node.color]]"
        colored-text$="[[coloredText]]"
        dark$="[[dark]]"
        visualization$="[[visualization]]"
        src$="[[node.src]]"
        icon$="[[node.icon]]"
        image$="[[node.image]]"
        label$="[[node.label]]"
        disabled$="[[node.disabled]]"
      ></simple-concept-network-node>
    </template>
  `,is:"simple-concept-network",behaviors:[HAXBehaviors.PropertiesBehaviors,SimpleColors,A11yBehaviors.A11y],observers:["_valueChanged(nodes.*)"],properties:{visualization:{type:String,reflectToAttribute:!0,value:"3d"},disabled:{type:Boolean},coloredText:{type:Boolean,reflectToAttribute:!0,value:!1},nodes:{type:Array,value:[],notify:!0}},_valueChanged:function(e){for(var i in e.base){for(var j in e.base[i]){this.notifyPath("nodes."+i+"."+j)}}},attached:function(){let props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Concept Network",description:"A simple way of visualizing data in a small network style configuration.",icon:"lrn:network",color:"blue",groups:["Image","Visualization"],handles:[{type:"image",source:"nodes.source",title:"nodes.label",link:"nodes.src",description:"nodes.description"}],meta:{author:"LRNWebComponents"}},settings:{quick:[],configure:[{property:"visualization",title:"Visualization",description:"How to visualize the concept",inputMethod:"select",options:{"3d":"3d plain",network:"network",flat:"flat"}},{property:"dark",title:"Dark",description:"Use dark theme",inputMethod:"boolean",icon:"invert-colors"},{property:"coloredText",title:"Colored Text / Icon",description:"Apply color to text / icon instead of background.",inputMethod:"boolean",icon:"editor:format-color-text"},{property:"nodes",title:"Node list",description:"List of the items to present in the visual",inputMethod:"array",properties:[{property:"color",title:"Node color",description:"Select the accent color for this node",inputMethod:"colorpicker",icon:"editor:format-color-fill"},{property:"icon",title:"Icon",description:"icon to display in the middle",inputMethod:"iconpicker",options:[]},{property:"label",title:"Label",description:"Label",inputMethod:"textfield"},{property:"image",title:"Image",description:"Image for the background",inputMethod:"textfield",validationType:"url"},{property:"description",title:"Description",description:"A longer description that can be used as part of a modal presentation",inputMethod:"textfield"},{property:"src",title:"Link",description:"Label",inputMethod:"textfield",validationType:"url"}]}],advanced:[]}};this.setHaxProperties(props)}});export{SimpleConceptNetwork};