// Fake media + recording environment shared by the voice-recorder suites.
// Nothing here touches a real microphone, AudioContext, Worker, or Audio
// element, so no recording hardware or network upload is ever exercised.

export const fakeWorkerBehavior = {
  initFails: false,
  replyToStop: true,
  stopBlob: null,
}

export function resetFakeWorkerBehavior() {
  fakeWorkerBehavior.initFails = false
  fakeWorkerBehavior.replyToStop = true
  fakeWorkerBehavior.stopBlob = null
}

export function settle(ms = 20) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function waitForEvent(target, name) {
  return new Promise((resolve) =>
    target.addEventListener(name, (event) => resolve(event), { once: true }),
  )
}

export function swallowUnhandledRejections() {
  const handler = (event) => event.preventDefault()
  globalThis.addEventListener('unhandledrejection', handler)
  return {
    restore: () => globalThis.removeEventListener('unhandledrejection', handler),
  }
}

export function silenceConsoleError() {
  const original = console.error
  const calls = []
  console.error = function () {
    calls.push(Array.from(arguments))
  }
  return {
    restore: () => {
      console.error = original
    },
    calls,
  }
}

export function makeFakeTrack() {
  const track = {
    stopped: 0,
    stop() {
      this.stopped += 1
    },
  }
  return track
}

export function makeFakeStream() {
  const tracks = [makeFakeTrack(), makeFakeTrack()]
  const stream = {
    getTracks: () => tracks,
  }
  return { stream, tracks }
}

export function makeFakeAudioParam() {
  return {
    value: 0,
    setTargetAtTime() {},
  }
}

export function makeFakeAudioNode() {
  const node = {
    buffer: null,
    loop: false,
    onaudioprocess: null,
    connectCalls: [],
    disconnectCalls: 0,
    connect(target) {
      this.connectCalls.push(target)
      return target
    },
    disconnect() {
      this.disconnectCalls += 1
    },
    start() {},
    gain: makeFakeAudioParam(),
    delayTime: makeFakeAudioParam(),
  }
  return node
}

export class FakeAudioContext {
  constructor() {
    this.sampleRate = 44100
    this.currentTime = 0
    this.state = 'running'
    this.closeCalls = 0
    this.destination = makeFakeAudioNode()
  }
  close() {
    this.closeCalls += 1
    return Promise.resolve()
  }
  createGain() {
    return makeFakeAudioNode()
  }
  createMediaStreamSource() {
    return makeFakeAudioNode()
  }
  createScriptProcessor() {
    return makeFakeAudioNode()
  }
  createBufferSource() {
    return makeFakeAudioNode()
  }
  createDelay() {
    return makeFakeAudioNode()
  }
  createBuffer(channels, length) {
    const data = new Float32Array(length)
    return {
      getChannelData: () => data,
    }
  }
}

export class FakeAudioElement {
  constructor() {
    this.paused = true
    this.src = ''
    this.pauseCalls = 0
  }
  pause() {
    this.pauseCalls += 1
    this.paused = true
  }
  play() {
    return Promise.resolve()
  }
}

export class FakeWorker {
  constructor(url) {
    this.url = url
    this.onmessage = null
    this.terminated = false
    this.messages = []
  }
  postMessage(message) {
    this.messages.push(message)
    if (message.type === 'init') {
      setTimeout(() => {
        if (this.terminated || !this.onmessage) {
          return
        }
        if (fakeWorkerBehavior.initFails) {
          this.onmessage({ data: { type: 'init-error', data: 'wasm failed' } })
        } else {
          this.onmessage({ data: { type: 'init' } })
        }
      })
    } else if (message.type === 'stop' && fakeWorkerBehavior.replyToStop) {
      const blob =
        fakeWorkerBehavior.stopBlob ||
        new Blob(['fake-mp3-bytes'], { type: 'audio/mpeg' })
      setTimeout(() => {
        if (this.terminated || !this.onmessage) {
          return
        }
        this.onmessage({ data: { type: 'stop', data: blob } })
      })
    }
  }
  terminate() {
    this.terminated = true
  }
  emit(type, data) {
    if (this.onmessage) {
      this.onmessage({ data: { type, data } })
    }
  }
}

export function installFakeMediaEnvironment() {
  const { stream, tracks } = makeFakeStream()
  const saved = {
    hadMediaDevices: Object.prototype.hasOwnProperty.call(
      navigator,
      'mediaDevices',
    ),
    mediaDevices: navigator.mediaDevices,
    webkitGetUserMedia: navigator.webkitGetUserMedia,
    mozGetUserMedia: navigator.mozGetUserMedia,
    AudioContext: globalThis.AudioContext,
    webkitAudioContext: globalThis.webkitAudioContext,
    Worker: globalThis.Worker,
    Audio: globalThis.Audio,
  }
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: () => Promise.resolve(stream),
    },
    configurable: true,
  })
  globalThis.AudioContext = FakeAudioContext
  globalThis.webkitAudioContext = FakeAudioContext
  globalThis.Worker = FakeWorker
  globalThis.Audio = FakeAudioElement
  const restore = () => {
    if (saved.hadMediaDevices) {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: saved.mediaDevices,
        configurable: true,
      })
    } else {
      delete navigator.mediaDevices
    }
    if (saved.webkitGetUserMedia === undefined) {
      delete navigator.webkitGetUserMedia
    } else {
      navigator.webkitGetUserMedia = saved.webkitGetUserMedia
    }
    if (saved.mozGetUserMedia === undefined) {
      delete navigator.mozGetUserMedia
    } else {
      navigator.mozGetUserMedia = saved.mozGetUserMedia
    }
    globalThis.AudioContext = saved.AudioContext
    globalThis.webkitAudioContext = saved.webkitAudioContext
    globalThis.Worker = saved.Worker
    globalThis.Audio = saved.Audio
  }
  return { stream, tracks, restore }
}

export function rejectGetUserMedia(message = 'no microphone') {
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: () => Promise.reject(new Error(message)),
    },
    configurable: true,
  })
}

export function legacyGetUserMedia(stream) {
  Object.defineProperty(navigator, 'mediaDevices', {
    value: undefined,
    configurable: true,
  })
  navigator.webkitGetUserMedia = (constraints, resolve) => resolve(stream)
}

export function unavailableGetUserMedia() {
  Object.defineProperty(navigator, 'mediaDevices', {
    value: undefined,
    configurable: true,
  })
  // shadow any prototype level legacy APIs as well, since deleting the
  // own property is not enough to hide them
  Object.defineProperty(navigator, 'webkitGetUserMedia', {
    value: undefined,
    configurable: true,
  })
  Object.defineProperty(navigator, 'mozGetUserMedia', {
    value: undefined,
    configurable: true,
  })
}
