import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../lib/hax-text-editor-button.js'
import { HaxTextEditorButton } from '../lib/hax-text-editor-button.js'

// RichTextEditor behaviors call getRangeAt(0) during render; we need a
// valid selection range in the document before the element renders.
function setupSelection() {
  const selNode = globalThis.document.createElement('div')
  selNode.textContent = 'selection target'
  globalThis.document.body.appendChild(selNode)
  const range = globalThis.document.createRange()
  range.selectNodeContents(selNode)
  const sel = globalThis.getSelection()
  if (sel) {
    sel.removeAllRanges()
    sel.addRange(range)
  }
  return selNode
}

function teardownSelection(node) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node)
  }
  const sel = globalThis.getSelection()
  if (sel) sel.removeAllRanges()
}

describe('hax-text-editor-button', () => {
  let el
  let selNode
  beforeEach(async () => {
    selNode = setupSelection()
    el = await fixture(
      html`<hax-text-editor-button></hax-text-editor-button>`,
    )
    await el.updateComplete
  })

  afterEach(() => {
    teardownSelection(selNode)
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-text-editor-button')
    expect(el.command).to.equal('insertHTML')
    expect(el.toggles).to.equal(true)
  })

  it('has static tag', () => {
    expect(HaxTextEditorButton.tag).to.equal('hax-text-editor-button')
  })

  describe('getSlotWrapper', () => {
    it('returns fallback when specified', () => {
      const field = { slotWrapper: 'div' }
      expect(el.getSlotWrapper(field)).to.equal('div')
    })

    it('returns first allowed wrapper when no fallback', () => {
      const field = { allowedSlotWrappers: ['span', 'div'] }
      expect(el.getSlotWrapper(field)).to.equal('span')
    })

    it('returns default array when no fallback and no allowed', () => {
      const field = {}
      const result = el.getSlotWrapper(field)
      expect(Array.isArray(result)).to.equal(true)
      expect(result).to.include('span')
      expect(result).to.include('div')
      expect(result).to.include('p')
    })

    it('excludes specified wrappers', () => {
      const field = { excludedSlotWrappers: ['span', 'div'] }
      const result = el.getSlotWrapper(field)
      expect(Array.isArray(result)).to.equal(true)
      expect(result).to.deep.equal(['p'])
    })
  })

  describe('setToggled', () => {
    it('sets toggled to true when value is truthy', () => {
      el.value = { something: 'test' }
      el.setToggled()
      expect(el.toggled).to.equal(true)
    })

    it('sets toggled to false when value is falsy', () => {
      el.value = null
      el.setToggled()
      expect(el.toggled).to.equal(false)
    })

    it('sets toggled to false when value is null', () => {
      el.value = null
      el.setToggled()
      expect(el.toggled).to.equal(false)
    })
  })

  describe('tagClickCallback', () => {
    it('calls open with event detail', () => {
      let openCalled = false
      let openArg = null
      el.open = (arg) => {
        openCalled = true
        openArg = arg
      }
      el.tagClickCallback({ detail: 'node-ref' })
      expect(openCalled).to.equal(true)
      expect(openArg).to.equal('node-ref')
    })

    it('does not call open when no detail', () => {
      let openCalled = false
      el.open = () => {
        openCalled = true
      }
      el.tagClickCallback({})
      expect(openCalled).to.equal(false)
    })
  })

  describe('updateElement', () => {
    it('dispatches deregister-button and register-button events', async () => {
      el.element = {
        gizmo: { tag: 'test-tag', icon: 'test-icon', title: 'Test' },
        settings: { configure: [] },
      }
      let deregisterFired = false
      let registerFired = false
      el.addEventListener('deregister-button', () => (deregisterFired = true))
      el.addEventListener('register-button', () => (registerFired = true))
      el.updateElement()
      await el.updateComplete
      expect(deregisterFired).to.equal(true)
      expect(registerFired).to.equal(true)
    })

    it('sets fields from settings.inline', () => {
      el.element = {
        gizmo: { tag: 'test', icon: 'i', title: 'T' },
        settings: {
          inline: [
            { property: 'prop1', inputMethod: 'textfield' },
            { slot: 'content', inputMethod: 'textfield' },
          ],
        },
      }
      el.updateElement()
      expect(el.fields.length).to.equal(2)
    })

    it('falls back to settings.configure when no inline', () => {
      el.element = {
        gizmo: { tag: 'test', icon: 'i', title: 'T' },
        settings: {
          configure: [{ property: 'prop1', inputMethod: 'textfield' }],
        },
      }
      el.updateElement()
      expect(el.fields.length).to.equal(1)
    })

    it('filters out collapse inputMethod fields', () => {
      el.element = {
        gizmo: { tag: 'test', icon: 'i', title: 'T' },
        settings: {
          inline: [
            { property: 'p1', inputMethod: 'textfield' },
            { property: 'p2', inputMethod: 'collapse' },
          ],
        },
      }
      el.updateElement()
      expect(el.fields.length).to.equal(1)
      expect(el.fields[0].property).to.equal('p1')
    })

    it('sets property to innerHTML when slot is empty string', () => {
      el.element = {
        gizmo: { tag: 'test', icon: 'i', title: 'T' },
        settings: {
          inline: [{ slot: '', inputMethod: 'textfield' }],
        },
      }
      el.updateElement()
      expect(el.fields[0].property).to.equal('innerHTML')
    })

    it('sets tagsList from gizmo.tag', () => {
      el.element = {
        gizmo: { tag: 'my-tag', icon: 'i', title: 'T' },
        settings: { configure: [] },
      }
      el.updateElement()
      expect(el.tagsList).to.equal('my-tag')
    })

    it('defaults tagsList to span when no gizmo.tag', () => {
      el.element = {
        gizmo: {},
        settings: { configure: [] },
      }
      el.updateElement()
      expect(el.tagsList).to.equal('span')
    })

    it('sets label from gizmo.title or gizmo.tag', () => {
      el.element = {
        gizmo: { tag: 'my-tag', icon: 'i', title: 'My Title' },
        settings: { configure: [] },
      }
      el.updateElement()
      expect(el.label).to.equal('My Title')
    })

    it('uses empty element when element is undefined', () => {
      el.element = undefined
      el.updateElement()
      expect(el.tagsList).to.equal('span')
      expect(el.icon).to.equal('add')
    })
  })
})
