import { expect } from '@open-wc/testing'

import '../lib/DDDStyleGuidePresets.js'
import {
  DDDStyleGuidePresets,
  getDDDStyleGuidePresetByKey,
  getDDDStyleGuideOptionsForTag,
  getDDDStyleGuidePresetManagedAttributes,
  getDDDStyleGuideDefaultPresetForTag,
  getDDDStyleGuideSchemaOverride,
} from '../lib/DDDStyleGuidePresets.js'

describe('DDDStyleGuidePresets data', () => {
  it('has expected preset keys', () => {
    expect(DDDStyleGuidePresets['style-1']).to.exist
    expect(DDDStyleGuidePresets.headline).to.exist
    expect(DDDStyleGuidePresets.byline).to.exist
    expect(DDDStyleGuidePresets.pullQuote).to.exist
    expect(DDDStyleGuidePresets.statBlock).to.exist
    expect(DDDStyleGuidePresets.calloutInfo).to.exist
    expect(DDDStyleGuidePresets.calloutWarning).to.exist
    expect(DDDStyleGuidePresets.calloutSuccess).to.exist
    expect(DDDStyleGuidePresets.calloutError).to.exist
    expect(DDDStyleGuidePresets.sectionDivider).to.exist
  })

  it('each preset has name, allowedTags, and properties', () => {
    for (const key of Object.keys(DDDStyleGuidePresets)) {
      const preset = DDDStyleGuidePresets[key]
      expect(preset.name).to.be.a('string')
      expect(Array.isArray(preset.allowedTags)).to.be.true
      expect(preset.properties).to.be.an('object')
    }
  })

  it('headline preset is the default for h1 and h2', () => {
    expect(DDDStyleGuidePresets.headline.default).to.be.true
    expect(DDDStyleGuidePresets.headline.allowedTags).to.include('h1')
    expect(DDDStyleGuidePresets.headline.allowedTags).to.include('h2')
  })

  it('style-1 preset is not default', () => {
    expect(DDDStyleGuidePresets['style-1'].default).to.be.false
  })
})

describe('getDDDStyleGuidePresetByKey', () => {
  it('returns the preset for a valid key', () => {
    const preset = getDDDStyleGuidePresetByKey('headline')
    expect(preset).to.not.be.null
    expect(preset.name).to.equal('Headline')
  })

  it('returns null for an invalid key', () => {
    expect(getDDDStyleGuidePresetByKey('nonexistent')).to.be.null
  })

  it('returns null for null key', () => {
    expect(getDDDStyleGuidePresetByKey(null)).to.be.null
  })

  it('returns null for undefined key', () => {
    expect(getDDDStyleGuidePresetByKey(undefined)).to.be.null
  })
})

describe('getDDDStyleGuideOptionsForTag', () => {
  it('returns options for h1 tag', () => {
    const options = getDDDStyleGuideOptionsForTag('h1')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.be.greaterThan(0)
    const keys = options.map((o) => o.value)
    expect(keys).to.include('headline')
    expect(keys).to.include('byline')
  })

  it('returns options for p tag', () => {
    const options = getDDDStyleGuideOptionsForTag('p')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.be.greaterThan(0)
    const keys = options.map((o) => o.value)
    expect(keys).to.include('style-1')
  })

  it('returns options for blockquote tag', () => {
    const options = getDDDStyleGuideOptionsForTag('blockquote')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.be.greaterThan(0)
    const keys = options.map((o) => o.value)
    expect(keys).to.include('pullQuote')
  })

  it('returns empty array for null tag', () => {
    expect(getDDDStyleGuideOptionsForTag(null)).to.deep.equal([])
  })

  it('returns empty array for undefined tag', () => {
    expect(getDDDStyleGuideOptionsForTag(undefined)).to.deep.equal([])
  })

  it('returns empty array for tag with no matches', () => {
    expect(getDDDStyleGuideOptionsForTag('span')).to.deep.equal([])
  })

  it('normalizes tag to lowercase', () => {
    const options = getDDDStyleGuideOptionsForTag('H1')
    expect(options.length).to.be.greaterThan(0)
  })

  it('returns options with value and text fields', () => {
    const options = getDDDStyleGuideOptionsForTag('h1')
    for (const opt of options) {
      expect(opt.value).to.be.a('string')
      expect(opt.text).to.be.a('string')
    }
  })
})

