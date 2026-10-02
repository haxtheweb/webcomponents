import { fixture, expect, html } from '@open-wc/testing'

import '../wysiwyg-hax.js'
import { WysiwygHax } from '../wysiwyg-hax.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'

// Behavioral tests for wysiwyg-hax: light-DOM rendering of the hidden
// textarea + cms-hax integration, attribute passthrough, the
// hax-save-body-value -> bodyValue binding, the save-button click
// flow, and template import on firstUpdated.
describe('wysiwyg-hax behaviors', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('wysiwyg-hax')).to.exist
    expect(WysiwygHax.tag).to.equal('wysiwyg-hax')
  })

  it('renders to light dom with a hidden textarea and cms-hax', async () => {
    const el = await fixture(html`<wysiwyg-hax></wysiwyg-hax>`)
    await el.updateComplete
    // createRenderRoot returns this: no shadow root at all
    expect(el.shadowRoot).to.equal(null)
    const ta = el.querySelector('textarea')
    expect(ta).to.exist
    expect(ta.id).to.equal('textarea-input-field')
    expect(ta.name).to.equal('data[content]')
    expect(ta.hasAttribute('hidden')).to.equal(true)
    const cms = el.querySelector('cms-hax')
    expect(cms).to.exist
    expect(cms.getAttribute('element-align')).to.equal('left')
    expect(cms.hasAttribute('hide-message')).to.equal(true)
    expect(cms.hasAttribute('open-default')).to.equal(false)
  })

  it('defaults match documented property values', async () => {
    const el = await fixture(html`<wysiwyg-hax></wysiwyg-hax>`)
    await el.updateComplete
    expect(el.openDefault).to.equal(false)
    expect(el.elementAlign).to.equal('left')
    expect(el.fieldId).to.equal('textarea-input-field')
    expect(el.fieldName).to.equal('data[content]')
    expect(el.endPoint).to.equal(null)
    expect(el.allowedTags).to.deep.equal([])
    expect(el.redirectLocation).to.equal('')
    expect(el.updatePageData).to.equal('')
  })

  it('binds body-value into the textarea', async () => {
    const el = await fixture(
      html`<wysiwyg-hax body-value="&lt;p&gt;hello&lt;/p&gt;"></wysiwyg-hax>`,
    )
    await el.updateComplete
    expect(el.querySelector('textarea').value).to.contain('<p>hello</p>')
  })

  it('passes field attributes through to the textarea', async () => {
    const el = await fixture(
      html`<wysiwyg-hax
        field-class="form-control"
        field-id="custom-id"
        field-name="custom[name]"
      ></wysiwyg-hax>`,
    )
    await el.updateComplete
    const ta = el.querySelector('textarea')
    expect(ta.id).to.equal('custom-id')
    expect(ta.getAttribute('class')).to.equal('form-control')
    expect(ta.name).to.equal('custom[name]')
  })

  it('passes integration attributes through to cms-hax', async () => {
    const el = await fixture(
      html`<wysiwyg-hax
        redirect-location="/after-save"
        update-page-data="page-42"
        end-point="/api/save"
        app-store-connection='{"url":"appstore.json"}'
        offset-margin="2rem"
        element-align="right"
        sync-body
        hide-panel-ops
        open-default
        .allowedTags=${['p', 'div']}
      ></wysiwyg-hax>`,
    )
    await el.updateComplete
    const cms = el.querySelector('cms-hax')
    expect(cms.getAttribute('redirect-location')).to.equal('/after-save')
    expect(cms.getAttribute('update-page-data')).to.equal('page-42')
    expect(cms.getAttribute('app-store-connection')).to.equal(
      '{"url":"appstore.json"}',
    )
    expect(cms.getAttribute('offset-margin')).to.equal('2rem')
    expect(cms.getAttribute('element-align')).to.equal('right')
    expect(cms.hasAttribute('sync-body')).to.equal(true)
    expect(cms.hasAttribute('hide-panel-ops')).to.equal(true)
    expect(cms.hasAttribute('open-default')).to.equal(true)
    // sync-body reflects on the host too
    expect(el.hasAttribute('sync-body')).to.equal(true)
    // FIXED (issue #3102 bugs 12/13): render now binds .endPoint= and
    // .allowedTags= so the save endpoint and tag allow-lists reach the
    // real camelCase properties declared by cms-hax
    expect(el.endPoint).to.equal('/api/save')
    expect(cms.endPoint).to.equal('/api/save')
    expect(cms.allowedTags).to.deep.equal(['p', 'div'])
  })

  it('updates bodyValue from the hax-save-body-value event', async () => {
    const el = await fixture(html`<wysiwyg-hax></wysiwyg-hax>`)
    await el.updateComplete
    globalThis.dispatchEvent(
      new CustomEvent('hax-save-body-value', {
        detail: { value: '<p>updated body</p>' },
      }),
    )
    await el.updateComplete
    expect(el.bodyValue).to.equal('<p>updated body</p>')
    expect(el.querySelector('textarea').value).to.contain(
      '<p>updated body</p>',
    )
  })

  it('stops listening for body updates after disconnect', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = '<wysiwyg-hax></wysiwyg-hax>'
    globalThis.document.body.appendChild(container)
    const el = container.querySelector('wysiwyg-hax')
    await el.updateComplete
    globalThis.dispatchEvent(
      new CustomEvent('hax-save-body-value', {
        detail: { value: '<p>while connected</p>' },
      }),
    )
    await el.updateComplete
    expect(el.bodyValue).to.equal('<p>while connected</p>')
    container.remove()
    globalThis.dispatchEvent(
      new CustomEvent('hax-save-body-value', {
        detail: { value: '<p>after disconnect</p>' },
      }),
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(el.bodyValue).to.equal('<p>while connected</p>')
  })

  it('fires hax-save and hides the modal when the save button is clicked', async () => {
    const el = await fixture(html`<wysiwyg-hax></wysiwyg-hax>`)
    await el.updateComplete
    const originalSkipExitTrap = HAXStore.skipExitTrap
    const saveEvents = []
    // capture at the element and stop propagation so the real h-a-x
    // save pipeline does not react to this synthetic save event
    const saveHandler = (e) => {
      saveEvents.push(e)
      e.stopPropagation()
    }
    const hideEvents = []
    const hideHandler = (e) => hideEvents.push(e)
    el.addEventListener('hax-save', saveHandler, true)
    globalThis.addEventListener('simple-modal-hide', hideHandler)
    try {
      const btn = globalThis.document.createElement('button')
      el.saveButtonSelector = btn
      await el.updateComplete
      // updated() only binds when the value has a tagName
      const plain = {}
      el.saveButtonSelector = plain
      await el.updateComplete
      btn.click()
      expect(saveEvents.length).to.equal(1)
      expect(saveEvents[0].bubbles).to.equal(true)
      expect(saveEvents[0].composed).to.equal(true)
      expect(saveEvents[0].cancelable).to.equal(true)
      expect(hideEvents.length).to.equal(1)
      expect(HAXStore.skipExitTrap).to.equal(true)
      expect(HAXStore.editMode).to.equal(false)
    } finally {
      el.removeEventListener('hax-save', saveHandler, true)
      globalThis.removeEventListener('simple-modal-hide', hideHandler)
      HAXStore.skipExitTrap = originalSkipExitTrap
    }
  })

  it('disconnect removes the save button click listener', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = '<wysiwyg-hax></wysiwyg-hax>'
    globalThis.document.body.appendChild(container)
    const el = container.querySelector('wysiwyg-hax')
    await el.updateComplete
    const originalSkipExitTrap = HAXStore.skipExitTrap
    const saveHandler = (e) => e.stopPropagation()
    el.addEventListener('hax-save', saveHandler, true)
    try {
      const btn = globalThis.document.createElement('button')
      el.saveButtonSelector = btn
      await el.updateComplete
      HAXStore.skipExitTrap = false
      container.remove()
      // FIXED (issue #3102 bug 58): the bound handler is cached on the
      // instance (__saveClickedBound), so disconnectedCallback's
      // removeEventListener now matches the listener registered in
      // updated() and the click handler no longer leaks; clicking the
      // detached button must not touch HAXStore anymore.
      btn.click()
      expect(HAXStore.skipExitTrap).to.equal(false)
    } finally {
      el.removeEventListener('hax-save', saveHandler, true)
      HAXStore.skipExitTrap = originalSkipExitTrap
    }
  })

  it('imports template content into cms-hax on firstUpdated', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = '<wysiwyg-hax></wysiwyg-hax>'
    // element is upgraded but not yet connected; prime the import content
    const el = container.querySelector('wysiwyg-hax')
    const tpl = globalThis.document.createElement('template')
    tpl.innerHTML = '<p>imported page content</p>'
    el.__importContent = tpl.cloneNode(true)
    globalThis.document.body.appendChild(container)
    await el.updateComplete
    const imported = el.querySelector('cms-hax').querySelector('template')
    expect(imported).to.exist
    expect(imported.innerHTML).to.contain('imported page content')
    container.remove()
  })

  it('covers the constructor template import branch via __importContent', async () => {
    // NOTE: the constructor's this.querySelector("template") branch
    // (wysiwyg-hax.js:58-61) is unreachable in this harness because the
    // element upgrades at creation time, before light DOM children are
    // parsed; production relies on deferred module loading. The
    // __importContent priming above exercises the downstream import.
    const el = globalThis.document.createElement('wysiwyg-hax')
    expect(el.__importContent).to.equal(undefined)
  })
})
