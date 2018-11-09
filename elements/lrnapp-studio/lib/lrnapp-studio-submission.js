import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/scary-gallery/scary-gallery.js";
import "@polymer/paper-header-panel/paper-header-panel.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@lrnwebcomponents/s-grid/lib/s-grid-style.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="lrnapp-studio-submission">
  <template is="dom-bind">
   <style include="iron-flex iron-flex-alignment"></style>
    <style include="s-grid-style s-grid-1-style">
      :host {
        --s-grid-1-items: 3;
        --s-grid-1-item-height: 100px;
      }
      ul {
        padding: 0;
        list-style: none;
      }
      .item {
        background-color: white;
      }
      @media (max-width: 640px) {
        :host {
          --s-grid-1-items: 1;
        }
      }
    </style>
    <style> 
      :host {
        display: block;
      }
      hr {
        border-top: 1px solid #8c8b8b;
      }
      paper-material {
        margin: 16px 16px;
      }
      
      .submission-title {
        font-family: "Roboto", sans-serif;
        font-weight: 500;
        font-size: 36px;
        margin-bottom: 12px;
      }
      .submission-date {
        font-size:12px;
        margin-bottom:32px;
      }
      .submission-attachments, .submission-links {
        padding: 4px;
        border: 1px solid #dfdfdf;
        border-radius: 4px;
        margin:16px 0;
        padding:16px;
      }
      .submission-attachments-title, .submission-links-title {
        color: #888;
        margin-top: 0;
        border-bottom: 1px solid #efefef;
        padding-bottom: 16px;
        margin-bottom: 12px;
      }
      @media (min-width:1200px) {
        .paper-material-margin-med {
          padding:32px 56px;
        }
      }
      scary-gallery {
        margin: 28px 0;
      }
    </style>
      
        <!-- <div class="s-grid s-grid-1">
          <div class="item">Thing 1</div>
          <div class="item">Thing 2</div>
          <div class="item">Thing 3</div>
        </div> -->
      <div class="divider"></div>
      <div class="paper-material-margin-med">
        <h2 class="submission-title">[[title]]</h2>
        <p class="submission-date">Posted on [[post_date]]</p>
        <p class="padding-width-med padding-height-small">[[text]]</p>  
           
      <template is="dom-if" if="[[images]]">
        <scary-gallery min-height="100">
          <template is="dom-repeat" items="[[images]]" as="image">
            <scary-image src="[[image]]"></scary-image>
          </template>
        </scary-gallery>
      </template>
      <template is="dom-if" if="[[attachments]]">
        <div class="submission-attachments">
          <div class="submission-attachments-title">Attachments</div>
          <template is="dom-repeat" items="[[attachments]]" as="attachment">
            <paper-button class="black"><a href="[[attachment]]" target="_blank">[[attachment]]</a></paper-button>
          </template>
        </div>
      </template>

      <template is="dom-if" if="[[links]]">
        <div class="submission-links">
          <div class="submission-links-title">Links</div>
          <template is="dom-repeat" items="[[links]]" as="link">
            <paper-button class="black"><a href="[[link]]" target="_blank">[[link]]</a></paper-button>
          </template>
        </div>
      </template>
      
      </div>
      

    


  </template>

  
</dom-module>`;

document.head.appendChild($_documentContainer);
Polymer({
  is: "lrnapp-studio-submission",

  properties: {
    title: {
      type: String
    },
    text: {
      type: String
    },
    author: {
      type: String
    },
    images: {
      type: Array
    },
    links: {
      type: Array
    },
    post_date: {
      type: String
    },
    attachments: {
      type: Array
    }
  }
});
