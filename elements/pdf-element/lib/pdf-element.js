import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-toolbar/paper-toolbar.js";
import "@polymer/paper-input/paper-input.js";
import "@polymer/iron-input/iron-input.js";
import "@polymer/paper-spinner/paper-spinner.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "pdfjs-dist/web/compatibility.js";
import "pdfjs-dist/build/pdf.js";
import "pdfjs-dist/build/pdf.worker.js";
import "./main.js";
/**
Polymer element which renders PDF documents. It uses [PDF.js](https://mozilla.github.io/pdf.js/) library behind.

Example:

Minimum configuration:
```html
<pdf-element src="../example.pdf" width=800 height=600></pdf-element>
```
Optionally following parameters could be triggered:
 - `elevation` material elevation;
 - `downloadable` to be able to download document;
 - `show-file-name` to show name of the file in the PDF toolbar.


 ```html
 <pdf-element src="../example.pdf" elevation="5" downloadable show-file-name width=800 height=600></pdf-element>
 ```

Another awesome feature is dynamically load PDF file. So you can change the `src` attribute of the element and document will be automatically reloaded (checkout the demo):

```html
<pdf-element src="[[pdfFile]]" width=800 height=600></pdf-element>
```

@demo demo/index.html
@hero hero.svg
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }

      paper-toolbar.pdf-toolbar {
        --paper-toolbar-background: #323639;
      }

      .pdf-viewer {
        text-align: center;
        border: 1px solid #4d4d4d;
      }

      .pdf-viewport-out {
        overflow: auto;
        background-color: #525659;
        position: relative;
        width: 100%;
        height: 100%;
      }

      .pdf-viewport {
        display: block;
        position: relative;
        border: 1px solid #eeeeee;
        transition: all 200ms ease-in-out;
        width: 100%;
        height: 100%;
      }

      .sidebar {
        background-color: gray;
        float: left;
        height: 0px;
        overflow: scroll;
        margin-left: -25%;
        visibility: hidden;
      }

      .main {
        margin-left: 0%;
      }

      .pageselector {
          width: 3ch;
          background-color : black; 
          font-size: 17px;
          background-color:transparent;
          border: 0px solid;
        }

        .pageselector:focus{
          outline:none;
        }

      #input {
        -webkit-margin-start: -3px;
        color: #fff;
        line-height: 18px;
        padding: 3px;
        text-align: end;
      }

      #input:focus,
      #input:hover {
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 2px;
      }

      #slash {
        padding: 0 3px;
      }

      paper-spinner {
        position: absolute;
        left: 50%;
      }

      .textLayer {
        transition: all 200ms ease-in-out;
      }

      .positionRelative {
        position: relative;
      }
    </style>

    <paper-material elevation="{{elevation}}">
      <div class="card-content" style="width: {{width}}px">
        <paper-card class="paperCard" style="width: {{width}}px">
          <div class="pdf-viewer">
            <paper-toolbar class="pdf-toolbar">
              <paper-icon-button icon="menu" on-click="sideBar"></paper-icon-button>
              <paper-icon-button icon="arrow-back" on-click="showPrev"></paper-icon-button>
              <input class="pageselector" id="input" is="iron-input" value="{{currentPage}}" prevent-invalid-input="" allowed-pattern="\\d" on-change="pageNumSearch">
              <span id="slash">/</span><span id="totalPages"></span>
              <paper-icon-button icon="arrow-forward" on-click="showNext"></paper-icon-button>
              <span class="title" hidden="{{!showFileName}}">Testing</span>
              <span class="title" hidden="{{showFileName}}"></span>
              <span class="pageRendering"></span>
              <paper-icon-button icon="zoom-in" on-click="zoomIn"></paper-icon-button>
              <paper-icon-button icon="zoom-out" on-click="zoomOut"></paper-icon-button>
              <paper-icon-button id="zoomIcon" icon="fullscreen" on-click="zoomFit"></paper-icon-button>
              <paper-icon-button icon="file-download" hidden\$="{{!downloadable}}" on-click="download"></paper-icon-button>
            </paper-toolbar>
            <div id="container" class="sidebar" style="width:25%"></div>
            <div id="main">
            <div id="test" class="pdf-viewport-out">
              <canvas class="pdf-viewport"></canvas>
              <div id="text-layer" class="textLayer" hidden\$="{{!enableTextSelection}}"></div>
            </div>
            <paper-spinner class="spinner" hidden\$="{{!showSpinner}}"></paper-spinner>
          </div>
        </div>
        </paper-card>
      </div>
    </paper-material>
`,

  is: "pdf-element",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * Source of a PDF file.
     */
    src: {
      type: String,
      reflectToAttribute: true
    },
    /**
     * The z-depth of this element, from 0-5. Setting to 0 will remove the shadow, and each increasing number greater than 0 will be "deeper" than the last.
     */
    elevation: {
      type: Number,
      value: 1
    },
    /**
     * If provided then download icon will appear on the toolbar to download file.
     */
    downloadable: {
      type: Boolean,
      value: false
    },
    /**
     * If provided then file name will be shown on the toolbar.
     */
    showFileName: {
      type: Boolean,
      value: false
    },
    /*
     * If provided then during page rendering loading spinner will be shown.
     * Maybe used for documents with many images for example.
     */
    showSpinner: {
      type: Boolean,
      value: false
    },
    /*
     * If provided then text selection will be enabled.
     */
    enableTextSelection: {
      type: Boolean,
      value: false
    },
    /*
     * If provided then the document will be zoomed to maximum width initially.
     */
    fitWidth: {
      type: Boolean,
      value: false
    },
    /*
    * If provided then the width will be set.
    */
    width: {
      type: Number,
      value: 500
    }
  },

  attached: function() {
    this.src = this.getAttribute("src");
    this._initializeReader();
    if (this.src) this.instance.loadPDF();
    this._setFitWidth();
    // Establish hax properties
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "PDF viewer",
        descrption:
          "This can nicely present a PDF in a standard inplace, cross browser way.",
        icon: "image:picture-as-pdf",
        color: "red",
        groups: ["Presentation", "PDF", "Data"],
        handles: [
          {
            type: "pdf",
            url: "src",
            source: "src"
          },
          {
            type: "document",
            url: "src",
            source: "src"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "src",
            title: "File",
            description: "The URL for the pdf",
            inputMethod: "textfield",
            icon: "link",
            required: true
          }
        ],
        configure: [
          {
            property: "src",
            title: "Source",
            description: "The URL for this csv file",
            inputMethod: "textfield",
            icon: "link",
            required: true
          },
          {
            property: "downloadable",
            title: "Downloadable",
            description: "User can download this",
            inputMethod: "boolean",
            icon: "file-download"
          },
          {
            property: "enableTextSelection",
            title: "Text Selection",
            description: "User can select text in this element.",
            inputMethod: "boolean",
            icon: "file-download"
          },
          {
            property: "elevation",
            title: "Elevation",
            description: "Visual elevation of the element",
            inputMethod: "number",
            icon: "flip-to-front"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /* 
  * For the first time the pdf is loaded.
  * The inital page is set to 1 and it sets the total Pages
  */
  loadPDF: function() {
    if (!this.getAttribute("src")) return;
    this.instance.changePDFSource(this.getAttribute("src"));
    this.currentPage = 1;
    this.totalPages = this.instance.totalPages;
    this.fileName = this.src.split("/").pop();
    this._setFitWidth();
    this.$.zoomIcon.icon = "fullscreen";
  },

  /*
  * When a new pdf is selected and loaded, this sets the properties for the switch
  */
  attributeChanged: function(name, type) {
    if (name === "src") {
      if (typeof this.instance == "undefined") this._initializeReader();
      else {
        this.loadPDF();
        this.changedSideBar = true;
        this.fromChange = true;
        this.sideBar();
      }
    } else if (name === "fitWidth") {
      this._setFitWidth();
    }
  },

  _initializeReader: function() {
    this.instance = new Polymer.Reader(this);
    if (this.src != null) this.fileName = this.src.split("/").pop();
    this.currentPage = 1;
  },

  _setFitWidth: function() {
    this.instance.setFitWidth(this.fitWidth);
  },

  /*
  * Is called from zoomIn function to control the zoom in
  */
  zoomInOut: function(step) {
    if (this.instance.currentZoomVal >= 2) {
      this.instance.currentZoomVal = 2;
    } else if (this.instance.currentZoomVal <= 0.1) {
      this.instance.currentZoomVal = 0.1;
    } else {
      this.$.zoomIcon.icon = "fullscreen";
      this.instance.zoomInOut(step);
    }
  },

  /*
  * Zoom in to the pdf as long as it is loaded
  */
  zoomIn: function() {
    if (this.instance.pdfExists) {
      this.zoomInOut(0.1);
    }
  },

  /*
  * Zoom out of the pdf as long as it is loaded
  */
  zoomOut: function() {
    if (this.instance.pdfExists) {
      this.instance.zoomInOut(-0.1);
    }
  },

  /*
  * When the zoom in/out button is selected. Reformats the pdf to the original display
  */
  zoomFit: function() {
    if (this.instance.pdfExists) {
      if (this.instance.currentZoomVal == this.instance.widthZoomVal) {
        this.instance.zoomPageFit();
        this.$.zoomIcon.icon = "fullscreen";
      } else {
        this.instance.zoomWidthFit();
        this.$.zoomIcon.icon = "fullscreen-exit";
      }
    }
  },

  /*
  * Controls the page search functionality.
  * When a number is input it checks to see if it is a valid page
  * If it is valid then it will change the view to that page 
  * as well as update the page number
  */
  pageNumSearch: function() {
    var page = parseInt(this.$.input.value);

    if (1 <= page && page <= this.instance.totalPagesNum) {
      this.instance.currentPage = page;
      this.instance.queueRenderPage(this.instance.currentPage);
      this.currentPage = page;
      this.$.input.blur();
    } else {
      this.$.input.value = this.currentPage;
      this.$.input.blur();
    }
  },

  /*
  * Is called when a page is selected from the sidebar
  * Checks to make sure a valid page is selected, then changes the page
  * The currentInstance is passed in to make sure it is changing the proper pdf if multiple are loaded
  */
  sideBarClick: function(page, currentInstance, currentThis) {
    //this.instance = currentInstance;
    var parsedFileName = currentThis.src.split("/").pop();
    var self = currentInstance;
    currentThis.sidebarOpen = true;
    if (1 <= page && page <= currentInstance.totalPagesNum) {
      self.currentPage = page;
      self.queueRenderPage(self.currentPage);
      currentInstance.currentPage = page;
      currentThis.currentPage = page;
      this.$.input.blur();
    } else {
      this.$.input.value = self.currentPage;
      this.$.input.blur();
    }
  },

  /*
  * Is called to show the previous page and update page number
  */
  showPrev: function() {
    if (1 < this.instance.currentPage) {
      this.instance.currentPage--;
      this.instance.queueRenderPage(this.instance.currentPage);
      this.currentPage--;
    }
  },

  /*
  * Is called to show the next page and update page number
  */
  showNext: function() {
    if (this.instance.totalPagesNum > this.instance.currentPage) {
      this.instance.currentPage++;
      this.instance.queueRenderPage(this.instance.currentPage);
      this.currentPage++;
    }
  },

  /*
  * The sidebar is a scrollable bar on the side of the page that allows you to scroll and select a page to change to
  * Checks if the pdf loaded changed
  * Then checks if the sidebar is open or not
  * If it is open, close. Else open sidebar. Set sidebarOpen to either T or F
  */
  sideBar: function() {
    if (this.instance.pdfExists) {
      if (!this.fromChange) {
        this.$.container.style.height = this.$.test.style.height;
        this.$.container.style.width = this.$.test.style.width;
        if (this.$.main.style.marginLeft == "25%") {
          this.sidebarOpen = false;
          this.instance.setViewportPos(false);
          this.$.main.style.marginLeft = "0%";
          this.$.container.style.marginLeft = "-25%";
          this.$.container.style.visibility = "hidden";
        } else {
          this.sidebarOpen = true;
          this.$.main.style.marginLeft = "25%";
          this.$.container.style.marginLeft = "0%";
          this.$.container.style.visibility = "visible";
          this.instance.setViewportPos(true);
        }
      }
      this.fromChange = false;
      this.instance.sidebarSetup(this);
      this.changedSideBar = false;
    }
  },

  /*
  * Is called when the download pdf button is selected
  */
  download: function() {
    if (this.instance.pdfExists) {
      this.instance.download();
    }
  }
});
