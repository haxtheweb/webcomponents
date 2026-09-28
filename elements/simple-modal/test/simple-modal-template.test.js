import { fixture, expect, html } from '@open-wc/testing'
import '../lib/simple-modal-template.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

describe('SimpleModalTemplate', () => {
  let element

  afterEach(async () => {
    if (globalThis.SimpleModal && globalThis.SimpleModal.instance) {
      globalThis.SimpleModal.instance.opened = false
    }
    await aTimeout(5)
  })

  it('instantiates with default property values', async () => {
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    expect(element.title).to.equal('')
    expect(element.modal).to.exist
  })

  it('renders header, content, and buttons slots', async () => {
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    const slots = element.shadowRoot.querySelectorAll('slot')
    expect(slots.length).to.equal(3)
    expect(slots[0].name).to.equal('header')
    expect(slots[1].name).to.equal('content')
    expect(slots[2].name).to.equal('buttons')
  })

  it('_getSlot clones slotted content into a div', async () => {
    element = await fixture(html`
      <simple-modal-template>
        <div slot="content">Hello World</div>
        <div slot="content">Second</div>
      </simple-modal-template>
    `)
    const result = element._getSlot('content')
    expect(result).to.exist
    expect(result.tagName).to.equal('DIV')
    expect(result.childNodes.length).to.equal(2)
    expect(result.childNodes[0].textContent).to.equal('Hello World')
    expect(result.childNodes[1].textContent).to.equal('Second')
  })

  it('_getSlot returns empty div (not false) when no slotted content', async () => {
    // _getSlot uses querySelectorAll which returns a NodeList (never null),
    // so the ternary always takes the truthy branch and returns a div clone
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    const result = element._getSlot('content')
    expect(result).to.exist
    expect(result.tagName).to.equal('DIV')
    expect(result.childNodes.length).to.equal(0)
  })

  it('_getSlot handles SLOT element passthrough via assignedNodes', async () => {
    element = await fixture(html`
      <simple-modal-template>
        <slot slot="content"></slot>
      </simple-modal-template>
    `)
    const result = element._getSlot('content')
    expect(result).to.exist
    expect(result.tagName).to.equal('DIV')
  })

  it('_getCustom returns single custom-element clone', async () => {
    const custom = globalThis.document.createElement('div')
    custom.setAttribute('slot', 'custom')
    custom.textContent = 'CustomContent'
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    element.appendChild(custom)
    const result = element._getCustom()
    expect(result).to.exist
    expect(result.textContent).to.equal('CustomContent')
    expect(result).to.not.equal(custom)
  })

  it('_getCustom falls back to _getSlot when multiple custom elements', async () => {
    const c1 = globalThis.document.createElement('div')
    c1.setAttribute('slot', 'custom')
    c1.textContent = 'C1'
    const c2 = globalThis.document.createElement('div')
    c2.setAttribute('slot', 'custom')
    c2.textContent = 'C2'
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    element.appendChild(c1)
    element.appendChild(c2)
    const result = element._getCustom()
    expect(result).to.exist
    expect(result.tagName).to.equal('DIV')
    expect(result.childNodes.length).to.equal(2)
  })

  it('associateEvents returns modal object', async () => {
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    const target = globalThis.document.createElement('button')
    const modal = element.associateEvents(target, 'click')
    expect(modal).to.equal(element.modal)
  })

  it('has static tag property', async () => {
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    expect(element.constructor.tag).to.equal('simple-modal-template')
  })

  it(':host has display:none style', async () => {
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    const style = getComputedStyle(element)
    expect(style.display).to.equal('none')
  })

  it('openModal dispatches simple-modal-show with full detail', async () => {
    element = await fixture(html`
      <simple-modal-template title="My Title" modal-id="my-modal" class="my-class">
        <div slot="header">Header</div>
        <div slot="content">Content</div>
        <div slot="buttons">Buttons</div>
        <div slot="custom">Custom</div>
      </simple-modal-template>
    `)
    const target = globalThis.document.createElement('button')
    let captured = null
    globalThis.addEventListener('simple-modal-show', (e) => {
      captured = e
    }, { once: true })
    element.openModal(target)
    await aTimeout(5)
    expect(captured).to.exist
    expect(captured.detail.id).to.equal('my-modal')
    expect(captured.detail.title).to.equal('My Title')
    expect(captured.detail.modalClass).to.equal('my-class')
    expect(captured.detail.invokedBy).to.equal(target)
    expect(captured.detail.elements.header).to.exist
    expect(captured.detail.elements.content).to.exist
    expect(captured.detail.styles).to.exist
  })

  it('openModal with bubbles=false', async () => {
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    const target = globalThis.document.createElement('button')
    let captured = null
    globalThis.addEventListener('simple-modal-show', (e) => {
      captured = e
    }, { once: true })
    element.openModal(target, false, false)
    await aTimeout(5)
    expect(captured).to.exist
    expect(captured.bubbles).to.equal(false)
  })

  it('openModal uses mode property', async () => {
    element = await fixture(html`<simple-modal-template></simple-modal-template>`)
    element.mode = 'dark'
    const target = globalThis.document.createElement('button')
    let captured = null
    globalThis.addEventListener('simple-modal-show', (e) => {
      captured = e
    }, { once: true })
    element.openModal(target)
    await aTimeout(5)
    expect(captured.detail.mode).to.equal('dark')
  })
})
