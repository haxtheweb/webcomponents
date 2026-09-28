import { fixture, expect, html } from '@open-wc/testing'

import {
  SimpleColorsSharedStyles,
  SimpleColorsSharedStylesGlobal,
} from '../simple-colors-shared-styles.js'

// ---------------------------------------------------------------------------
// a11y smoke test (kept from the original scaffold)
// ---------------------------------------------------------------------------
describe('simple-colors-shared-styles test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <simple-colors-shared-styles
        title="test-title"
      ></simple-colors-shared-styles>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

// ---------------------------------------------------------------------------
// Data-shape tests: colors and contrasts objects
// ---------------------------------------------------------------------------
describe('SimpleColorsSharedStylesGlobal data', () => {
  it('has a colors object with all expected color keys', () => {
    const expectedKeys = [
      'grey',
      'red',
      'pink',
      'purple',
      'deep-purple',
      'indigo',
      'blue',
      'light-blue',
      'cyan',
      'teal',
      'green',
      'light-green',
      'lime',
      'yellow',
      'amber',
      'orange',
      'deep-orange',
      'brown',
      'blue-grey',
    ]
    for (const key of expectedKeys) {
      expect(SimpleColorsSharedStylesGlobal.colors).to.have.property(key)
    }
  })

  it('has 12 shades per color, each a hex string', () => {
    for (const key of Object.keys(SimpleColorsSharedStylesGlobal.colors)) {
      const shades = SimpleColorsSharedStylesGlobal.colors[key]
      expect(shades.length).to.equal(12, `${key} should have 12 shades`)
      for (const shade of shades) {
        expect(shade).to.match(/^#[0-9a-f]{6}$/i, `${key} shade ${shade} is hex`)
      }
    }
  })

  it('has a contrasts object with greyColor and colorColor', () => {
    const c = SimpleColorsSharedStylesGlobal.contrasts
    expect(c).to.have.property('greyColor')
    expect(c).to.have.property('colorColor')
  })

  it('has aaLarge and aa arrays of 12 entries each in contrasts', () => {
    const c = SimpleColorsSharedStylesGlobal.contrasts
    for (const group of ['greyColor', 'colorColor']) {
      for (const aa of ['aaLarge', 'aa']) {
        const arr = c[group][aa]
        expect(arr.length).to.equal(
          12,
          `${group}.${aa} should have 12 entries`,
        )
        for (const entry of arr) {
          expect(entry).to.have.property('min')
          expect(entry).to.have.property('max')
          expect(entry.min).to.be.a('number')
          expect(entry.max).to.be.a('number')
          expect(entry.min).to.be.at.least(1)
          expect(entry.max).to.be.at.most(12)
        }
      }
    }
  })
})

// ---------------------------------------------------------------------------
// makeVariable
// ---------------------------------------------------------------------------
describe('makeVariable', () => {
  it('returns the default variable when called with no args', () => {
    expect(SimpleColorsSharedStylesGlobal.makeVariable()).to.equal(
      '--simple-colors-default-theme-grey-1',
    )
  })

  it('builds a variable with color only (defaults shade=1, theme=default)', () => {
    expect(SimpleColorsSharedStylesGlobal.makeVariable('red')).to.equal(
      '--simple-colors-default-theme-red-1',
    )
  })

  it('builds a variable with color and shade', () => {
    expect(SimpleColorsSharedStylesGlobal.makeVariable('red', 5)).to.equal(
      '--simple-colors-default-theme-red-5',
    )
  })

  it('builds a variable with a multi-word color name', () => {
    expect(
      SimpleColorsSharedStylesGlobal.makeVariable('deep-purple', 12, 'fixed'),
    ).to.equal('--simple-colors-fixed-theme-deep-purple-12')
  })

  it('builds a fixed-theme variable', () => {
    expect(
      SimpleColorsSharedStylesGlobal.makeVariable('blue', 7, 'fixed'),
    ).to.equal('--simple-colors-fixed-theme-blue-7')
  })

  it('passes shade as a number in the string', () => {
    const v = SimpleColorsSharedStylesGlobal.makeVariable('green', 9)
    expect(v).to.equal('--simple-colors-default-theme-green-9')
  })
})

// ---------------------------------------------------------------------------
// getColorInfo
// ---------------------------------------------------------------------------
describe('getColorInfo', () => {
  it('parses a fixed-theme red variable', () => {
    const info = SimpleColorsSharedStylesGlobal.getColorInfo(
      '--simple-colors-fixed-theme-red-3',
    )
    expect(info.shade).to.equal('3')
    expect(info.theme).to.equal('--fixed')
  })

  it('parses a default-theme grey variable', () => {
    const info = SimpleColorsSharedStylesGlobal.getColorInfo(
      '--simple-colors-default-theme-grey-1',
    )
    expect(info.shade).to.equal('1')
    expect(info.theme).to.equal('--default')
  })

  it('parses a variable without the leading -- prefix (theme has no --)', () => {
    const info = SimpleColorsSharedStylesGlobal.getColorInfo(
      'simple-colors-fixed-theme-red-3-text',
    )
    expect(info.theme).to.equal('fixed')
    expect(info.shade).to.equal('3')
  })

  it('strips -text and -border suffixes', () => {
    const info = SimpleColorsSharedStylesGlobal.getColorInfo(
      'simple-colors-fixed-theme-blue-5-border',
    )
    expect(info.shade).to.equal('5')
  })

  it('falls back to color=grey, shade=1 when shade part is a single element', () => {
    // After stripping simple-colors- and splitting on -theme-,
    // the shade part is just "3" (no dashes), so temp2.length === 1
    const info = SimpleColorsSharedStylesGlobal.getColorInfo(
      'simple-colors-fixed-theme-3',
    )
    expect(info.color).to.equal('grey')
    expect(info.shade).to.equal('1')
  })

  it('throws TypeError for input without -theme- (temp1[1] is undefined)', () => {
    expect(() =>
      SimpleColorsSharedStylesGlobal.getColorInfo('red'),
    ).to.throw(TypeError)
  })

  it('throws TypeError for empty string input', () => {
    expect(() =>
      SimpleColorsSharedStylesGlobal.getColorInfo(''),
    ).to.throw(TypeError)
  })
})

// ---------------------------------------------------------------------------
// getContrastingShades
// ---------------------------------------------------------------------------
describe('getContrastingShades', () => {
  it('returns shades 7-12 for grey shade 1, large text (greyColor)', () => {
    const shades =
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        true,
        'grey',
        1,
        'grey',
      )
    expect(shades).to.deep.equal([7, 8, 9, 10, 11, 12])
  })

  it('returns shades 7-12 for grey shade 1, small text (greyColor)', () => {
    const shades =
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        false,
        'grey',
        1,
        'grey',
      )
    expect(shades).to.deep.equal([7, 8, 9, 10, 11, 12])
  })

  it('uses colorColor table when neither color is grey', () => {
    const shades =
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        true,
        'red',
        7,
        'blue',
      )
    // colorColor.aaLarge index 7 = { min: 1, max: 3 }
    expect(shades).to.deep.equal([1, 2, 3])
  })

  it('uses greyColor table when one color is grey', () => {
    const shades =
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        true,
        'red',
        6,
        'grey',
      )
    // greyColor.aaLarge index 6 = { min: 1, max: 3 }
    expect(shades).to.deep.equal([1, 2, 3])
  })

  it('large vs small text give different results for colorColor shade 1', () => {
    const large =
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        true,
        'red',
        1,
        'blue',
      )
    const small =
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        false,
        'red',
        1,
        'blue',
      )
    // colorColor.aaLarge[1] = {min:7,max:12}, colorColor.aa[1] = {min:8,max:12}
    expect(large).to.deep.equal([7, 8, 9, 10, 11, 12])
    expect(small).to.deep.equal([8, 9, 10, 11, 12])
  })

  it('handles shade 0 (index 0)', () => {
    const shades =
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        true,
        'grey',
        0,
        'grey',
      )
    expect(shades).to.deep.equal([7, 8, 9, 10, 11, 12])
  })

  it('handles string shade values ("3")', () => {
    const shades =
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        true,
        'grey',
        '3',
        'grey',
      )
    expect(shades).to.deep.equal([7, 8, 9, 10, 11, 12])
  })

  it('throws for out-of-range shade 12 (index 12 is undefined)', () => {
    expect(() =>
      SimpleColorsSharedStylesGlobal.getContrastingShades(
        true,
        'grey',
        12,
        'grey',
      ),
    ).to.throw(TypeError)
  })
})

