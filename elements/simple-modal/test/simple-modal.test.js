import { fixture, expect, html } from '@open-wc/testing'
// Pre-import web-dialog so firstUpdated's dynamic import resolves from cache
import 'web-dialog/index.js'

import '../simple-modal.js'

const aTimeout = (ms) => new Promise((r) => setTimeout(r, ms))

describe('simple-modal test', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`
      <simple-modal title="test-title"></simple-modal>
    `)
  })

  afterEach(async () => {
    if (element && element.opened) {
      element.opened = false
      await aTimeout(10)
    }
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('instantiates with default property values', () => {
    expect(element.title).to.equal('test-title')
    expect(element.opened).to.equal(false)
    expect(element.closeLabel).to.equal('Close')
    expect(element.closeIcon).to.equal('close')
    expect(element.modal).to.equal(false)
    expect(element.showClose).to.equal(false)
    expect(element.titleIcon).to.equal('')
    expect(element.breadcrumbs).to.deep.equal([])
  })

  it('has static tag property returning "simple-modal"', () => {
    expect(element.constructor.tag).to.equal('simple-modal')
  })

  it('_getAriaLabelledby returns "simple-modal-title" when title is set', () => {
    expect(element._getAriaLabelledby('My Title')).to.equal('simple-modal-title')
  })

  it('_getAriaLabelledby returns null when title is empty', () => {
    expect(element._getAriaLabelledby('')).to.equal(null)
    expect(element._getAriaLabelledby(null)).to.equal(null)
    expect(element._getAriaLabelledby(undefined)).to.equal(null)
  })

  it('_getAriaLabel returns null when title is set', () => {
    expect(element._getAriaLabel('My Title')).to.equal(null)
  })

  it('_getAriaLabel returns "Modal Dialog" when title is empty', () => {
    expect(element._getAriaLabel('')).to.equal('Modal Dialog')
    expect(element._getAriaLabel(null)).to.equal('Modal Dialog')
  })

  it('_isBreadcrumbClickable returns false for last index', () => {
    expect(element._isBreadcrumbClickable({ label: 'a' }, 2, 2)).to.equal(false)
  })

  it('_isBreadcrumbClickable returns false when clickable=false', () => {
    expect(element._isBreadcrumbClickable({ label: 'a', clickable: false }, 0, 2)).to.equal(false)
  })

  it('_isBreadcrumbClickable returns true when action is set', () => {
    expect(element._isBreadcrumbClickable({ label: 'a', action: 'go' }, 0, 2)).to.equal(true)
  })

  it('_isBreadcrumbClickable returns true when onClick is a function', () => {
    expect(element._isBreadcrumbClickable({ label: 'a', onClick: () => {} }, 0, 2)).to.equal(true)
  })

  it('_isBreadcrumbClickable returns false for plain crumb without action/onClick', () => {
    expect(element._isBreadcrumbClickable({ label: 'a' }, 0, 2)).to.equal(false)
  })

  it('_mobileBreadcrumbLimit returns crumbs as-is when length <= 2', () => {
    const crumbs = [{ label: 'a' }, { label: 'b' }]
    expect(element._mobileBreadcrumbLimit(crumbs)).to.equal(crumbs)
  })

  it('_mobileBreadcrumbLimit returns first and last when > 2 and mobile', () => {
    const origMatchMedia = globalThis.matchMedia
    globalThis.matchMedia = (q) => ({ matches: true })
    const crumbs = [{ label: 'a' }, { label: 'b' }, { label: 'c' }]
    const result = element._mobileBreadcrumbLimit(crumbs)
    expect(result.length).to.equal(2)
    expect(result[0]).to.equal(crumbs[0])
    expect(result[1]).to.equal(crumbs[2])
    globalThis.matchMedia = origMatchMedia
  })

  it('_mobileBreadcrumbLimit returns all when > 2 and not mobile', () => {
    const origMatchMedia = globalThis.matchMedia
    globalThis.matchMedia = (q) => ({ matches: false })
    const crumbs = [{ label: 'a' }, { label: 'b' }, { label: 'c' }]
    const result = element._mobileBreadcrumbLimit(crumbs)
    expect(result.length).to.equal(3)
    globalThis.matchMedia = origMatchMedia
  })

  it('_mobileBreadcrumbLimit handles non-array input', () => {
    expect(element._mobileBreadcrumbLimit(null)).to.equal(null)
    expect(element._mobileBreadcrumbLimit('not array')).to.equal('not array')
  })

  it('_handleBreadcrumbClick dispatches simple-modal-breadcrumb-click event', () => {
    let captured = null
    element.addEventListener('simple-modal-breadcrumb-click', (e) => {
      captured = e
    })
    const crumb = { label: 'crumb', action: 'test' }
    element.breadcrumbs = [crumb, { label: 'last' }]
    element.title = 'My Title'
    element._handleBreadcrumbClick(crumb, 0, { preventDefault() {}, stopPropagation() {} })
    expect(captured).to.exist
    expect(captured.detail.breadcrumb).to.equal(crumb)
    expect(captured.detail.index).to.equal(0)
    expect(captured.detail.title).to.equal('My Title')
    expect(captured.bubbles).to.be.true
    expect(captured.composed).to.be.true
  })

  it('_handleBreadcrumbClick calls crumb.onClick when it is a function', () => {
    let onClickCalled = false
    let onClickDetail = null
    const crumb = {
      label: 'crumb',
      onClick: (detail) => {
        onClickCalled = true
        onClickDetail = detail
      },
    }
    element.breadcrumbs = [crumb, { label: 'last' }]
    element._handleBreadcrumbClick(crumb, 0, null)
    expect(onClickCalled).to.be.true
    expect(onClickDetail).to.exist
    expect(onClickDetail.breadcrumb).to.equal(crumb)
    expect(onClickDetail.index).to.equal(0)
  })

  it('_handleBreadcrumbClick handles null event', () => {
    let captured = null
    element.addEventListener('simple-modal-breadcrumb-click', (e) => {
      captured = e
    })
    const crumb = { label: 'crumb' }
    element._handleBreadcrumbClick(crumb, 0, null)
    expect(captured).to.exist
  })

  it('show method sets title, mode, and opened=true', async () => {
    const content = globalThis.document.createElement('div')
    content.textContent = 'content'
    element.show('New Title', 'edit', { content }, null)
    expect(element.title).to.equal('New Title')
    expect(element.mode).to.equal('edit')
    expect(element.opened).to.equal(true)
    expect(element.invokedBy).to.equal(null)
    // clean up
    element.opened = false
    await aTimeout(10)
  })

  it('show method sets id when provided', async () => {
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null, 'my-id')
    expect(element.getAttribute('id')).to.equal('my-id')
    element.opened = false
    await aTimeout(10)
  })

  it('show method removes id when not provided', async () => {
    element.setAttribute('id', 'old-id')
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null)
    expect(element.hasAttribute('id')).to.be.false
    element.opened = false
    await aTimeout(10)
  })

  it('show method sets modalClass when provided', async () => {
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null, null, 'my-class')
    expect(element.getAttribute('class')).to.equal('my-class')
    element.opened = false
    await aTimeout(10)
  })

  it('show method removes class when not provided', async () => {
    element.setAttribute('class', 'old-class')
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null)
    expect(element.hasAttribute('class')).to.be.false
    element.opened = false
    await aTimeout(10)
  })

  it('show method applies CSS var styles when provided', async () => {
    const styles = { '--simple-modal-width': '500px' }
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null, null, null, styles)
    expect(element.style.getPropertyValue('--simple-modal-width')).to.equal('500px')
    element.opened = false
    await aTimeout(10)
  })

  it('show method clones elements when clone=true', async () => {
    const content = globalThis.document.createElement('div')
    content.textContent = 'original'
    element.show('T', 'm', { content }, null, null, null, null, true)
    const slotted = element.querySelector('[slot="content"]')
    expect(slotted).to.exist
    expect(slotted).to.not.equal(content)
    expect(slotted.textContent).to.equal('original')
    element.opened = false
    await aTimeout(10)
  })

  it('show method appends elements without cloning when clone=false', async () => {
    const content = globalThis.document.createElement('div')
    content.textContent = 'original'
    element.show('T', 'm', { content }, null, null, null, null, false)
    const slotted = element.querySelector('[slot="content"]')
    expect(slotted).to.equal(content)
    element.opened = false
    await aTimeout(10)
  })

  it('show method sets modal and showClose flags', async () => {
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null, null, null, null, false, true, true)
    expect(element.modal).to.equal(true)
    expect(element.showClose).to.equal(true)
    element.opened = false
    await aTimeout(10)
  })

  it('show method sets titleIcon and breadcrumbs', async () => {
    const crumbs = [{ label: 'a' }, { label: 'b' }]
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null, null, null, null, false, false, false, 'icons:star', crumbs)
    expect(element.titleIcon).to.equal('icons:star')
    expect(element.breadcrumbs).to.equal(crumbs)
    element.opened = false
    await aTimeout(10)
  })

  it('show method defaults breadcrumbs to empty array when not array', async () => {
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null, null, null, null, false, false, false, null, 'not array')
    expect(element.breadcrumbs).to.deep.equal([])
    element.opened = false
    await aTimeout(10)
  })

  it('show method defaults titleIcon to empty string when null', async () => {
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null, null, null, null, false, false, false, null)
    expect(element.titleIcon).to.equal('')
    element.opened = false
    await aTimeout(10)
  })

  it('close method is a no-op when not opened', () => {
    expect(element.opened).to.equal(false)
    element.close()
    expect(element.opened).to.equal(false)
  })

  it('close method dispatches simple-modal-will-close event', async () => {
    const content = globalThis.document.createElement('div')
    element.show('T', 'm', { content }, null)
    let willClose = null
    element.addEventListener('simple-modal-will-close', (e) => {
      willClose = e
    })
    element.close()
    expect(willClose).to.exist
    expect(willClose.detail.opened).to.equal(true)
    await aTimeout(10)
  })

  it('close method can be cancelled via simple-modal-will-close', async () => {
    const content = globalThis.document.createElement('div')
    element.show('T', 'm', { content }, null)
    element.addEventListener('simple-modal-will-close', (e) => {
      e.preventDefault()
    })
    element.close()
    expect(element.opened).to.equal(true)
    element.opened = false
    await aTimeout(10)
  })

  it('close method clears title, titleIcon, breadcrumbs, showClose', async () => {
    element.show('T', 'm', { content: globalThis.document.createElement('div') }, null, null, null, null, false, false, true, 'icon', [{ label: 'b' }])
    expect(element.title).to.equal('T')
    expect(element.titleIcon).to.equal('icon')
    expect(element.showClose).to.equal(true)
    element.close()
    expect(element.title).to.equal('')
    expect(element.titleIcon).to.equal('')
    expect(element.breadcrumbs).to.deep.equal([])
    expect(element.showClose).to.equal(false)
    await aTimeout(10)
  })

  it('showEvent dispatches simple-toast-hide and calls show', async () => {
    let toastHide = null
    globalThis.addEventListener('simple-toast-hide', (e) => {
      toastHide = e
    }, { once: true })
    const content = globalThis.document.createElement('div')
    const fakeEvent = new CustomEvent('simple-modal-show', {
      detail: {
        title: 'Evt Title',
        mode: 'evt',
        elements: { content },
        invokedBy: null,
      },
    })
    element.showEvent(fakeEvent)
    expect(toastHide).to.exist
    expect(element.title).to.equal('Evt Title')
    expect(element.opened).to.equal(true)
    element.opened = false
    await aTimeout(10)
  })

  it('showEvent swaps content when already opened', async () => {
    const content1 = globalThis.document.createElement('div')
    content1.textContent = 'first'
    element.show('First', 'm', { content: content1 }, null)
    await aTimeout(10)

    const content2 = globalThis.document.createElement('div')
    content2.textContent = 'second'
    const fakeEvent = new CustomEvent('simple-modal-show', {
      detail: {
        title: 'Second',
        mode: 'm',
        elements: { content: content2 },
        invokedBy: null,
      },
    })
    element.showEvent(fakeEvent)
    expect(element.title).to.equal('Second')
    element.opened = false
    await aTimeout(10)
  })

  it('connectedCallback adds simple-modal-show and simple-modal-hide listeners', async () => {
    // The modal should have event listeners from connectedCallback
    // We can verify by dispatching a simple-modal-hide event
    element.opened = true
    await aTimeout(10)
    globalThis.dispatchEvent(new CustomEvent('simple-modal-hide'))
    await aTimeout(10)
    expect(element.opened).to.equal(false)
  })

  it('disconnectedCallback aborts window controllers', async () => {
    const ctrl = element.windowControllers
    expect(ctrl.signal.aborted).to.equal(false)
    element.parentNode.removeChild(element)
    expect(ctrl.signal.aborted).to.equal(true)
  })

  it('_renderTitle returns plain title when no breadcrumbs and no titleIcon', () => {
    element.title = 'Plain Title'
    element.breadcrumbs = []
    element.titleIcon = ''
    // _renderTitle is called during render; we can check the rendered output
    // by looking at the shadow DOM
    const titleEl = element.shadowRoot.querySelector('#simple-modal-title')
    expect(titleEl).to.exist
  })

  it('render shows close button when showClose is true', async () => {
    element.showClose = true
    element.title = 'T'
    await element.updateComplete
    const closeBtn = element.shadowRoot.querySelector('#close')
    expect(closeBtn).to.exist
  })

  it('render hides close button when modal=true and showClose=false', async () => {
    element.modal = true
    element.showClose = false
    element.title = 'T'
    await element.updateComplete
    const closeBtn = element.shadowRoot.querySelector('#close')
    expect(closeBtn).to.not.exist
  })

  it('render shows close button when modal=false', async () => {
    element.modal = false
    element.showClose = false
    element.title = 'T'
    await element.updateComplete
    const closeBtn = element.shadowRoot.querySelector('#close')
    expect(closeBtn).to.exist
  })

  it('titlebar has "full" class when title is set', async () => {
    element.title = 'T'
    await element.updateComplete
    const titlebar = element.shadowRoot.querySelector('#titlebar')
    expect(titlebar.classList.contains('full')).to.be.true
  })

  it('titlebar has "empty" class when title is empty', async () => {
    element.title = ''
    await element.updateComplete
    const titlebar = element.shadowRoot.querySelector('#titlebar')
    expect(titlebar.classList.contains('empty')).to.be.true
  })

  it('title heading is hidden when title is empty', async () => {
    element.title = ''
    await element.updateComplete
    const titleEl = element.shadowRoot.querySelector('#simple-modal-title')
    expect(titleEl.hasAttribute('hidden')).to.be.true
  })

  it('render has slots for header, content, custom, and buttons', async () => {
    await element.updateComplete
    const headerSlot = element.shadowRoot.querySelector('slot[name="header"]')
    const contentSlot = element.shadowRoot.querySelector('slot[name="content"]')
    const customSlot = element.shadowRoot.querySelector('slot[name="custom"]')
    const buttonsSlot = element.shadowRoot.querySelector('slot[name="buttons"]')
    expect(headerSlot).to.exist
    expect(contentSlot).to.exist
    expect(customSlot).to.exist
    expect(buttonsSlot).to.exist
  })
})
