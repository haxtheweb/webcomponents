import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
let SimpleImage = Polymer({
  _template: html`
    <style is="custom-style" include="simple-colors">
      :host {
        display: block;
      }
      @-webkit-keyframes simple-animate {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }

      @keyframes simple-animate {
        0% {
          opacity: 0;
        }

        100% {
          opacity: 1;
        }
      }
      .hero {
          margin-bottom: 21px;
      }
      .hero-img {
          display: block;
          position: absolute;
          width: 100%;
          opacity: 1;
          -webkit-animation: simple-animate 1s ease;
          animation: simple-animate 1s ease;
      }

      .hero-img {
          -webkit-animation: simple-animate 1s ease;
          animation: simple-animate 1s ease;
      }

      .credit {
          color: #8a959e;
          font-family: 'Gotham SSm A','Gotham SSm B','Arial','Verdana','sans-serif';
          font-weight: 400;
          font-size: 9px;
          line-height: 11px;
          margin: 0;
          text-align: right;
      }

      .credit--full {
          margin: 3px 20px 0;
      }

      .caption {
          font-family: museoSlab-500,'Arial Narrow','Arial','Helvetica','sans-serif';
          font-size: 15px;
          line-height: 21px;
          color: #666666;
          font-style: normal;
          margin: 0;
          float: none;
          display: block;
          margin-top: 6px;
      }

      .trigger {
          background-color: #eeeeee;
          padding: 0 0 56.25%;
          position: relative;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          display: block;
          margin: 0;
          border: none;
          width: 100%;
      }

      .trigger:hover {
          cursor: pointer;
      }

      .trigger:focus {
          outline: none;
      }

      .hero--full {
          -webkit-animation: animation-lm3h86 1s ease;
          animation: animation-lm3h86 1s ease;
          margin-top: 90px;
          margin-bottom: 21px;
      }

      @media screen and (min-width: 581px) {
          .hero--full {
              position:relative;
              height: 320px;
          }
      }

      @media screen and (min-width: 769px) {
          .hero--full {
              height:362px;
          }
      }

      @media screen and (min-width: 1024px) {
          .hero--full {
              height:510px;
          }
      }

      .full-img {
          display: block;
          width: 100%;
      }

      @media screen and (min-width: 581px) {
          .full-img {
              position:absolute;
              top: 50%;
              -webkit-transform: translateY(-50%);
              -ms-transform: translateY(-50%);
              transform: translateY(-50%);
          }
      }

      .hero_container-full {
          display: block;
          position: relative;
          overflow: hidden;
      }

      @media screen and (min-width: 581px) {
          .hero_container-full {
              height:320px;
          }
      }

      @media screen and (min-width: 769px) {
          .hero_container-full {
              height:362px;
          }
      }

      @media screen and (min-width: 1024px) {
          .hero_container-full {
              height:510px;
          }
      }
    </style>
    <div class="hero">
      <div class="modal-overlay" style="display: none;">
        <div class="modal-content">
          <div class="modal-wrapper">
            <paper-icon-button id="closearea" icon="icons:fullscreen-exit" class="close-modal modal--close"></paper-icon-button>
            <paper-tooltip for="closearea" position="bottom" offset="14">
              close modal
            </paper-tooltip>                        
            <div class="content">
              <img src\$="[[src]]" alt\$="[[alt]]"></div>
            <div class="meta">
              <div class="credit">[[credit]]</div>
              <div class="caption">[[caption]]</div>
            </div>
          </div>
        </div>
      </div>
      <div class="trigger modal">
        <img class="simple-img" src\$="[[src]]" srcset="https://media.edutopia.org/styles/responsive_200px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 200w,
                           https://media.edutopia.org/styles/responsive_250px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 250w,
                           https://media.edutopia.org/styles/responsive_300px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 300w,
                           https://media.edutopia.org/styles/responsive_310px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 310w,
                           https://media.edutopia.org/styles/responsive_350px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 350w,
                           https://media.edutopia.org/styles/responsive_450px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 450w,
                           https://media.edutopia.org/styles/responsive_500px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 500w,
                           https://media.edutopia.org/styles/responsive_550px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 550w,
                           https://media.edutopia.org/styles/responsive_600px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 600w,
                           https://media.edutopia.org/styles/responsive_620px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 620w,
                           https://media.edutopia.org/styles/responsive_650px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 650w,
                           https://media.edutopia.org/styles/responsive_700px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 700w,
                           https://media.edutopia.org/styles/responsive_750px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 750w,
                           https://media.edutopia.org/styles/responsive_768px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 768w,
                           https://media.edutopia.org/styles/responsive_800px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 800w,
                           https://media.edutopia.org/styles/responsive_900px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 900w,
                           https://media.edutopia.org/styles/responsive_1000px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1000w,
                           https://media.edutopia.org/styles/responsive_1100px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1100w,
                           https://media.edutopia.org/styles/responsive_1200px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1200w,
                           https://media.edutopia.org/styles/responsive_1240px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1240w,
                           https://media.edutopia.org/styles/responsive_1300px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1300w,
                           https://media.edutopia.org/styles/responsive_1400px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1400w,
                           https://media.edutopia.org/styles/responsive_1440px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1440w,
                           https://media.edutopia.org/styles/responsive_1500px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1500w,
                           https://media.edutopia.org/styles/responsive_1536px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1536w,
                           https://media.edutopia.org/styles/responsive_1600px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 1600w,
                           https://media.edutopia.org/styles/responsive_2000px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 2000w,
                           https://media.edutopia.org/styles/responsive_2880px_16x9/s3/masters/2018-05/kids-doing-homework-math-problems-at-the-kitchen-table-at-home_t20_K6blK1_master.jpg 2880w," sizes="100vw" alt\$="[[alt]]"></div>
      <div class="credit">[[credit]]</div>
      <iron-icon icon="icons:fullscreen" class="close-fullscreen"></iron-icon>
    </div>
`,
  is: "simple-image",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
    src: { type: String },
    alt: { type: String },
    caption: { type: String },
    credit: { type: String }
  },
  attached: function() {
    let props = {
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
      gizmo: {
        title: "Simple image",
        description:
          "A clean, simple image presentation that's responsive and modals on tapping",
        icon: "editor:insert-photo",
        color: "green",
        groups: ["Image", "Media"],
        handles: [{ type: "image", url: "src" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "src",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: !0
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "alt",
            icon: "accessibility",
            required: !0
          }
        ],
        configure: [
          {
            property: "src",
            title: "Source",
            description: "The URL for the image.",
            inputMethod: "textfield",
            icon: "link",
            required: !0
          },
          {
            property: "caption",
            title: "Caption",
            description: "A caption to describe the image usage",
            inputMethod: "textarea"
          },
          {
            property: "alt",
            title: "Alternative text",
            description: "Text to describe the image to non-sighted users.",
            inputMethod: "alt"
          },
          {
            property: "credit",
            title: "Credits",
            description: "Who the image is credited to / copyright information",
            inputMethod: "textarea"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
export { SimpleImage };
