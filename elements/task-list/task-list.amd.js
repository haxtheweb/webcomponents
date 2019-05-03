define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js","./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js"],function(_exports,_polymerLegacy,_HAXWiring,_schemaBehaviors){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.TaskList=void 0;function _templateObject_ba28f3906d0911e98cf779863d9fb275(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n      }\n    </style>\n    <h3><span property=\"oer:name\">[[name]]</span></h3>\n    <ol>\n      <template is=\"dom-repeat\" items=\"[[tasks]]\" as=\"task\">\n        <li><span property=\"oer:task\">[[task.name]]</span></li>\n      </template>\n    </ol>\n  "]);_templateObject_ba28f3906d0911e98cf779863d9fb275=function _templateObject_ba28f3906d0911e98cf779863d9fb275(){return data};return data}/**
`task-list`
Visual listing of tasks with different design components that is
OER Schema capable!

* @demo demo/index.html

@microcopy - the mental model for this element
 - task - a singular thing to accomplish

*/var TaskList=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_ba28f3906d0911e98cf779863d9fb275()),is:"task-list",behaviors:[HAXBehaviors.PropertiesBehaviors,SchemaBehaviors.Schema],hostAttributes:{typeof:"oer:SupportingMaterial"},observers:["_valueChanged(tasks.*)"],properties:{/**
     * Name of this task list
     */name:{type:String,value:"Steps to completion"},/**
     * Related Resource ID
     */relatedResource:{type:String},/**
     * Task list
     */tasks:{type:Array,value:[],notify:!0},_resourceLink:{type:Object,computed:"_generateResourceLink(relatedResource)"}},_generateResourceLink:function _generateResourceLink(relatedResource){if(this._resourceLink){document.head.removeChild(this._resourceLink)}var link=document.createElement("link");link.setAttribute("property","oer:forComponent");link.setAttribute("content",relatedResource);document.head.appendChild(link);return link},/**
   * Ensure the values change.
   */_valueChanged:function _valueChanged(e){for(var i in e.base){for(var j in e.base[i]){this.notifyPath("tasks."+i+"."+j)}}},/**
   * Attached to the DOM, now fire.
   */attached:function attached(){// Establish hax property binding
var props={canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Task list",description:"A list of tasks which is an ordered list",icon:"icons:list",color:"orange",groups:["Content","Instructional"],handles:[],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"name",title:"Name",description:"Name of the list",inputMethod:"textfield",icon:"editor:title"},{property:"relatedResource",title:"Related resource",description:"A reference to the related Schema resource",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"name",title:"Name",description:"Name of the list",inputMethod:"textfield",icon:"editor:title"},{property:"relatedResource",title:"Related resource",description:"A reference to the related Schema resource",inputMethod:"textfield",icon:"editor:title"},{property:"tasks",title:"Tasks",description:"The tasks to be completed",inputMethod:"array",properties:[{property:"name",title:"Name",description:"Name of the task",inputMethod:"textfield",required:!0},{property:"link",title:"Link",description:"Optional link",inputMethod:"textfield"}]}],advanced:[]}};this.setHaxProperties(props)}});_exports.TaskList=TaskList});