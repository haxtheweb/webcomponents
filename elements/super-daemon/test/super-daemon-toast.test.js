import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import '../lib/super-daemon-toast.js'

// Behavioral coverage for super-daemon-toast: default render modes, show and
// hide state machine (eventCallback, awaitingMerlinInput, alwaysvisible), the
// global show/hide events, and future-terminal-text text piping.
describe('super-daemon-toast behavior', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`<super-daemon-toast></super-daemon-toast>`)
    element.alwaysvisible = false
    element.opened = false
    element.awaitingMerlinInput = false
    element.eventCallback = null
  })

  it('has sensible defaults', () => {
    expect(element.text).to.equal('Saved')
    expect(element.duration).to.equal(3000)
    expect(element.hat).to.equal('coffee')
    expect(element.accentColor).to.equal('grey')
    expect(element.fire).to.equal(false)
    expect(element.merlin).to.equal(false)
    expect(element.walking).to.equal(false)
    expect(element.future).to.equal(false)
    expect(element.classStyle).to.equal('')
  })

  it('renders the merlin icon by default', () => {
    expect(element.shadowRoot.querySelector('.merlin')).to.exist
    expect(element.shadowRoot.querySelector('.awaiting-input')).to.be.null
  })

  it('renders the awaiting input icon when waiting for merlin', async () => {
    element.awaitingMerlinInput = true
    await element.updateComplete
    expect(element.shadowRoot.querySelector('.awaiting-input')).to.exist
    expect(element.shadowRoot.querySelector('.merlin')).to.be.null
  })

  it('renders plain text in the bubble', async () => {
    element.text = 'hello'
    await element.updateComplete
    expect(element.shadowRoot.querySelector('.mid').textContent).to.contain(
      'hello',
    )
  })

  it('renders future terminal text when future is set', async () => {
    element.future = true
    element.text = 'future text'
    await element.updateComplete
    const ftt = element.shadowRoot.querySelector('future-terminal-text')
    expect(ftt).to.exist
    // the glitch effect swaps a random character each run, so assert the
    // text was piped through by length instead of exact content
    expect(ftt.innerText.length).to.equal(element.text.length)
  })

  it('show opens the toast with fade animations', () => {
    element.duration = 4000
    element.show()
    expect(element.opened).to.equal(true)
    expect(element.style.animation).to.contain('fadein')
    expect(element.style.animation).to.contain('fadeout')
    expect(element.style.animation).to.contain('4s')
  })

  it('show while already open does not re-open', async () => {
    element.duration = 4000
    element.opened = true
    await element.updateComplete
    element.show()
    expect(element.opened).to.equal(true)
  })

  it('hide dispatches the eventCallback and closes', () => {
    let got = false
    element.eventCallback = 'toast-done'
    element.addEventListener('toast-done', () => (got = true))
    element.opened = true
    element.hide()
    expect(got).to.equal(true)
    expect(element.opened).to.equal(false)
  })

  it('hide keeps the toast open while awaiting merlin input', () => {
    element.awaitingMerlinInput = true
    element.opened = true
    element.hide()
    expect(element.opened).to.equal(true)
    expect(element.style.animation).to.contain('fadein')
  })

  it('hide keeps an alwaysvisible toast open', () => {
    element.alwaysvisible = true
    element.opened = true
    element.hide()
    expect(element.opened).to.equal(true)
    expect(element.style.animation).to.contain('fadein')
  })

  it('hide without eventCallback dispatches nothing', () => {
    let fired = false
    element.addEventListener('nothing-here', () => (fired = true))
    element.opened = true
    element.hide()
    expect(fired).to.equal(false)
    expect(element.opened).to.equal(false)
  })

  it('showSimpleToast applies full event detail state', async () => {
    const slot = document.createElement('span')
    slot.textContent = 'slotted'
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-toast-show', {
        detail: {
          text: 'New message',
          duration: 1000,
          fire: true,
          hat: 'party',
          merlin: true,
          walking: true,
          future: false,
          classStyle: 'fit-bottom',
          eventCallback: 'cb',
          accentColor: 'blue',
          alwaysvisible: false,
          slot: slot,
          awaitingMerlinInput: true,
        },
      }),
    )
    await aTimeout(20)
    expect(element.text).to.equal('New message')
    expect(element.duration).to.equal(1000)
    expect(element.fire).to.equal(true)
    expect(element.hat).to.equal('party')
    expect(element.merlin).to.equal(true)
    expect(element.walking).to.equal(true)
    expect(element.classStyle).to.equal('fit-bottom')
    expect(element.eventCallback).to.equal('cb')
    expect(element.accentColor).to.equal('blue')
    expect(element.opened).to.equal(true)
    // slot content is appended into the toast light DOM
    const slotted = element.querySelector('span')
    expect(slotted === null).to.equal(false)
    expect(slotted.textContent).to.equal('slotted')
    // awaitingMerlinInput flips on after duration/2
    await aTimeout(600)
    expect(element.awaitingMerlinInput).to.equal(true)
  })

  it('showSimpleToast applies defaults for a sparse detail', async () => {
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-toast-show', { detail: {} }),
    )
    await aTimeout(20)
    expect(element.text).to.equal('Saved')
    expect(element.duration).to.equal(4000)
    expect(element.fire).to.equal(false)
    expect(element.hat).to.equal('coffee')
    expect(element.merlin).to.equal(false)
    expect(element.walking).to.equal(false)
    expect(element.future).to.equal(false)
    expect(element.classStyle).to.equal('')
    expect(element.eventCallback).to.equal(null)
    expect(element.accentColor).to.equal('grey')
    expect(element.opened).to.equal(true)
  })

  it('hideSimpleToast closes the toast via the global hide event', async () => {
    element.opened = true
    globalThis.dispatchEvent(new CustomEvent('super-daemon-toast-hide'))
    await aTimeout(20)
    expect(element.opened).to.equal(false)
  })

  it('hideSimpleToast respects alwaysvisible', async () => {
    element.opened = true
    element.alwaysvisible = true
    globalThis.dispatchEvent(new CustomEvent('super-daemon-toast-hide'))
    await aTimeout(20)
    expect(element.opened).to.equal(true)
  })

  it('removes global listeners when disconnected', async () => {
    const el = await fixture(html`<super-daemon-toast></super-daemon-toast>`)
    el.opened = true
    el.remove()
    globalThis.dispatchEvent(new CustomEvent('super-daemon-toast-hide'))
    await aTimeout(20)
    // listener aborted; state untouched by the event
    expect(el.opened).to.equal(true)
  })
})
