import { fixture, expect, html } from '@open-wc/testing'
import { LitElement, css } from 'lit'

import '../simple-colors.js'
import { SimpleColorsSuper } from '../simple-colors.js'
import { SimpleColorsSharedStylesGlobal } from '@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js'

// ---------------------------------------------------------------------------
// a11y smoke test (kept from the original scaffold)
// ---------------------------------------------------------------------------
describe('simple-colors test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <simple-colors title="test-title"></simple-colors>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

// ---------------------------------------------------------------------------
// Default property values
// ---------------------------------------------------------------------------
describe('simple-colors defaults', () => {
  it('defaults accentColor to "grey"', async () => {
    const el = await fixture(html` <simple-colors></simple-colors> `)
    expect(el.accentColor).to.equal('grey')
  })

  it('defaults dark to false', async () => {
    const el = await fixture(html` <simple-colors></simple-colors> `)
    expect(el.dark).to.equal(false)
  })

  it('gets colors from SimpleColorsSharedStylesGlobal', async () => {
    const el = await fixture(html` <simple-colors></simple-colors> `)
    expect(el.colors).to.equal(SimpleColorsSharedStylesGlobal.colors)
  })

  it('has tag "simple-colors"', async () => {
    const el = await fixture(html` <simple-colors></simple-colors> `)
    expect(el.constructor.tag).to.equal('simple-colors')
  })
})

// ---------------------------------------------------------------------------
// accentColor attribute reflection
// ---------------------------------------------------------------------------
describe('accentColor attribute reflection', () => {
  it('reflects accent-color attribute to property', async () => {
    const el = await fixture(html`
      <simple-colors accent-color="red"></simple-colors>
    `)
    expect(el.accentColor).to.equal('red')
  })

  it('reflects property to attribute', async () => {
    const el = await fixture(html` <simple-colors></simple-colors> `)
    el.accentColor = 'blue'
    await el.updateComplete
    expect(el.getAttribute('accent-color')).to.equal('blue')
  })

  it('updates attribute when property changes', async () => {
    const el = await fixture(html`
      <simple-colors accent-color="green"></simple-colors>
    `)
    expect(el.getAttribute('accent-color')).to.equal('green')
    el.accentColor = 'purple'
    await el.updateComplete
    expect(el.getAttribute('accent-color')).to.equal('purple')
  })
})

// ---------------------------------------------------------------------------
// dark attribute reflection
// ---------------------------------------------------------------------------
describe('dark attribute reflection', () => {
  it('reflects dark attribute to property', async () => {
    const el = await fixture(html`
      <simple-colors dark></simple-colors>
    `)
    expect(el.dark).to.equal(true)
  })

  it('reflects dark property to attribute', async () => {
    const el = await fixture(html` <simple-colors></simple-colors> `)
    el.dark = true
    await el.updateComplete
    expect(el.hasAttribute('dark')).to.equal(true)
  })

  it('removes dark attribute when property set to false', async () => {
    const el = await fixture(html`
      <simple-colors dark></simple-colors>
    `)
    expect(el.hasAttribute('dark')).to.equal(true)
    el.dark = false
    await el.updateComplete
    expect(el.hasAttribute('dark')).to.equal(false)
  })
})

// ---------------------------------------------------------------------------
// CSS custom properties on host
// ---------------------------------------------------------------------------
describe('CSS custom properties', () => {
  it('sets --simple-colors-default-theme-accent-7 on host', async () => {
    const el = await fixture(html` <simple-colors></simple-colors> `)
    await el.updateComplete
    const computed = getComputedStyle(el)
    // With accent-color="grey" (default), accent-7 is #666666
    expect(computed.getPropertyValue('--simple-colors-default-theme-accent-7').trim()).to.equal('#666666')
  })

  it('overrides accent variables when accent-color is set', async () => {
    const el = await fixture(html`
      <simple-colors accent-color="red"></simple-colors>
    `)
    await el.updateComplete
    const computed = getComputedStyle(el)
    // With accent-color="red", accent-7 is #ee0000
    expect(computed.getPropertyValue('--simple-colors-default-theme-accent-7').trim()).to.equal('#ee0000')
  })

  it('inverts accent variables when dark is set', async () => {
    const el = await fixture(html`
      <simple-colors dark accent-color="red"></simple-colors>
    `)
    await el.updateComplete
    const computed = getComputedStyle(el)
    // With dark + accent-color="red", accent-7 is #ff2222 (inverted)
    expect(computed.getPropertyValue('--simple-colors-default-theme-accent-7').trim()).to.equal('#ff2222')
  })

  it('sets fixed-theme accent variables for accent-color', async () => {
    const el = await fixture(html`
      <simple-colors accent-color="blue"></simple-colors>
    `)
    await el.updateComplete
    const computed = getComputedStyle(el)
    // fixed-theme accent-7 for blue is #0059ff
    expect(computed.getPropertyValue('--simple-colors-fixed-theme-accent-7').trim()).to.equal('#0059ff')
  })
})

// ---------------------------------------------------------------------------
// Passthrough methods — these delegate to SimpleColorsSharedStylesGlobal
// ---------------------------------------------------------------------------
describe('passthrough methods', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html` <simple-colors></simple-colors> `)
  })

  // -- getColorInfo --------------------------------------------------------
  describe('getColorInfo', () => {
    it('matches SimpleColorsSharedStylesGlobal.getColorInfo', () => {
      const input = '--simple-colors-fixed-theme-red-3'
      expect(el.getColorInfo(input)).to.deep.equal(
        SimpleColorsSharedStylesGlobal.getColorInfo(input),
      )
    })

    it('matches for a multi-word color variable', () => {
      const input = '--simple-colors-default-theme-deep-purple-12'
      expect(el.getColorInfo(input)).to.deep.equal(
        SimpleColorsSharedStylesGlobal.getColorInfo(input),
      )
    })

    it('falls back to default info for input without -theme-', () => {
      expect(el.getColorInfo('red')).to.deep.equal(
        SimpleColorsSharedStylesGlobal.getColorInfo('red'),
      )
    })
  })

  // -- makeVariable --------------------------------------------------------
  describe('makeVariable', () => {
    it('returns a CSS variable string', () => {
      expect(el.makeVariable()).to.be.a('string')
      expect(el.makeVariable()).to.include('--simple-colors')
    })

    it('passes caller arguments through to the shared styles global', () => {
      expect(el.makeVariable('red', 5, 'fixed')).to.equal(
        '--simple-colors-fixed-theme-red-5',
      )
      expect(el.makeVariable('deep-purple', 12, 'fixed')).to.equal(
        '--simple-colors-fixed-theme-deep-purple-12',
      )
    })

    it('matches SimpleColorsSharedStylesGlobal.makeVariable with defaults', () => {
      expect(el.makeVariable()).to.equal(
        SimpleColorsSharedStylesGlobal.makeVariable(),
      )
    })
  })

  // -- getContrastingColors ------------------------------------------------
  describe('getContrastingColors', () => {
    it('matches SimpleColorsSharedStylesGlobal.getContrastingColors', () => {
      const result = el.getContrastingColors('grey', 1, true)
      const direct =
        SimpleColorsSharedStylesGlobal.getContrastingColors('grey', 1, true)
      expect(result).to.deep.equal(direct)
    })

    it('returns an object with all color keys', () => {
      const result = el.getContrastingColors('red', 6, false)
      for (const key of Object.keys(SimpleColorsSharedStylesGlobal.colors)) {
        expect(result).to.have.property(key)
      }
    })
  })

  // -- getContrastingShades ------------------------------------------------
  describe('getContrastingShades', () => {
    it('matches SimpleColorsSharedStylesGlobal.getContrastingShades', () => {
      const result = el.getContrastingShades(true, 'grey', 1, 'grey')
      const direct =
        SimpleColorsSharedStylesGlobal.getContrastingShades(
          true,
          'grey',
          1,
          'grey',
        )
      expect(result).to.deep.equal(direct)
    })

    it('returns an array of shade numbers', () => {
      const result = el.getContrastingShades(true, 'red', 6, 'grey')
      expect(result).to.be.an('array')
      // greyColor.aaLarge shade 6 (index 5) = { min: 10, max: 12 }
      expect(result).to.deep.equal([10, 11, 12])
    })

    it('handles the darkest shade 12 (same as shared-styles)', () => {
      expect(el.getContrastingShades(true, 'grey', 12, 'grey')).to.deep.equal([
        1, 2, 3, 4, 5, 6,
      ])
    })
  })

  // -- isContrastCompliant -------------------------------------------------
  describe('isContrastCompliant', () => {
    it('returns false when contrastShade below range.min', () => {
      expect(el.isContrastCompliant(true, 'grey', 1, 'grey', 1)).to.equal(false)
    })

    it('returns true when contrastShade is inside the range', () => {
      expect(el.isContrastCompliant(true, 'grey', 1, 'grey', 7)).to.equal(true)
    })

    it('returns false when contrastShade is above range.max', () => {
      // greyColor.aaLarge shade 7 (index 6) = {min:1, max:3}
      expect(el.isContrastCompliant(true, 'grey', 7, 'grey', 7)).to.equal(false)
    })
  })

  // -- invertShade ---------------------------------------------------------
  describe('invertShade', () => {
    it('delegates to SimpleColorsSharedStylesGlobal.invertShade', () => {
      expect(el.invertShade(1)).to.equal(12)
      expect(el.invertShade(5)).to.equal(8)
      expect(el.invertShade('12')).to.equal(1)
    })
  })
})

