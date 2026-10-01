import { fixture, expect, html, waitUntil } from '@open-wc/testing'
import '../moment-element.js'

const tick = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms))

// the bridge fires this on document once the vendored moment script loads
// and it bubbles up to the window-level listener; dispatching it directly
// on globalThis drives _momentLoaded deterministically
const bridgeLoaded = () =>
  globalThis.dispatchEvent(new CustomEvent('es-bridge-moment-loaded'))

describe('moment-element behavior', () => {
  // deliberately first: this test is the only thing that triggers the real
  // script load in this session, and every later test depends on it having
  // finished so no other es-bridge-moment-loaded is ever in flight
  it('loads the vendored moment library and flips libraryLoaded', async () => {
    const element = await fixture(html`<moment-element></moment-element>`)
    await waitUntil(
      () => typeof globalThis.moment === 'function',
      'moment never became global',
      10000,
    )
    await waitUntil(
      () => element.libraryLoaded === true,
      'libraryLoaded never flipped',
      5000,
    )
    expect(element.libraryLoaded).to.equal(true)
  })

  it('starts with constructor defaults then learns the loaded library', async () => {
    const element = await fixture(html`<moment-element></moment-element>`)
    expect(element.datetime instanceof Date).to.be.true
    expect(element.inputFormat).to.equal('')
    expect(element.outputFormat).to.equal('')
    expect(element.from).to.equal('')
    expect(element.to).to.equal('')
    expect(typeof element.windowControllers.abort).to.equal('function')
    // the library already loaded earlier in this session, so this element
    // deterministically learns that from the bridge resolution: it flips
    // libraryLoaded, computes an output and renders it
    await waitUntil(
      () => element.libraryLoaded === true,
      'libraryLoaded never flipped',
      5000,
    )
    await waitUntil(
      () => element.output !== undefined && element.output !== '',
      'output never computed',
      5000,
    )
    await element.updateComplete
    const time = element.shadowRoot.querySelector('time')
    expect(time === null).to.be.false
    expect(time.hasAttribute('datetime')).to.be.true
  })

  it('computes an output once the library-loaded event arrives', async () => {
    // a bare local date keeps the year stable in any timezone
    const element = await fixture(html`
      <moment-element
        datetime="2020-06-15"
        output-format="YYYY"
      ></moment-element>
    `)
    // the library already loaded in this session, so let the bridge
    // resolution land first, then force the element back to the
    // not-yet-loaded state so only the bridge event can drive the pipeline
    await waitUntil(
      () => element.libraryLoaded === true,
      'libraryLoaded never flipped',
      5000,
    )
    element.libraryLoaded = false
    await element.updateComplete
    expect(element.output).to.equal(undefined)
    bridgeLoaded()
    await waitUntil(() => element.output === '2020', 'output never computed')
    expect(element.libraryLoaded).to.equal(true)
    expect(element.shadowRoot.textContent.includes('2020')).to.be.true
  })

  it('covers every _computeOutput branch', async () => {
    const element = await fixture(html`<moment-element></moment-element>`)
    bridgeLoaded()
    await waitUntil(() => element.libraryLoaded === true)
    // inputFormat parsing plus outputFormat
    expect(
      element._computeOutput('01-02-2020', 'DD-MM-YYYY', 'YYYY-MM-DD', '', '', true),
    ).to.equal('2020-02-01')
    // no inputFormat: the datetime is parsed on its own; noon UTC keeps
    // the year stable in any timezone
    expect(
      element._computeOutput('2020-06-15T12:00:00Z', '', 'YYYY', '', '', true),
    ).to.equal('2020')
    // from = now
    const fromNow = element._computeOutput(
      '2020-01-01T00:00:00Z',
      '',
      '',
      'now',
      '',
      true,
    )
    expect(String(fromNow).endsWith('ago')).to.be.true
    // from = a specific date: the datetime sits before it, so the anchor
    // reads as time ago (a.from(b) spans from b to a)
    const fromDate = element._computeOutput(
      '2019-06-01T12:00:00Z',
      '',
      '',
      '2020-06-01T12:00:00Z',
      '',
      true,
    )
    expect(String(fromDate).includes('ago')).to.be.true
    // to = now
    const toNow = element._computeOutput(
      '2020-01-01T00:00:00Z',
      '',
      '',
      '',
      'now',
      true,
    )
    expect(String(toNow).startsWith('in')).to.be.true
    // to = a specific date
    const toDate = element._computeOutput(
      '2020-01-01T00:00:00Z',
      '',
      '',
      '',
      '2030-01-01T00:00:00Z',
      true,
    )
    expect(String(toDate).startsWith('in')).to.be.true
    // outputFormat wins over from and to
    expect(
      element._computeOutput('2020-06-15T12:00:00Z', '', 'YYYY', 'now', 'now', true),
    ).to.equal('2020')
    // with neither formats nor anchors the raw moment object is returned
    const raw = element._computeOutput(
      '2020-06-15T12:00:00Z',
      '',
      '',
      '',
      '',
      true,
    )
    expect(typeof raw.format === 'function').to.be.true
    expect(raw.format('YYYY')).to.equal('2020')
    // nothing is computed before the library is loaded
    expect(
      element._computeOutput('2020-01-01', '', 'YYYY', '', '', false),
    ).to.equal(undefined)
  })

  it('recomputes on datetime, inputFormat, outputFormat, from and to changes', async () => {
    const element = await fixture(html`<moment-element></moment-element>`)
    bridgeLoaded()
    await waitUntil(() => element.libraryLoaded === true)
    element.datetime = '25-12-2020'
    element.inputFormat = 'DD-MM-YYYY'
    element.outputFormat = 'MMMM'
    await waitUntil(() => element.output === 'December', 'never formatted')
    element.outputFormat = ''
    element.from = 'now'
    await waitUntil(
      () => String(element.output).endsWith('ago'),
      'never anchored from now',
    )
    element.from = ''
    element.to = 'now'
    await waitUntil(
      () => String(element.output).startsWith('in'),
      'never anchored to now',
    )
    expect(element.shadowRoot.textContent.includes('in')).to.be.true
  })

  it('notifies output changes as a custom event', async () => {
    const element = await fixture(html`<moment-element></moment-element>`)
    bridgeLoaded()
    await waitUntil(() => element.libraryLoaded === true)
    element.datetime = '2020-06-15'
    element.outputFormat = 'YYYY'
    await waitUntil(() => element.output === '2020', 'first output missing')
    const events = []
    element.addEventListener('output-changed', (event) => {
      events.push(event.detail ? event.detail.value : undefined)
    })
    element.datetime = '2021-06-30'
    await waitUntil(() => element.output === '2021', 'second output missing')
    await waitUntil(
      () => events.includes('2021'),
      'output-changed never carried the value',
    )
    expect(events.includes('2021')).to.be.true
  })

  it('stops reacting to the bridge event once disconnected', async () => {
    const element = await fixture(html`<moment-element></moment-element>`)
    // let the bridge resolution land first so it cannot race this test
    await waitUntil(
      () => element.libraryLoaded === true,
      'libraryLoaded never flipped',
      5000,
    )
    element.remove()
    // simulate the not-yet-loaded state: disconnecting aborted the bridge
    // event listener, so the event can no longer flip libraryLoaded
    element.libraryLoaded = false
    bridgeLoaded()
    await tick(50)
    expect(element.libraryLoaded).to.equal(false)
  })

  // FIXED: moment-element.js — the constructor now initializes libraryLoaded
  // to false and chains the bridge load resolution, so elements created after
  // the first also learn the library already loaded (the bridge resolves with
  // true instead of re-dispatching the event) and render their output.
  it('a later element learns the library already loaded and renders', async () => {
    // noon UTC keeps the year stable in any timezone
    const element = await fixture(html`
      <moment-element
        datetime="2020-01-01T12:00:00Z"
        output-format="YYYY"
      ></moment-element>
    `)
    // the library really is loaded in this session...
    expect(typeof globalThis.moment === 'function').to.be.true
    // ...and this element hears about it through the bridge resolution,
    // computes its output and renders it in machine-readable markup
    await waitUntil(
      () => element.libraryLoaded === true,
      'libraryLoaded never flipped',
      5000,
    )
    await waitUntil(() => element.output === '2020', 'output never computed', 5000)
    await element.updateComplete
    expect(element.shadowRoot.textContent.includes('2020')).to.be.true
    const time = element.shadowRoot.querySelector('time')
    expect(time === null).to.be.false
    expect(time.getAttribute('datetime')).to.equal('2020-01-01T12:00:00.000Z')
  })
})
