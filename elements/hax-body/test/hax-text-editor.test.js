import { fixture, expect, html } from '@open-wc/testing'

import '../lib/hax-text-editor.js'
import { HaxTextEditor } from '../lib/hax-text-editor.js'

describe('hax-text-editor', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-text-editor></hax-text-editor>`)
    await el.updateComplete
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-text-editor')
    expect(el.haxUIElement).to.equal(true)
    expect(el.type).to.equal('hax-text-editor-toolbar')
  })

  it('has static tag', () => {
    expect(HaxTextEditor.tag).to.equal('hax-text-editor')
  })

  describe('haxHooks', () => {
    it('returns activeElementChanged hook', () => {
      const hooks = el.haxHooks()
      expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    })
  })

  describe('haxactiveElementChanged', () => {
    it('returns element when val is true', () => {
      const testEl = globalThis.document.createElement('p')
      const result = el.haxactiveElementChanged(testEl, true)
      expect(result).to.equal(testEl)
    })

    it('overwrites innerHTML from getValue when val is false and el exists', () => {
      const testEl = globalThis.document.createElement('p')
      testEl.innerHTML = 'old'
      el.getValue = () => 'new content'
      const result = el.haxactiveElementChanged(testEl, false)
      expect(testEl.innerHTML).to.equal('new content')
      expect(result).to.equal(testEl)
    })

    it('returns element when val is false and no el', () => {
      const result = el.haxactiveElementChanged(null, false)
      expect(result).to.be.null
    })
  })
})
