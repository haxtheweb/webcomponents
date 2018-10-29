import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@polymer/iron-image/iron-image.js";import"./node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";Polymer({_template:html`
    <style include="materializecss-styles-colors">
      :host {
        display: block;
      }
      /**
       * Dialog
       */
      .course-image {

      }
      .course-heading {
        position: relative;
        background-color: rgba(30, 30, 30, .8);
        text-align: left;
        margin: -5em 0 0 0;
        padding: 1em;
        color: #ffffff;
        height: 4em;
      }
      .course-avatar {
        float: left;
        display: inline-flex;
        padding: 0 1em 0 0;
      }
      .course-name {
        font-size: 1em;
        line-height: 1em;
        min-width: 6em;
      }
      .course-title {
        font-size: 1em;
        line-height: 1em;
        display: none;
      }
      .name-wrapper {
        display: flow-root;
        overflow: hidden;
        text-overflow: clip;
      }
      @media screen and (min-width: 420px) {
        .course-name {
          font-size: 1.5em;
        }
        .course-title {
          display: block;
        }
      }
    </style>
    <iron-image class="course-image" style="width:100%; height:200px; background-color: lightgray;" sizing="cover" preload="" fade="" src\$="[[image]]"></iron-image>
    <div class="course-heading">
      <lrndesign-avatar class="course-avatar" label="[[name]]" jdenticon="" color="[[color]]">
      </lrndesign-avatar>
      <div class="name-wrapper">
        <div class="course-name">[[name]]</div>
        <div class="course-title">[[title]]</div>
      </div>
    </div>
`,is:"lrndesign-course-banner",properties:{color:{type:String},image:{type:String},name:{type:String},title:{type:String}}});