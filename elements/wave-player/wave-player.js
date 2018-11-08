import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-fab/paper-fab.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

Polymer({
  _template: html`
    <style>
      :host {
        min-width: 480px;
        height: 150px;
        background-color: var(--dark-primary-color);
      }

      paper-icon-button {
        position: absolute;
      }

      .title,
      .subtitle {
        transition: all .5s ease;
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
        z-index: 20
      }

      paper-fab {
        transition: all .5s ease;
        top: -25px;
        z-index: 25;
        border-radius: 0;
      }

      .albuminfo {
        position: relative;
        transition: all .5s ease;
        top: -156px;
        margin-bottom: -150px;
        z-index: 20;
        height: 150px;
        width: 400px;
        background-color: rgba(0, 0, 0, .4);
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
        transition: all .5s ease;
        background-color: var(--dark-primary-color);
        transform: scaleY(1.5)
      }

      .circleAnimation {
        border-radius: 50%;
        overflow: auto;
        -moz-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .4);
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .4)
      }

      .circleAnimation:active {
        -moz-box-shadow: 0 8px 17px 0 rgba(0, 0, 0, .2);
        box-shadow: 0 8px 17px 0 rgba(0, 0, 0, .2)
      }

      .playActive {
        top: 0;
        width: 100%;
        height: 50px
      }

      .waveActive {
        top: 0px;
        transform: scaleY(1)
      }

      .centred,
      .titleActive {
        transform: scaleY(0);
      }

      .titleActive {
        opacity: 0;
      }

      #playbutton {
        transition: all .5s ease
      }

      .coverart {
        transition: all .5s ease;
        width: 150px;
        height: 150px
      }

      .title {
        font-size: 24px;
      }

      .coverartActive {
        width: 25px;
        height: 25px
      }

      .nameActive {
        font-size: 19px;
        padding: 3px 3px 3px 0;
        left: 30px
      }

      .centred {
        top: calc(50% - 20px);
        left: calc(50% - 20px);
        transition: all .3s ease
      }

      .left,
      .middle,
      .right {
        transform: scale(1)
      }

      .left {
        left: calc(25% - 20px)
      }

      .right {
        left: calc(75% - 20px)
      }

      .hidden {
        display: none
      }

      @media only screen and (max-width: 500px) {
        .albuminfo {
          width: 100%;
        }
      }
    </style>
    <paper-fab id="playbutton" class="circleAnimation" disabled="" icon="av:play-arrow" on-click="togglePlay"></paper-fab>
    <paper-card id="controls" class="controls hidden" elevation="2">
      <div class="actions">
      <paper-icon-button class="centred middle" style="color: white;" icon="av:pause" on-click="togglePlay"></paper-icon-button>
      <paper-icon-button id="replay" class="centred" style="color: white;" icon="av:replay-30" on-click="throwBack"></paper-icon-button>
      <paper-icon-button id="mute" class="centred" style="color: white;" icon="av:volume-up" on-click="toggleMute"></paper-icon-button>
      </div>
    </paper-card>
    <paper-card id="container" class="waveContainer" elevation="0"></paper-card>
    <div id="albuminfo" class="albuminfo">
      <img class="coverart" src="[[coverart]]">
      <span class="title">[[title]]</span>
      <span class="subtitle">[[subtitle]]</span>
    </div>
`,

  is: "wave-player",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
    /**
     * The source of the audio file to be played
     *
     * @attribute src
     * @type String
     * @default NULL
     */
    src: {
      type: String,
      value: "",
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
  },

  /**
   * Source changed, let's test if we should update wavesurfer
   */
  _srcChanged: function(newValue, oldValue) {
    // don't care what it is so long as it's a value
    if (typeof newValue !== typeof undefined && newValue !== "") {
      window.wavesurferobject.load(this.src);
    }
  },
  /**
   * created life cycle
   */
  created: function() {
    const name = "wavesurfer";
    const basePath = pathFromUrl(import.meta.url);
    const location = `${basePath}../../wavesurfer.js/dist/wavesurfer.js`;
    window.addEventListener(
      `es-bridge-${name}-loaded`,
      this._wavesurferLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();
    window.ESGlobalBridge.instance.load(name, location);
  },
  /**
   * Attached life cycle
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
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
    this.setHaxProperties(props);
  },

  /**
   * Ready life cycle
   */
  ready: function() {
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
      this.coverart = this.resolveUrl("art.jpg");
    }
  },
  /**
   * invoke wavesurfer once we know it's globally scoped
   */
  _wavesurferLoaded: function() {
    this.updateWavesurfer();
  },

  /**
   * Function to update classes (for activate)
   */
  activateAnimation: function() {
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
  },

  /**
   * Function to update classes (for deactivate)
   */
  deactivateAnimation: function() {
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
  },

  /**
   * Initializing wave object
   */
  initWaveSurfer: function() {
    var self = this;
    window.wavesurferobject.init({
      container: this.$.container,
      waveColor: this.wavecolor,
      progressColor: this.progresscolor, // --primary-background-color
      fillParent: true,
      height: 100
    });
    window.wavesurferobject.on("ready", function() {
      self.$.playbutton.removeAttribute("disabled");
    });
    window.wavesurferobject.on("finish", function() {
      self.deactivateAnimation();
    });
  },

  /**
   * Stores Object
   */
  updateWavesurfer: function() {
    window.wavesurferobject = WaveSurfer.create();
    this.initWaveSurfer();
  },

  /**
   * Toggle play and pause
   */
  togglePlay: function(e) {
    // make sure we have the correct instance loaded before we play
    window.wavesurferobject.playPause();
    var iconType = this.$.playbutton.getAttribute("icon");
    if (iconType === "av:play-arrow") {
      this.activateAnimation();
    } else {
      this.deactivateAnimation();
    }
  },

  /**
   * Toggle mute on and off
   */
  toggleMute: function(e) {
    var muteStyle = this.$.mute;
    var iconType = muteStyle.getAttribute("icon");
    window.wavesurferobject.toggleMute();
    if (iconType === "av:volume-up") {
      muteStyle.setAttribute("icon", "av:volume-off");
    } else {
      muteStyle.setAttribute("icon", "av:volume-up");
    }
  },

  /**
   * Jumps back 30 seconds
   */
  throwBack: function(e) {
    window.wavesurferobject.skipBackward(30);
  }
});
