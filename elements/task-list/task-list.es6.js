import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";Polymer({_template:html`
    <style>
      :host {
        display: block;
      }
    </style>
    <link property="oer:forComponent" content\$="[[relatedResource]]">
    <h2><span property="oer:name">[[name]]</span></h2>
    <ol>
      <template is="dom-repeat" items="[[tasks]]" as="task">
        <li><span property="oer:task">[[task.name]]</span></li>
      </template>
    </ol>
`,is:"task-list",behaviors:[HAXBehaviors.PropertiesBehaviors,MaterializeCSSBehaviors.ColorBehaviors,SchemaBehaviors.Schema],hostAttributes:{typeof:"oer:SupportingMaterial"},observers:["_valueChanged(tasks.*)"],properties:{name:{type:String,value:"Steps to completion"},relatedResource:{type:String},tasks:{type:Array,value:[],notify:!0}},_valueChanged:function(e){for(var i in e.base){for(var j in e.base[i]){this.notifyPath("tasks."+i+"."+j)}}},attached:function(){this.setHaxProperties({canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Task list",description:"A list of tasks which is an ordered list",icon:"icons:list",color:"orange",groups:["Content","Instructional"],handles:[],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"name",title:"Name",description:"Name of the list",inputMethod:"textfield",icon:"editor:title"},{property:"relatedResource",title:"Related resource",description:"A reference to the related Schema resource",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"name",title:"Name",description:"Name of the list",inputMethod:"textfield",icon:"editor:title"},{property:"relatedResource",title:"Related resource",description:"A reference to the related Schema resource",inputMethod:"textfield",icon:"editor:title"},{property:"tasks",title:"Tasks",description:"The tasks to be completed",inputMethod:"array",properties:[{property:"name",title:"Name",description:"Name of the task",inputMethod:"textfield",required:!0},{property:"link",title:"Link",description:"Optional link",inputMethod:"textfield"}]}],advanced:[]}})}});