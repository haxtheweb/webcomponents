/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@polymer/paper-material/paper-material.js";
import "@polymer/paper-fab/paper-fab.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
/**
 * `wave-player`
 * `A player for visualizing a sound file`
 *
 * @customElement
 * @polymer
 * @polymerLegacy
 * @demo demo/index.html
 */
class WavePlayer extends SchemaBehaviors(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          height: 150px;
          background-color: var(--dark-primary-color);
          display: block;
        }

        paper-icon-button {
          position: absolute;
        }

        .title,
        .subtitle {
          transition: all 0.5s ease;
          padding: 10px 10px 10px 0;
          left: 160px;
          position: absolute;
        }

        .subtitle {
          bottom: 0;
        }

        .controls {
          height: 50px;
          width: 100%;
          top: 0;
          background: var(--accent-color);
          z-index: 20;
        }

        paper-fab {
          transition: all 0.5s ease;
          top: -25px;
          z-index: 25;
          border-radius: 0;
        }

        .albuminfo {
          position: relative;
          transition: all 0.5s ease;
          top: -156px;
          margin-bottom: -150px;
          z-index: 20;
          height: 150px;
          background-color: rgba(0, 0, 0, 0.4);
          color: #fff;
          font-family: Roboto, sans-serif;
        }

        .albuminfoActive {
          top: -25;
          height: 25px;
          width: 100%;
          margin-bottom: -19px;
        }

        .waveContainer {
          top: -31px;
          transition: all 0.5s ease;
          background-color: var(--dark-primary-color);
          transform: scaleY(1.5);
        }

        .circleAnimation {
          border-radius: 50%;
          overflow: auto;
          -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
          box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.4);
        }

        .circleAnimation:active {
          -moz-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);
          box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2);
        }

        .playActive {
          top: 0;
          width: 100%;
          height: 50px;
        }

        .waveActive {
          top: 0px;
          transform: scaleY(1);
        }

        .centred,
        .titleActive {
          transform: scaleY(0);
        }

        .titleActive {
          opacity: 0;
        }

        #playbutton {
          transition: all 0.5s ease;
        }

        .coverart {
          transition: all 0.5s ease;
          width: 150px;
          height: 150px;
        }

        .title {
          font-size: 24px;
        }

        .coverartActive {
          width: 25px;
          height: 25px;
        }

        .nameActive {
          font-size: 19px;
          padding: 3px 3px 3px 0;
          left: 30px;
        }

        .centred {
          top: calc(50% - 20px);
          left: calc(50% - 20px);
          transition: all 0.3s ease;
        }

        .left,
        .middle,
        .right {
          transform: scale(1);
        }

        .left {
          left: calc(25% - 20px);
        }

        .right {
          left: calc(75% - 20px);
        }

        .hidden {
          display: none;
        }

        @media only screen and (max-width: 500px) {
          .albuminfo {
            width: 100%;
          }
        }
      </style>
      <paper-fab
        id="playbutton"
        class="circleAnimation"
        disabled=""
        icon="av:play-arrow"
        on-click="togglePlay"
      ></paper-fab>
      <paper-material id="controls" class="controls hidden" elevation="2">
        <paper-icon-button
          class="centred middle"
          style="color: white;"
          icon="av:pause"
          on-click="togglePlay"
        ></paper-icon-button>
        <paper-icon-button
          id="replay"
          class="centred"
          style="color: white;"
          icon="av:replay-30"
          on-click="throwBack"
        ></paper-icon-button>
        <paper-icon-button
          id="mute"
          class="centred"
          style="color: white;"
          icon="av:volume-up"
          on-click="toggleMute"
        ></paper-icon-button>
      </paper-material>
      <div id="container" class="waveContainer" elevation="0"></div>
      <div id="albuminfo" class="albuminfo">
        <img class="coverart" src="[[coverart]]" />
        <span class="title">[[title]]</span>
        <span class="subtitle">[[subtitle]]</span>
      </div>
    `;
  }

  static get tag() {
    return "wave-player";
  }
  static get properties() {
    let props = {
      /**
       * The source of the audio file to be played
       *
       * @attribute src
       * @type String
       * @default NULL
       */
      src: {
        type: String,
        notify: true,
        observer: "_srcChanged"
      },
      /**
       * The main (bold) title
       *
       * @attribute title
       * @type String
       * @default NULL
       */
      title: {
        type: String,
        value: "",
        notify: true
      },
      /**
       * The smaller subtitle, for chapter heading or composer.
       *
       * @attribute subtitle
       * @type String
       * @default NULL
       */
      subtitle: {
        type: String,
        value: "",
        notify: true
      },
      /**
       * The sourse for cover art
       *
       * @attribute coverart
       * @type String
       * @default art.jpg
       */
      coverart: {
        type: String,
        value: "",
        notify: true
      },
      /**
       * container for the wave object
       *
       * @attribute wavesurfer
       * @type Object
       */
      wavesurfer: {
        type: Object
      },
      /**
       * Determines if the FOB is on the left or the right
       *
       * @attribute lean
       * @type String
       * @default left
       */
      lean: {
        type: String,
        value: "left",
        notify: true
      },
      /**
       * Color of the Wave
       *
       * @attribute wavecolor
       * @type String
       * @default #ffffff
       */
      wavecolor: {
        type: String,
        value: "#ffffff",
        notify: true
      },
      /**
       * Color of the completed section of the wave
       *
       * @attribute progresscolor
       * @type String
       * @default #CFD8DC
       */
      progresscolor: {
        type: String,
        value: "#CFD8DC",
        notify: true
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }
  /**
   * Source changed, let's test if we should update wavesurfer
   */
  _srcChanged(newValue, oldValue) {
    // don't care what it is so long as it's a value
    if (typeof newValue !== typeof undefined && this.__wavesurfer) {
      window.wavesurferobject.load(newValue);
    }
  }
  /**
   * created life cycle
   */
  constructor() {
    super();
    import("@polymer/iron-icons/iron-icons.js");
    import("@polymer/iron-icons/av-icons.js");
    const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
    const location = `${basePath}lib/wavesurfer.js/dist/wavesurfer.js`;
    window.addEventListener(
      "es-bridge-wavesurfer-loaded",
      this._wavesurferLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load("wavesurfer", location);
  }
  disconnectedCallback() {
    window.removeEventListener(
      "es-bridge-wavesurfer-loaded",
      this._wavesurferLoaded.bind(this)
    );
    super.disconnectedCallback();
  }
  /**
   * Ready life cycle
   */
  ready() {
    super.ready();
    if (this.lean === "right") {
      this.$.playbutton.style.right = "25";
      this.$.controls.style.right = "0";
    } else {
      this.$.playbutton.style.left = "25";
      this.$.controls.style.left = "0";
    }
    if (this.name === "") {
      this.$.albuminfo.classList.add("hidden");
    }
    // basic default for coverart if none
    if (this.coverart === "") {
      const basePath = pathFromUrl(decodeURIComponent(import.meta.url));
      this.coverart = `${basePath}lib/art.jpg`;
    }
  }
  /**
   * invoke wavesurfer once we know it's globally scoped
   */
  _wavesurferLoaded() {
    this.__wavesurfer = true;
    this.initWaveSurfer();
  }
  /**
   * Function to update classes (for activate)
   */
  activateAnimation() {
    var self = this;
    var waveStyle = this.$.container;
    var buttonStyle = this.$.playbutton;
    var controlsStyle = this.$.controls;
    var muteStyle = this.$.mute;
    var replayStyle = this.$.replay;
    var albumStyle = this.$.albuminfo;
    var coverartStyle = albumStyle.querySelector(".coverart");
    var nameStyle = albumStyle.querySelector(".title");
    var titleStyle = albumStyle.querySelector(".subtitle");
    buttonStyle.setAttribute("icon", "av:pause");
    buttonStyle.classList.remove("circleAnimation");
    buttonStyle.classList.add("playActive");
    albumStyle.classList.add("albuminfoActive");
    coverartStyle.classList.add("coverartActive");
    nameStyle.classList.add("nameActive");
    titleStyle.classList.add("titleActive");
    if (self.lean === "right") {
      this.$.playbutton.style.right = "0";
    } else {
      this.$.playbutton.style.left = "0";
    }
    waveStyle.classList.add("waveActive");
    setTimeout(function() {
      controlsStyle.classList.remove("hidden");
      buttonStyle.classList.add("hidden");
    }, 500);
    setTimeout(function() {
      muteStyle.classList.add("right");
      replayStyle.classList.add("left");
    }, 600);
  }
  /**
   * Function to update classes (for deactivate)
   */
  deactivateAnimation() {
    var self = this;
    var waveStyle = this.$.container;
    var buttonStyle = this.$.playbutton;
    var controlsStyle = this.$.controls;
    var muteStyle = this.$.mute;
    var replayStyle = this.$.replay;
    var albumStyle = this.$.albuminfo;
    var coverartStyle = albumStyle.querySelector(".coverart");
    var nameStyle = albumStyle.querySelector(".title");
    var titleStyle = albumStyle.querySelector(".subtitle");
    muteStyle.classList.remove("right");
    replayStyle.classList.remove("left");
    setTimeout(function() {
      controlsStyle.classList.add("hidden");
      buttonStyle.classList.remove("hidden");
    }, 100);
    setTimeout(function() {
      buttonStyle.setAttribute("icon", "av:play-arrow");
      buttonStyle.classList.add("circleAnimation");
      buttonStyle.classList.remove("playActive");
      albumStyle.classList.remove("albuminfoActive");
      coverartStyle.classList.remove("coverartActive");
      nameStyle.classList.remove("nameActive");
      titleStyle.classList.remove("titleActive");
      if (self.lean === "right") {
        buttonStyle.style.right = "25";
      } else {
        buttonStyle.style.left = "25";
      }
      waveStyle.classList.remove("waveActive");
    }, 200);
  }
  /**
   * Initializing wave object
   */
  initWaveSurfer() {
    window.wavesurferobject = new WaveSurfer({
      container: this.$.container,
      waveColor: this.wavecolor,
      progressColor: this.progresscolor, // --primary-background-color
      fillParent: true,
      height: 100
    });
    window.wavesurferobject.init();
    if (typeof this.src !== typeof undefined) {
      window.wavesurferobject.load(this.src);
    }
    window.wavesurferobject.on("ready", () => {
      this.$.playbutton.removeAttribute("disabled");
    });
    window.wavesurferobject.on("finish", () => {
      this.deactivateAnimation();
    });
  }
  /**
   * Toggle play and pause
   */
  togglePlay(e) {
    // make sure we have the correct instance loaded before we play
    window.wavesurferobject.playPause();
    var iconType = this.$.playbutton.getAttribute("icon");
    if (iconType === "av:play-arrow") {
      this.activateAnimation();
    } else {
      this.deactivateAnimation();
    }
  }
  /**
   * Toggle mute on and off
   */
  toggleMute(e) {
    var muteStyle = this.$.mute;
    var iconType = muteStyle.getAttribute("icon");
    window.wavesurferobject.toggleMute();
    if (iconType === "av:volume-up") {
      muteStyle.setAttribute("icon", "av:volume-off");
    } else {
      muteStyle.setAttribute("icon", "av:volume-up");
    }
  }
  /**
   * Jumps back 30 seconds
   */
  throwBack(e) {
    window.wavesurferobject.skipBackward(30);
  }
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Audio player",
        description: "Audio that is just like spotify.",
        icon: "av:play-circle-filled",
        color: "purple",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "audio",
            source: "src",
            title: "title",
            caption: "subtitle"
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
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          }
        ],
        configure: [
          {
            property: "src",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "title",
            title: "Title",
            description: "A simple title",
            inputMethod: "textfield",
            icon: "av:video-label",
            required: false,
            validationType: "text"
          }
        ],
        advanced: []
      }
    };
  }
}
window.customElements.define(WavePlayer.tag, WavePlayer);
export { WavePlayer };
