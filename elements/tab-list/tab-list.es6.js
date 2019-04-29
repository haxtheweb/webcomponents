import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";import"./node_modules/@polymer/paper-tabs/paper-tabs.js";import"./node_modules/@polymer/paper-tabs/paper-tab.js";import"./node_modules/@polymer/paper-button/paper-button.js";/**
 * `tab-list`
 * `A simple listing of tabed links / items`
 *
 * @demo demo/index.html
 *
 * @microcopy - the mental model for this element
 * -
 */let TabList=Polymer({_template:html`
    <style>
      :host {
        display: block;
        margin: 0 auto;
        list-style: none;
        display: block;
        padding: 16px;
        border-bottom: 1px solid black;
      }
      paper-tabs {
        align-items: center;
        justify-items: center;
      }
      paper-tab a {
        text-decoration: none;
        flex: unset;
        height: unset;
        width: 100%;
        text-align: center;
      }
      paper-button {
        text-transform: unset;
        width: 100%;
        display: block;
        min-width: unset;
        margin: 0;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      @media screen and (max-width: 600px) {
        paper-tab {
          display: block;
        }
      }
    </style>
    <paper-tabs>
      <template is="dom-repeat" items="[[tabs]]" as="tab">
        <paper-tab>
          <a target="_blank" href="[[tab.link]]" tabindex="-1">
            <paper-button raised>[[tab.label]]</paper-button>
          </a>
        </paper-tab>
      </template>
    </paper-tabs>
  `,is:"tab-list",behaviors:[HAXBehaviors.PropertiesBehaviors],observers:["_valueChanged(tabs.*)"],properties:{/**
     * List of tabs
     */tabs:{type:Array,value:[],notify:!0}},/**
   * Notice an array has changed and update the DOM.
   */_valueChanged:function(e){for(var i in e.base){for(var j in e.base[i]){this.notifyPath("tabs."+i+"."+j)}}},/**
   * Attached to the DOM, now fire.
   */attached:function(){// Establish hax property binding
let props={canScale:!1,canPosition:!1,canEditSource:!1,gizmo:{title:"Tabs",description:"A list of links as tabs.",icon:"icons:tab",color:"grey",groups:["Presentation","Links"],handles:[],meta:{author:"LRNWebComponents"}},settings:{quick:[],configure:[{property:"tabs",title:"Tabs",description:"Listing of tabs",inputMethod:"array",properties:[{property:"link",title:"Link",description:"link to go to",inputMethod:"textfield",required:!0},{property:"label",title:"Label",description:"text to place on the tab",inputMethod:"textfield",required:!0}]}],advanced:[]}};this.setHaxProperties(props)}});export{TabList};