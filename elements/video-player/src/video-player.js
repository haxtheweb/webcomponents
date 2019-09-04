/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import { A11yBehaviors } from "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import "@polymer/polymer/lib/elements/dom-if.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import { MediaBehaviorsVideo } from "@lrnwebcomponents/media-behaviors/media-behaviors.js";
import "@lrnwebcomponents/a11y-media-player/a11y-media-player.js";
/**
 * `video-player`
 * `A simple responsive video player with ridiculously powerful backing`
 *
 * @microcopy - language worth noting:
 * - `video source` - url / link to the video file
 * ```
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
</video-player>```
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class VideoPlayer extends MediaBehaviorsVideo(
  A11yBehaviors(SchemaBehaviors(SimpleColors))
) {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */
  constructor() {
    super();
    afterNextRender(this, function() {
      this.HAXWiring = new HAXWiring();
      this.HAXWiring.setup(VideoPlayer.haxProperties, VideoPlayer.tag, this);
    });
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "video-player";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * Get Youtube ID
   */
  _computeYoutubeId(source, sourceType) {
    if (source !== undefined && sourceType === "youtube") {
      return this._computeSRC(source).replace(
        /(https?:\/\/)?(www.)?youtube(-nocookie)?.com\/embed\//,
        ""
      );
    }
    return false;
  }

  /**
   * Determine if it is youtube
   */
  _computeYoutube(sourceType) {
    return sourceType === "youtube";
  }

  /**
   * Determine if it is compatible with a11y-media-player
   */
  _computeA11yMedia(sourceType, sandboxed) {
    if (!sandboxed && (sourceType == "youtube" || sourceType == "local")) {
      return true;
    }
    return false;
  }

  /**
   * Compute iframed status
   */
  _computeIframed(sourceData, sandboxed) {
    // make sure we take into account sandboxing as well
    // so that we can manage the state effectively
    if (
      sourceData.length > 0 &&
      sourceData[0] !== undefined &&
      window.MediaBehaviors.Video._sourceIsIframe(sourceData[0].src) &&
      !sandboxed
    ) {
      return true;
    }
    return false;
  }

  /**
   * Gets cleaned track list
   */
  _getTrackData(track, tracks) {
    let temp =
      typeof tracks === "string" ? JSON.parse(tracks).slice() : tracks.slice();
    if (track !== undefined && track !== null && track !== "")
      temp.push({
        src: track,
        srclang: this.lang,
        label: this.lang === "en" ? "English" : this.lang,
        kind: "subtitles"
      });
    return temp;
  }

  /**
   * Gets source and added to sources list
   */
  _getSourceData(source, sources, trackData) {
    if (typeof sources === "string") sources = JSON.parse(sources);
    let root = this,
      temp = sources.slice();
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
      if (this.sourceType !== "youtube") {
        temp.unshift({ src: src, type: this._computeMediaType(src) });
      }
    }
    this.__standAlone =
      trackData === undefined || trackData === null || trackData.length < 1;
    return temp;
  }

  /**
   * Compute media type based on source, i.e. 'audio/wav' for '.wav'
   */
  _computeMediaType(source) {
    let root = this,
      audio = ["aac", "flac", "mp3", "oga", "wav"],
      video = ["mov", "mp4", "ogv", "webm"],
      type = "",
      findType = function(text, data) {
        for (let i = 0; i < data.length; i++) {
          if (
            type === "" &&
            source !== undefined &&
            source !== null &&
            source.toLowerCase().indexOf("." + data[i]) > -1
          ) {
            if (text === "audio") root.audioOnly = true;
            type = text + "/" + data[i];
          }
        }
      };
    findType("audio", audio);
    findType("video", video);
    return type;
  }

  /**
   * Compute sandboxed status
   */
  _computeSandboxed(sourceData) {
    // we have something that would require an iframe
    // see if we have a local system that would want to sandbox instead
    if (
      sourceData.length > 0 &&
      sourceData[0] !== undefined &&
      window.MediaBehaviors.Video._sourceIsIframe(sourceData[0].src)
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
  }

  /**
   * Compute video type based on source
   */
  _computeSourceType(sourceData) {
    let root = this;
    if (
      sourceData.length > 0 &&
      sourceData[0] !== undefined &&
      typeof sourceData[0].src !== typeof undefined
    ) {
      return window.MediaBehaviors.Video.getVideoType(sourceData[0].src);
    } else {
      return null;
    }
  }

  /**
   * Compute src from type / source combo.
   * Type is set by source so this ensures a waterfall
   * of valid values.
   */
  _computeSRC(source) {
    if (source !== null && typeof source !== undefined) {
      let type =
        this.sourceType !== undefined
          ? this.sourceType
          : window.MediaBehaviors.Video.getVideoType(source);
      // ensure that this is a valid url / cleaned up a bit
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
  /**
   * postProcesshaxNodeToContent - clean up so we don't have empty array data
   */
  postProcesshaxNodeToContent(content) {
    content = content.replace(' sources="[]",', "");
    content = content.replace(' tracks="[]",', "");
    return content;
  }
}
window.customElements.define(VideoPlayer.tag, VideoPlayer);
export { VideoPlayer };