// ---------------------------------------------------------------------------
// getContrastingColors
// ---------------------------------------------------------------------------
describe('getContrastingColors', () => {
  it('returns an object keyed by every color name', () => {
    const result =
      SimpleColorsSharedStylesGlobal.getContrastingColors('red', 1, true)
    const colorKeys = Object.keys(SimpleColorsSharedStylesGlobal.colors)
    for (const key of colorKeys) {
      expect(result).to.have.property(key)
    }
  })

  it('each value is an array of shade numbers', () => {
    const result =
      SimpleColorsSharedStylesGlobal.getContrastingColors('grey', 1, true)
    for (const key of Object.keys(result)) {
      expect(result[key]).to.be.an('array')
      expect(result[key].length).to.be.greaterThan(0)
    }
  })

  it('grey contrast values match getContrastingShades for each color', () => {
    const result =
      SimpleColorsSharedStylesGlobal.getContrastingColors('grey', 1, true)
    for (const color of Object.keys(SimpleColorsSharedStylesGlobal.colors)) {
      const direct =
        SimpleColorsSharedStylesGlobal.getContrastingShades(
          true,
          'grey',
          1,
          color,
        )
      expect(result[color]).to.deep.equal(direct, `mismatch for ${color}`)
    }
  })

  it('passes isLarge through to getContrastingShades', () => {
    const largeResult =
      SimpleColorsSharedStylesGlobal.getContrastingColors('red', 1, true)
    const smallResult =
      SimpleColorsSharedStylesGlobal.getContrastingColors('red', 1, false)
    // colorColor.aaLarge[1] vs aa[1] for a non-grey color
    const largeBlue = largeResult['blue']
    const smallBlue = smallResult['blue']
    // colorColor.aaLarge[1]={min:7,max:12}, colorColor.aa[1]={min:8,max:12}
    expect(largeBlue).to.deep.equal([7, 8, 9, 10, 11, 12])
    expect(smallBlue).to.deep.equal([8, 9, 10, 11, 12])
  })
})

