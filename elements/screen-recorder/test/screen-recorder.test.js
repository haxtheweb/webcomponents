import { html, fixture, expect } from '@open-wc/testing';
import "../screen-recorder.js";
import {
  FakeMediaRecorder,
  installFakeScreenRecordingEnvironment,
  silenceConsole,
  settle,
} from './screen-recorder-fakes.js';

describe("ScreenRecorder test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <screen-recorder
        title="title"
      ></screen-recorder>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('screen-recorder defaults and toggles', () => {
  it('has sensible defaults', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    expect(el.recording).to.be.false
    expect(el.videoSrc).to.equal('')
    expect(el.downloadUrl).to.equal('')
    expect(el.completeBlob).to.equal(null)
    expect(el.recorder).to.equal(null)
    expect(el.chunks).to.deep.equal([])
    expect(el.includeSystemAudio).to.be.true
    expect(el.includeMicrophoneAudio).to.be.true
    expect(el.constructor.tag).to.equal('screen-recorder')
  })

  it('toggles audio options from the checkboxes', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    await el.updateComplete
    const checkboxes = el.shadowRoot.querySelectorAll(
      '.checkbox-container input',
    )
    expect(checkboxes).to.have.lengthOf(2)
    checkboxes[0].checked = false
    checkboxes[0].dispatchEvent(new Event('change'))
    expect(el.includeSystemAudio).to.be.false
    checkboxes[1].checked = false
    checkboxes[1].dispatchEvent(new Event('change'))
    expect(el.includeMicrophoneAudio).to.be.false
    // toggling back on works too
    checkboxes[0].checked = true
    checkboxes[0].dispatchEvent(new Event('change'))
    checkboxes[1].checked = true
    checkboxes[1].dispatchEvent(new Event('change'))
    expect(el.includeSystemAudio).to.be.true
    expect(el.includeMicrophoneAudio).to.be.true
  })

  it('exposes haxProperties from the lib folder', () => {
    const url = customElements.get('screen-recorder').haxProperties
    expect(url).to.contain('lib/screen-recorder.haxProperties.json')
  })
})

