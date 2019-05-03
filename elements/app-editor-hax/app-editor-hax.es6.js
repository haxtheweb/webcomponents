import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import{afterNextRender}from"./node_modules/@polymer/polymer/lib/utils/render-status.js";import"./node_modules/@lrnwebcomponents/h-a-x/h-a-x.js";/**
`app-editor-hax`
stand alone editor intended for use in a larger application
as the editor. It is like cms-hax in that it's prepackaged
the way HAX will be integrated but the connotation is that there
is no edit state and that it is always editing effectively.

* @demo demo/index.html

@microcopy - the mental model for this element
 - app - an application desktop or mobile that's deployed this
 - editor - in this case HAX is the editor / authoring tool
 - hax - just to make sure we're aware that it's actually HAX based

*/class AppEditorHax extends PolymerElement{static get template(){return html`
    <style>
      :host {
        display: block;
        font-size: 16px;
        box-sizing: content-box;
      }
    </style>
    <h-a-x app-store$="[[appStoreConnection]]"></h-a-x>`}static get tag(){return"app-editor-hax"}static get properties(){return{/**
       * Establish the app store connection to pull in our JSON
       */appStoreConnection:{type:Object}}}/**
   * Basic save event to make targetting easier.
   */save(){// convert the body area to content
let content=window.HaxStore.instance.activeHaxBody.haxToContent();// fire event so apps can react correctly
this.dispatchEvent(new CustomEvent("app-editor-hax-save",{bubbles:!0,cancelable:!0,composed:!0,detail:content}))}/**
   * Basic import capability abstraction of hax body's import capabilities
   */import(html){// import the HTML blob to get going
window.HaxStore.instance.activeHaxBody.importContent(html);// fire event just letting things know this happened
this.dispatchEvent(new CustomEvent("app-editor-hax-import",{bubbles:!0,cancelable:!0,composed:!0,detail:!0}))}}window.customElements.define(AppEditorHax.tag,AppEditorHax);export{AppEditorHax};