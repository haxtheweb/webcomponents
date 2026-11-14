/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { VideoPlayer } from "@haxtheweb/video-player/video-player.js";
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
  /**
   * xAPI statements this element sends (see scripts/generate-xapi-vocabulary.mjs)
   */
  static get xapiVocabulary() {
    return {
      tag: "audio-player",
      event: "user-engagement",
      verbs: ["attempted", "progressed", "completed"],
      objectType: "http://adlnet.gov/expapi/activities/media",
      result: [
        "completion",
        "duration",
        "extensions.https://w3id.org/xapi/video/extensions/progress",
      ],
      countsTowardCompletion: true,
      done: "every quarter of the media actually watched (90% of its seconds), or the first three and the player reaching its end; seeking ahead does not count, and each milestone is sent once per learner",
    };
  }
  // haxProperty definition
  static get haxProperties() {
    return new URL("./lib/audio-player.haxProperties.json", import.meta.url)
      .href;
  }
}
globalThis.customElements.define(AudioPlayer.tag, AudioPlayer);
export { AudioPlayer };
