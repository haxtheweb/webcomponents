/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { VideoPlayer } from "@lrnwebcomponents/video-player/video-player.js";
/**
 * `audio-player`
 * `simple audio web component to match video`
 * @demo demo/index.html
 * @element audio-player
 */
class AudioPlayer extends VideoPlayer {
  /**
   * HTMLElement
   */
  constructor() {
    super();
  }
  get audioOnly() {
    return true;
  }
  /**
   * Convention we use
   */
  static get tag() {
    return "audio-player";
  }
  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: {
        min: 50,
        step: 25,
      },
      canPosition: false,
      canEditSource: true,
      gizmo: {
        title: "Audio",
        description:
          "This can present video in a highly accessible manner regardless of source.",
        icon: "av:music-video",
        color: "green",
        tags: ["Audio / Video", "Media", "listen", "mp3"],
        handles: [
          {
            type: "audio",
            type_exclusive: true,
            source: "source",
            title: "caption",
            caption: "caption",
            description: "caption",
            color: "primaryColor",
          },
        ],
        meta: {
          author: "HAXTheWeb core team",
        },
      },
      settings: {
        configure: [
          {
            property: "source",
            title: "Source",
            description: "The URL for this media.",
            inputMethod: "haxupload",
            noCamera: true,
            validationType: "url",
          },
          {
            property: "mediaTitle",
            title: "Title",
            description: "Simple title for under video",
            inputMethod: "textfield",
            validationType: "text",
          },
          {
            property: "accentColor",
            title: "Accent color",
            description: "Select the accent color for the player.",
            inputMethod: "colorpicker",
          },
          {
            property: "track",
            title: "Closed captions",
            description: "The URL for the captions file.",
            inputMethod: "haxupload",
            noCamera: true,
            noVoiceRecord: true,
            validationType: "url",
          },
        ],
        advanced: [
          {
            property: "thumbnailSrc",
            title: "Thumbnail image",
            description: "Optional. The URL for a thumbnail/poster image.",
            inputMethod: "haxupload",
            noVoiceRecord: true,
            validationType: "url",
          },
          {
            property: "learningMode",
            title: "Enable learning mode",
            description: "Disables fast forward and rewind.",
            inputMethod: "boolean",
          },
          {
            property: "hideYoutubeLink",
            title: "Remove open on YouTube button",
            description: "Removes the button for opening the video on YouTube.",
            inputMethod: "boolean",
          },
          {
            property: "linkable",
            title: "Include a share link?",
            description: "Provides a link to share the video.",
            inputMethod: "boolean",
          },
        ],
        developer: [
          {
            property: "crossorigin",
            title: "Crossorigin",
            description: "Indicates whether to use CORS.",
            inputMethod: "select",
            options: {
              "": "",
              anonymous: "anonymous",
              "use-credentials": "use-credentials",
            },
          },
          {
            property: "allowBackgroundPlay",
            title: "Allow background playback",
            description:
              "Videos pause / play automatically when tab loses focus; this enables video to play without tab having focus",
            inputMethod: "boolean",
          },
          {
            property: "darkTranscript",
            title: "Dark theme for transcript",
            description: "Enable dark theme for the transcript.",
            inputMethod: "boolean",
          },
          {
            property: "disableInteractive",
            title: "Disable Interactive",
            description:
              "Disable interactive mode that makes transcript clickable.",
            inputMethod: "boolean",
          },
          {
            property: "hideTimestamps",
            title: "Hide timestamps",
            description: "Hide the time stamps on the transcript.",
            inputMethod: "boolean",
          },
          {
            property: "hideTranscript",
            title: "Hide Transcript",
            description: "Hide transcript by default.",
            inputMethod: "boolean",
          },
          {
            property: "lang",
            title: "Language",
            description: "Language of the media.",
            inputMethod: "textfield",
            validationType: "text",
          },
        ],
      },
      saveOptions: {
        unsetAttributes: ["__utils", "__stand-alone", "colors"],
      },
      demoSchema: [
        {
          tag: "audio-player",
          properties: {
            accentColor: "orange",
            dark: true,
            crossorigin: "anonymous",
            source: "https://inline-audio-mocha.vercel.app/assets/whopper.mp3",
          },
          content: "",
        },
      ],
    };
  }
}
customElements.define(AudioPlayer.tag, AudioPlayer);
export { AudioPlayer };
