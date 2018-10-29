import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "./node_modules/@lrnwebcomponents/media-behaviors/media-behaviors.js";
import "./node_modules/@lrnwebcomponents/simple-colors/simple-colors.js";
import "./node_modules/@lrnwebcomponents/a11y-media-player/a11y-media-player.js";
Polymer({
  _template: html`
   <custom-style>
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
    </custom-style>
    
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
    accentColor: { type: String, value: null, reflectToAttribute: !0 },
    dark: { type: Boolean, value: !1, reflectToAttribute: !0 },
    darkTranscript: { type: Boolean, value: !1 },
    disableInteractive: { type: Boolean, value: !1 },
    height: { type: String, value: null },
    hideTimestamps: { type: Boolean, value: !1 },
    iframed: {
      type: Boolean,
      computed: "_computeIframed(sourceData, sandboxed)"
    },
    isA11yMedia: {
      type: Boolean,
      computed: "_computeA11yMedia(sourceType, sandboxed)"
    },
    lang: { type: String, value: "en" },
    mediaTitle: { type: String },
    preload: { type: String, value: "metadata" },
    sandboxed: { type: Boolean, computed: "_computeSandboxed(sourceData)" },
    source: { type: String, value: null },
    sources: { type: Array, value: [] },
    sourceData: {
      type: Array,
      computed: "_getSourceData(source,sources,tracks)",
      reflectToAttribute: !0
    },
    sourceType: { type: String, computed: "_computeSourceType(sourceData)" },
    youtubeId: {
      type: String,
      computed: "_computeYoutubeId(source,sourceType)"
    },
    isYoutube: { type: Boolean, computed: "_computeYoutube(sourceType)" },
    stickyCorner: { type: String, value: "top-right", reflectToAttribute: !0 },
    tracks: { type: Array, value: [] },
    thumbnailSrc: { type: String, value: null, reflectToAttribute: !0 },
    width: { type: String, value: null },
    crossorigin: { type: Boolean, value: !1 }
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
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
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
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
            required: !0,
            validationType: "url"
          },
          {
            property: "track",
            title: "Closed captions",
            description: "The URL for the captions file.",
            inputMethod: "textfield",
            icon: "link",
            required: !0,
            validationType: "url"
          },
          {
            property: "thumbnailSrc",
            title: "Thumbnail image",
            description: "Optional. The URL for a thumbnail/poster image.",
            inputMethod: "textfield",
            icon: "link",
            required: !0,
            validationType: "url"
          },
          {
            property: "mediaTitle",
            title: "Title",
            description: "Simple title for under video",
            inputMethod: "textfield",
            icon: "av:video-label",
            required: !1,
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
                options: { subtitles: "subtitles" }
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
    });
  },
  _computeYoutubeId: function(source, sourceType) {
    if (source !== void 0 && "youtube" === sourceType) {
      return this._computeSRC(source).replace(
        /(https?:\/\/)?(www.)?youtube(-nocookie)?.com\/embed\//,
        ""
      );
    }
    return !1;
  },
  _computeYoutube: function(sourceType) {
    return "youtube" === sourceType;
  },
  _computeA11yMedia: function(sourceType, sandboxed) {
    if (!sandboxed && ("youtube" == sourceType || "local" == sourceType)) {
      return !0;
    }
    return !1;
  },
  _computeIframed: function(sourceData, sandboxed) {
    if (
      0 < sourceData.length &&
      sourceData[0] !== void 0 &&
      this._sourceIsIframe(sourceData[0].src) &&
      !sandboxed
    ) {
      return !0;
    }
    return !1;
  },
  _getSourceData: function(source, sources, tracks) {
    let root = this,
      slotted = dom(root).querySelector("track"),
      temp = sources.slice();
    for (let i = 0; i < temp.length; i++) {
      temp[i].type =
        temp[i].type !== void 0 && null !== temp[i].type
          ? temp[i].type
          : this._computeMediaType(temp[i].src);
      temp[i].src = this._computeSRC(temp[i].src);
    }
    if (null !== source) {
      let src = this._computeSRC(source);
      this.sourceType = this._computeSourceType(src);
      if ("youtube" !== this.sourceType)
        temp.unshift({ src: src, type: this._computeMediaType(src) });
    }
    this.__standAlone =
      tracks === void 0 ||
      null === tracks ||
      (0 === tracks.length && null === slotted);
    return temp;
  },
  _computeMediaType: function(source) {
    let type = "",
      findType = function(text, data) {
        for (let i = 0; i < data.length; i++) {
          if (
            "" === type &&
            null !== source &&
            -1 < source.toLowerCase().indexOf("." + data[i])
          )
            type = text + "/" + data[i];
        }
      };
    findType("audio", ["aac", "flac", "mp3", "oga", "wav"]);
    findType("video", ["mov", "mp4", "ogv", "webm"]);
    return type;
  },
  _computeSandboxed: function(sourceData) {
    if (
      0 < sourceData.length &&
      sourceData[0] !== void 0 &&
      this._sourceIsIframe(sourceData[0].src)
    ) {
      let test = document.createElement("webview");
      if ("function" === typeof test.reload) {
        return !0;
      }
    }
    return !1;
  },
  _computeSourceType: function(sourceData) {
    let root = this,
      slotted = dom(root).querySelector("source");
    if (
      0 < sourceData.length &&
      sourceData[0] !== void 0 &&
      typeof sourceData[0].src !== typeof void 0
    ) {
      return root.getVideoType(sourceData[0].src);
    } else if (null !== slotted) {
      let src = root._computeSRC(slotted.getAttribute("src"));
      return root.getVideoType(src);
    } else {
      return null;
    }
  },
  _computeSRC: function(source) {
    if (null !== source && typeof source !== void 0) {
      let type =
        this.sourceType !== void 0
          ? this.sourceType
          : this.getVideoType(source);
      source = this.cleanVideoSource(source, type);
      if ("vimeo" == type) {
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
        if (typeof this.videoColor !== typeof void 0) {
          source += "&color=" + this.videoColor;
        }
      } else if ("dailymotion" == type) {
        source += "&ui-start-screen-info=false";
        source += "&ui-logo=false";
        source += "&sharing-enable=false";
        source += "&endscreen-enable=false";
        if (typeof this.videoColor !== typeof void 0) {
          source += "&ui-highlight=" + this.videoColor;
        }
      }
    }
    return source;
  }
});
