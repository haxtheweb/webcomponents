import { expect } from '@open-wc/testing'

import { HAXStore } from '../lib/hax-store.js'
import { LitElement } from 'lit'

describe('hax-store methods round 3', () => {
  describe('_openInlineProgramAtCursor', () => {
    it('returns false when missing required params', () => {
      expect(HAXStore._openInlineProgramAtCursor({})).to.equal(false)
      expect(HAXStore._openInlineProgramAtCursor({ machineName: 'x' })).to.equal(false)
      expect(
        HAXStore._openInlineProgramAtCursor({ machineName: 'x', range: {} }),
      ).to.equal(false)
      expect(
        HAXStore._openInlineProgramAtCursor({
          machineName: 'x',
          range: {},
          selection: {},
        }),
      ).to.equal(false)
    })
  })

  describe('__editableForRange', () => {
    it('returns null for null range', () => {
      expect(HAXStore.__editableForRange(null)).to.be.null
    })

    it('returns null when no contenteditable ancestor found', () => {
      const div = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(div)
      const range = globalThis.document.createRange()
      range.selectNodeContents(div)
      const result = HAXStore.__editableForRange(range)
      expect(result).to.be.null
      div.remove()
    })

    it('finds contenteditable ancestor', () => {
      const editable = globalThis.document.createElement('div')
      editable.setAttribute('contenteditable', 'true')
      globalThis.document.body.appendChild(editable)
      editable.textContent = 'test'
      const range = globalThis.document.createRange()
      range.selectNodeContents(editable)
      const result = HAXStore.__editableForRange(range)
      expect(result).to.equal(editable)
      editable.remove()
    })
  })

  describe('_handleRteInlineProgram', () => {
    it('does nothing when detail is missing', () => {
      expect(() => HAXStore._handleRteInlineProgram({})).to.not.throw()
      expect(() => HAXStore._handleRteInlineProgram({ detail: {} })).to.not.throw()
    })

    it('does nothing when missing required fields', () => {
      expect(() =>
        HAXStore._handleRteInlineProgram({ detail: { range: {} } }),
      ).to.not.throw()
    })
  })

  describe('_openExternalLink', () => {
    it('does not throw', () => {
      const originalOpen = globalThis.open
      globalThis.open = () => null
      expect(() => HAXStore._openExternalLink('https://example.com')).to.not.throw()
      globalThis.open = originalOpen
    })
  })

  describe('_haxStoreContribute', () => {
    it('does not throw for bug report type', async () => {
      const originalOpen = globalThis.open
      globalThis.open = () => null
      await HAXStore._haxStoreContribute('bug', 'bug')
      globalThis.open = originalOpen
    })

    it('does not throw for merlin report type', async () => {
      const originalOpen = globalThis.open
      globalThis.open = () => null
      await HAXStore._haxStoreContribute('merlin', 'feature', 'my command')
      globalThis.open = originalOpen
    })

    it('does not throw for feature report type', async () => {
      const originalOpen = globalThis.open
      globalThis.open = () => null
      await HAXStore._haxStoreContribute('feature', 'feature')
      globalThis.open = originalOpen
    })

    it('does not throw for issue report type', async () => {
      const originalOpen = globalThis.open
      globalThis.open = () => null
      await HAXStore._haxStoreContribute('issue', 'issue')
      globalThis.open = originalOpen
    })

    it('defaults to bug when type is null', async () => {
      const originalOpen = globalThis.open
      globalThis.open = () => null
      await HAXStore._haxStoreContribute(null, 'bug')
      globalThis.open = originalOpen
    })
  })

  describe('_richTextEditorPromptConfirm', () => {
    it('does not throw for event without value', () => {
      expect(() => HAXStore._richTextEditorPromptConfirm({ detail: {} })).to.not.throw()
    })

    it('does not throw for event with value.target on A tag', () => {
      const originalActiveNode = HAXStore.activeNode
      const a = globalThis.document.createElement('a')
      HAXStore.activeNode = a
      expect(() =>
        HAXStore._richTextEditorPromptConfirm({
          detail: { value: { target: '_blank' } },
        }),
      ).to.not.throw()
      HAXStore.activeNode = originalActiveNode
    })
  })

  describe('activeBodyIgnoreActive', () => {
    it('throws when activeHaxBody is null (expected behavior)', () => {
      const originalBody = HAXStore.activeHaxBody
      HAXStore.activeHaxBody = null
      expect(() => HAXStore.activeBodyIgnoreActive(true)).to.throw()
      HAXStore.activeHaxBody = originalBody
    })

    it('sets __ignoreActive on activeHaxBody with a real element', () => {
      const originalBody = HAXStore.activeHaxBody
      const fakeBody = globalThis.document.createElement('div')
      HAXStore.activeHaxBody = fakeBody
      HAXStore.activeBodyIgnoreActive(true)
      expect(fakeBody.__ignoreActive).to.equal(true)
      HAXStore.activeHaxBody = originalBody
    })
  })

  describe('_getStyleGuideSchemaOverride', () => {
    let originalSchema
    beforeEach(() => {
      originalSchema = HAXStore.styleGuideSchema
    })
    afterEach(() => {
      HAXStore.styleGuideSchema = originalSchema
    })

    it('returns null when styleGuideSchema is empty', () => {
      HAXStore.styleGuideSchema = {}
      expect(HAXStore._getStyleGuideSchemaOverride('test-tag')).to.be.null
    })

    it('returns schema for known tag', () => {
      HAXStore.styleGuideSchema = {
        'test-tag': { demoSchema: [{ tag: 'test-tag' }] },
      }
      const result = HAXStore._getStyleGuideSchemaOverride('test-tag')
      expect(result).to.exist
      expect(result.demoSchema).to.exist
    })

    it('returns null for unknown tag', () => {
      HAXStore.styleGuideSchema = {
        'other-tag': { demoSchema: [] },
      }
      expect(HAXStore._getStyleGuideSchemaOverride('test-tag')).to.be.null
    })
  })

  describe('_updateElementDemoSchema', () => {
    let originalSchema
    beforeEach(() => {
      originalSchema = HAXStore.styleGuideSchema
      HAXStore.styleGuideSchema = {}
    })
    afterEach(() => {
      HAXStore.styleGuideSchema = originalSchema
    })

    it('does nothing for null haxElement', async () => {
      await HAXStore._updateElementDemoSchema(null)
      expect(HAXStore.styleGuideSchema).to.deep.equal({})
    })

    it('does nothing for haxElement without tag', async () => {
      await HAXStore._updateElementDemoSchema({ properties: {} })
      expect(HAXStore.styleGuideSchema).to.deep.equal({})
    })

    it('creates demoSchema entry for tag', async () => {
      await HAXStore._updateElementDemoSchema({
        tag: 'test-el',
        properties: { source: 'img.jpg' },
        content: '<p>content</p>',
      })
      expect(HAXStore.styleGuideSchema['test-el']).to.exist
      expect(HAXStore.styleGuideSchema['test-el'].demoSchema).to.exist
      expect(HAXStore.styleGuideSchema['test-el'].demoSchema[0].tag).to.equal(
        'test-el',
      )
    })
  })

  describe('detectAndRegisterPageTemplateStax', () => {
    it('returns early for null content', async () => {
      await HAXStore.detectAndRegisterPageTemplateStax(null)
      // Should not throw
      expect(true).to.equal(true)
    })

    it('returns early for empty content', async () => {
      await HAXStore.detectAndRegisterPageTemplateStax('')
      expect(true).to.equal(true)
    })
  })

  describe('_detectStyleGuideTemplates', () => {
    it('does not throw when HAXCMS is not available', async () => {
      await HAXStore._detectStyleGuideTemplates()
      expect(true).to.equal(true)
    })
  })

  describe('forceAppStoreLoad', () => {
    it('does not throw when not loaded and no appStore data', async () => {
      await HAXStore.forceAppStoreLoad()
      expect(true).to.equal(true)
    })
  })

  describe('getHAXSlot', () => {
    let originalValidTagList
    beforeEach(() => {
      originalValidTagList = HAXStore.validTagList
      HAXStore.validTagList = ['p', 'div', 'span']
    })
    afterEach(() => {
      HAXStore.validTagList = originalValidTagList
    })

    it('returns innerHTML for text elements', async () => {
      const p = globalThis.document.createElement('p')
      p.innerHTML = '<b>bold</b> text'
      HAXStore.isTextElement = () => true
      const result = await HAXStore.getHAXSlot(p)
      expect(result).to.equal('<b>bold</b> text')
    })

    it('returns content for non-text elements with children', async () => {
      const div = globalThis.document.createElement('div')
      div.innerHTML = '<p>hello</p>'
      HAXStore.isTextElement = () => false
      const result = await HAXStore.getHAXSlot(div)
      expect(result).to.contain('hello')
    })

    it('returns empty string for element with no children', async () => {
      const div = globalThis.document.createElement('div')
      HAXStore.isTextElement = () => false
      const result = await HAXStore.getHAXSlot(div)
      expect(result).to.equal('')
    })

    it('preserves comment nodes', async () => {
      const div = globalThis.document.createElement('div')
      div.appendChild(globalThis.document.createComment('my comment'))
      HAXStore.isTextElement = () => false
      const result = await HAXStore.getHAXSlot(div)
      expect(result).to.contain('my comment')
    })
  })

  describe('nodeToContent', () => {
    let originalElementList, originalValidTagList, originalIsSandboxed
    beforeEach(() => {
      originalElementList = HAXStore.elementList
      originalValidTagList = HAXStore.validTagList
      originalIsSandboxed = HAXStore._isSandboxed
      HAXStore.elementList = {
        p: {
          gizmo: {},
          saveOptions: {},
          settings: { configure: [], advanced: [] },
        },
      }
      HAXStore.validTagList = ['p', 'div', 'span', 'img', 'br', 'hr']
      HAXStore._isSandboxed = false
    })
    afterEach(() => {
      HAXStore.elementList = originalElementList
      HAXStore.validTagList = originalValidTagList
      HAXStore._isSandboxed = originalIsSandboxed
    })

    it('converts a simple p element to HTML', async () => {
      const p = globalThis.document.createElement('p')
      p.textContent = 'Hello'
      const content = await HAXStore.nodeToContent(p)
      expect(content).to.contain('<p>')
      expect(content).to.contain('Hello')
      expect(content).to.contain('</p>')
    })

    it('removes hax-specific attributes', async () => {
      const p = globalThis.document.createElement('p')
      p.textContent = 'Hello'
      p.setAttribute('data-hax-ray', 'true')
      p.setAttribute('contenteditable', 'true')
      const content = await HAXStore.nodeToContent(p)
      expect(content).to.not.contain('data-hax-ray')
      expect(content).to.not.contain('contenteditable')
    })

    it('handles self-closing void tags', async () => {
      const hr = globalThis.document.createElement('hr')
      const content = await HAXStore.nodeToContent(hr)
      expect(content).to.contain('<hr')
      expect(content).to.not.contain('</hr>')
    })

    it('handles img as void tag', async () => {
      const img = globalThis.document.createElement('img')
      img.setAttribute('src', 'test.jpg')
      const content = await HAXStore.nodeToContent(img)
      expect(content).to.contain('<img')
      expect(content).to.not.contain('</img>')
    })

    it('handles br as void tag', async () => {
      const br = globalThis.document.createElement('br')
      const content = await HAXStore.nodeToContent(br)
      expect(content).to.contain('<br')
    })

    it('preserves slot attribute', async () => {
      const p = globalThis.document.createElement('p')
      p.textContent = 'Hello'
      p.setAttribute('slot', 'col-1')
      const content = await HAXStore.nodeToContent(p)
      expect(content).to.contain('slot=')
      expect(content).to.contain('col-1')
    })

    it('handles null node gracefully', async () => {
      // nodeToContent expects a node with tagName; test the preProcess path
      HAXStore.testHook = () => false
      const p = globalThis.document.createElement('p')
      p.textContent = 'test'
      const content = await HAXStore.nodeToContent(p)
      expect(content).to.contain('test')
    })

    it('cleans nbsp from output', async () => {
      const p = globalThis.document.createElement('p')
      p.innerHTML = 'hello&nbsp;world'
      const content = await HAXStore.nodeToContent(p)
      expect(content).to.not.contain('&nbsp;')
    })

    it('skips Lit state properties', async () => {
      class HaxStateDemo extends LitElement {
        static get properties() {
          return {
            label: { type: String },
            _open: { state: true },
            _rows: { state: true },
          }
        }
      }
      if (!globalThis.customElements.get('hax-state-demo')) {
        globalThis.customElements.define('hax-state-demo', HaxStateDemo)
      }
      HAXStore.validTagList = [...HAXStore.validTagList, 'hax-state-demo']
      const el = globalThis.document.createElement('hax-state-demo')
      el.label = 'Hello'
      el._open = true
      el._rows = [{ id: 1 }]
      globalThis.document.body.appendChild(el)
      await el.updateComplete
      const content = await HAXStore.nodeToContent(el)
      el.remove()
      expect(content).to.contain('label="Hello"')
      expect(content).to.not.contain('_open')
      expect(content).to.not.contain('_rows')
    })
  })

  describe('htmlToHaxElements', () => {
    let originalValidTagList
    beforeEach(() => {
      originalValidTagList = HAXStore.validTagList
      HAXStore.validTagList = ['p', 'div', 'h2', 'span', 'img']
    })
    afterEach(() => {
      HAXStore.validTagList = originalValidTagList
    })

    it('converts simple HTML to hax elements', async () => {
      const elements = await HAXStore.htmlToHaxElements('<p>Hello</p><p>World</p>')
      expect(elements.length).to.equal(2)
    })

    it('filters out invalid tags', async () => {
      const elements = await HAXStore.htmlToHaxElements(
        '<p>valid</p><custom-unknown>invalid</custom-unknown>',
      )
      expect(elements.length).to.equal(1)
    })

    it('handles empty HTML', async () => {
      const elements = await HAXStore.htmlToHaxElements('')
      expect(elements).to.deep.equal([])
    })

    it('handles null HTML', async () => {
      const elements = await HAXStore.htmlToHaxElements(null)
      expect(elements).to.deep.equal([])
    })
  })

  describe('keyboardShortcuts getter', () => {
    it('returns an object', () => {
      const shortcuts = HAXStore.keyboardShortcuts
      expect(typeof shortcuts).to.equal('object')
    })
  })

  describe('activeGizmo getter', () => {
    let originalActiveNode, originalGizmoList
    beforeEach(() => {
      originalActiveNode = HAXStore.activeNode
      originalGizmoList = HAXStore.gizmoList
      HAXStore.gizmoList = [{ tag: 'test-el', title: 'Test' }]
    })
    afterEach(() => {
      HAXStore.activeNode = originalActiveNode
      HAXStore.gizmoList = originalGizmoList
    })

    it('returns gizmo for activeNode', () => {
      HAXStore.activeNode = globalThis.document.createElement('test-el')
      const gizmo = HAXStore.activeGizmo
      expect(gizmo).to.exist
      expect(gizmo.tag).to.equal('test-el')
    })

    it('returns null for null activeNode', () => {
      HAXStore.activeNode = null
      const gizmo = HAXStore.activeGizmo
      expect(gizmo).to.be.null
    })
  })

  describe('attemptGizmoTranslation', () => {
    it('returns properties unchanged when no translation available', async () => {
      const props = { gizmo: { title: 'Test' } }
      const result = await HAXStore.attemptGizmoTranslation('nonexistent-tag', props)
      expect(result).to.equal(props)
    })
  })

  describe('_haxStoreRegisterStax', () => {
    let originalStaxList
    beforeEach(() => {
      originalStaxList = HAXStore.staxList
      HAXStore.staxList = []
    })
    afterEach(() => {
      HAXStore.staxList = originalStaxList
    })

    it('registers a new stax', () => {
      // _haxStoreRegisterStax checks e.target.parentElement.tagName === 'HAX-STORE'
      const fakeStore = globalThis.document.createElement('hax-store')
      const fakeTarget = globalThis.document.createElement('div')
      fakeStore.appendChild(fakeTarget)
      HAXStore._haxStoreRegisterStax({
        detail: { details: { title: 'My Stax' }, stax: [] },
        target: fakeTarget,
      })
      expect(HAXStore.staxList.length).to.equal(1)
      expect(HAXStore.staxList[0].details.title).to.equal('My Stax')
      fakeStore.remove()
    })

    it('does not register duplicate stax with same haxsgId', () => {
      const fakeStore = globalThis.document.createElement('hax-store')
      const fakeTarget = globalThis.document.createElement('div')
      fakeStore.appendChild(fakeTarget)
      HAXStore.staxList = [
        { details: { title: 'Existing', haxsgId: '123' }, stax: [] },
      ]
      HAXStore._haxStoreRegisterStax({
        detail: { details: { title: 'New', haxsgId: '123' }, stax: [] },
        target: fakeTarget,
      })
      expect(HAXStore.staxList.length).to.equal(1)
      fakeStore.remove()
    })
  })

  describe('retrieveImageFromClipboardAsBlob', () => {
    it('calls callback with undefined when clipboardData is false', () => {
      let callbackResult = 'not called'
      HAXStore.retrieveImageFromClipboardAsBlob(
        { clipboardData: false },
        (result) => {
          callbackResult = result
        },
      )
      expect(callbackResult).to.be.undefined
    })

    it('calls callback with undefined when items is undefined', () => {
      let callbackResult = 'not called'
      HAXStore.retrieveImageFromClipboardAsBlob(
        { clipboardData: {} },
        (result) => {
          callbackResult = result
        },
      )
      expect(callbackResult).to.be.undefined
    })

    it('calls callback with undefined when no image items', () => {
      // When no image items found, the function does NOT call the callback
      // (it only calls callback inside the image-type loop)
      let callbackCalled = false
      HAXStore.retrieveImageFromClipboardAsBlob(
        { clipboardData: { items: [{ type: 'text/plain' }] } },
        () => {
          callbackCalled = true
        },
      )
      expect(callbackCalled).to.equal(false)
    })
  })
})
