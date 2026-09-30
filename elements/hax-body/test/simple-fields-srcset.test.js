import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../lib/simple-fields-srcset.js'
import { SimpleFieldsSrcset } from '../lib/simple-fields-srcset.js'

describe('simple-fields-srcset', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-fields-srcset></simple-fields-srcset>`)
    await el.updateComplete
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('simple-fields-srcset')
    expect(el.__rows).to.deep.equal([])
    expect(el.value).to.be.undefined
  })

  describe('_parseSrcset', () => {
    it('parses simple url only', () => {
      const rows = el._parseSrcset('image.jpg')
      expect(rows.length).to.equal(1)
      expect(rows[0].url).to.equal('image.jpg')
      expect(rows[0].descriptor).to.equal('')
    })

    it('parses url with width descriptor', () => {
      const rows = el._parseSrcset('small.jpg 480w')
      expect(rows.length).to.equal(1)
      expect(rows[0].url).to.equal('small.jpg')
      expect(rows[0].descriptor).to.equal('480w')
    })

    it('parses multiple entries', () => {
      const rows = el._parseSrcset('small.jpg 480w, large.jpg 800w')
      expect(rows.length).to.equal(2)
      expect(rows[0].url).to.equal('small.jpg')
      expect(rows[0].descriptor).to.equal('480w')
      expect(rows[1].url).to.equal('large.jpg')
      expect(rows[1].descriptor).to.equal('800w')
    })

    it('returns empty for null/undefined', () => {
      expect(el._parseSrcset(null)).to.deep.equal([])
      expect(el._parseSrcset(undefined)).to.deep.equal([])
    })

    it('returns empty for empty string', () => {
      expect(el._parseSrcset('')).to.deep.equal([])
    })

    it('returns empty for non-string', () => {
      expect(el._parseSrcset(123)).to.deep.equal([])
      expect(el._parseSrcset({})).to.deep.equal([])
    })

    it('filters entries with empty url', () => {
      const rows = el._parseSrcset(' , 480w')
      // '480w' is treated as a url (no space separator), so it stays
      expect(rows.length).to.equal(1)
      expect(rows[0].url).to.equal('480w')
    })

    it('trims entries', () => {
      const rows = el._parseSrcset('  small.jpg   480w  ')
      expect(rows[0].url).to.equal('small.jpg')
      expect(rows[0].descriptor).to.equal('480w')
    })

    it('handles density descriptor', () => {
      const rows = el._parseSrcset('img.jpg 2x')
      expect(rows[0].url).to.equal('img.jpg')
      expect(rows[0].descriptor).to.equal('2x')
    })
  })

  describe('_serializeSrcset', () => {
    it('serializes url only', () => {
      const result = el._serializeSrcset([{ url: 'a.jpg', descriptor: '' }])
      expect(result).to.equal('a.jpg')
    })

    it('serializes url with descriptor', () => {
      const result = el._serializeSrcset([
        { url: 'a.jpg', descriptor: '480w' },
      ])
      expect(result).to.equal('a.jpg 480w')
    })

    it('serializes multiple rows', () => {
      const result = el._serializeSrcset([
        { url: 'a.jpg', descriptor: '480w' },
        { url: 'b.jpg', descriptor: '800w' },
      ])
      expect(result).to.equal('a.jpg 480w, b.jpg 800w')
    })

    it('skips rows with empty url', () => {
      const result = el._serializeSrcset([
        { url: '', descriptor: '480w' },
        { url: 'b.jpg', descriptor: '800w' },
      ])
      expect(result).to.equal('b.jpg 800w')
    })

    it('handles null/undefined rows', () => {
      expect(el._serializeSrcset(null)).to.equal('')
      expect(el._serializeSrcset(undefined)).to.equal('')
    })

    it('trims url and descriptor', () => {
      const result = el._serializeSrcset([
        { url: '  a.jpg  ', descriptor: '  480w  ' },
      ])
      expect(result).to.equal('a.jpg 480w')
    })
  })

  describe('_rowsEqual', () => {
    it('returns true for identical rows', () => {
      const a = [{ url: 'x.jpg', descriptor: '1x' }]
      const b = [{ url: 'x.jpg', descriptor: '1x' }]
      expect(el._rowsEqual(a, b)).to.equal(true)
    })

    it('returns false for different urls', () => {
      const a = [{ url: 'x.jpg', descriptor: '1x' }]
      const b = [{ url: 'y.jpg', descriptor: '1x' }]
      expect(el._rowsEqual(a, b)).to.equal(false)
    })

    it('returns false for different descriptors', () => {
      const a = [{ url: 'x.jpg', descriptor: '1x' }]
      const b = [{ url: 'x.jpg', descriptor: '2x' }]
      expect(el._rowsEqual(a, b)).to.equal(false)
    })

    it('returns false for different lengths', () => {
      const a = [{ url: 'x.jpg', descriptor: '1x' }]
      const b = [
        { url: 'x.jpg', descriptor: '1x' },
        { url: 'y.jpg', descriptor: '2x' },
      ]
      expect(el._rowsEqual(a, b)).to.equal(false)
    })

    it('returns false for non-arrays', () => {
      expect(el._rowsEqual(null, [])).to.equal(false)
      expect(el._rowsEqual([], null)).to.equal(false)
    })
  })

  describe('_addRow', () => {
    it('adds a new empty row', async () => {
      el.__rows = []
      el._addRow()
      expect(el.__rows.length).to.equal(1)
      expect(el.__rows[0].url).to.equal('')
      expect(el.__rows[0].descriptor).to.equal('')
    })

    it('does nothing when disabled', () => {
      el.disabled = true
      el.__rows = []
      el._addRow()
      expect(el.__rows.length).to.equal(0)
    })

    it('updates value to serialized form', () => {
      el.__rows = [{ url: 'a.jpg', descriptor: '1x' }]
      el._addRow()
      expect(el.value).to.equal('a.jpg 1x')
    })
  })

  describe('_removeRow', () => {
    it('removes row at index', () => {
      el.__rows = [
        { url: 'a.jpg', descriptor: '1x' },
        { url: 'b.jpg', descriptor: '2x' },
      ]
      el._removeRow(0)
      expect(el.__rows.length).to.equal(1)
      expect(el.__rows[0].url).to.equal('b.jpg')
    })

    it('does nothing when disabled', () => {
      el.disabled = true
      el.__rows = [{ url: 'a.jpg', descriptor: '1x' }]
      el._removeRow(0)
      expect(el.__rows.length).to.equal(1)
    })
  })

  describe('_moveRow', () => {
    it('moves row up', () => {
      el.__rows = [
        { url: 'a.jpg', descriptor: '1x' },
        { url: 'b.jpg', descriptor: '2x' },
      ]
      el._moveRow(1, -1)
      expect(el.__rows[0].url).to.equal('b.jpg')
      expect(el.__rows[1].url).to.equal('a.jpg')
    })

    it('moves row down', () => {
      el.__rows = [
        { url: 'a.jpg', descriptor: '1x' },
        { url: 'b.jpg', descriptor: '2x' },
      ]
      el._moveRow(0, 1)
      expect(el.__rows[0].url).to.equal('b.jpg')
      expect(el.__rows[1].url).to.equal('a.jpg')
    })

    it('does not move beyond bounds (top)', () => {
      el.__rows = [
        { url: 'a.jpg', descriptor: '1x' },
        { url: 'b.jpg', descriptor: '2x' },
      ]
      el._moveRow(0, -1)
      expect(el.__rows[0].url).to.equal('a.jpg')
    })

    it('does not move beyond bounds (bottom)', () => {
      el.__rows = [
        { url: 'a.jpg', descriptor: '1x' },
        { url: 'b.jpg', descriptor: '2x' },
      ]
      el._moveRow(1, 1)
      expect(el.__rows[1].url).to.equal('b.jpg')
    })

    it('does nothing when disabled', () => {
      el.disabled = true
      el.__rows = [
        { url: 'a.jpg', descriptor: '1x' },
        { url: 'b.jpg', descriptor: '2x' },
      ]
      el._moveRow(0, 1)
      expect(el.__rows[0].url).to.equal('a.jpg')
    })
  })

  describe('_rowInput', () => {
    it('updates descriptor field', () => {
      el.__rows = [{ url: 'a.jpg', descriptor: '' }]
      el._rowInput(0, 'descriptor', { target: { value: '480w' } })
      expect(el.__rows[0].descriptor).to.equal('480w')
    })
  })

  describe('value round-trip via updated()', () => {
    it('parses value into rows when value set externally', async () => {
      el.value = 'a.jpg 480w, b.jpg 800w'
      await el.updateComplete
      expect(el.__rows.length).to.equal(2)
      expect(el.__rows[0].url).to.equal('a.jpg')
      expect(el.__rows[1].url).to.equal('b.jpg')
    })
  })
})
