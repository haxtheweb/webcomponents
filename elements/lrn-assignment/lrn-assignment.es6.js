import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./node_modules/@polymer/paper-card/paper-card.js";import"./node_modules/@polymer/paper-button/paper-button.js";import"./node_modules/@polymer/polymer/lib/elements/dom-repeat.js";import"./node_modules/@polymer/polymer/lib/elements/dom-if.js";/**
`lrn-assignment`

* @demo demo/index.html
*/class LrnAssignment extends PolymerElement{static get template(){return html`
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
    `}static get tag(){return"lrn-assignment"}static get properties(){return{/**
       * Title
       */title:{type:String},/**
       * Image url
       */image:{type:String},/**
       * Details of the assignment
       */details:{type:String},/**
       * url
       */url:{type:String},open:{type:Boolean,value:!1},complete:{type:Boolean,value:!1},actions:{type:Object}}}}window.customElements.define(LrnAssignment.tag,LrnAssignment);export{LrnAssignment};class LrnAssignments extends PolymerElement{static get template(){return html`
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
    `}static get tag(){return"lrn-assignments"}static get properties(){return{assignments:{type:Object,reflectToAttribute:!0,observer:"assignmentsChanged"},layout:{type:String,reflectToAttribute:!0},url:{type:String}}}assignmentsChanged(assignments){if(1>=assignments.length){this.layout="wide"}else if(4>=assignments.length){this.layout="medium"}else if(6>=assignments.length){this.layout="tight"}}rowItemsChanged(items){}handleResponse(data){this.assignments=data.response}}window.customElements.define(LrnAssignments.tag,LrnAssignments);export{LrnAssignments};