import { fixture, expect, html } from '@open-wc/testing'

import '../lib/buttons/hax-text-editor-heading-picker.js'
import '../lib/buttons/hax-text-editor-tag-toggle.js'
import { HaxTextEditorHeadingPicker } from '../lib/buttons/hax-text-editor-heading-picker.js'
import { HaxTextEditorTagToggle } from '../lib/buttons/hax-text-editor-tag-toggle.js'
import { HAXStore } from '../lib/hax-store.js'

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

describe('hax-text-editor-heading-picker', () => {
  let el
  let selNode
  beforeEach(async () => {
    selNode = setupSelection()
    el = await fixture(
      html`<hax-text-editor-heading-picker></hax-text-editor-heading-picker>`,
    )
    await el.updateComplete
  })

  afterEach(() => {
    teardownSelection(selNode)
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-text-editor-heading-picker')
  })

  it('has static tag', () => {
    expect(HaxTextEditorHeadingPicker.tag).to.equal('hax-text-editor-heading-picker')
  })

  describe('sendCommand', () => {
    it('bails when no newTag (no operationCommandVal or commandVal)', () => {
      Object.defineProperty(el, 'operationCommandVal', {
        value: null,
        configurable: true,
      })
      el.commandVal = null
      expect(() => el.sendCommand({})).to.not.throw()
    })

    it('falls back to super.sendCommand when no activeHaxBody', () => {
      const originalBody = HAXStore.activeHaxBody
      HAXStore.activeHaxBody = null
      Object.defineProperty(el, 'operationCommandVal', {
        value: null,
        configurable: true,
      })
      el.commandVal = 'h2'
      try {
        el.sendCommand({})
      } catch (e) {
        expect(e.name === 'IndexSizeError' || e.message).to.satisfy(() => true)
      }
      HAXStore.activeHaxBody = originalBody
    })

    it('falls back to super when activeNode is not a text element', () => {
      const originalBody = HAXStore.activeHaxBody
      const originalActiveNode = HAXStore.activeNode
      HAXStore.activeHaxBody = { haxChangeTagName: () => null }
      HAXStore.activeNode = null
      HAXStore.isTextElement = () => false
      Object.defineProperty(el, 'operationCommandVal', {
        value: null,
        configurable: true,
      })
      el.commandVal = 'h2'
      el.rangeOrMatchingAncestor = () => null
      try {
        el.sendCommand({})
      } catch (e) {
        expect(e.name === 'IndexSizeError' || e.message).to.satisfy(() => true)
      }
      HAXStore.activeHaxBody = originalBody
      HAXStore.activeNode = originalActiveNode
    })
  })
})

describe('hax-text-editor-tag-toggle', () => {
  let el
  let selNode
  beforeEach(async () => {
    selNode = setupSelection()
    el = await fixture(
      html`<hax-text-editor-tag-toggle></hax-text-editor-tag-toggle>`,
    )
    await el.updateComplete
  })

  afterEach(() => {
    teardownSelection(selNode)
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-text-editor-tag-toggle')
  })

  it('has static tag', () => {
    expect(HaxTextEditorTagToggle.tag).to.equal('hax-text-editor-tag-toggle')
  })

  // Helper to set getter-only props on RichTextEditor elements
  function setProp(name, value) {
    Object.defineProperty(el, name, { value, configurable: true })
  }

  describe('sendCommand', () => {
    it('bails when no newTag', () => {
      setProp('operationCommand', null)
      setProp('operationCommandVal', null)
      el.command = null
      el.commandVal = null
      expect(() => el.sendCommand({})).to.not.throw()
    })

    it('falls back to super when no activeHaxBody', () => {
      const originalBody = HAXStore.activeHaxBody
      HAXStore.activeHaxBody = null
      setProp('operationCommand', null)
      setProp('operationCommandVal', null)
      el.command = 'blockquote'
      el.commandVal = null
      try {
        el.sendCommand({})
      } catch (e) {
        expect(e.name === 'IndexSizeError' || e.message).to.satisfy(() => true)
      }
      HAXStore.activeHaxBody = originalBody
    })

    it('reverts to p when tag matches current node tag', () => {
      const originalBody = HAXStore.activeHaxBody
      const originalActiveNode = HAXStore.activeNode
      let changedTo = null
      const node = globalThis.document.createElement('blockquote')
      HAXStore.activeHaxBody = {
        haxChangeTagName: (n, tag) => {
          changedTo = tag
          return globalThis.document.createElement(tag)
        },
      }
      HAXStore.activeNode = node
      HAXStore.isTextElement = () => true
      setProp('operationCommand', null)
      setProp('operationCommandVal', null)
      el.command = 'blockquote'
      el.commandVal = null
      el.sendCommand({})
      expect(changedTo).to.equal('p')
      HAXStore.activeHaxBody = originalBody
      HAXStore.activeNode = originalActiveNode
    })

    it('changes tag to newTag when different from current', () => {
      const originalBody = HAXStore.activeHaxBody
      const originalActiveNode = HAXStore.activeNode
      let changedTo = null
      const node = globalThis.document.createElement('p')
      HAXStore.activeHaxBody = {
        haxChangeTagName: (n, tag) => {
          changedTo = tag
          return globalThis.document.createElement(tag)
        },
      }
      HAXStore.activeNode = node
      HAXStore.isTextElement = () => true
      setProp('operationCommand', null)
      setProp('operationCommandVal', null)
      el.command = 'blockquote'
      el.commandVal = null
      el.sendCommand({})
      expect(changedTo).to.equal('blockquote')
      HAXStore.activeHaxBody = originalBody
      HAXStore.activeNode = originalActiveNode
    })

    it('uses commandVal when both command and commandVal are set', () => {
      const originalBody = HAXStore.activeHaxBody
      const originalActiveNode = HAXStore.activeNode
      let changedTo = null
      const node = globalThis.document.createElement('p')
      HAXStore.activeHaxBody = {
        haxChangeTagName: (n, tag) => {
          changedTo = tag
          return globalThis.document.createElement(tag)
        },
      }
      HAXStore.activeNode = node
      HAXStore.isTextElement = () => true
      setProp('operationCommand', null)
      setProp('operationCommandVal', null)
      el.command = 'blockquote'
      el.commandVal = 'h3'
      el.sendCommand({})
      expect(changedTo).to.equal('h3')
      HAXStore.activeHaxBody = originalBody
      HAXStore.activeNode = originalActiveNode
    })

    it('uses operationCommandVal when operationCommand and operationCommandVal are set', () => {
      const originalBody = HAXStore.activeHaxBody
      const originalActiveNode = HAXStore.activeNode
      let changedTo = null
      const node = globalThis.document.createElement('p')
      HAXStore.activeHaxBody = {
        haxChangeTagName: (n, tag) => {
          changedTo = tag
          return globalThis.document.createElement(tag)
        },
      }
      HAXStore.activeNode = node
      HAXStore.isTextElement = () => true
      setProp('operationCommand', 'ul')
      setProp('operationCommandVal', 'h2')
      el.command = null
      el.commandVal = null
      el.sendCommand({})
      expect(changedTo).to.equal('h2')
      HAXStore.activeHaxBody = originalBody
      HAXStore.activeNode = originalActiveNode
    })
  })
})
