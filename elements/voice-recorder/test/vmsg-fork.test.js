import { expect } from '@open-wc/testing'
import { Recorder, Form, record } from '../lib/vmsg-fork.js'
import {
  FakeAudioContext,
  FakeWorker,
  fakeWorkerBehavior,
  installFakeMediaEnvironment,
  legacyGetUserMedia,
  makeFakeStream,
  rejectGetUserMedia,
  resetFakeWorkerBehavior,
  settle,
  silenceConsoleError,
  unavailableGetUserMedia,
  waitForEvent,
} from './vmsg-fakes.js'

function makeResolvers() {
  const calls = { resolved: [], rejected: [] }
  return {
    calls,
    resolve: (value) => calls.resolved.push(value),
    reject: (error) => calls.rejected.push(error),
  }
}

async function openForm(target, resolvers) {
  const ready = waitForEvent(target, 'vmsg-ready')
  const form = new Form({}, target, resolvers.resolve, resolvers.reject)
  await ready
  return form
}

describe('vmsg-fork Recorder', () => {
  let env
  beforeEach(() => {
    resetFakeWorkerBehavior()
    env = installFakeMediaEnvironment()
  })
  afterEach(() => {
    env.restore()
    resetFakeWorkerBehavior()
  })

  it('applies default URLs and options', () => {
    const rec = new Recorder()
    expect(rec.wasmURL.endsWith('/static/js/vmsg.wasm')).to.be.true
    expect(rec.shimURL.endsWith('/static/js/wasm-polyfill.js')).to.be.true
    expect(rec.pitch).to.equal(0)
    expect(rec.stream).to.equal(null)
    expect(rec.worker).to.equal(null)
    expect(rec.blob).to.equal(null)
  })

  it('applies custom URLs and pitch', () => {
    const rec = new Recorder({
      wasmURL: './custom/vmsg.wasm',
      shimURL: './custom/shim.js',
      pitch: 0.5,
    })
    expect(rec.wasmURL.endsWith('/custom/vmsg.wasm')).to.be.true
    expect(rec.shimURL.endsWith('/custom/shim.js')).to.be.true
    expect(rec.pitch).to.equal(0.5)
  })

  it('initAudio builds the audio graph without pitch shift', async () => {
    const rec = new Recorder()
    await rec.initAudio()
    expect(rec.stream).to.equal(env.stream)
    expect(rec.audioCtx).to.be.instanceOf(FakeAudioContext)
    expect(rec.gainNode).to.exist
    expect(rec.encNode).to.exist
    expect(rec.pitchFX).to.exist
    // pitch 0 keeps the pitch-down wiring engaged
    expect(rec.pitchFX.mod1Gain.gain.value).to.equal(1)
    expect(rec.pitchFX.mod3Gain.gain.value).to.equal(0)
    // the gain node feeds the encoder directly
    expect(rec.gainNode.connectCalls.includes(rec.encNode)).to.be.true
  })

  it('initAudio wires the pitch shifter when pitch is nonzero', async () => {
    const rec = new Recorder({ pitch: 0.5 })
    await rec.initAudio()
    expect(rec.pitchFX.mod1Gain.gain.value).to.equal(0)
    expect(rec.pitchFX.mod3Gain.gain.value).to.equal(1)
    expect(rec.gainNode.connectCalls.includes(rec.pitchFX.input)).to.be.true
  })

  it('initAudio falls back to the legacy getUserMedia API', async () => {
    const { stream } = makeFakeStream()
    legacyGetUserMedia(stream)
    const rec = new Recorder()
    await rec.initAudio()
    expect(rec.stream).to.equal(stream)
  })

  it('initAudio rejects when getUserMedia is unavailable', async () => {
    unavailableGetUserMedia()
    const rec = new Recorder()
    let error = null
    await rec.initAudio().catch((err) => {
      error = err
    })
    expect(error).to.be.instanceOf(Error)
    expect(error.message).to.equal(
      'getUserMedia is not implemented in this browser',
    )
  })

  it('initWorker requires audio first', () => {
    const rec = new Recorder()
    let caught = null
    try {
      rec.initWorker()
    } catch (err) {
      caught = err
    }
    expect(caught.message).to.equal('missing audio initialization')
  })

  it('init resolves once the worker reports ready', async () => {
    const rec = new Recorder()
    await rec.init()
    expect(rec.worker).to.be.instanceOf(FakeWorker)
    expect(rec.worker.messages[0].type).to.equal('init')
    expect(rec.worker.messages[0].data.wasmURL).to.equal(rec.wasmURL)
    expect(rec.worker.messages[0].data.shimURL).to.equal(rec.shimURL)
  })

  it('init rejects when the worker cannot load the wasm module', async () => {
    fakeWorkerBehavior.initFails = true
    const rec = new Recorder()
    let error = null
    await rec.init().catch((err) => {
      error = err
    })
    expect(error.message).to.equal('wasm failed')
  })

  it('startRecording requires stream and worker', () => {
    const rec = new Recorder()
    let caught = null
    try {
      rec.startRecording()
    } catch (err) {
      caught = err
    }
    expect(caught.message).to.equal('missing audio initialization')
    rec.stream = env.stream
    caught = null
    try {
      rec.startRecording()
    } catch (err) {
      caught = err
    }
    expect(caught.message).to.equal('missing worker initialization')
  })

  it('startRecording posts the sample rate and streams audio data', async () => {
    const rec = new Recorder()
    await rec.init()
    rec.startRecording()
    const startMsg = rec.worker.messages[rec.worker.messages.length - 1]
    expect(startMsg.type).to.equal('start')
    expect(startMsg.data).to.equal(44100)
    expect(rec.encNode.connectCalls.includes(rec.audioCtx.destination)).to.be
      .true
    const samples = new Float32Array([0.5, 0.25, 0, -0.25])
    rec.encNode.onaudioprocess({ inputBuffer: { getChannelData: () => samples } })
    const dataMsg = rec.worker.messages[rec.worker.messages.length - 1]
    expect(dataMsg.type).to.equal('data')
    expect(dataMsg.data).to.equal(samples)
  })

  it('startRecording revokes the previous blob between takes', async () => {
    const rec = new Recorder()
    await rec.init()
    rec.startRecording()
    await rec.stopRecording()
    const previousBlobURL = rec.blobURL
    expect(previousBlobURL.startsWith('blob:')).to.be.true
    rec.startRecording()
    expect(rec.blobURL).to.equal(null)
    expect(rec.blob).to.equal(null)
  })

  it('stopRecording resolves with the encoded blob', async () => {
    const stops = []
    const customBlob = new Blob(['second-take'], { type: 'audio/mpeg' })
    fakeWorkerBehavior.stopBlob = customBlob
    const rec = new Recorder({}, () => stops.push('onStop'))
    await rec.init()
    rec.startRecording()
    const blob = await rec.stopRecording()
    expect(blob).to.equal(customBlob)
    expect(rec.blob).to.equal(customBlob)
    expect(rec.blobURL.startsWith('blob:')).to.be.true
    expect(stops).to.have.lengthOf(1)
    expect(rec.encNode.onaudioprocess).to.equal(null)
    expect(env.tracks[0].stopped).to.equal(1)
  })

  it('stopRecording rejects when the worker reports an error', async () => {
    fakeWorkerBehavior.replyToStop = false
    const rec = new Recorder()
    await rec.init()
    rec.startRecording()
    const quiet = silenceConsoleError()
    const stopping = rec.stopRecording()
    rec.worker.emit('error', 'boom')
    let error = null
    await stopping.catch((err) => {
      error = err
    })
    quiet.restore()
    expect(error).to.equal('boom')
  })

  it('stopTracks stops every track and tolerates streams without getTracks', () => {
    const rec = new Recorder()
    const { stream, tracks } = makeFakeStream()
    rec.stream = stream
    rec.stopTracks()
    expect(tracks[0].stopped).to.equal(1)
    expect(tracks[1].stopped).to.equal(1)
    // some browsers miss getTracks entirely
    rec.stream = {}
    rec.stopTracks()
  })

  it('close releases every resource', async () => {
    const rec = new Recorder()
    await rec.init()
    rec.startRecording()
    rec.close()
    expect(rec.worker.terminated).to.be.true
    expect(rec.audioCtx.closeCalls).to.equal(1)
    expect(rec.encNode.disconnectCalls).to.equal(1)
    expect(rec.encNode.onaudioprocess).to.equal(null)
    expect(env.tracks[0].stopped).to.equal(1)
  })
})

