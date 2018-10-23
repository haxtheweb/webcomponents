import "@polymer/polymer/polymer.js";
import "simple-search/simple-search.js";
import "simple-colors/simple-colors.js";
import "./a11y-media-behaviors.js";
import "./a11y-media-button.js";
/**
`a11y-media-transcript-controls`
A controls for the transcript element

@demo demo/index.html

@microcopy - the mental model for this element
  <a11y-media-transcript-controls 
    accent-color$="[[accentColor]]"                 // Optional accent color highlighted cues, 
                                                    // using the following materialize colors: 
                                                    // red, pink, purple, deep-purple, indigo, blue, 
                                                    // light blue, cyan, teal, green, light green, lime, 
                                                    // yellow, amber, orange, deep-orange, and brown. 
                                                    // Default is null. 
    custom-microcopy$="[[customMicrocopy]]"         // Optional customization or text and icons
    disable-print-button$="[[disablePrintButton]]"  // Disable the print button?
    disable-scroll$="[[disableScroll]]"             // Disable autoscrolling transcript as video plays? 
    disable-search$="[[disableSearch]]"             // Disable transcript search? 
  </a11y-media-transcript-controls>

*/
Polymer({
  _template: `
    <style is="custom-style">
        :host { 
          background-color: var(--a11y-media-transcript-bg-color);
          color: var(--a11y-media-transcript-text-color);
          --a11y-media-button-color: var(--a11y-media-transcript-color);
          --a11y-media-button-bg-color: var(--a11y-media-transcript-bg-color);
          --a11y-media-button-toggle-color: var(--a11y-media-transcript-accent-color);
          --a11y-media-button-hover-color: var(--a11y-media-transcript-faded-accent-color);
          --a11y-media-button-hover-bg-color:  var(--a11y-media-transcript-bg-color);
          --simple-search-input-color: var(--a11y-media-transcript-color);
          --simple-search-input-line-color: var(--a11y-media-transcript-accent-color);
          --simple-search-input-placeholder-color: var(--a11y-media-transcript-color);
          --simple-search-button-color: var(--a11y-media-transcript-accent-color);
          --simple-search-button-hover-color: var(--a11y-media-transcript-faded-accent-color);
          --simple-search-button-bg-color: var(--a11y-media-transcript-bg-color);
          --simple-search-button-border-color: var(--a11y-media-transcript-bg-color);
          --simple-search-button-hover-border-color: var(--a11y-media-transcript-bg-color);
          --simple-search-button-disabled-color: var(--simple-colors-background5);
          --simple-search-button-disabled-bg-color: var(--simple-colors-background2);
          --simple-search-button-disabled-border-color: var(--simple-colors-background3);
          --simple-search-container: {
            padding: 0 15px;
          };
        }
        :host #searchbar {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          width: 100%;
        }
        :host #searching {
          flex-grow: 2;
        }
        :host #autoscroll {
          padding-right: 0.5em;
        }
        :host #scrolling,
        :host #printing {
          display: flex;
          align-items: center;
        }
        @media print {
          :host {
            display: none;
          }
        }
    </style>
    <div id="searchbar">
      <div id="searching">
        <simple-search id="search" disabled\$="[[disableSearch]]" controls="transcript" hidden\$="[[disableSearch]]" no-label-float="" next-button-icon\$="[[searchNextIcon]]" next-button-label\$="[[searchNextLabel]]" prev-button-icon\$="[[searchPrevIcon]]" prev-button-label\$="[[searchPrevLabel]]" search-input-icon\$="[[searchIcon]]" search-input-label\$="[[searchLabel]]" target="[[target]]">
        </simple-search>
      </div>
      <div id="scrolling">
        <a11y-media-button id="scroll" controls="transcript" icon="[[autoScrollIcon]]" label="[[autoScrollLabel]]" toggle\$="[[!disableScroll]]">
        </a11y-media-button>
      </div>
      <div id="printing" hidden\$="[[disablePrintButton]]" disabled\$="[[disablePrintButton]]">
        <a11y-media-button controls="transcript" id="print" icon="[[printIcon]]" label="[[printLabel]]">
        </a11y-media-button>
      </div>
    </div>
`,

  is: "a11y-media-transcript-controls",

  behaviors: [
    simpleColorsBehaviors,
    a11yMediaBehaviors.GeneralFunctions,
    a11yMediaBehaviors.TranscriptBehaviors
  ],

  properties: {
    /**
     * Language
     */
    lang: {
      type: String,
      value: "en",
      reflectToAttribute: true
    },
    /**
     * target of the controls
     */
    target: {
      type: Object,
      value: null
    }
  },

  /**
   * calls responsive-utility to get parent's responsive size
   */
  attached: function() {
    let root = this;
    Polymer.SimpleColorsUtility.requestAvailability();
    root.search = root.$.search;
    root.fire("searchbar-added", root.$.search);
    root.$.scroll.addEventListener("button-clicked", function(e) {
      this.fire("toggle-scroll", this);
    });
    root.$.print.addEventListener("button-clicked", function(e) {
      this.fire("print-transcript", this);
    });
  }
});
