import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";import"./node_modules/@polymer/iron-image/iron-image.js";import"./node_modules/@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";/**
`lrndesign-course-banner`
A LRN element

* @demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/let LrndesignCourseBanner=Polymer({_template:html`
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
        background-color: rgba(30, 30, 30, 0.8);
        text-align: left;
        margin: -5em 0 0 0;
        padding: 16px;
        color: #ffffff;
        height: 64px;
      }
      .course-avatar {
        float: left;
        display: inline-flex;
        padding: 0 16px 0 0;
      }
      .course-name {
        font-size: 16px;
        line-height: 16px;
        min-width: 96px;
      }
      .course-title {
        font-size: 16px;
        line-height: 16px;
        display: none;
      }
      .name-wrapper {
        display: flow-root;
        overflow: hidden;
        text-overflow: clip;
      }
      @media screen and (min-width: 420px) {
        .course-name {
          font-size: 24px;
        }
        .course-title {
          display: block;
        }
      }
    </style>
    <iron-image
      class="course-image"
      style="width:100%; height:200px; background-color: lightgray;"
      sizing="cover"
      preload=""
      fade=""
      src\$="[[image]]"
    ></iron-image>
    <div class="course-heading">
      <lrndesign-avatar
        class="course-avatar"
        label="[[name]]"
        jdenticon=""
        color="[[color]]"
      >
      </lrndesign-avatar>
      <div class="name-wrapper">
        <div class="course-name">[[name]]</div>
        <div class="course-title">[[title]]</div>
      </div>
    </div>
  `,is:"lrndesign-course-banner",properties:{/**
     * Text representation of the color like red or blue
     */color:{type:String},/**
     * Banner image
     */image:{type:String},/**
     * Name of the course
     */name:{type:String},/**
     * Title of the course, longer description.
     */title:{type:String}}});export{LrndesignCourseBanner};