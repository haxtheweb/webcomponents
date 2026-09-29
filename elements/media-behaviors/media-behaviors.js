import { sanitizeEmbeddableURL } from "@haxtheweb/utils/lib/url.js";
// ensure MediaBehaviors exists
globalThis.MediaBehaviors = globalThis.MediaBehaviors || {};
/**
 * `MediaBehaviors.Video` provides some helper functions for working with video
 * from multiple sources. It helps resolve a video by type and currently supports
 * youtube, vimeo, twitch, and a few other sources and helps to determine if we need
 * an iframe to display the media or a local `<video>` tag.
 *
 * This also provides a powerful little utility to clean up embedded
 * URLs that reference popular media sources in order to make sure
 * that their embed URLs are structured correctly. This is especially
 * useful for allowing users to copy and paste links from youtube's URL
 * bar yet actually transform that address into a cookie free embed that
 * strips off the related videos and other options.
 *
 **/
globalThis.MediaBehaviors.Video = {
  /**
   * Compute iframe or video tag for implementation.
   */
  _sourceIsIframe(source) {
    let type = this.getVideoType(source);
    if (type == "local") {
      return false;
    } else {
      return true;
    }
  },
  /**
   * Check source of the video, potentially correcting bad links.
   */
  cleanVideoSource(input, type) {
    input = sanitizeEmbeddableURL(input, "");
    if (input === "") {
      return input;
    }
    // ensure we are NOT local and do a sanity check
    if (type != "local" && typeof input === "string") {
      // strip off the ? modifier for youtube/vimeo so we can build ourselves
      var tmp = input.split("?");
      var v = "";
      input = tmp[0];
      if (tmp.length == 2) {
        let tmp2 = tmp[1].split("&"),
          args = tmp2[0].split("=");
        // drop the v parameter (the video id) and keep every other
        // parameter on the rebuilt query string
        tmp2.shift();
        let qry = tmp2.join("&");
        if (args[0] == "v") {
          let q = qry !== undefined && qry !== "" ? "?" + qry : "";
          v = args[1] + q;
        }
      }
      // link to the vimeo video instead of the embed player address
      if (
        input.indexOf("player.vimeo.com") == -1 &&
        input.indexOf("vimeo.com") != -1
      ) {
        // normalize what the API will return since it is API based
        // and needs cleaned up for front-end
        if (input.indexOf("/videos/") != -1) {
          input = input.replace("/videos/", "/");
        }
        return input.replace("vimeo.com/", "player.vimeo.com/video/");
      }
      // copy and paste from the URL
      else if (input.indexOf("youtube.com/watch") != -1) {
        return input.replace("youtube.com/watch", "youtube.com/embed/") + v;
      }
      // copy and paste from the URL shorts
      else if (input.indexOf("youtube.com/shorts/") != -1) {
        return input.replace("youtube.com/shorts/", "youtube.com/embed/") + v;
      }
      // copy and paste from the URL
      else if (input.indexOf("youtube-no-cookie.com/") != -1) {
        return input.replace("youtube-no-cookie.com/", "youtube.com/") + v;
      }
      // weird share-ly style version
      else if (input.indexOf("youtu.be") != -1) {
        return input.replace("youtu.be/", "www.youtube.com/embed/") + v;
      }
      // embed link
      else if (input.indexOf("player.twitch.tv/") != -1) {
        if (tmp[1]) {
          return `${input}?${tmp[1].replace("&parent=www.example.com", "")}`;
        } else {
          let tmp2 = input.replace("&parent=www.example.com", "").split("/");
          // a /video(s) path segment means the last segment is a video id,
          // otherwise it is a channel name
          let isVideo =
            input.indexOf("/video/") != -1 || input.indexOf("/videos/") != -1;
          let type = isVideo ? "video" : "channel";
          return `https://player.twitch.tv/?${type}=${tmp2.pop()}`;
        }
      }
      // URL / share link
      else if (input.indexOf("twitch.tv/videos/") != -1) {
        let tmp2 = input.replace("&parent=www.example.com", "").split("/");
        return `https://player.twitch.tv/?video=${tmp2.pop()}`;
      }
      // twitch channel URL / share link
      else if (input.indexOf("twitch.tv/") != -1) {
        let tmp2 = input.replace("&parent=www.example.com", "").split("/");
        return `https://player.twitch.tv/?channel=${tmp2.pop()}`;
      }
      // copy and paste from the URL for sketchfab
      else if (
        input.indexOf("sketchfab.com") != -1 &&
        input.indexOf("/embed") == -1
      ) {
        return input + "/embed";
      }
      // copy and paste a Kaltura MediaSpace share URL into the secure embed
      // https://{tenant}.mediaspace.kaltura.com/media/t/{mediaId}
      // -> https://{tenant}.mediaspace.kaltura.com/embed/secure/iframe/entryId/{mediaId}/uiConfId/54679342/st/0
      else if (
        input.indexOf("mediaspace.kaltura.com") != -1 &&
        input.indexOf("/media/t/") != -1
      ) {
        let match = input.match(/^https?:\/\/([^\/]+)\/media\/t\/([^\/?#]+)/i);
        if (match) {
          return (
            "https://" +
            match[1] +
            "/embed/secure/iframe/entryId/" +
            match[2] +
            "/uiConfId/54679342/st/0"
          );
        }
      }
    }
    return input;
  },
  /**
   * Figure out the type of video based on source.
   */
  getVideoType(source) {
    if (typeof source !== "string" || source === "") {
      return "external";
    }
    let localFormats = [
        "aac",
        "flac",
        "mov",
        "mp3",
        "mp4",
        "oga",
        "ogg",
        "ogv",
        "wav",
        "webm",
      ],
      isLocal = false;
    // some common ones
    if (source.indexOf("vimeo") != -1) {
      return "vimeo";
    } else if (
      source.indexOf("youtube") != -1 ||
      source.indexOf("youtu.be") != -1
    ) {
      return "youtube";
    } else if (source.indexOf("sketchfab.com") != -1) {
      return "sketchfab";
    } else if (source.indexOf("twitch.tv") != -1) {
      return "twitch";
    } else if (
      source.indexOf("mediaspace.kaltura.com") != -1 &&
      (source.indexOf("/media/t/") != -1 ||
        source.indexOf("/embed/secure/iframe/entryId/") != -1)
    ) {
      return "kaltura";
    }
    for (let i = 0; i < localFormats.length; i++) {
      if (!isLocal && source.toLowerCase().indexOf("." + localFormats[i]) > -1)
        isLocal = true;
    }
    // see if it's a direct file reference, otherwise we'll assume it's external
    if (isLocal) {
      return "local";
    } else {
      // not sure but iframe it for funzies
      return "external";
    }
  },
};

export const MediaBehaviorsVideo = function (SuperClass) {
  return class extends SuperClass {
    _sourceIsIframe(source) {
      let type = this.getVideoType(source);
      if (type == "local") {
        return false;
      } else {
        return true;
      }
    }
    /**
     * Check source of the video, potentially correcting bad links.
     */
    cleanVideoSource(input, type) {
      // delegate to the global helper so the two implementations can never
      // drift apart (the mixin copy was missing the youtube shorts branch
      // and the typeof-string guard before this was unified)
      return globalThis.MediaBehaviors.Video.cleanVideoSource(input, type);
    }
    /**
     * Figure out the type of video based on source.
     */
    getVideoType(source) {
      return globalThis.MediaBehaviors.Video.getVideoType(source);
    }
  };
};