describe('vmsg-fork Form', () => {
  let env
  let target
  beforeEach(() => {
    resetFakeWorkerBehavior()
    env = installFakeMediaEnvironment()
    target = document.createElement('div')
    document.body.appendChild(target)
  })
  afterEach(() => {
    env.restore()
    resetFakeWorkerBehavior()
    target.remove()
  })

  it('draws the popup UI and reports ready', async () => {
    const resolvers = makeResolvers()
    const form = await openForm(target, resolvers)
    expect(target.querySelector('.vmsg-popup')).to.exist
    // the loading dots are cleared once the UI is ready to interact with
    expect(target.querySelectorAll('.vmsg-progress-dot')).to.have.lengthOf(0)
    expect(form.timer.textContent).to.equal('00:00')
    // the elapsed-time counter is explicitly non-live so its 300ms
    // updates stay silent for assistive technology
    expect(form.timer.getAttribute('role')).to.equal('timer')
    expect(form.timer.getAttribute('aria-live')).to.equal('off')
    const row = target.querySelector('.vmsg-record-row')
    expect(row.children).to.have.lengthOf(4)
    expect(form.recordBtn.innerHTML).to.equal('Record')
    expect(form.stopBtn.style.display).to.equal('none')
    expect(form.previewBtn.style.display).to.equal('none')
    expect(form.saveBtn.style.display).to.equal('none')
    expect(form.playing).to.be.false
    expect(form.hasRecording).to.be.false
    expect(resolvers.calls.resolved).to.have.lengthOf(0)
  })

  it('formats elapsed time with drawTime', async () => {
    const form = await openForm(target, makeResolvers())
    form.drawTime(0)
    expect(form.timer.textContent).to.equal('00:00')
    form.drawTime(65000)
    expect(form.timer.textContent).to.equal('01:05')
    form.drawTime(599000)
    // pad2 floors with a bitwise or rather than rounding
    expect(form.timer.textContent).to.equal('09:59')
  })

  it('starts and stops recording through the buttons', async () => {
    const form = await openForm(target, makeResolvers())
    form.recordBtn.click()
    expect(form.stopBtn.style.display).to.equal('')
    expect(form.recordBtn.style.display).to.equal('none')
    expect(
      form.recorder.worker.messages.some((msg) => msg.type === 'start'),
    ).to.be.true
    // let the 300ms elapsed-time loop tick once
    await settle(350)
    form.stopBtn.click()
    expect(form.hasRecording).to.be.true
    expect(form.stopBtn.disabled).to.be.true
    expect(form.tid).to.equal(0)
    await settle()
    expect(form.recordBtn.innerHTML).to.equal('Rerecord')
    expect(form.recordBtn.icon).to.equal('refresh')
    expect(form.previewBtn.style.display).to.equal('')
    expect(form.saveBtn.style.display).to.equal('')
    // rerecording resets the UI for another take
    form.recordBtn.click()
    expect(form.recordBtn.style.display).to.equal('none')
    form.stopBtn.click()
    await settle()
    expect(form.saveBtn.style.display).to.equal('')
  })

  it('previews and pauses the finished recording', async () => {
    const form = await openForm(target, makeResolvers())
    form.recordBtn.click()
    form.stopBtn.click()
    await settle()
    expect(form.audio.paused).to.be.true
    form.previewBtn.click()
    expect(form.playing).to.be.true
    expect(form.audio.src).to.equal(form.recorder.blobURL)
    expect(form.previewBtn.innerHTML).to.equal('Pause')
    // flip the audio element into a playing state, then pause it
    form.audio.paused = false
    form.previewBtn.click()
    expect(form.playing).to.be.false
    expect(form.audio.paused).to.be.true
    expect(form.previewBtn.innerHTML).to.equal('Preview')
  })

  it('saves the recording and resolves with the blob', async () => {
    const resolvers = makeResolvers()
    const customBlob = new Blob(['form-take'], { type: 'audio/mpeg' })
    fakeWorkerBehavior.stopBlob = customBlob
    const form = await openForm(target, resolvers)
    form.recordBtn.click()
    form.stopBtn.click()
    await settle()
    form.saveBtn.click()
    expect(resolvers.calls.resolved).to.have.lengthOf(1)
    expect(resolvers.calls.resolved[0]).to.equal(customBlob)
    expect(form.recorder.worker.terminated).to.be.true
  })

  it('rejects when saving with no recording made', async () => {
    const resolvers = makeResolvers()
    const form = await openForm(target, resolvers)
    form.saveBtn.click()
    expect(resolvers.calls.rejected).to.have.lengthOf(1)
    expect(resolvers.calls.rejected[0]).to.be.instanceOf(Error)
    expect(resolvers.calls.rejected[0].message).to.equal('No record made')
  })

  it('rejects when saving while the timer is running', async () => {
    const resolvers = makeResolvers()
    const form = await openForm(target, resolvers)
    form.recordBtn.click()
    // saving mid-take cancels the recording and rejects without a blob
    form.saveBtn.click()
    expect(resolvers.calls.rejected).to.have.lengthOf(1)
    expect(resolvers.calls.rejected[0].message).to.equal('No record made')
  })

  it('renders an error state when the microphone is unavailable', async () => {
    rejectGetUserMedia('no microphone')
    const quiet = silenceConsoleError()
    const resolvers = makeResolvers()
    const form = new Form({}, target, resolvers.resolve, resolvers.reject)
    await settle(50)
    quiet.restore()
    const error = target.querySelector('.vmsg-error')
    expect(error).to.exist
    expect(error.textContent).to.equal('Error: no microphone')
    // the error is announced to assistive technology
    expect(error.getAttribute('role')).to.equal('alert')
    expect(form.renderArea.querySelector('.vmsg-error')).to.exist
    expect(resolvers.calls.resolved).to.have.lengthOf(0)
    // the caller promise settles instead of hanging forever
    expect(resolvers.calls.rejected).to.have.lengthOf(1)
    expect(resolvers.calls.rejected[0].message).to.equal('no microphone')
  })

  it('drawInit replaces an existing popup', async () => {
    await openForm(target, makeResolvers())
    await openForm(target, makeResolvers())
    expect(target.querySelectorAll('.vmsg-popup')).to.have.lengthOf(1)
  })

  it('clearAll empties the render area and tolerates a missing one', async () => {
    const form = await openForm(target, makeResolvers())
    form.clearAll()
    expect(form.renderArea.innerHTML).to.equal('')
    form.renderArea = null
    form.clearAll()
  })
})

