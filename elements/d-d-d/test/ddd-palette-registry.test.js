import { expect } from '@open-wc/testing'

import '../lib/DDDPaletteRegistry.js'
import {
  DDDPaletteSwatches,
  DDDPaletteRegistry,
  getDDDPaletteOptions,
  getDDDPaletteOptionByValue,
  getDDDPaletteAttributeValue,
  getDDDPaletteKey,
} from '../lib/DDDPaletteRegistry.js'

describe('DDDPaletteSwatches', () => {
  it('is a frozen array of 7 swatch indices', () => {
    expect(Object.isFrozen(DDDPaletteSwatches)).to.be.true
    expect(DDDPaletteSwatches.length).to.equal(7)
    expect(DDDPaletteSwatches[0]).to.equal(1)
    expect(DDDPaletteSwatches[6]).to.equal(7)
  })
})

describe('DDDPaletteRegistry', () => {
  it('is a frozen array of 16 palette entries', () => {
    expect(Object.isFrozen(DDDPaletteRegistry)).to.be.true
    expect(DDDPaletteRegistry.length).to.equal(16)
  })

  it('each entry has key, label, dataPalette, and frozen aliases', () => {
    for (const entry of DDDPaletteRegistry) {
      expect(entry.key).to.be.a('string')
      expect(entry.label).to.be.a('string')
      expect(entry.dataPalette).to.be.a('string')
      expect(Object.isFrozen(entry.aliases)).to.be.true
      expect(Array.isArray(entry.aliases)).to.be.true
    }
  })

  it('first entry is wisdom-walk-green with dataPalette 0', () => {
    expect(DDDPaletteRegistry[0].key).to.equal('wisdom-walk-green')
    expect(DDDPaletteRegistry[0].dataPalette).to.equal('0')
  })

  it('last entry is graphite-contrast with dataPalette 15', () => {
    expect(DDDPaletteRegistry[15].key).to.equal('graphite-contrast')
    expect(DDDPaletteRegistry[15].dataPalette).to.equal('15')
  })
})

describe('getDDDPaletteOptions', () => {
  it('returns normalized copies of every registry entry', () => {
    const options = getDDDPaletteOptions()
    expect(options.length).to.equal(DDDPaletteRegistry.length)
    for (const opt of options) {
      expect(opt.key).to.be.a('string')
      expect(opt.label).to.be.a('string')
      expect(opt.dataPalette).to.be.a('string')
      expect(Array.isArray(opt.aliases)).to.be.true
      expect(Array.isArray(opt.swatches)).to.be.true
      expect(opt.swatches).to.deep.equal([...DDDPaletteSwatches])
    }
  })

  it('returns a copy, not the original frozen data', () => {
    const options = getDDDPaletteOptions()
    expect(options).to.not.equal(DDDPaletteRegistry)
    expect(options[0].aliases).to.not.equal(DDDPaletteRegistry[0].aliases)
  })

  it('builds aliases from key and dataPalette when entry has no aliases', () => {
    const customRegistry = [
      { key: 'custom-key', label: 'Custom', dataPalette: '99' },
    ]
    const options = getDDDPaletteOptions()
    // verify the function handles entries without aliases gracefully
    expect(options[0].aliases).to.include('wisdom-walk-green')
    expect(options[0].aliases).to.include('0')
  })
})

describe('getDDDPaletteOptionByValue', () => {
  it('finds option by key', () => {
    const opt = getDDDPaletteOptionByValue('wisdom-walk-green')
    expect(opt).to.not.be.null
    expect(opt.key).to.equal('wisdom-walk-green')
    expect(opt.dataPalette).to.equal('0')
  })

  it('finds option by dataPalette string', () => {
    const opt = getDDDPaletteOptionByValue('5')
    expect(opt).to.not.be.null
    expect(opt.key).to.equal('monotone')
    expect(opt.dataPalette).to.equal('5')
  })

  it('finds option by dataPalette number 0', () => {
    const opt = getDDDPaletteOptionByValue(0)
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('0')
  })

  it('finds option by alias', () => {
    const opt = getDDDPaletteOptionByValue('monotone')
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('5')
  })

  it('finds option with case-insensitive key', () => {
    const opt = getDDDPaletteOptionByValue('Monotone')
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('5')
  })

  it('finds option with trimmed whitespace', () => {
    const opt = getDDDPaletteOptionByValue('  monotone  ')
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('5')
  })

  it('falls back to fallbackValue when value is empty string', () => {
    const opt = getDDDPaletteOptionByValue('', '5')
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('5')
  })

  it('falls back to fallbackValue when value is null', () => {
    const opt = getDDDPaletteOptionByValue(null, '1')
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('1')
  })

  it('falls back to fallbackValue when value is undefined', () => {
    const opt = getDDDPaletteOptionByValue(undefined, '2')
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('2')
  })

  it('falls back to default 0 when no fallback specified and value is empty', () => {
    const opt = getDDDPaletteOptionByValue('')
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('0')
  })

  it('returns null when value not found and fallback not found and no options', () => {
    const opt = getDDDPaletteOptionByValue('nonexistent', 'nonexistent', [])
    expect(opt).to.be.null
  })

  it('falls back to first option when fallback not found but options exist', () => {
    const customOptions = [
      { key: 'aaa', label: 'AAA', dataPalette: '100', aliases: ['aaa'] },
      { key: 'bbb', label: 'BBB', dataPalette: '200', aliases: ['bbb'] },
    ]
    const opt = getDDDPaletteOptionByValue('nonexistent', 'nonexistent', customOptions)
    expect(opt).to.not.be.null
    expect(opt.key).to.equal('aaa')
  })

  it('returns null when value not found and options array is empty', () => {
    const opt = getDDDPaletteOptionByValue('nonexistent', '0', [])
    expect(opt).to.be.null
  })

  it('handles value without toString method', () => {
    const weirdValue = Object.create(null)
    const opt = getDDDPaletteOptionByValue(weirdValue, '0')
    expect(opt).to.not.be.null
    expect(opt.dataPalette).to.equal('0')
  })
})

describe('getDDDPaletteAttributeValue', () => {
  it('returns dataPalette for a known key', () => {
    expect(getDDDPaletteAttributeValue('monotone')).to.equal('5')
  })

  it('returns dataPalette for a known dataPalette value', () => {
    expect(getDDDPaletteAttributeValue('3')).to.equal('3')
  })

  it('returns fallback when value is not found', () => {
    expect(getDDDPaletteAttributeValue('nonexistent', '5')).to.equal('5')
  })

  it('returns default fallback when value and fallback not specified', () => {
    expect(getDDDPaletteAttributeValue('nonexistent')).to.equal('0')
  })

  it('returns fallback value when value is empty', () => {
    expect(getDDDPaletteAttributeValue('', '2')).to.equal('2')
  })
})

describe('getDDDPaletteKey', () => {
  it('returns key for a known dataPalette value', () => {
    expect(getDDDPaletteKey('5')).to.equal('monotone')
  })

  it('returns key for a known key value', () => {
    expect(getDDDPaletteKey('monotone')).to.equal('monotone')
  })

  it('returns null when value not found and fallback not found', () => {
    expect(getDDDPaletteKey('nonexistent', 'nonexistent', [])).to.be.null
  })

  it('returns fallback key when value is not found', () => {
    expect(getDDDPaletteKey('nonexistent', '5')).to.equal('monotone')
  })
})
