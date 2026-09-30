import { A11yMediaYoutube } from '../lib/a11y-media-youtube.js'

/**
 * Offline test double for the global YT.Player constructor.
 * a11y-media-player / a11y-media-youtube drive playback through the real
 * YouTube IFrame API; tests must never load it, so every fixture gets this
 * fully local fake instead. It records calls so assertions can inspect them.
 */
export class FakeYTPlayer {
  constructor(divid, opts) {
    this.divid = divid
    this.opts = opts || {}
    this.listeners = {}
    this.state = 5
    this.time = 0
    this.durationVal = 0
    this.volumeVal = 70
    this.mutedVal = false
    this.playbackRateVal = 1
    this.playVideoCalls = 0
    this.pauseVideoCalls = 0
    this.destroyed = false
    this.cued = null
    this.bufferedRange = null
    // a real (inert, src-less) iframe matches what YT.Player returns and
    // keeps aria-label/title valid for the a11y audits
    this.iframe = globalThis.document.createElement("iframe");
    if (this.opts.events && this.opts.events.onReady) {
      this.opts.events.onReady({ target: this })
    }
  }
  getIframe() {
    return this.iframe
  }
  addEventListener(type, cb) {
    this.listeners[type] = this.listeners[type] || []
    this.listeners[type].push(cb)
  }
  playVideo() {
    this.playVideoCalls += 1
    this.state = 1
  }
  pauseVideo() {
    this.pauseVideoCalls += 1
    this.state = 2
  }
  seekTo(time, allowSeekAhead) {
    this.time = time
    this.seekAllowed = allowSeekAhead
  }
  mute() {
    this.mutedVal = true
  }
  unMute() {
    this.mutedVal = false
  }
  setLoop(loop) {
    this.loopVal = loop
  }
  setPlaybackRate(rate) {
    this.playbackRateVal = rate
  }
  setVolume(volume) {
    this.volumeVal = volume
  }
  getCurrentTime() {
    return this.time
  }
  getDuration() {
    return this.durationVal
  }
  getPlayerState() {
    return this.state
  }
  cueVideoById(data) {
    this.cued = data
  }
  destroy() {
    this.destroyed = true
  }
  get buffered() {
    return this.bufferedRange
  }
}

/**
 * Installs page-wide guards so no fixture in the calling test file can make
 * an external request. Call once at module scope, before any fixture:
 * - preconnected=true keeps warmConnections() from adding real preconnect hints
 * - a truthy manager.api keeps init() from injecting the real iframe API script
 * - globalThis.YT.Player is replaced with the local FakeYTPlayer
 * - the a11y-media-player poster getter wraps external http(s) urls (the
 *   generated https://img.youtube.com/vi/... thumbnail) into an inline
 *   placeholder so neither #print-thumbnail nor the #player background-image
 *   can fetch it
 */
export function installOfflineYouTubeStubs() {
  A11yMediaYoutube.preconnected = true
  globalThis.A11yMediaYoutubeManager.api = true
  globalThis.YT = { Player: FakeYTPlayer }
  const PlayerClass = globalThis.customElements.get('a11y-media-player')
  if (PlayerClass && !PlayerClass.prototype.__posterOfflineStubbed) {
    const desc = Object.getOwnPropertyDescriptor(PlayerClass.prototype, 'poster')
    if (desc && desc.get) {
      const originalGet = desc.get
      Object.defineProperty(PlayerClass.prototype, 'poster', {
        get() {
          const url = originalGet.call(this)
          if (
            typeof url === 'string' &&
            url.match(/^https?:\/\//) &&
            url.indexOf('localhost') < 0
          ) {
            return 'data:image/gif;base64,R0lGODlhAQABAAAAADs='
          }
          return url
        },
        configurable: true,
      })
      PlayerClass.prototype.__posterOfflineStubbed = true
    }
  }
}
