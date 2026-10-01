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

  it('starts with constructor defaults and renders nothing yet', async () => {
    const element = await fixture(html`<moment-element></moment-element>`)
    expect(element.datetime instanceof Date).to.be.true
    expect(element.inputFormat).to.equal('')
    expect(element.outputFormat).to.equal('')
    expect(element.from).to.equal('')
    expect(element.to).to.equal('')
    // libraryLoaded is not initialized in the constructor: it stays undefined
    // until the bridge event arrives
    expect(element.libraryLoaded).to.equal(undefined)
    expect(element.output).to.equal(undefined)
    expect(element.shadowRoot.textContent.trim()).to.equal('')
    expect(typeof element.windowControllers.abort).to.equal('function')
  })

  it('computes an output once the library-loaded event arrives', async () => {
    // a bare local date keeps the year stable in any timezone
    const element = await fixture(html`
      <moment-element
        datetime="2020-06-15"
        output-format="YYYY"
      ></moment-element>
    `)
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
    element.remove()
    bridgeLoaded()
    await tick(50)
    expect(element.libraryLoaded).to.equal(undefined)
    expect(element.output).to.equal(undefined)
  })

  // BUG: moment-element.js:49-57 — the constructor asks the es-global-bridge
  // singleton to load moment, but once that singleton has already imported it
  // (any element created after the first), ESGlobalBridge.load resolves
  // WITHOUT re-dispatching es-bridge-moment-loaded. Late elements therefore
  // never set libraryLoaded (it is not even initialized to false), never
  // compute an output and render nothing.
  it('documents: a later element never learns the library already loaded', async () => {
    const element = await fixture(html`
      <moment-element
        datetime="2020-01-01T00:00:00Z"
        output-format="YYYY"
      ></moment-element>
    `)
    await tick(400)
    // the library really is loaded in this session...
    expect(typeof globalThis.moment === 'function').to.be.true
    // ...but this element never hears about it and renders nothing
    expect(element.libraryLoaded).to.equal(undefined)
    expect(element.output).to.equal(undefined)
    expect(element.shadowRoot.textContent.trim()).to.equal('')
  })
})
