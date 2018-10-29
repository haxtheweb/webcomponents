import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/csv-render/csv-render.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
      .hidden-title {
        display: none;
      }
    </style>
    <div typeof="oer:SupportingMaterial">
      <div class="hidden-title" property="oer:name">[[title]]</div>
      <div property="oer:description">
        <slot></slot>
        <csv-render data-source="[[csvFile]]" caption="[[title]]" summary="[[description]]"></csv-render>
      </div>
    </div>
`,is:"lrn-table",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],properties:{title:{type:String},csvFile:{type:String},description:{type:String}},attached:function(){this.setHaxProperties({canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"CSV table",description:"This can generate a table from a CSV file no matter where it is located.",icon:"editor:border-all",color:"green",groups:["Presentation","Table","Data"],handles:[{type:"csv",source:"csvFile"}],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"csvFile",title:"Source",description:"The URL for this csv file.",inputMethod:"textfield",icon:"link",required:!0},{property:"title",title:"Title",description:"Title for the table to be generated.",inputMethod:"textfield",icon:"editor:title"},{property:"description",title:"Description",description:"More detailed description for improved accessibility of the table data.",inputMethod:"textfield",icon:"editor:short-text"}],configure:[{property:"csvFile",title:"Source",description:"The URL for this csv file.",inputMethod:"textfield",required:!0},{property:"title",title:"Title",description:"Title for the table to be generated.",inputMethod:"textfield"},{property:"description",title:"Description",description:"More detailed description for improved accessibility of the table data.",inputMethod:"textfield"}],advanced:[]}})}});