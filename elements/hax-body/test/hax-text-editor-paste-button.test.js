import { fixture, expect, html } from '@open-wc/testing'

import '../lib/hax-text-editor-paste-button.js'
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

describe('hax-text-editor-paste-button', () => {
  let el
  let selNode
  beforeEach(async () => {
    selNode = setupSelection()
    el = await fixture(
      html`<hax-text-editor-paste-button></hax-text-editor-paste-button>`,
    )
    await el.updateComplete
  })

  afterEach(() => {
    teardownSelection(selNode)
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-text-editor-paste-button')
    expect(el.command).to.equal('paste')
    expect(el.icon).to.equal('content-paste')
    expect(el.label).to.equal('Paste Clipboard')
  })

  describe('sendCommand', () => {
    it('calls HAXStore._onPaste with clipboard data when navigator.clipboard exists', () => {
      let called = false
      let receivedArg = null
      const originalOnPaste = HAXStore._onPaste
      HAXStore._onPaste = (arg) => {
        called = true
        receivedArg = arg
      }
      const fakeClipboard = { readText: () => Promise.resolve('test') }
      const originalClipboard = globalThis.navigator.clipboard
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: fakeClipboard,
        configurable: true,
      })
      el.sendCommand({ test: true })
      expect(called).to.equal(true)
      expect(receivedArg.clipboardData).to.equal(fakeClipboard)
      HAXStore._onPaste = originalOnPaste
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true,
      })
    })

    it('does not call _onPaste when navigator.clipboard is missing', () => {
      let called = false
      const originalOnPaste = HAXStore._onPaste
      HAXStore._onPaste = () => {
        called = true
      }
      const originalClipboard = globalThis.navigator.clipboard
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: undefined,
        configurable: true,
      })
      el.sendCommand({})
      expect(called).to.equal(false)
      HAXStore._onPaste = originalOnPaste
      Object.defineProperty(globalThis.navigator, 'clipboard', {
        value: originalClipboard,
        configurable: true,
      })
    })
  })
})