// ---------------------------------------------------------------------------
// isContrastCompliant (has a typo bug: "ontrastShade" instead of
// "contrastShade" — see completion message)
// ---------------------------------------------------------------------------
describe('isContrastCompliant', () => {
  it('returns false when contrastShade is below range.min (short-circuit)', () => {
    // greyColor.aaLarge index 2 = {min:7, max:12}, shade 1 < 7 -> false
    const result =
      SimpleColorsSharedStylesGlobal.isContrastCompliant(
        true,
        'grey',
        1,
        'grey',
        1,
      )
    expect(result).to.equal(false)
  })

  it('throws ReferenceError when contrastShade >= range.min (hits ontrastShade typo)', () => {
    // greyColor.aaLarge index 2 = {min:7, max:12}, shade 7 >= 7 -> evaluates ontrastShade
    expect(() =>
      SimpleColorsSharedStylesGlobal.isContrastCompliant(
        true,
        'grey',
        1,
        'grey',
        7,
      ),
    ).to.throw(ReferenceError)
  })

  it('returns false for colorColor path below min', () => {
    // colorColor.aaLarge index 2 = {min:8, max:12}, shade 1 < 8 -> false
    const result =
      SimpleColorsSharedStylesGlobal.isContrastCompliant(
        true,
        'red',
        1,
        'blue',
        1,
      )
    expect(result).to.equal(false)
  })

  it('throws ReferenceError for colorColor path at or above min', () => {
    // colorColor.aaLarge index 2 = {min:8, max:12}, shade 8 >= 8 -> evaluates ontrastShade
    expect(() =>
      SimpleColorsSharedStylesGlobal.isContrastCompliant(
        true,
        'red',
        1,
        'blue',
        8,
      ),
    ).to.throw(ReferenceError)
  })

  it('returns false for small text (isLarge=false) below min', () => {
    // greyColor.aa index 2 = {min:7, max:12}, shade 1 < 7 -> false
    const result =
      SimpleColorsSharedStylesGlobal.isContrastCompliant(
        false,
        'grey',
        1,
        'grey',
        1,
      )
    expect(result).to.equal(false)
  })

  it('throws ReferenceError for small text (isLarge=false) at or above min', () => {
    // greyColor.aa index 2 = {min:7, max:12}, shade 7 >= 7 -> evaluates ontrastShade
    expect(() =>
      SimpleColorsSharedStylesGlobal.isContrastCompliant(
        false,
        'grey',
        1,
        'grey',
        7,
      ),
    ).to.throw(ReferenceError)
  })
})

