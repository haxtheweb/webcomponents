import "@polymer/polymer/polymer.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-material/paper-material.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";
import "@polymer/iron-iconset/iron-iconset.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/maps-icons.js";
import "@polymer/iron-icons/social-icons.js";
import "@polymer/iron-icon/iron-icon.js";
import "../lrnapp-studio-submissions-list/lrnapp-studio-submissions-list.js";
import "materializecss-styles/materializecss-styles.js";
Polymer({
  _template: `
    <style include="materializecss-styles"></style>
    <style>
      :host {
        display: block;
      }
      .center {
        text-align: center;
      }
      @media (min-width:1200px) {
        .paper-material-padding-med {
          padding:3.5rem;
        }
      }
      @media (min-width:56rem) {
        .lrnapp-studio-displayboard-wrapper {
          max-width: 54rem;
          margin: 2rem auto;
        }
      }
      @media (max-width:410px) {
        .lrnapp-studio-displayboard-wrapper {
          min-width: 100%;
          margin-left: 0;
          margin-right: 0;
        }
        .paper-material-0[elevation="3"] {
            box-shadow: none;
        }
      }
      </style>

    <paper-material elevation="3" class="paper-material-margin-med lrnapp-studio-displayboard-wrapper">
      <div class="paper-material-padding-med">
      <paper-button class="black"><iron-icon icon="clear"></iron-icon> Close</paper-button>

        <h1 class="center">[[title]]</h1>
        <p class="center">By [[author]]</p>
      </div>
      <lrnapp-studio-submissions-list></lrnapp-studio-submissions-list>
      <div class="divider"></div>
      <!-- <div class="paper-material-padding-med">
          <paper-button class="black"><iron-icon icon="clear"></iron-icon> Close</paper-button>
      </div> -->
    </paper-material>
`,

  is: "lrnapp-studio-displayboard",

  properties: {
    title: {
      type: String,
      value: "Project 1 Title"
    },
    author: {
      type: String,
      value: "Bill Billerson"
    }
  }
});
