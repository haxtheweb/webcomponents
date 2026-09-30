import { fixture, expect, html } from '@open-wc/testing'

import { LrnVocab } from '../lrn-vocab.js'

describe('lrn-vocab test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html` <lrn-vocab term="breaching">
          <video-player
            source="https://youtu.be/4EojXTOtNTA"
          ></video-player> </lrn-vocab
        >like whales when attacking prey from underneath.`,
    )
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('lrn-vocab behavior', () => {
  it('registers the lrn-vocab tag', async () => {
    expect(LrnVocab.tag).to.equal('lrn-vocab')
    expect(globalThis.customElements.get('lrn-vocab')).to.exist
  })

  it('renders the term as a button with oer:name microdata', async () => {
    const el = await fixture(
      html` <lrn-vocab term="breaching">whale business</lrn-vocab> `,
    )
    const button = el.shadowRoot.querySelector('button')
    expect(button).to.exist
    expect(button.getAttribute('property')).to.equal('oer:name')
    expect(button.textContent).to.equal('breaching')
  })

  it('renders description microdata as a meta oer:description', async () => {
    const el = await fixture(
      html` <lrn-vocab term="breaching" description="whale business"></lrn-vocab> `,
    )
    const meta = el.shadowRoot.querySelector('meta[property="oer:description"]')
    expect(meta).to.exist
    expect(meta.getAttribute('content')).to.equal('whale business')
  })

  it('reflects the term property to its attribute', async () => {
    const el = await fixture(
      html` <lrn-vocab term="breaching">whale business</lrn-vocab> `,
    )
    expect(el.getAttribute('term')).to.equal('breaching')
    el.term = 'spyhopping'
    await el.updateComplete
    expect(el.getAttribute('term')).to.equal('spyhopping')
    expect(el.shadowRoot.querySelector('button').textContent).to.equal(
      'spyhopping',
    )
  })

  it('declares itself an oer:LearningComponent and defaults description from text', async () => {
    const el = await fixture(
      html` <lrn-vocab term="breaching">like whales when attacking prey</lrn-vocab> `,
    )
    expect(el.getAttribute('typeof')).to.equal('oer:LearningComponent')
    expect(el.description).to.equal('like whales when attacking prey')
    const meta = el.shadowRoot.querySelector('meta[property="oer:description"]')
    expect(meta.getAttribute('content')).to.equal(
      'like whales when attacking prey',
    )
  })

  it('opens the singleton modal with cloned children on click', async () => {
    const el = await fixture(html`
      <lrn-vocab term="breaching">
        <p>Attacking prey from underneath</p>
      </lrn-vocab>
    `)
    await new Promise((resolve) => setTimeout(resolve, 50))
    let captured = null
    el.addEventListener('simple-modal-show', (e) => {
      captured = e
    })
    el.click()
    expect(captured).to.exist
    expect(captured.detail.title).to.equal('breaching')
    expect(captured.detail.invokedBy === el).to.be.true
    const content = captured.detail.elements.content
    expect(content.querySelector('p').textContent).to.equal(
      'Attacking prey from underneath',
    )
    expect(captured.detail.styles['--simple-modal-width']).to.equal('80vw')
    expect(captured.detail.styles['--simple-modal-z-index']).to.equal(
      '100000000',
    )
  })

  it('blocks the modal while hax editing is active', async () => {
    const el = await fixture(html`
      <lrn-vocab term="breaching">
        <p>Attacking prey from underneath</p>
      </lrn-vocab>
    `)
    await new Promise((resolve) => setTimeout(resolve, 50))
    let modalEvents = 0
    el.addEventListener('simple-modal-show', () => {
      modalEvents++
    })
    el.haxeditModeChanged(true)
    el.click()
    expect(modalEvents).to.equal(0)
    el.haxeditModeChanged(false)
    el.click()
    expect(modalEvents).to.equal(1)
  })

  it('implements hax hooks for edit mode', async () => {
    const el = await fixture(html` <lrn-vocab term="hooks"></lrn-vocab> `)
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    el.haxactiveElementChanged(el, true)
    expect(el._haxstate).to.be.true
    el.haxactiveElementChanged(el, false)
    // a falsey val does not clear the flag
    expect(el._haxstate).to.be.true
    el.haxeditModeChanged(false)
    expect(el._haxstate).to.be.false
  })

  it('reports haxProperties for the editor', async () => {
    const props = LrnVocab.haxProperties
    expect(props.canScale).to.be.false
    expect(props.canEditSource).to.be.true
    expect(props.gizmo.title).to.equal('Vocab')
    expect(props.settings.inline[0].property).to.equal('term')
    expect(props.settings.configure[0].property).to.equal('term')
  })

  it('requests the simple-modal singleton on first update', async () => {
    const el = await fixture(html` <lrn-vocab term="modal"></lrn-vocab> `)
    expect(globalThis.SimpleModal).to.exist
    const singleton = globalThis.SimpleModal.requestAvailability()
    expect(singleton).to.exist
    expect(singleton.tagName.toLowerCase()).to.equal('simple-modal')
    expect(el.getAttribute('typeof')).to.equal('oer:LearningComponent')
  })
})