// ---------------------------------------------------------------------------
// indexToShade / shadeToIndex
// ---------------------------------------------------------------------------
describe('indexToShade', () => {
  it('returns 1 for index 0', () => {
    expect(SimpleColorsSharedStylesGlobal.indexToShade(0)).to.equal(1)
  })

  it('returns 6 for index 5', () => {
    expect(SimpleColorsSharedStylesGlobal.indexToShade(5)).to.equal(6)
  })

  it('parses string index', () => {
    expect(SimpleColorsSharedStylesGlobal.indexToShade('3')).to.equal(4)
  })
})

describe('shadeToIndex', () => {
  it('returns 0 for shade 1', () => {
    expect(SimpleColorsSharedStylesGlobal.shadeToIndex(1)).to.equal(0)
  })

  it('returns 5 for shade 6', () => {
    expect(SimpleColorsSharedStylesGlobal.shadeToIndex(6)).to.equal(5)
  })

  it('parses string shade', () => {
    expect(SimpleColorsSharedStylesGlobal.shadeToIndex('12')).to.equal(11)
  })
})

// ---------------------------------------------------------------------------
// requestAvailability singleton
// ---------------------------------------------------------------------------
describe('requestAvailability', () => {
  it('returns the same instance on repeated calls', () => {
    const a = globalThis.SimpleColorsSharedStyles.requestAvailability()
    const b = globalThis.SimpleColorsSharedStyles.requestAvailability()
    expect(a).to.equal(b)
  })

  it('sets colors and contrasts on the global object', () => {
    globalThis.SimpleColorsSharedStyles.requestAvailability()
    expect(globalThis.SimpleColorsSharedStyles.colors).to.exist
    expect(globalThis.SimpleColorsSharedStyles.contrasts).to.exist
    expect(globalThis.SimpleColorsSharedStyles.colors).to.equal(
      globalThis.SimpleColorsSharedStyles.instance.colors,
    )
  })

  it('appends a stylesheet to document.head', () => {
    globalThis.SimpleColorsSharedStyles.requestAvailability()
    expect(globalThis.SimpleColorsSharedStyles.stylesheet).to.exist
    expect(
      globalThis.document.head.contains(
        globalThis.SimpleColorsSharedStyles.stylesheet,
      ),
    ).to.equal(true)
  })
})

// ---------------------------------------------------------------------------
// Class static properties
// ---------------------------------------------------------------------------
describe('SimpleColorsSharedStyles class', () => {
  it('has the correct tag name', () => {
    expect(SimpleColorsSharedStyles.tag).to.equal(
      'simple-colors-shared-styles',
    )
  })
})