describe('screen-recorder capture flow', () => {
  let env
  beforeEach(() => {
    env = installFakeScreenRecordingEnvironment()
  })
  afterEach(() => {
    env.restore()
  })

  it('records with mixed system and microphone audio', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    await el.updateComplete
    const buttons = el.shadowRoot.querySelectorAll(
      '.controls > simple-icon-button-lite',
    )
    const startBtn = buttons[0]
    const stopBtn = buttons[1]
    // start a take
    startBtn.click()
    await el.updateComplete
    await settle()
    expect(env.behavior.getDisplayMediaCalls).to.have.lengthOf(1)
    expect(env.behavior.getDisplayMediaCalls[0]).to.deep.equal({
      video: { mediaSource: 'screen' },
      audio: true,
    })
    expect(env.behavior.getUserMediaCalls).to.have.lengthOf(1)
    expect(env.behavior.getUserMediaCalls[0]).to.deep.equal({ audio: true })
    expect(el.stream).to.equal(env.displayStream)
    expect(el.audioStream).to.equal(env.micStream)
    expect(el.recorder).to.be.instanceOf(FakeMediaRecorder)
    // final stream mixes display video with the combined audio tracks
    expect(el.recorder.stream.getVideoTracks()).to.have.lengthOf(1)
    expect(el.recorder.stream.getAudioTracks()).to.have.lengthOf(1)
    expect(el.recorder.state).to.equal('recording')
    expect(el.recording).to.be.true
    // the UI reflects the active recording
    expect(startBtn.className).to.contain('hidden')
    expect(stopBtn.className).to.not.contain('hidden')
    expect(
      el.shadowRoot.querySelector('.audio-options').className,
    ).to.contain('hidden')
    // simulate a data chunk arriving from the recorder
    el.recorder.ondataavailable({
      data: new Blob(['chunk-one'], { type: 'video/webm' }),
    })
    expect(el.chunks).to.have.lengthOf(1)
    // stop the take and collect the blob
    const blobs = []
    el.addEventListener('screen-recorder-blob', (event) => {
      blobs.push(event.detail.blob)
    })
    stopBtn.click()
    await settle()
    expect(el.recorder.stopCalls).to.equal(1)
    expect(el.recording).to.be.false
    expect(el.completeBlob).to.be.instanceOf(Blob)
    expect(el.videoSrc.startsWith('blob:')).to.be.true
    expect(el.downloadUrl).to.equal(el.videoSrc)
    expect(blobs).to.have.lengthOf(1)
    expect(blobs[0]).to.equal(el.completeBlob)
    expect(el.chunks).to.deep.equal([])
    // capture tracks are released after the take
    expect(env.videoTrack.stopped).to.equal(1)
    expect(env.systemAudioTrack.stopped).to.equal(1)
    expect(env.micTrack.stopped).to.equal(1)
    expect(el.audioStream).to.equal(null)
    // the playback UI appears once the take is complete
    expect(
      el.shadowRoot.querySelector('.video-container video').className,
    ).to.not.contain('hidden')
    const downloadLink = el.shadowRoot.querySelector('.download-link')
    expect(downloadLink.className).to.not.contain('hidden')
    expect(downloadLink.getAttribute('download').startsWith('screen-recording-'))
      .to.be.true
    expect(startBtn.className).to.not.contain('hidden')
    expect(stopBtn.className).to.contain('hidden')
  })

  it('records without the microphone when it is not requested', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    el.includeMicrophoneAudio = false
    await el.updateComplete
    el.shadowRoot
      .querySelectorAll('.controls > simple-icon-button-lite')[0]
      .click()
    await el.updateComplete
    await settle()
    expect(env.behavior.getUserMediaCalls).to.have.lengthOf(0)
    // the display stream feeds the recorder directly
    expect(el.recorder.stream).to.equal(env.displayStream)
    expect(el.recorder.state).to.equal('recording')
    el.recorder.ondataavailable({
      data: new Blob(['no-mic-chunk'], { type: 'video/webm' }),
    })
    el.shadowRoot
      .querySelectorAll('.controls > simple-icon-button-lite')[1]
      .click()
    await settle()
    expect(el.recording).to.be.false
  })

  it('requests the display without audio when system audio is off', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    el.includeSystemAudio = false
    await el.updateComplete
    el.shadowRoot
      .querySelectorAll('.controls > simple-icon-button-lite')[0]
      .click()
    await el.updateComplete
    await settle()
    expect(env.behavior.getDisplayMediaCalls[0].audio).to.be.false
    expect(el.recorder.state).to.equal('recording')
    el.recorder.ondataavailable({
      data: new Blob(['no-audio-chunk'], { type: 'video/webm' }),
    })
    el.shadowRoot
      .querySelectorAll('.controls > simple-icon-button-lite')[1]
      .click()
    await settle()
  })

  it('continues with display audio when the microphone fails', async () => {
    env.behavior.micStreamError = 'microphone denied'
    const quiet = silenceConsole()
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    await el.updateComplete
    el.shadowRoot
      .querySelectorAll('.controls > simple-icon-button-lite')[0]
      .click()
    await el.updateComplete
    await settle()
    quiet.restore()
    expect(quiet.warns).to.have.lengthOf(1)
    expect(env.behavior.getUserMediaCalls).to.have.lengthOf(1)
    // falls back to recording the display stream on its own
    expect(el.recorder.stream).to.equal(env.displayStream)
    expect(el.recorder.state).to.equal('recording')
    expect(el.recording).to.be.true
    el.recorder.ondataavailable({
      data: new Blob(['mic-failure-chunk'], { type: 'video/webm' }),
    })
    el.shadowRoot
      .querySelectorAll('.controls > simple-icon-button-lite')[1]
      .click()
    await settle()
  })

  it('alerts and stays idle when the display capture is refused', async () => {
    env.behavior.displayStreamError = 'user cancelled the picker'
    const quiet = silenceConsole()
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    await el.updateComplete
    el.shadowRoot
      .querySelectorAll('.controls > simple-icon-button-lite')[0]
      .click()
    await settle()
    quiet.restore()
    expect(quiet.errors).to.have.lengthOf(1)
    expect(env.behavior.alertCalls).to.have.lengthOf(1)
    expect(env.behavior.alertCalls[0]).to.equal(
      'Error starting screen recording: user cancelled the picker',
    )
    expect(el.recording).to.be.false
    expect(el.recorder).to.equal(null)
  })

  it('guards stop when the recorder is not active', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    const stops = []
    el.recorder = { state: 'inactive', stop: () => stops.push('stopped') }
    el.stream = null
    el.audioStream = null
    el._stopRecording()
    expect(stops).to.have.lengthOf(0)
    expect(el.recording).to.be.false
  })

  it('crashes the stop handler when no data chunks arrived', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    el.chunks = []
    let caught = null
    try {
      el._onRecordingStop()
    } catch (err) {
      caught = err
    }
    // BUG: screen-recorder.js:333 reads this.chunks[0].type without a guard,
    // so a recorder that stops before any dataavailable event throws a
    // TypeError instead of producing an empty recording.
    expect(caught).to.be.instanceOf(TypeError)
  })

  it('cleans up streams and blob URLs on disconnect', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    el.videoSrc = 'blob:not-a-real-url'
    el.stream = env.displayStream
    el.audioStream = env.micStream
    el.disconnectedCallback()
    expect(env.behavior.revokeObjectURLCalls).to.deep.equal([
      'blob:not-a-real-url',
    ])
    expect(env.videoTrack.stopped).to.equal(1)
    expect(env.micTrack.stopped).to.equal(1)
  })

  it('skips revocation when there is no blob URL on disconnect', async () => {
    const el = await fixture(html`<screen-recorder></screen-recorder>`)
    el.videoSrc = ''
    el.stream = null
    el.audioStream = null
    el.disconnectedCallback()
    expect(env.behavior.revokeObjectURLCalls).to.have.lengthOf(0)
  })
})
