import { fixture, expect, html } from '@open-wc/testing'
import { LitElement } from 'lit'
import { SimpleModalHandler } from '../lib/simple-modal-handler.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

class TestHandlerEl extends SimpleModalHandler(LitElement) {
  static get tag() {
    return 'test-handler-el'
  }
  static get properties() {
    return {
      modalTitle: { type: String },
      modalContent: { type: Object },
    }
  }
  constructor() {
    super()
    this.modalTitle = ''
    this.modalContent = null
  }
  render() {
    return html`<slot></slot>`
  }
}
globalThis.customElements.define('test-handler-el', TestHandlerEl)

describe('SimpleModalHandler mixin', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<test-handler-el></test-handler-el>`)
  })

  afterEach(async () => {
    if (globalThis.SimpleModal && globalThis.SimpleModal.instance) {
      globalThis.SimpleModal.instance.close()
      await aTimeout(10)
    }
  })

  it('sets tabindex=0 on connectedCallback', () => {
    expect(element.getAttribute('tabindex')).to.equal('0')
  })

  it('respects an author-provided tabindex instead of clobbering it', async () => {
    const el = await fixture(
      html`<test-handler-el tabindex="-1"></test-handler-el>`,
    )
    expect(el.getAttribute('tabindex')).to.equal('-1')
  })

  it('registers SimpleModal singleton after constructor setTimeout', async () => {
    await aTimeout(10)
    expect(globalThis.SimpleModal).to.exist
    expect(globalThis.SimpleModal.instance).to.exist
  })

  it('dispatches simple-modal-show on click with title, content, styles, invokedBy', async () => {
    await aTimeout(10)
    element.modalTitle = 'Test Modal'
    const content = globalThis.document.createElement('div')
    content.textContent = 'hello'
    element.modalContent = content

    let captured = null
    element.addEventListener('simple-modal-show', (e) => {
      captured = e
    })
    element.click()

    expect(captured).to.exist
    expect(captured.detail.title).to.equal('Test Modal')
    expect(captured.detail.elements.content).to.equal(content)
    expect(captured.detail.invokedBy).to.equal(element)
    expect(captured.detail.clone).to.equal(false)
    expect(captured.detail.styles['--simple-modal-min-width']).to.equal('50vw')
    expect(captured.detail.styles['--simple-modal-min-height']).to.equal('50vh')
    expect(captured.bubbles).to.be.true
    expect(captured.composed).to.be.true
    expect(captured.cancelable).to.be.true
  })

  it('uses empty-string title and null content defaults when unset', async () => {
    await aTimeout(10)
    let captured = null
    element.addEventListener('simple-modal-show', (e) => {
      captured = e
    })
    element.click()
    expect(captured).to.exist
    expect(captured.detail.title).to.equal('')
    expect(captured.detail.elements.content).to.equal(null)
  })

  it('_keydown fires click on Enter', async () => {
    await aTimeout(10)
    let clickFired = false
    element.addEventListener('click', () => {
      clickFired = true
    })
    element._keydown({ key: 'Enter' })
    expect(clickFired).to.be.true
  })

  it('_keydown does nothing on non-Enter keys', async () => {
    await aTimeout(10)
    let clickFired = false
    element.addEventListener('click', () => {
      clickFired = true
    })
    element._keydown({ key: 'Escape' })
    element._keydown({ key: ' ' })
    element._keydown({ key: 'Tab' })
    expect(clickFired).to.be.false
  })

  it('does not throw when addEventListener is unavailable (plain object mixin)', async () => {
    // SimpleModalHandler can be applied to non-HTMLElement bases;
    // constructor guards with if (this.addEventListener)
    const Plain = SimpleModalHandler(class {
      constructor() {
        this.modalTitle = 'x'
      }
    })
    const instance = new Plain()
    // no addEventListener -> setTimeout body is a no-op
    await aTimeout(10)
    expect(instance.modalTitle).to.equal('x')
  })
})
