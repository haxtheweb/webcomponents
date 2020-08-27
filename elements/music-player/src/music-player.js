/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from 'lit-element/lit-element.js';

/**
 * `music-player`
 * `Visualize different types of music and simple format player`
 * @demo demo/index.html
 * @element music-player
 */
class MusicPlayer extends LitElement {
  
  //styles function
  static get styles() {
    return  [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }`
    ];
  }

// render function
  render() {
    return html`
  <midi-player
    src="${this.source}"
    sound-font>
  </midi-player>
  <midi-visualizer
    type="${this.visualizer}"
    src="${this.source}">
  </midi-visualizer>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      source: {
        type: String
      },
      visualizer: {
        type: String
      },
      noteHeight: {
        type: Number,
        attribute: 'note-height'
      },
      pixelsPerTimeStep: {
        type: Number,
        attribute: 'pixels-per-time-step'
      },
      minPitch: {
        type: Number,
        attribute: 'min-pitch'
      }
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "music-player";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.visualizer = 'piano-roll';
    this.noteHeight = 4;
    this.pixelsPerTimeStep = 60;
    this.minPitch = 30;
  }
  /**
   * LitElement life cycle - 1st updated
   */
  firstUpdated() {
    this.visualizerElement = this.shadowRoot.querySelector('midi-visualizer');
    setTimeout(() => {
      import("./lib/html-midi-player.js").then((module) => {
        this.shadowRoot.querySelector('midi-player').addVisualizer(this.visualizerElement);
      });
    }, 0);
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (['noteHeight', 'pixelsPerTimeStep', 'minPitch'].includes(propName) && this.visualizerElement) {
        this.visualizerElement.config = {
          noteHeight: this.noteHeight,
          pixelsPerTimeStep: this.pixelsPerTimeStep,
          minPitch: this.minPitch
        };
      }
    });
  }
    /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Music player",
        description: "Play music in context with a data visualization",
        icon: "image:music-note",
        color: "blue",
        groups: ["Media", "Music"],
        handles: [
          {
            type: "audio",
            source: "source"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "source",
            title: "Source",
            description: "Source of the file to play",
            inputMethod: "haxupload"
          },
          {
            property: "visualizer",
            title: "Visualization",
            description: "How to visualize the music file",
            inputMethod: "select",
            options: {
              "staff": "Staff",
              "piano-roll": "Piano roll",
              "waterfall": "Piano + waterfall"
            }
          },
        ],
        advanced: []
      },
      demoSchema: [
        {
          tag: "music-player",
          content: "",
          properties: {
            source: "https://magenta.github.io/magenta-js/music/demos/melody.mid"
          }
        }
      ]
    };
  }
}
customElements.define(MusicPlayer.tag, MusicPlayer);
export { MusicPlayer };
