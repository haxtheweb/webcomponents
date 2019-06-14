import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import{HAXWiring}from"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import{SchemaBehaviors}from"./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";import"./node_modules/@polymer/polymer/lib/elements/dom-repeat.js";/**
 * `task-list`
 * Visual listing of tasks with different design components that is
 * OER Schema capable!
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - task - a singular thing to accomplish
 */class TaskList extends SchemaBehaviors(PolymerElement){constructor(){super();afterNextRender(this,function(){this.HAXWiring=new HAXWiring;this.HAXWiring.setup(TaskList.haxProperties,TaskList.tag,this)})}static get template(){return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <h3><span property="oer:name">[[name]]</span></h3>
      <ol>
        <template is="dom-repeat" items="[[tasks]]" as="task">
          <li><span property="oer:task">[[task.name]]</span></li>
        </template>
      </ol>
    `}static get tag(){return"task-list"}static get observers(){return["_valueChanged(tasks.*)"]}static get properties(){let props={/**
       * Name of this task list
       */name:{type:String,value:"Steps to completion"},/**
       * Related Resource ID
       */relatedResource:{type:String},/**
       * Task list
       */tasks:{type:Array,value:[],notify:!0},_resourceLink:{type:Object,computed:"_generateResourceLink(relatedResource)"}};if(super.properties){props=Object.assign(props,super.properties)}return props}_generateResourceLink(relatedResource){if(this._resourceLink){document.head.removeChild(this._resourceLink)}let link=document.createElement("link");link.setAttribute("property","oer:forComponent");link.setAttribute("content",relatedResource);document.head.appendChild(link);return link}/**
   * Ensure the values change.
   */_valueChanged(e){for(var i in e.base){for(var j in e.base[i]){this.notifyPath("tasks."+i+"."+j)}}}/**
   * Attached to the DOM, now fire.
   */connectedCallback(){super.connectedCallback();this.setAttribute("typeof","oer:SupportingMaterial")}static get haxProperties(){return{canScale:!0,canPosition:!0,canEditSource:!1,gizmo:{title:"Task list",description:"A list of tasks which is an ordered list",icon:"icons:list",color:"orange",groups:["Content","Instructional"],handles:[],meta:{author:"LRNWebComponents"}},settings:{quick:[{property:"name",title:"Name",description:"Name of the list",inputMethod:"textfield",icon:"editor:title"},{property:"relatedResource",title:"Related resource",description:"A reference to the related Schema resource",inputMethod:"textfield",icon:"editor:title"}],configure:[{property:"name",title:"Name",description:"Name of the list",inputMethod:"textfield",icon:"editor:title"},{property:"relatedResource",title:"Related resource",description:"A reference to the related Schema resource",inputMethod:"textfield",icon:"editor:title"},{property:"tasks",title:"Tasks",description:"The tasks to be completed",inputMethod:"array",properties:[{property:"name",title:"Name",description:"Name of the task",inputMethod:"textfield",required:!0},{property:"link",title:"Link",description:"Optional link",inputMethod:"textfield"}]}],advanced:[]}}}}window.customElements.define(TaskList.tag,TaskList);export{TaskList};