// ---------------------------------------------------------------------------
// render template
// ---------------------------------------------------------------------------
describe('render', () => {
  it('renders a slot in shadow DOM', async () => {
    const el = await fixture(html` <simple-colors></simple-colors> `)
    await el.updateComplete
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
  })
})

// ---------------------------------------------------------------------------
// SimpleColorsSuper mixin — styles composition
// ---------------------------------------------------------------------------
describe('SimpleColorsSuper mixin styles', () => {
  it('composes super.styles when the base class provides them', () => {
    // BaseWithStyles has a static styles getter that returns truthy,
    // so the if (super.styles) true-branch in the mixin is exercised.
    class BaseWithStyles extends LitElement {
      static get styles() {
        return css`:host { color: red; }`
      }
    }
    class TestColorsWithSuperStyles extends SimpleColorsSuper(BaseWithStyles) {}
    const styles = TestColorsWithSuperStyles.styles
    // mixin returns [super.styles, css`...`] — 2 entries
    expect(styles).to.be.an('array')
    expect(styles.length).to.equal(2)
  })

  it('uses empty css when base class has no styles', () => {
    class BaseNoStyles extends LitElement {}
    class TestColorsNoSuperStyles extends SimpleColorsSuper(BaseNoStyles) {}
    const styles = TestColorsNoSuperStyles.styles
    expect(styles).to.be.an('array')
    expect(styles.length).to.equal(2)
  })
})
