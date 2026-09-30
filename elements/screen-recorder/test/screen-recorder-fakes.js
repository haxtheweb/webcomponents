// Fake screen-recording environment for the screen-recorder suite.
// Nothing here touches a real display, microphone, AudioContext,
// MediaRecorder, or MediaStream, so no capture hardware or network
// request is ever exercised.

export class FakeMediaStream {
  constructor(tracks) {
    this.tracks = tracks || []
  }
  getTracks() {
    return this.tracks
  }
  getVideoTracks() {
    return this.tracks.filter((track) => track.kind === 'video')
  }
  getAudioTracks() {
    return this.tracks.filter((track) => track.kind === 'audio')
  }
}

export class FakeAudioContext {
  constructor() {
    this.destinations = []
    this.sources = []
  }
  createMediaStreamDestination() {
    const destination = {
      stream: new FakeMediaStream([{ kind: 'audio', mixed: true }]),
    }
    this.destinations.push(destination)
    return destination
  }
  createMediaStreamSource(stream) {
    const source = {
      stream,
      connected: [],
      connect(target) {
        this.connected.push(target)
      },
    }
    this.sources.push(source)
    return source
  }
}

export class FakeMediaRecorder {
  constructor(stream) {
    this.stream = stream
    this.state = 'inactive'
    this.ondataavailable = null
    this.onstop = null
    this.startCalls = 0
    this.stopCalls = 0
  }
  start() {
    this.startCalls += 1
    this.state = 'recording'
  }
  stop() {
    this.stopCalls += 1
    this.state = 'inactive'
    if (this.onstop) {
      this.onstop()
    }
  }
}

function makeTrack(kind) {
  const track = {
    kind,
    stopped: 0,
    stop() {
      this.stopped += 1
    },
  }
  return track
}

export function installFakeScreenRecordingEnvironment() {
  const videoTrack = makeTrack('video')
  const systemAudioTrack = makeTrack('audio')
  const displayStream = new FakeMediaStream([videoTrack, systemAudioTrack])
  const micTrack = makeTrack('audio')
  const micStream = new FakeMediaStream([micTrack])
  const behavior = {
    displayStreamError: null,
    micStreamError: null,
    getDisplayMediaCalls: [],
    getUserMediaCalls: [],
    alertCalls: [],
  }
  const saved = {
    hadMediaDevices: Object.prototype.hasOwnProperty.call(
      navigator,
      'mediaDevices',
    ),
    mediaDevices: navigator.mediaDevices,
    AudioContext: globalThis.AudioContext,
    MediaRecorder: globalThis.MediaRecorder,
    MediaStream: globalThis.MediaStream,
    alert: globalThis.alert,
    revokeObjectURL: URL.revokeObjectURL,
  }
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getDisplayMedia: (constraints) => {
        behavior.getDisplayMediaCalls.push(constraints)
        if (behavior.displayStreamError) {
          return Promise.reject(new Error(behavior.displayStreamError))
        }
        return Promise.resolve(displayStream)
      },
      getUserMedia: (constraints) => {
        behavior.getUserMediaCalls.push(constraints)
        if (behavior.micStreamError) {
          return Promise.reject(new Error(behavior.micStreamError))
        }
        return Promise.resolve(micStream)
      },
    },
    configurable: true,
  })
  globalThis.AudioContext = FakeAudioContext
  globalThis.MediaRecorder = FakeMediaRecorder
  globalThis.MediaStream = FakeMediaStream
  globalThis.alert = (message) => {
    behavior.alertCalls.push(message)
  }
  behavior.revokeObjectURLCalls = []
  URL.revokeObjectURL = (url) => {
    behavior.revokeObjectURLCalls.push(url)
  }
  const restore = () => {
    if (saved.hadMediaDevices) {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: saved.mediaDevices,
        configurable: true,
      })
    } else {
      delete navigator.mediaDevices
    }
    globalThis.AudioContext = saved.AudioContext
    globalThis.MediaRecorder = saved.MediaRecorder
    globalThis.MediaStream = saved.MediaStream
    globalThis.alert = saved.alert
    URL.revokeObjectURL = saved.revokeObjectURL
  }
  return { videoTrack, systemAudioTrack, micTrack, displayStream, micStream, behavior, restore }
}

export function silenceConsole() {
  const savedError = console.error
  const savedWarn = console.warn
  const errors = []
  const warns = []
  console.error = function () {
    errors.push(Array.from(arguments))
  }
  console.warn = function () {
    warns.push(Array.from(arguments))
  }
  return {
    errors,
    warns,
    restore: () => {
      console.error = savedError
      console.warn = savedWarn
    },
  }
}

export function settle(ms = 20) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
