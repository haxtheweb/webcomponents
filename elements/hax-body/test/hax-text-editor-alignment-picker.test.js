import { fixture, expect, html } from '@open-wc/testing'

import '../lib/buttons/hax-text-editor-alignment-picker.js'
import { HaxTextEditorAlignmentPicker } from '../lib/buttons/hax-text-editor-alignment-picker.js'

describe('hax-text-editor-alignment-picker', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<hax-text-editor-alignment-picker></hax-text-editor-alignment-picker>`,
    )
    await el.updateComplete
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-text-editor-alignment-picker')
    expect(el._isRTL).to.equal(false)
    expect(el.allowNull).to.equal(true)
    expect(el.icon).to.equal('editor:format-align-left')
  })

  it('has static tag', () => {
    expect(HaxTextEditorAlignmentPicker.tag).to.equal(
      'hax-text-editor-alignment-picker',
    )
  })

  it('has LTR alignments by default', () => {
    expect(el.alignments.length).to.equal(3)
    expect(el.alignments[0].label).to.equal('Left')
    expect(el.alignments[1].label).to.equal('Center')
    expect(el.alignments[2].label).to.equal('Right')
  })

  describe('_updateAlignments', () => {
    it('sets RTL alignments when _isRTL is true', () => {
      el._isRTL = true
      el._updateAlignments()
      expect(el.alignments[0].label).to.equal('Right')
      expect(el.alignments[2].label).to.equal('Left')
      expect(el.icon).to.equal('editor:format-align-right')
    })

    it('sets LTR alignments when _isRTL is false', () => {
      el._isRTL = false
      el._updateAlignments()
      expect(el.alignments[0].label).to.equal('Left')
      expect(el.alignments[2].label).to.equal('Right')
      expect(el.icon).to.equal('editor:format-align-left')
    })
  })

  describe('_setOptions', () => {
    it('maps alignments to options', () => {
      el.alignments = [
        { label: 'X', value: 'x', icon: 'i1' },
        { label: 'Y', value: 'y', icon: 'i2' },
      ]
      el._setOptions()
      expect(el.options.length).to.equal(2)
      expect(el.options[0][0].alt).to.equal('X')
      expect(el.options[0][0].value).to.equal('x')
    })
  })

  describe('rangeOrMatchingAncestor', () => {
    it('returns null when no range', () => {
      el.range = null
      expect(el.rangeOrMatchingAncestor()).to.be.null
    })

    it('finds block-level ancestor', () => {
      const div = globalThis.document.createElement('div')
      const p = globalThis.document.createElement('p')
      div.appendChild(p)
      globalThis.document.body.appendChild(div)
      const range = globalThis.document.createRange()
      range.selectNodeContents(p)
      el.range = range
      const result = el.rangeOrMatchingAncestor()
      expect(result).to.equal(p)
      div.remove()
    })

    it('returns null when reaching body', () => {
      const span = globalThis.document.createElement('span')
      globalThis.document.body.appendChild(span)
      const range = globalThis.document.createRange()
      range.selectNodeContents(span)
      el.range = range
      const result = el.rangeOrMatchingAncestor()
      // span is not in tagsList, walks up to body
      expect(result).to.be.null
      span.remove()
    })
  })

  describe('_detectRTL', () => {
    it('sets _isRTL false when no range', () => {
      el.range = null
      el._detectRTL()
      expect(el._isRTL).to.equal(false)
    })
  })

  describe('_pickerChange', () => {
    it('does nothing when no range', () => {
      el.range = null
      expect(() => el._pickerChange({ detail: { value: 'center' } })).to.not.throw()
    })

    it('sets data-text-align attribute on ancestor', () => {
      const p = globalThis.document.createElement('p')
      globalThis.document.body.appendChild(p)
      const range = globalThis.document.createRange()
      range.selectNodeContents(p)
      el.range = range
      el._pickerChange({ detail: { value: 'center' } })
      expect(p.getAttribute('data-text-align')).to.equal('center')
      p.remove()
    })

    it('removes data-text-align when value is empty', () => {
      const p = globalThis.document.createElement('p')
      p.setAttribute('data-text-align', 'center')
      globalThis.document.body.appendChild(p)
      const range = globalThis.document.createRange()
      range.selectNodeContents(p)
      el.range = range
      el._pickerChange({ detail: { value: '' } })
      expect(p.hasAttribute('data-text-align')).to.equal(false)
      p.remove()
    })

    it('updates icon based on alignment value', () => {
      const p = globalThis.document.createElement('p')
      globalThis.document.body.appendChild(p)
      const range = globalThis.document.createRange()
      range.selectNodeContents(p)
      el.range = range
      el._pickerChange({ detail: { value: 'right' } })
      expect(el.icon).to.equal('editor:format-align-right')
      p.remove()
    })

    it('dispatches command event', async () => {
      const p = globalThis.document.createElement('p')
      globalThis.document.body.appendChild(p)
      const range = globalThis.document.createRange()
      range.selectNodeContents(p)
      el.range = range
      let commandEvent = null
      el.addEventListener('command', (e) => {
        commandEvent = e
      })
      el._pickerChange({ detail: { value: 'center' } })
      expect(commandEvent).to.exist
      expect(commandEvent.detail.command).to.equal('setAlignment')
      expect(commandEvent.detail.value).to.equal('center')
      p.remove()
    })
  })
})
