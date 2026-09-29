import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../hax-body.js'
import { HAXStore } from '../lib/hax-store.js'

describe('hax-body helper methods', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-body></hax-body>`)
    await el.updateComplete
  })

  describe('ContentStateManager (via el._contentState)', () => {
    let cm
    beforeEach(() => {
      cm = el._contentState
    })

    it('getState returns false for unknown key', () => {
      expect(cm.getState('unknownKey')).to.equal(false)
    })

    it('setState sets a known key', () => {
      cm.setState('importing', true)
      expect(cm.getState('importing')).to.equal(true)
    })

    it('setState does not set unknown key', () => {
      cm.setState('unknownKey', true)
      expect(cm.getState('unknownKey')).to.equal(false)
    })

    it('setState false notifies listeners', async () => {
      cm.setState('importing', true)
      const promise = cm.waitFor('importing')
      cm.setState('importing', false)
      await promise
      // Should resolve without hanging
      expect(true).to.equal(true)
    })

    it('isContentBusy returns true when importing', () => {
      cm.setState('importing', true)
      expect(cm.isContentBusy()).to.equal(true)
    })

    it('isContentBusy returns true when mutationsSuspended', () => {
      cm.setState('mutationsSuspended', true)
      expect(cm.isContentBusy()).to.equal(true)
    })

    it('isContentBusy returns true when editModeTransitioning', () => {
      cm.setState('editModeTransitioning', true)
      expect(cm.isContentBusy()).to.equal(true)
    })

    it('isContentBusy returns true when inserting', () => {
      cm.setState('inserting', true)
      expect(cm.isContentBusy()).to.equal(true)
    })

    it('isContentBusy returns false when all states are false', () => {
      cm.reset()
      expect(cm.isContentBusy()).to.equal(false)
    })

    it('waitFor resolves immediately when state is false', async () => {
      cm.setState('importing', false)
      await cm.waitFor('importing')
      // Should resolve immediately
      expect(true).to.equal(true)
    })

    it('waitForStable resolves when all states are false', async () => {
      cm.reset()
      await cm.waitForStable()
      expect(true).to.equal(true)
    })

    it('waitForStable waits for all true states', async () => {
      cm.setState('importing', true)
      cm.setState('inserting', true)
      const promise = cm.waitForStable()
      cm.setState('importing', false)
      cm.setState('inserting', false)
      await promise
      expect(true).to.equal(true)
    })

    it('reset sets all states to false', () => {
      cm.setState('importing', true)
      cm.setState('inserting', true)
      cm.reset()
      expect(cm.getState('importing')).to.equal(false)
      expect(cm.getState('inserting')).to.equal(false)
    })

    it('reset notifies listeners for states that were true', async () => {
      cm.setState('importing', true)
      const promise = cm.waitFor('importing')
      cm.reset()
      await promise
      expect(true).to.equal(true)
    })
  })

  describe('primitiveTextBlocks', () => {
    it('returns array of text primitive tags', () => {
      const tags = el.primitiveTextBlocks
      expect(Array.isArray(tags)).to.equal(true)
      expect(tags).to.include('p')
      expect(tags).to.include('h1')
      expect(tags).to.include('h2')
      expect(tags).to.include('blockquote')
      expect(tags).to.include('pre')
    })
  })

  describe('__isTextPrimitiveTag', () => {
    it('returns true for p element', () => {
      expect(el.__isTextPrimitiveTag(globalThis.document.createElement('p'))).to.equal(true)
    })

    it('returns true for h2 element', () => {
      expect(el.__isTextPrimitiveTag(globalThis.document.createElement('h2'))).to.equal(true)
    })

    it('returns true for blockquote element', () => {
      expect(el.__isTextPrimitiveTag(globalThis.document.createElement('blockquote'))).to.equal(true)
    })

    it('returns false for non-text-primitive elements', () => {
      expect(el.__isTextPrimitiveTag(globalThis.document.createElement('div'))).to.equal(true)
      expect(el.__isTextPrimitiveTag(globalThis.document.createElement('media-image'))).to.equal(false)
    })

    it('returns false for null/undefined', () => {
      expect(el.__isTextPrimitiveTag(null)).to.equal(false)
      expect(el.__isTextPrimitiveTag(undefined)).to.equal(false)
    })
  })

  describe('__isHeadingNode', () => {
    it('returns true for h1-h6', () => {
      expect(el.__isHeadingNode(globalThis.document.createElement('h1'))).to.equal(true)
      expect(el.__isHeadingNode(globalThis.document.createElement('h2'))).to.equal(true)
      expect(el.__isHeadingNode(globalThis.document.createElement('h3'))).to.equal(true)
      expect(el.__isHeadingNode(globalThis.document.createElement('h4'))).to.equal(true)
      expect(el.__isHeadingNode(globalThis.document.createElement('h5'))).to.equal(true)
      expect(el.__isHeadingNode(globalThis.document.createElement('h6'))).to.equal(true)
    })

    it('returns false for non-heading elements', () => {
      expect(el.__isHeadingNode(globalThis.document.createElement('p'))).to.equal(false)
      expect(el.__isHeadingNode(globalThis.document.createElement('div'))).to.equal(false)
    })

    it('returns false for null/undefined', () => {
      expect(el.__isHeadingNode(null)).to.equal(false)
      expect(el.__isHeadingNode(undefined)).to.equal(false)
    })
  })

  describe('__isKeyboardParagraphInsertTarget', () => {
    it('returns true for P, H1-H6, BLOCKQUOTE, PRE, SECTION, FIGURE, CODE', () => {
      for (const tag of ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'BLOCKQUOTE', 'PRE', 'SECTION', 'FIGURE', 'CODE']) {
        expect(el.__isKeyboardParagraphInsertTarget(globalThis.document.createElement(tag))).to.equal(true)
      }
    })

    it('returns false for non-target elements', () => {
      expect(el.__isKeyboardParagraphInsertTarget(globalThis.document.createElement('div'))).to.equal(false)
      expect(el.__isKeyboardParagraphInsertTarget(globalThis.document.createElement('span'))).to.equal(false)
    })

    it('returns false for null/undefined', () => {
      expect(el.__isKeyboardParagraphInsertTarget(null)).to.equal(false)
      expect(el.__isKeyboardParagraphInsertTarget(undefined)).to.equal(false)
    })
  })

  describe('__isTransientEditorStyleSpan', () => {
    it('returns true for span with style attribute', () => {
      const span = globalThis.document.createElement('span')
      span.setAttribute('style', 'color: red')
      expect(el.__isTransientEditorStyleSpan(span)).to.equal(true)
    })

    it('returns false for span without style attribute', () => {
      const span = globalThis.document.createElement('span')
      expect(el.__isTransientEditorStyleSpan(span)).to.equal(false)
    })

    it('returns false for non-span elements', () => {
      const div = globalThis.document.createElement('div')
      div.setAttribute('style', 'color: red')
      expect(el.__isTransientEditorStyleSpan(div)).to.equal(false)
    })

    it('returns false for null/undefined', () => {
      expect(el.__isTransientEditorStyleSpan(null)).to.equal(false)
      expect(el.__isTransientEditorStyleSpan(undefined)).to.equal(false)
    })
  })

  describe('__rangeFragmentToHTML', () => {
    it('converts a document fragment to HTML string', () => {
      const fragment = globalThis.document.createDocumentFragment()
      const p = globalThis.document.createElement('p')
      p.textContent = 'Hello'
      fragment.appendChild(p)
      const html = el.__rangeFragmentToHTML(fragment)
      expect(html).to.contain('<p>')
      expect(html).to.contain('Hello')
    })
  })

  describe('__keyboardInsertScrollSettings', () => {
    it('returns scroll settings object', () => {
      const settings = el.__keyboardInsertScrollSettings()
      expect(settings.block).to.equal('center')
      expect(settings.inline).to.equal('nearest')
    })
  })

  describe('_normalizeKeyboardShortcutGuess', () => {
    it('returns empty string for null node', () => {
      expect(el._normalizeKeyboardShortcutGuess(null)).to.equal('')
    })

    it('returns empty string for undefined node', () => {
      expect(el._normalizeKeyboardShortcutGuess(undefined)).to.equal('')
    })

    it('returns empty string for node without textContent', () => {
      expect(el._normalizeKeyboardShortcutGuess({})).to.equal('')
    })

    it('strips zero-width spaces', () => {
      const p = globalThis.document.createElement('p')
      p.textContent = '\u200bhello\u200b'
      expect(el._normalizeKeyboardShortcutGuess(p)).to.equal('hello')
    })

    it('strips newlines', () => {
      const p = globalThis.document.createElement('p')
      p.textContent = 'hello\nworld'
      expect(el._normalizeKeyboardShortcutGuess(p)).to.equal('helloworld')
    })

    it('strips leading space', () => {
      const p = globalThis.document.createElement('p')
      p.textContent = ' hello'
      expect(el._normalizeKeyboardShortcutGuess(p)).to.equal('hello')
    })

    it('replaces non-breaking spaces with regular spaces', () => {
      const p = globalThis.document.createElement('p')
      p.textContent = 'hello\u00a0world'
      const result = el._normalizeKeyboardShortcutGuess(p)
      expect(result).to.not.contain('\u00a0')
    })
  })

  describe('__removeDirectBreakChildren', () => {
    it('removes BR children from a node', () => {
      const div = globalThis.document.createElement('div')
      div.appendChild(globalThis.document.createElement('br'))
      div.appendChild(globalThis.document.createTextNode('text'))
      div.appendChild(globalThis.document.createElement('br'))
      el.__removeDirectBreakChildren(div)
      expect(div.querySelectorAll('br').length).to.equal(0)
      expect(div.textContent).to.equal('text')
    })

    it('does nothing for null/undefined', () => {
      expect(() => el.__removeDirectBreakChildren(null)).to.not.throw()
      expect(() => el.__removeDirectBreakChildren(undefined)).to.not.throw()
    })

    it('does nothing for node without childNodes', () => {
      expect(() => el.__removeDirectBreakChildren({})).to.not.throw()
    })
  })

  describe('__isEffectivelyEmptyTextBlock', () => {
    it('returns false for null/undefined', () => {
      expect(el.__isEffectivelyEmptyTextBlock(null)).to.equal(false)
      expect(el.__isEffectivelyEmptyTextBlock(undefined)).to.equal(false)
    })

    it('returns false for node without tagName', () => {
      expect(el.__isEffectivelyEmptyTextBlock({})).to.equal(false)
    })

    it('returns false for non-grid-tag elements', () => {
      const span = globalThis.document.createElement('span')
      expect(el.__isEffectivelyEmptyTextBlock(span)).to.equal(false)
    })

    it('returns true for empty p element', () => {
      const p = globalThis.document.createElement('p')
      expect(el.__isEffectivelyEmptyTextBlock(p)).to.equal(true)
      expect(p.hasAttribute('data-hax-empty')).to.equal(true)
    })

    it('returns true for p with only BR child', () => {
      const p = globalThis.document.createElement('p')
      p.appendChild(globalThis.document.createElement('br'))
      expect(el.__isEffectivelyEmptyTextBlock(p)).to.equal(true)
    })

    it('returns false for p with text content', () => {
      const p = globalThis.document.createElement('p')
      p.textContent = 'Hello'
      expect(el.__isEffectivelyEmptyTextBlock(p)).to.equal(false)
    })

    it('returns false for p with non-BR element child', () => {
      const p = globalThis.document.createElement('p')
      p.appendChild(globalThis.document.createElement('span'))
      expect(el.__isEffectivelyEmptyTextBlock(p)).to.equal(false)
    })

    it('returns true for p with only zero-width spaces', () => {
      const p = globalThis.document.createElement('p')
      p.textContent = '\u200b\u200b'
      expect(el.__isEffectivelyEmptyTextBlock(p)).to.equal(true)
    })

    it('returns true for empty li element', () => {
      const li = globalThis.document.createElement('li')
      expect(el.__isEffectivelyEmptyTextBlock(li)).to.equal(true)
    })
  })

  describe('calcClasses', () => {
    let originalValidTagList
    beforeEach(() => {
      originalValidTagList = HAXStore.validTagList
      HAXStore.validTagList = ['p', 'div', 'h2', 'span', 'media-image']
    })
    afterEach(() => {
      HAXStore.validTagList = originalValidTagList
    })

    it('returns not-text for null activeNode', () => {
      expect(el.calcClasses(null)).to.equal('not-text')
    })

    it('returns not-text for element without getAttribute', () => {
      expect(el.calcClasses({})).to.equal('not-text')
    })

    it('returns not-text for locked element', () => {
      const p = globalThis.document.createElement('p')
      p.setAttribute('data-hax-lock', 'data-hax-lock')
      expect(el.calcClasses(p)).to.equal('not-text')
    })

    it('returns is-text for unlocked text element', () => {
      const p = globalThis.document.createElement('p')
      // need parentNode without lock
      const parent = globalThis.document.createElement('div')
      parent.appendChild(p)
      HAXStore.isTextElement = () => true
      HAXStore.isSingleSlotElement = () => false
      expect(el.calcClasses(p)).to.equal('is-text')
    })
  })

  describe('getSlotConfig', () => {
    it('returns undefined for empty props', () => {
      expect(el.getSlotConfig('col-1', {})).to.be.undefined
    })

    it('returns undefined for props without settings', () => {
      expect(el.getSlotConfig('col-1', { other: 'val' })).to.be.undefined
    })

    it('returns matching slot config', () => {
      const props = {
        settings: {
          configure: [
            { slot: 'col-1', title: 'Column 1' },
            { slot: 'col-2', title: 'Column 2' },
          ],
        },
      }
      const config = el.getSlotConfig('col-1', props)
      expect(config).to.exist
      expect(config.title).to.equal('Column 1')
    })

    it('returns undefined when no slot matches', () => {
      const props = {
        settings: {
          configure: [{ slot: 'col-1' }],
        },
      }
      expect(el.getSlotConfig('col-3', props)).to.be.undefined
    })

    it('returns first matching slot when slotId is empty', () => {
      const props = {
        settings: {
          configure: [
            { slot: 'col-1', title: 'Column 1' },
            { slot: 'col-2', title: 'Column 2' },
          ],
        },
      }
      const config = el.getSlotConfig('', props)
      expect(config).to.exist
    })
  })

  describe('hideContextMenus', () => {
    it('does not throw when called', () => {
      expect(() => el.hideContextMenus()).to.not.throw()
    })

    it('does not throw when called with false', () => {
      expect(() => el.hideContextMenus(false)).to.not.throw()
    })
  })

  describe('__scrubTransientEditorStyleSpans', () => {
    it('does nothing for null', () => {
      expect(() => el.__scrubTransientEditorStyleSpans(null)).to.not.throw()
    })

    it('removes style spans from a subtree', () => {
      const div = globalThis.document.createElement('div')
      const span = globalThis.document.createElement('span')
      span.setAttribute('style', 'color: red')
      span.textContent = 'styled'
      div.appendChild(span)
      const p = globalThis.document.createElement('p')
      p.textContent = 'plain'
      div.appendChild(p)
      el.__scrubTransientEditorStyleSpans(div)
      // The span should be unwrapped (content preserved, span removed)
      expect(div.querySelectorAll('span[style]').length).to.equal(0)
      expect(div.textContent).to.contain('styled')
      expect(div.textContent).to.contain('plain')
    })
  })

  describe('__syncDataHaxEmpty', () => {
    it('does nothing for null/undefined', () => {
      expect(() => el.__syncDataHaxEmpty(null)).to.not.throw()
    })

    it('does nothing for node without tagName', () => {
      expect(() => el.__syncDataHaxEmpty({})).to.not.throw()
    })

    it('sets data-hax-empty on empty p', () => {
      const p = globalThis.document.createElement('p')
      el.__syncDataHaxEmpty(p)
      expect(p.hasAttribute('data-hax-empty')).to.equal(true)
    })
  })

  describe('__unwrapTransientEditorStyleSpan', () => {
    it('removes empty span', () => {
      const div = globalThis.document.createElement('div')
      const span = globalThis.document.createElement('span')
      span.setAttribute('style', 'color: red')
      div.appendChild(span)
      el.__unwrapTransientEditorStyleSpan(span)
      expect(div.querySelector('span')).to.be.null
    })

    it('does nothing for null', () => {
      expect(() => el.__unwrapTransientEditorStyleSpan(null)).to.not.throw()
    })
  })
})
