import { expect } from '@open-wc/testing'
import { ESGlobalBridgeStore } from '@haxtheweb/es-global-bridge/es-global-bridge.js'

// This file deliberately has NO static import of la-tex.js: template cloning
// constructs the element before its children exist, so the constructor's
// light dom capture is only observable on the upgrade path, where the element
// and its children already sit in the page before the definition arrives.
// The bridge import is stubbed so the vendored bundle never loads here; the
// upgrade itself does not depend on it.

describe('la-tex dynamic upgrade', () => {
  it('captures its authored light dom text when the element upgrades', async () => {
    const originalImport = ESGlobalBridgeStore.import
    ESGlobalBridgeStore.import = () => Promise.resolve()
    const container = globalThis.document.createElement('div')
    container.innerHTML = '<la-tex>E = mc^2</la-tex>'
    globalThis.document.body.appendChild(container)
    try {
      await import('../la-tex.js')
      const element = container.querySelector('la-tex')
      await element.updateComplete
      expect(element.initialText).to.equal('E = mc^2')
      expect(element.hydrated).to.equal(false)
      // the hax hooks restore exactly that captured text
      element.innerHTML = '<p>hydrated markup</p>'
      element.hydrated = true
      const node = globalThis.document.createElement('div')
      node.innerHTML = '<p>hydrated markup</p>'
      const restored = await element.haxpreProcessNodeToContent(node)
      expect(restored === node).to.be.true
      expect(node.innerHTML).to.equal('E = mc^2')
    } finally {
      container.remove()
      ESGlobalBridgeStore.import = originalImport
    }
  })
})