describe('getDDDStyleGuidePresetManagedAttributes', () => {
  it('returns an array of unique attribute names', () => {
    const attrs = getDDDStyleGuidePresetManagedAttributes()
    expect(Array.isArray(attrs)).to.be.true
    expect(attrs.length).to.be.greaterThan(0)
    // should include data-design-treatment from multiple presets
    expect(attrs).to.include('data-design-treatment')
    expect(attrs).to.include('data-primary')
    expect(attrs).to.include('data-accent')
    expect(attrs).to.include('data-border-radius')
    expect(attrs).to.include('data-padding')
  })

  it('returns unique attributes (no duplicates)', () => {
    const attrs = getDDDStyleGuidePresetManagedAttributes()
    const unique = [...new Set(attrs)]
    expect(attrs.length).to.equal(unique.length)
  })
})

describe('getDDDStyleGuideDefaultPresetForTag', () => {
  it('returns the headline default preset for h1', () => {
    const preset = getDDDStyleGuideDefaultPresetForTag('h1')
    expect(preset).to.not.be.null
    expect(preset.key).to.equal('headline')
    expect(preset.name).to.equal('Headline')
  })

  it('returns the headline default preset for h2', () => {
    const preset = getDDDStyleGuideDefaultPresetForTag('h2')
    expect(preset).to.not.be.null
    expect(preset.key).to.equal('headline')
  })

  it('returns null for p tag (no default preset)', () => {
    const preset = getDDDStyleGuideDefaultPresetForTag('p')
    expect(preset).to.be.null
  })

  it('returns null for null tag', () => {
    expect(getDDDStyleGuideDefaultPresetForTag(null)).to.be.null
  })

  it('returns null for undefined tag', () => {
    expect(getDDDStyleGuideDefaultPresetForTag(undefined)).to.be.null
  })

  it('returns null for tag with no presets at all', () => {
    expect(getDDDStyleGuideDefaultPresetForTag('video-player')).to.be.null
  })

  it('normalizes tag to lowercase', () => {
    const preset = getDDDStyleGuideDefaultPresetForTag('H1')
    expect(preset).to.not.be.null
    expect(preset.key).to.equal('headline')
  })
})

describe('getDDDStyleGuideSchemaOverride', () => {
  it('returns schema override for h1 with demoSchema', () => {
    const override = getDDDStyleGuideSchemaOverride('h1')
    expect(override).to.not.be.null
    expect(override.demoSchema).to.exist
    expect(Array.isArray(override.demoSchema)).to.be.true
    expect(override.demoSchema[0].tag).to.equal('h1')
    expect(override.demoSchema[0].properties['data-style-guide']).to.equal(
      'headline',
    )
  })

  it('returns null for p tag (no default preset)', () => {
    expect(getDDDStyleGuideSchemaOverride('p')).to.be.null
  })

  it('returns null for null tag', () => {
    expect(getDDDStyleGuideSchemaOverride(null)).to.be.null
  })

  it('returns null for undefined tag', () => {
    expect(getDDDStyleGuideSchemaOverride(undefined)).to.be.null
  })

  it('includes preset properties in the demoSchema', () => {
    const override = getDDDStyleGuideSchemaOverride('h1')
    expect(override.demoSchema[0].properties['data-design-treatment']).to.equal(
      'vert',
    )
    expect(override.demoSchema[0].properties['data-primary']).to.equal('8')
  })
})
