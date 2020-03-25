/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { MediaBehaviorsVideo } from "@lrnwebcomponents/media-behaviors/media-behaviors.js";
import "@lrnwebcomponents/a11y-media-player/a11y-media-player.js";
/**
 * `video-player`
 * `A simple responsive video player with ridiculously powerful backing`
 *
 * @microcopy - language worth noting:
 * - `video source` - url / link to video file
 *
 * @demo demo/index.html
 * @customElement video-player
 */
class VideoPlayer extends MediaBehaviorsVideo(SchemaBehaviors(SimpleColors)) {
  //styles function
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: block;
          margin: 0 0 15px;
        }
        .video-caption {
          font-style: italic;
          margin: 0;
          padding: 8px;
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      ${!this.isA11yMedia
        ? html`
            <div
              class="responsive-video-container"
              .lang="${this.lang || undefined}"
            >
              ${this.sandboxed
                ? html``
                : html`
                    <webview
                      resource="${this.schemaResourceID}-video"
                      .src="${(this.sourceData &&
                        this.sourceData[0] &&
                        this.sourceData[0].src) ||
                        undefined}"
                      .width="${this.width || undefined}"
                      .height="${this.height || undefined}"
                      frameborder="0"
                    >
                    </webview>
                  `}
              ${!(!this.sandboxed && this.iframed)
                ? html``
                : html`
                    <iframe
                      resource="${this.schemaResourceID}-video"
                      .src="${(this.sourceData &&
                        this.sourceData[0] &&
                        this.sourceData[0].src) ||
                        undefined}"
                      width="${this.width}"
                      height="${this.height}"
                      frameborder="0"
                      webkitallowfullscreen=""
                      mozallowfullscreen=""
                      allowfullscreen=""
                    ></iframe>
                  `}
            </div>
            <div id="videocaption" class="video-caption">
              <p>
                ${this.mediaTitle}
                <span class="media-type print-only">(embedded media)</span>
              </p>
              <slot name="caption"></slot>
            </div>
          `
        : html`
            <a11y-media-player
              accent-color="${this.accentColor}"
              ?audio-only="${this.audioOnly}"
              ?dark="${this.dark}"
              ?dark-transcript="${this.darkTranscript}"
              ?disable-interactive="${this.disableInteractive}"
              ?hide-timestamps="${this.hideTimestamps}"
              ?hide-transcript="${this.hideTiranscript}"
              id="${this.playerId}"
              lang="${this.lang || "en"}"
              ?linkable="${this.linkable}"
              preload="${this.preload || "metadata"}"
              media-title="${this.mediaTitle || ""}"
              .sources="${this.sourceProperties}"
              ?stand-alone="${this.standAlone}"
              sticky-corner="${this.stickyCorner || "top-right"}"
              .thumbnail-src="${this.thumbnailSrc}"
              .tracks="${this.trackProperties}"
              .crossorigin="${this.crossorigin || "anonymous"}"
              .width="${this.width}"
              .height="${this.height}"
              .youtubeId="${this.youtubeId || undefined}"
            >
              <slot></slot>
            </a11y-media-player>
          `}
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: {
        min: 25,
        step: 12.5
      },
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
            type_exclusive: true,
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
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
          {
            attribute: "dark",
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
            description: "The URL for this media.",
            inputMethod: "haxupload",
            noCamera: true,
            noVoiceRecord: true,
            validationType: "url"
          },
          {
            property: "track",
            title: "Closed captions",
            description: "The URL for the captions file.",
            inputMethod: "haxupload",
            noCamera: true,
            noVoiceRecord: true,
            validationType: "url"
          },
          {
            property: "thumbnailSrc",
            title: "Thumbnail image",
            description: "Optional. The URL for a thumbnail/poster image.",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            validationType: "url"
          },
          {
            property: "mediaTitle",
            title: "Title",
            description: "Simple title for under video",
            inputMethod: "textfield",
            validationType: "text"
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker"
          },
          {
            attribute: "dark",
            title: "Dark theme",
            description: "Enable dark theme for the player.",
            inputMethod: "boolean"
          }
        ],
        advanced: [
          {
            property: "crossorigin",
            title: "Crossorigin",
            description: "Indicates whether to use CORS.",
            inputMethod: "select",
            options: {
              "": "",
              anonymous: "anonymous",
              "use-credentials": "use-credentials"
            }
          },
          {
            property: "darkTranscript",
            title: "Dark theme for transcript",
            description: "Enable dark theme for the transcript.",
            inputMethod: "boolean"
          },
          {
            property: "disableInteractive",
            title: "Disable Interactive",
            description:
              "Disable interactive mode that makes transcript clickable.",
            inputMethod: "boolean"
          },
          {
            property: "height",
            title: "Height",
            inputMethod: "textfield",
            required: false,
            validationType: "text"
          },
          {
            property: "hideTimestamps",
            title: "Hide timestamps",
            description: "Hide the time stamps on the transcript.",
            inputMethod: "boolean"
          },
          {
            property: "hideTranscript",
            title: "Hide Transcript",
            description: "Hide transcript by default.",
            inputMethod: "boolean"
          },
          {
            property: "lang",
            title: "Language",
            description: "Language of the media.",
            inputMethod: "textfield",
            validationType: "text"
          },
          {
            property: "linkable",
            title: "Include a share link?",
            description: "Provides a link to share the video.",
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
                description: "The URL for this source.",
                inputMethod: "haxupload",
                required: true,
                noCamera: true,
                noVoiceRecord: true,
                validationType: "url"
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
                  subtitles: "subtitles"
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
                description: "The source for the captions file.",
                inputMethod: "haxupload",
                required: false,
                noCamera: true,
                noVoiceRecord: true,
                validationType: "url"
              },
              {
                property: "srclang",
                title:
                  'Two letter, language code, eg. \'en\' for English, "de" for German, "es" for Spanish, etc.',
                description: "Label",
                inputMethod: "textfield"
              }
            ]
          },
          {
            property: "width",
            title: "width",
            inputMethod: "textfield",
            required: false,
            validationType: "text"
          }
        ]
      },
      saveOptions: {
        unsetAttributes: ["__utils", "__stand-alone", "colors"]
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      /**
       * Optional accent color for controls,
       * using these colors:
       * `red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`,
       * `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`,
       * `yellow`, `amber`, orange, deep-orange, and brown.
       * Default is null.
       */
      accentColor: {
        type: String,
        attribute: "accent-color",
        reflect: true
      },
      /**
       * Cross origin flag for transcripts to load
       */
      crossorigin: {
        type: String,
        attribute: "crossorigin",
        reflect: true
      },
      /**
       * Enables darker player.
       */
      dark: {
        type: Boolean,
        attribute: "dark",
        reflect: true
      },
      /**
       * Use dark theme on transcript? Default is false, even when player is dark.
       */
      darkTranscript: {
        type: Boolean
      },
      /**
       * disable interactive mode that makes transcript clickable
       */
      disableInteractive: {
        type: Boolean
      },
      /**
       * Height of media player.
       */
      height: {
        type: String
      },
      /**
       * show cue's start and end time
       */
      hideTimestamps: {
        type: Boolean
      },
      /**
       * Hide transcript by default
       */
      hideTranscript: {
        type: Boolean
      },
      /**
       * Unique id
       */
      id: {
        type: String,
        attribute: "id",
        reflect: true
      },
      /**
       * Language of media
       */
      lang: {
        type: String
      },
      /**
       * Include a share link?
       */
      linkable: {
        type: Boolean
      },
      /**
       * Simple caption for video
       */
      mediaTitle: {
        type: String,
        attribute: "media-title",
        reflect: true
      },
      /**
       * What to preload for a11y-media-player: auto, metadata (default), or none.
       */
      preload: {
        type: String
      },
      /**
       * Single sources of video
       */
      source: {
        type: String,
        attribute: "source",
        reflect: true
      },
      /**
       * Array of multiple video sources
       */
      sources: {
        type: Array
      },
      /**
       * When playing but scrolled off screen, to which corner does it "stick":
       * `top-left`, `top-right`, `bottom-left`, `bottom-right`, or `none`?
       * Default is `top-right`. `None` disables stickiness.
       */
      stickyCorner: {
        type: String,
        attribute: "sticky-corner",
        reflect: true
      },
      /**
       * Url for a single subtitle track
       */
      track: {
        type: String
      },
      /**
       * Array of text tracks, eg. `[{ "src": "path/to/track.vtt", "label": "English", "srclang": "en", "kind": "subtitles", }]`
       */
      tracks: {
        type: Array
      },
      /**
       * Source of optional thumbnail image
       */
      thumbnailSrc: {
        type: String,
        attribute: "thumbnail-src",
        reflect: true
      },
      /**
       * Width of media player for non-a11y-media.
       */
      width: {
        type: String
      }
    };
  }
  /**
   * Store tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "video-player";
  }
  constructor() {
    super();
    this.crossorigin = "anonymous";
    this.dark = false;
    this.darkTranscript = false;
    this.disableInteractive = false;
    this.hideTimestamps = false;
    this.hideTranscript = false;
    this.lang = "en";
    this.linkable = false;
    this.preload = "metadata";
    this.sources = [];
    this.stickyCorner = "top-right";
    this.tracks = [];
    this.setSourceData();
    this.observer.observe(this, {
      childList: true,
      subtree: false
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    if (this.observer && this.observer.disconnect) this.observer.disconnect();
    super.disconnectedCallback();
  }
  /**
   * gets the HTML5 `audio` or `video` children
   * @readonly
   * @returns {object} HTML template
   */
  get html5() {
    return html`
      ${this.sourceData
        .filter(item => item.type !== "youtube")
        .map(sd => {
          html`
            <source
              .src="${sd.src || undefined}"
              .type="${sd.type || undefined}"
            />
          `;
        })}
      ${this.trackData.map(track => {
        `<track
          .src="${track.src || undefined}"
          .kind="${track.kind || undefined}"
          .label="${track.label || undefined}"
          .srclang="${track.lang || undefined}"
        />`;
      })}
    `;
  }

  /**
   * Computes whether uses iframe
   * @readonly
   * @returns {Boolean}
   */
  get iframed() {
    // make sure we take into account sandboxing as well
    // so that we can manage state effectively
    if (
      this.sourceData &&
      this.sourceData.length > 0 &&
      this.sourceData[0] !== undefined &&
      window.MediaBehaviors.Video._sourceIsIframe(this.sourceData[0].src) &&
      !this.sandboxed
    ) {
      return true;
    }
    return false;
  }

  /**
   * Determines if compatible with `a11y-media-player`
   * @readonly
   * @returns {Boolean}
   */
  get isA11yMedia() {
    if (
      !this.sandboxed &&
      (this.sourceType == "youtube" ||
        this.sourceType == "local" ||
        this.sourceData.length < 1)
    ) {
      return true;
    }
    return false;
  }
  /**
   * mutation observer for tabs
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.setSourceData();
    return new MutationObserver(callback);
  }

  /**
   * Compute sandboxed status
   * @readonly
   * @returns {Boolean}
   */
  get sandboxed() {
    // we have something that would require an iframe
    // see if we have a local system that would want to sandbox instead
    if (
      this.sourceData &&
      this.sourceData.length > 0 &&
      typeof this.sourceData[0] !== undefined &&
      window.MediaBehaviors.Video._sourceIsIframe(this.sourceData[0].src)
    ) {
      // fake creation of a webview element to see if it's valid
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
  }

  /**
   * Gets cleaned source list from source and sources properties
   * @readonly
   * @returns {Array} Eg. `[{ "src": "path/to/media.mp3", "type": "audio/mp3"}]`
   */
  get sourceProperties() {
    let temp =
      typeof this.sources === "string"
        ? JSON.parse(this.sources)
        : this.sources.slice();
    if (this.source) temp.unshift({ src: this.source });
    if (temp && temp.length > 0)
      temp.forEach(item => {
        item.type = item.type || this._computeMediaType(item.src);
        item.src = this._computeSRC(item.src, item.type);
      });
    return temp;
  }

  /**
   * Gets cleaned track list from track and tracks properties
   * @readonly
   * @returns {Array} Eg. `[{ "src": "path/to/track.vtt", "label": "English", "srclang": "en", "kind": "subtitles"}]`
   */
  get trackProperties() {
    let temp =
      typeof this.tracks === "string"
        ? JSON.parse(this.tracks)
        : this.tracks.slice();
    if (this.track) temp.unshift({ src: this.track });
    if (temp && temp.length > 0)
      temp.forEach(item => {
        item.srclang = item.srclang || this.lang;
        item.kind = item.kind || "subtitles";
        item.label = item.label || item.kind || item.lang;
      });
    return temp;
  }

  /**
   * Source properties and slotted sources
   * @readonly
   * @returns {Array} List of source objects
   */
  get sourceData() {
    let temp = this.sourceProperties.slice(),
      slotted = this.querySelectorAll("video source, audio source, iframe");
    slotted.forEach(slot => {
      this.sources.unshift({
        src: slot.src,
        type: slot.type || this._computeMediaType(slot.src)
      });
    });
    return temp;
  }

  get audioOnly() {
    let videos = this.sourceData.filter(
      item => item.type.indexOf("audio") > -1
    );
    return videos.length > 1;
  }

  get standAlone() {
    return (
      this.trackData === undefined ||
      this.trackData === null ||
      this.trackData.length < 1
    );
  }

  /**
   * Gets type of source based on src attribute
   * @returns {String} `local`, `vimeo`, `youtube`, etc.
   */
  get sourceType() {
    if (
      this.sourceData &&
      this.sourceData.length > 0 &&
      this.sourceData[0] !== undefined &&
      typeof this.sourceData[0].src !== typeof undefined
    ) {
      return window.MediaBehaviors.Video.getVideoType(this.sourceData[0].src);
    } else {
      return null;
    }
  }

  /**
   * Gets cleaned track list
   * @readonly
   * @returns {Array} Eg. `[{ "src": "path/to/track.vtt", "label": "English", "srclang": "en", "kind": "subtitles",}]`
   */
  get trackData() {
    let temp =
        typeof this.tracks === "string"
          ? JSON.parse(this.tracks).slice()
          : this.tracks.slice(),
      slotted = this.querySelectorAll("video track, audio track");
    slotted.forEach(slot => {
      let track = { src: slot.src };
      if (slot.lang) track.lang = slot.lang;
      if (slot.srclang) track.srclang = slot.srclang;
      if (slot.label) track.label = slot.label;
      if (slot.kind) track.kind = slot.kind;
      this.tracks.unshift(track);
      slot.remove();
    });
    if (this.track !== undefined && this.track !== null && this.track !== "")
      temp.push({
        src: this.track,
        srclang: this.lang,
        label: this.lang === "en" ? "English" : this.lang,
        kind: "subtitles"
      });
    return temp;
  }

  /**
   * Gets Youtube ID from source string
   * @readonly
   * @returns {String}
   */
  get youtubeId() {
    if (
      this.sourceData &&
      this.sourceData[0] &&
      this.sourceType === "youtube"
    ) {
      return this._computeSRC(this.sourceData[0].src).replace(
        /.*\/embed\//,
        ""
      );
    }
    return;
  }

  /**
   * gets an id for a11y-media-player
   * @readonly
   * @returns {string} an id for player
   */
  get playerId() {
    return `${this.id || this.schemaResourceID}-media`;
  }

  /**
   * Compute media type based on source, i.e. 'audio/wav' for '.wav'
   */
  _computeMediaType(source) {
    let audio = ["aac", "flac", "mp3", "oga", "wav"],
      video = ["mov", "mp4", "ogv", "webm"],
      type = "",
      findType = (text, data) => {
        data.forEach(item => {
          if (
            type === "" &&
            typeof source !== undefined &&
            source !== null &&
            source.toLowerCase().indexOf("." + item) > -1
          ) {
            type = text + "/" + item;
          }
        });
      };
    findType("audio", audio);
    findType("video", video);
    return type;
  }

  /**
   * Compute src from type / source combo.
   * Type is set by source so this ensures a waterfall
   * of valid values.
   */
  _computeSRC(source, type) {
    if (source !== null && typeof source !== undefined) {
      // ensure that this is a valid url / cleaned up a bit
      type = type || window.MediaBehaviors.Video.getVideoType(source);
      source = window.MediaBehaviors.Video.cleanVideoSource(source, type);
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
      } else if (type == "dailymotion") {
        source += "&ui-start-screen-info=false";
        source += "&ui-logo=false";
        source += "&sharing-enable=false";
        source += "&endscreen-enable=false";
      }
    }
    return source;
  }
  /**
   * postProcesshaxNodeToContent - clean up so we don't have empty array data
   */
  postProcesshaxNodeToContent(content) {
    content = content.replace(' sources="[]",', "");
    content = content.replace(' tracks="[]",', "");
    return content;
  }
  /**
   * triggers an update of sourceData property when slot changes
   *
   * @memberof VideoPlayer
   */
  setSourceData() {
    let temp = this.source;
    this.source = "";
    this.source = temp;
  }
}
window.customElements.define(VideoPlayer.tag, VideoPlayer);
export { VideoPlayer };
