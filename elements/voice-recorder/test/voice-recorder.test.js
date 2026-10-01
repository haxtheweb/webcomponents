import { fixture, expect, html } from "@open-wc/testing";

import "../voice-recorder.js";
import {
  installFakeMediaEnvironment,
  rejectGetUserMedia,
  resetFakeWorkerBehavior,
  settle,
  silenceConsoleError,
  waitForEvent,
} from "./vmsg-fakes.js";

describe("voice-recorder test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <voice-recorder title="test-title"></voice-recorder>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("voice-recorder passes accessibility test", async () => {
    const el = await fixture(html` <voice-recorder></voice-recorder> `);
    await expect(el).to.be.accessible();
  });
  it("voice-recorder passes accessibility negation", async () => {
    const el = await fixture(
      html`<voice-recorder aria-labelledby="voice-recorder"></voice-recorder>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("voice-recorder can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<voice-recorder .foo=${'bar'}></voice-recorder>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<voice-recorder ></voice-recorder>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<voice-recorder></voice-recorder>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it("hides mobile menu", async () => {
      const el await fixture(html`<voice-recorder></voice-recorder>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

describe('voice-recorder defaults and rendering', () => {
  it('has sensible defaults', async () => {
    const el = await fixture(html`<voice-recorder></voice-recorder>`)
    expect(el.recording).to.be.false
    expect(el.label).to.equal('Activate Recorder')
    expect(el.constructor.tag).to.equal('voice-recorder')
  })
  it('renders the activate button with a custom label', async () => {
    const el = await fixture(
      html`<voice-recorder label="Say something"></voice-recorder>`,
    )
    await el.updateComplete
    const button = el.shadowRoot.querySelector('simple-icon-button-lite')
    expect(button).to.exist
    expect(button.getAttribute('icon')).to.equal('av:mic')
    expect(button.textContent.trim()).to.equal('Say something')
  })
})

describe('voice-recorder recording state machine', () => {
  let env
  beforeEach(() => {
    resetFakeWorkerBehavior()
    env = installFakeMediaEnvironment()
  })
  afterEach(() => {
    env.restore()
    resetFakeWorkerBehavior()
  })

  it('records, stops, saves, and emits the recording blob', async () => {
    const el = await fixture(html`<voice-recorder></voice-recorder>`)
    const blobs = []
    el.addEventListener('voice-recorder-recording-blob', (event) => {
      blobs.push(event.detail.value)
    })
    const ready = waitForEvent(el, 'vmsg-ready')
    el.recording = true
    await el.updateComplete
    // the activate button is hidden while a recording session is open
    expect(el.shadowRoot.querySelector('simple-icon-button-lite')).to.not.exist
    await ready
    expect(el.querySelector('.vmsg-popup')).to.exist
    const row = el.querySelector('.vmsg-record-row')
    const recordBtn = row.children[0]
    const stopBtn = row.children[1]
    const saveBtn = row.children[3]
    // start a take
    recordBtn.click()
    expect(stopBtn.style.display).to.equal('')
    expect(recordBtn.style.display).to.equal('none')
    // stop the take; the stubbed worker replies with an mp3 blob
    stopBtn.click()
    await settle()
    expect(saveBtn.style.display).to.equal('')
    expect(recordBtn.innerHTML).to.equal('Rerecord')
    // saving resolves record() and the wrapper emits the blob
    const emitted = waitForEvent(el, 'voice-recorder-recording-blob')
    saveBtn.click()
    await emitted
    expect(blobs).to.have.lengthOf(1)
    expect(blobs[0]).to.be.instanceOf(Blob)
    expect(el.recording).to.be.false
    expect(el.innerHTML.trim()).to.equal('')
    await el.updateComplete
    expect(el.shadowRoot.querySelector('simple-icon-button-lite')).to.exist
  })

  it('toggleRecording starts the recorder from the activate button', async () => {
    const el = await fixture(html`<voice-recorder></voice-recorder>`)
    const ready = waitForEvent(el, 'vmsg-ready')
    el.shadowRoot.querySelector('simple-icon-button-lite').click()
    expect(el.recording).to.be.true
    await ready
    expect(el.querySelector('.vmsg-popup')).to.exist
    // cancel without a take: record() rejects because no blob was made
    el.querySelector('.vmsg-save-button').click()
    await settle()
    // the rejection handler resets the recording state and clears the
    // cancelled form so the activate button comes back without a reload
    expect(el.recording).to.be.false
    await el.updateComplete
    expect(el.querySelector('.vmsg-popup')).to.not.exist
    expect(el.shadowRoot.querySelector('simple-icon-button-lite')).to.exist
  })

  it('recovers when the microphone is denied', async () => {
    const quiet = silenceConsoleError()
    rejectGetUserMedia('no microphone')
    const el = await fixture(html`<voice-recorder></voice-recorder>`)
    el.recording = true
    await el.updateComplete
    await settle(50)
    quiet.restore()
    // the fork draws an alerting error and now settles the record()
    // promise, so the wrapper resets instead of leaving recording stuck
    const error = el.querySelector('.vmsg-error')
    expect(error).to.exist
    expect(error.getAttribute('role')).to.equal('alert')
    expect(error.textContent).to.equal('Error: no microphone')
    expect(el.recording).to.be.false
    await el.updateComplete
    expect(el.shadowRoot.querySelector('simple-icon-button-lite')).to.exist
    // the error message stays visible so the user knows why it failed
    expect(el.querySelector('.vmsg-error')).to.exist
  })
})
