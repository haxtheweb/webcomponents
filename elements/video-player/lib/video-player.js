import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "@lrnwebcomponents/media-behaviors/media-behaviors.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/a11y-media-player/a11y-media-player.js";
/**
`video-player`
A simple responsive video player with ridiculously powerful backing

@demo demo/index.html

@microcopy - the mental model for this element
 - video source - url / link to the video file

 <video-player 
  accent-color$="[[accentColor]]"                 // Optional accent color for controls, 
                                                  // using the following materialize colors: 
                                                  // red, pink, purple, deep-purple, indigo, blue, 
                                                  // light blue, cyan, teal, green, light green, lime, 
                                                  // yellow, amber, orange, deep-orange, and brown. 
                                                  // Default is null. 
  dark$="[[dark]]"                                // Is the color scheme dark? Default is light. 
  dark-transcript$="[[darkTranscript]]"           // Use dark theme on transcript? Default is false, even when player is dark.   
  disable-interactive$="[[disableInteractive]]"   // Disable interactive cues?
  height$="[[height]]"                            // The height of player
  hide-timestamps$="[[hideTimestamps]]"           // Hide cue timestamps?
  lang$="[[lang]]"                                // The language of the media
  media-title$="[[mediaTitle]]"                   // The title of the media
  source$="[[source]]"                            // The source URL of the media
  sticky-corner$="[[stickyCorner]]"               // When user scrolls a playing video off-screen, 
                                                      which corner will it stick to? Values are: 
                                                      top-right (default), top-left, bottom-left, bottom-right, 
                                                      and none (to turn sticky off)
  thumbnail-src$="[[thumbnailSrc]]"               // Optional thumbanil/cover image url
  width$="[[width]]">                              // The width of the media             
  <div slot="caption">Optional caption info.</div>
</video-player>

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        margin: 0 0 15px;
      }
      .video-caption {
        font-style: italic;
        margin: 0;
        padding: 8px;
        @apply --video-player-caption-theme;
      }
    </style>
    
    <template is="dom-if" if="[[isA11yMedia]]" restamp="">
      <a11y-media-player accent-color\$="[[accentColor]]" dark\$="[[dark]]" dark-transcript\$="[[darkTranscript]]" disable-interactive\$="[[disableInteractive]]" hide-timestamps\$="[[hideTimestamps]]" lang\$="[[lang]]" media-type\$="[[sourceType]]" preload\$="[[preload]]" media-title\$="[[mediaTitle]]" stand-alone\$="[[__standAlone]]" sticky-corner\$="[[stickyCorner]]" thumbnail-src\$="[[thumbnailSrc]]" crossorigin\$="[[crossorigin]]" youtube-id\$="[[youtubeId]]">
        <slot name="source"></slot>
        <slot name="track"></slot>
        <template id="sources" is="dom-repeat" items="[[sourceData]]" as="sd">
          <source src\$="[[sd.src]]" type\$="[[sd.type]]">
        </template>
        <template id="tracks" is="dom-repeat" items="[[tracks]]" as="track">
          <track src\$="[[track.src]]" kind\$="[[track.kind]]" label\$="[[track.label]]" srclang\$="[[track.lang]]">
        </template>
        <slot name="caption"></slot>
      </a11y-media-player>
    </template>
    <template is="dom-if" if="[[!isA11yMedia]]">
      <template is="dom-if" if="[[sandboxed]]">
        <div class="responsive-video-container" lang\$="[[lang]]">
          <webview resource\$="[[schemaResourceID]]-video" src\$="[[sourceData.0.src]]" width\$="[[width]]" height\$="[[height]]" frameborder="0"></webview>
        </div>
      </template>
      <template is="dom-if" if="[[!sandboxed]]">
        <template is="dom-if" if="[[iframed]]">
          <div class="responsive-video-container" lang\$="[[lang]]">
            <iframe resource\$="[[schemaResourceID]]-video" src\$="[[sourceData.0.src]]" width\$="[[width]]" height\$="[[height]]" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>
          </div>
        </template>
      </template>
      <div id="videocaption" class\$="video-caption">
        <p>[[mediaTitle]] <span class="media-type print-only">(embedded media)</span></p>
        <slot name="caption"></slot>
      </div>
    </template>
`,

  is: "video-player",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema,
    A11yBehaviors.A11y,
    MediaBehaviors.Video
  ],

  properties: {
    /**
     * Optional accent color for controls,
     * using the following materialize colors:
     * red, pink, purple, deep-purple, indigo, blue,
     * light blue, cyan, teal, green, light green, lime,
     * yellow, amber, orange, deep-orange, and brown.
     * Default is null.
     */
    accentColor: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /**
     * Enables darker player.
     */
    dark: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Use dark theme on transcript? Default is false, even when player is dark.
     */
    darkTranscript: {
      type: Boolean,
      value: false
    },
    /**
     * disable interactive mode that makes the transcript clickable
     */
    disableInteractive: {
      type: Boolean,
      value: false
    },
    /**
     * The height of the media player.
     */
    height: {
      type: String,
      value: null
    },
    /**
     * show cue's start and end time
     */
    hideTimestamps: {
      type: Boolean,
      value: false
    },
    /**
     * Computed if this should be in an iframe or not.
     */
    iframed: {
      type: Boolean,
      computed: "_computeIframed(sourceData, sandboxed)"
    },
    /**
     * Computed if this should be in a11y-media-player.
     */
    isA11yMedia: {
      type: Boolean,
      computed: "_computeA11yMedia(sourceType, sandboxed)"
    },
    /**
     * The language of the media
     */
    lang: {
      type: String,
      value: "en"
    },
    /**
     * Simple caption for the video
     */
    mediaTitle: {
      type: String
    },
    /**
     * What to preload for a11y-media-player: auto, metadata (default), or none.
     */
    preload: {
      type: String,
      value: "metadata"
    },
    /* *
       * Responsive video, calculated from not-responsive.
       * /
      responsive: {
        type: Boolean,
        reflectToAttribute: true,
        value: true,
      },*/
    /**
     * Compute if this is a sandboxed system or not
     */
    sandboxed: {
      type: Boolean,
      computed: "_computeSandboxed(sourceData)"
    },
    /**
     * Source of the video
     */
    source: {
      type: String,
      value: null
    },
    /**
     * Source of the video
     */
    sources: {
      type: Array,
      value: []
    },
    /**
     * List of source objects
     */
    sourceData: {
      type: Array,
      computed: "_getSourceData(source,sources,tracks)",
      reflectToAttribute: true
    },
    /**
     * The type of source, i.e. "local", "vimeo", "youtube", etc.
     */
    sourceType: {
      type: String,
      computed: "_computeSourceType(sourceData)"
    },
    /**
     * The type of source, i.e. "local", "vimeo", "youtube", etc.
     */
    youtubeId: {
      type: String,
      computed: "_computeYoutubeId(source,sourceType)"
    },
    /**
     * The type of source, i.e. "local", "vimeo", "youtube", etc.
     */
    isYoutube: {
      type: Boolean,
      computed: "_computeYoutube(sourceType)"
    },
    /**
     * When playing but scrolled off screen, to which corner does it stick:
     * top-left, top-right, bottom-left, bottom-right, or none?
     * Default is "top-right". "None" disables stickiness.
     */
    stickyCorner: {
      type: String,
      value: "top-right",
      reflectToAttribute: true
    },
    /**
     * Array of text tracks
     * [{
     *  "src": "path/to/track.vtt",
     *  "label": "English",
     *  "srclang": "en",
     *  "kind": "subtitles",
     * }]
     */
    tracks: {
      type: Array,
      value: []
    },
    /**
     * Source of optional thumbnail image
     */
    thumbnailSrc: {
      type: String,
      value: null,
      reflectToAttribute: true
    },
    /* *
       * Calculate vimeo color based on accent color.
       * /
      vimeoColor: {
        type: String,
        computed: getVimeoColor(dark,accentColor),
      }, 
      */
    /**
     * The width of the media player.
     */
    width: {
      type: String,
      value: null
    },
    /**
     * Cross origin flag for transcripts to load
     */
    crossorigin: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Attached.
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Video player",
        description:
          "This can present video in a highly accessible manner regardless of source.",
        icon: "av:play-circle-filled",
        color: "red",
        groups: ["Video", "Media"],
        handles: [
          {
            type: "video",
            source: "source",
            title: "caption",
            caption: "caption",
            description: "caption",
            color: "primaryColor"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          /*{
            'property': 'responsive',
            'title': 'Responsive',
            'description': 'The video automatically fills the available area.',
            'inputMethod': 'boolean',
            'icon': 'image:photo-size-select-small',
          },*/
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark theme",
            description: "Enable dark theme for the player.",
            inputMethod: "boolean",
            icon: "invert-colors"
          }
        ],
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "track",
            title: "Closed captions",
            description: "The URL for the captions file.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "thumbnailSrc",
            title: "Thumbnail image",
            description: "Optional. The URL for a thumbnail/poster image.",
            inputMethod: "textfield",
            icon: "link",
            required: true,
            validationType: "url"
          },
          {
            property: "mediaTitle",
            title: "Title",
            description: "Simple title for under video",
            inputMethod: "textfield",
            icon: "av:video-label",
            required: false,
            validationType: "text"
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            property: "dark",
            title: "Dark theme",
            description: "Enable dark theme for the player.",
            inputMethod: "boolean",
            icon: "invert-colors"
          }
        ],
        advanced: [
          {
            property: "darkTranscript",
            title: "Dark theme for transcript",
            description: "Enable dark theme for the transcript.",
            inputMethod: "boolean"
          },
          {
            property: "hideTimestamps",
            title: "Hide timestamps",
            description: "Hide the time stamps on the transcript.",
            inputMethod: "boolean"
          },
          {
            property: "preload",
            title: "Preload source(s).",
            description:
              "How the sources should be preloaded, i.e. auto, metadata (default), or none.",
            inputMethod: "select",
            options: {
              preload: "Preload all media",
              metadata: "Preload media metadata only",
              none: "Don't preload anything"
            }
          },
          {
            property: "stickyCorner",
            title: "Sticky Corner",
            description:
              "Set the corner where a video plays when scrolled out of range, or choose none to disable sticky video.",
            inputMethod: "select",
            options: {
              none: "none",
              "top-left": "top-left",
              "top-right": "top-right",
              "bottom-left": "bottom-left",
              "bottom-right": "bottom-right"
            }
          },
          {
            property: "sources",
            title: "Other sources",
            description: "List of other sources",
            inputMethod: "array",
            properties: [
              {
                property: "src",
                title: "Source",
                description: "The URL for this video.",
                inputMethod: "textfield"
              },
              {
                property: "type",
                title: "Type",
                description: "Media type data",
                inputMethod: "select",
                options: {
                  "audio/aac": "acc audio",
                  "audio/flac": "flac audio",
                  "audio/mp3": "mp3 audio",
                  "video/mp4": "mp4 video",
                  "video/mov": "mov video",
                  "audio/ogg": "ogg audio",
                  "video/ogg": "ogg video",
                  "audio/wav": "wav audio",
                  "audio/webm": "webm audio",
                  "video/webm": "webm video"
                }
              }
            ]
          },
          {
            property: "tracks",
            title: "Track list",
            description: "Tracks of different languages of closed captions",
            inputMethod: "array",
            properties: [
              {
                property: "kind",
                title: "Kind",
                description: "Kind of track",
                inputMethod: "select",
                options: {
                  subtitles:
                    "subtitles" /*,
                  Future Features
                  'description': 'description',
                  'thumbnails': 'thumbnails',
                  'interactive': 'interactive',
                  'annotation': 'annotation'*/
                }
              },
              {
                property: "label",
                title: "Label",
                description:
                  'The human-readable name for this track, eg. "English Subtitles"',
                inputMethod: "textfield"
              },
              {
                property: "src",
                title: "Source",
                description: "Source of the track",
                inputMethod: "textfield"
              },
              {
                property: "srclang",
                title:
                  'Two letter, language code, eg. "en" for English, "de" for German, "es" for Spanish, etc.',
                description: "Label",
                inputMethod: "textfield"
              }
            ]
          }
        ]
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Get Youtube ID
   */
  _computeYoutubeId: function(source, sourceType) {
    if (source !== undefined && sourceType === "youtube") {
      return this._computeSRC(source).replace(
        /(https?:\/\/)?(www.)?youtube(-nocookie)?.com\/embed\//,
        ""
      );
    }
    return false;
  },

  /**
   * Determine if it is youtube
   */
  _computeYoutube: function(sourceType) {
    return sourceType === "youtube";
  },

  /**
   * Determine if it is compatible with a11y-media-player
   */
  _computeA11yMedia: function(sourceType, sandboxed) {
    if (!sandboxed && (sourceType == "youtube" || sourceType == "local")) {
      return true;
    }
    return false;
  },

  /**
   * Compute iframed status
   */
  _computeIframed: function(sourceData, sandboxed) {
    // make sure we take into account sandboxing as well
    // so that we can manage the state effectively
    if (
      sourceData.length > 0 &&
      sourceData[0] !== undefined &&
      this._sourceIsIframe(sourceData[0].src) &&
      !sandboxed
    ) {
      return true;
    }
    return false;
  },

  /**
   * Gets source and added to sources list
   */
  _getSourceData: function(source, sources, tracks) {
    let root = this,
      slotted = Polymer.dom(root).querySelector("track");
    let temp = sources.slice();
    for (let i = 0; i < temp.length; i++) {
      temp[i].type =
        temp[i].type !== undefined && temp[i].type !== null
          ? temp[i].type
          : this._computeMediaType(temp[i].src);
      temp[i].src = this._computeSRC(temp[i].src);
    }
    if (source !== null) {
      let src = this._computeSRC(source);
      this.sourceType = this._computeSourceType(src);
      if (this.sourceType !== "youtube")
        temp.unshift({ src: src, type: this._computeMediaType(src) });
    }
    this.__standAlone =
      tracks === undefined ||
      tracks === null ||
      (tracks.length === 0 && slotted === null);
    return temp;
  },

  /**
   * Compute media type based on source, i.e. 'audio/wav' for '.wav'
   */
  _computeMediaType: function(source) {
    let audio = ["aac", "flac", "mp3", "oga", "wav"],
      video = ["mov", "mp4", "ogv", "webm"],
      type = "",
      findType = function(text, data) {
        for (let i = 0; i < data.length; i++) {
          if (
            type === "" &&
            source !== null &&
            source.toLowerCase().indexOf("." + data[i]) > -1
          )
            type = text + "/" + data[i];
        }
      };
    findType("audio", audio);
    findType("video", video);
    return type;
  },

  /**
   * Compute sandboxed status
   */
  _computeSandboxed: function(sourceData) {
    // we have something that would require an iframe
    // see if we have a local system that would want to sandbox instead
    if (
      sourceData.length > 0 &&
      sourceData[0] !== undefined &&
      this._sourceIsIframe(sourceData[0].src)
    ) {
      // fake the creation of a webview element to see if it's valid
      // or not.
      let test = document.createElement("webview");
      // if this function exists it means that our deploy target
      // is in a sandboxed environment and is not able to run iframe
      // content with any real stability. This is beyond edge case but
      // as this is an incredibly useful tag we want to make sure it
      // can mutate to work in chromium and android environments
      // which support such sandboxing
      if (typeof test.reload === "function") {
        return true;
      }
    }
    return false;
  },

  /**
   * Compute video type based on source
   */
  _computeSourceType: function(sourceData) {
    let root = this,
      slotted = Polymer.dom(root).querySelector("source");
    if (
      sourceData.length > 0 &&
      sourceData[0] !== undefined &&
      typeof sourceData[0].src !== typeof undefined
    ) {
      return root.getVideoType(sourceData[0].src);
    } else if (slotted !== null) {
      let src = root._computeSRC(slotted.getAttribute("src"));
      return root.getVideoType(src);
    } else {
      return null;
    }
  },

  /**
   * Compute src from type / source combo.
   * Type is set by source so this ensures a waterfall
   * of valid values.
   */
  _computeSRC: function(source) {
    if (source !== null && typeof source !== undefined) {
      let type =
        this.sourceType !== undefined
          ? this.sourceType
          : this.getVideoType(source);
      // ensure that this is a valid url / cleaned up a bit
      source = this.cleanVideoSource(source, type);
      if (type == "vimeo") {
        if (this.vimeoTitle) {
          source += "?title=1";
        } else {
          source += "?title=0";
        }
        if (this.vimeoByline) {
          source += "&byline=1";
        } else {
          source += "&byline=0";
        }
        if (this.vimeoPortrait) {
          source += "&portrait=1";
        } else {
          source += "&portrait=0";
        }
        if (typeof this.videoColor !== typeof undefined) {
          source += "&color=" + this.videoColor;
        }
      } else if (type == "dailymotion") {
        source += "&ui-start-screen-info=false";
        source += "&ui-logo=false";
        source += "&sharing-enable=false";
        source += "&endscreen-enable=false";
        if (typeof this.videoColor !== typeof undefined) {
          source += "&ui-highlight=" + this.videoColor;
        }
      }
    }
    return source;
  }
});