describe('vmsg-fork record', () => {
  let env
  beforeEach(() => {
    resetFakeWorkerBehavior()
    env = installFakeMediaEnvironment()
  })
  afterEach(() => {
    env.restore()
    resetFakeWorkerBehavior()
  })

  it('records a full take and resolves with the blob', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const ready = waitForEvent(target, 'vmsg-ready')
    const recording = record({}, target)
    await ready
    const row = target.querySelector('.vmsg-record-row')
    row.children[0].click()
    row.children[1].click()
    await settle()
    row.children[3].click()
    const blob = await recording
    expect(blob).to.be.instanceOf(Blob)
    target.remove()
  })

  it('rejects when the form is saved with no take', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    const ready = waitForEvent(target, 'vmsg-ready')
    const recording = record({}, target)
    await ready
    target.querySelector('.vmsg-save-button').click()
    let error = null
    await recording.catch((err) => {
      error = err
    })
    expect(error.message).to.equal('No record made')
    target.remove()
  })

  it('rejects and unlocks when the microphone is unavailable', async () => {
    const target = document.createElement('div')
    document.body.appendChild(target)
    rejectGetUserMedia('no microphone')
    const quiet = silenceConsoleError()
    let error = null
    await record({}, target).catch((err) => {
      error = err
    })
    quiet.restore()
    expect(error.message).to.equal('no microphone')
    expect(target.querySelector('.vmsg-error')).to.exist
    // the module level lock resets after the failure, so a later
    // record() opens again instead of throwing already-opened
    const quietRetry = silenceConsoleError()
    let retryError = null
    await record({}, target).catch((err) => {
      retryError = err
    })
    quietRetry.restore()
    expect(retryError.message).to.equal('no microphone')
    target.remove()
  })

  it('rejects a second record() while a form is open, then resets', async () => {
    const first = document.createElement('div')
    const second = document.createElement('div')
    document.body.appendChild(first)
    document.body.appendChild(second)
    const readyFirst = waitForEvent(first, 'vmsg-ready')
    const initial = record({}, first)
    const duplicate = record({}, second)
    let duplicateError = null
    await duplicate.catch((err) => {
      duplicateError = err
    })
    expect(duplicateError.message).to.equal('Record form is already opened')
    expect(second.querySelector('.vmsg-popup')).to.not.exist
    // close the first form so the module level flag resets
    await readyFirst
    first.querySelector('.vmsg-save-button').click()
    let initialError = null
    await initial.catch((err) => {
      initialError = err
    })
    expect(initialError.message).to.equal('No record made')
    // a fresh record() opens again on the second target
    const readySecond = waitForEvent(second, 'vmsg-ready')
    const next = record({}, second)
    await readySecond
    expect(second.querySelector('.vmsg-popup')).to.exist
    second.querySelector('.vmsg-save-button').click()
    const nextError = await next.catch((err) => err)
    expect(nextError.message).to.equal('No record made')
    first.remove()
    second.remove()
  })
})
