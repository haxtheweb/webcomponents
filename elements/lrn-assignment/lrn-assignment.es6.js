import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@polymer/paper-card/paper-card.js";import"./node_modules/@polymer/paper-button/paper-button.js";/**
`lrn-assignment`

* @demo demo/index.html
*/let LrnAssignment=Polymer({_template:html`
    <style>
      :host {
        display: flex;
        width: 100%;
      }
      paper-card {
        width: 100%;
      }
    </style>
    <paper-card
      heading="[[title]]"
      image="[[image]]"
      elevation="1"
      animated-shadow="false"
    >
      <div class="card-content">[[details]] <slot></slot></div>
      <div class="card-actions">
        <template is="dom-repeat" items="[[actions]]">
          <a href$="[[item.url]]"
            ><paper-button raised>[[item.label]]</paper-button></a
          >
        </template>
      </div>
    </paper-card>
  `,is:"lrn-assignment",properties:{/**
     * Title
     */title:{type:String},/**
     * Image url
     */image:{type:String},/**
     * Details of the assignment
     */details:{type:String},/**
     * url
     */url:{type:String},open:{type:Boolean,value:!1},complete:{type:Boolean,value:!1},actions:{type:Object}}});export{LrnAssignment};let LrnAssignments=Polymer({_template:html`
    <style>
      :host {
        display: flex;
        flex-wrap: wrap;
      }
      :host lrn-assignment {
        margin: 16px;
      }
      :host([layout="wide"]) lrn-assignment {
        width: calc(100% - 32px);
      }
      :host([layout="medium"]) lrn-assignment {
        width: calc(50% - 32px);
      }
      :host([layout="tight"]) lrn-assignment {
        width: calc(25% - 32px);
      }
    </style>
    <template is="dom-repeat" items="[[assignments]]">
      <lrn-assignment
        title="[[item.title]]"
        actions="[[item.actions]]"
      ></lrn-assignment>
    </template>

    <template is="dom-if" if="[[url]]">
      <iron-ajax
        auto=""
        url="[[url]]"
        handle-as="json"
        on-response="handleResponse"
      ></iron-ajax>
    </template>
  `,is:"lrn-assignments",properties:{assignments:{type:Object,reflectToAttribute:!0,observer:"assignmentsChanged"},layout:{type:String,reflectToAttribute:!0},url:{type:String}},assignmentsChanged:function(assignments){if(1>=assignments.length){this.layout="wide"}else if(4>=assignments.length){this.layout="medium"}else if(6>=assignments.length){this.layout="tight"}},rowItemsChanged:function(items){},handleResponse:function(data){this.assignments=data.response}});export{LrnAssignments};